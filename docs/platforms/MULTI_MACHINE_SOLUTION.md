# 🔧 SOLUÇÃO: Multi-Machine Config Robusto

**Data:** 2026-01-06
**Status:** ✅ IDENTIFICADO COM SOLUÇÃO

---

## 🎯 Problema Identificado

### O Sistema Atual (Existe mas quebra)

```
opencode.template.json  (com placeholders {machine:path})
    ↓ init:machine
opencode.json  (paths resolvidos para máquina atual)
    ↓ switch:zai/gemini/copilot  ❌ PROBLEMA AQUI!
opencode.json  (gerado de opencode.base.json - perde paths!)
```

### O Bug

**`switch-profile.ts` lê `opencode.base.json`** e gera `opencode.json` diretamente.
**NÃO chama `init-machine.ts`**, então:
- ❌ Perde os machine-specific paths
- ❌ Precisas de correr `npm run init:machine` manualmente depois
- ❌ `opencode.json` fica hardcoded com paths errados

### Arquitetura Correta (Mas não usada)

```
machines.json          (perfis por máquina, GIT)
    ↓ init:machine
opencode.json         (gerado, machine-specific, GITIGNORED)
```

---

## ✅ A Solução: Placeholders em Tudo

### 1. Adicionar Placeholders de Model em `opencode.base.json`

**Atual (quebrado):**
```json
{
  "model": "github-copilot/gpt-5.1-codex",  ❌ Hardcoded
  "agent": {
    "conductor": {
      "model": "github-copilot/claude-sonnet-4.5"  ❌ Hardcoded
    }
  }
}
```

**Corrigido:**
```json
{
  "model": "{profile:model}",  ✅ Placeholder
  "agent": {
    "conductor": {
      "model": "{profile:conductor.model}"  ✅ Placeholder
    }
  }
}
```

### 2. Atualizar `switch-profile.ts` para Usar Placeholders

```typescript
function applyProfileWithPlaceholders(
  profileName: string,
  machineName: string
) {
  const profile = loadProfile(profileName);
  const machine = loadMachine(machineName);

  // Apply profile
  baseConfig.model = profile.model;
  baseConfig.agent = profile.agents;

  // Resolve placeholders
  const resolved = resolvePlaceholders(baseConfig, {
    ...profile,
    ...machine.paths
  });

  // Write
  writeOpencode(resolved);
}
```

### 3. Criar Script Unificado `switch:profile:machine`

```typescript
// scripts/switch-profile-and-machine.ts

function main() {
  const profile = args.profile;
  const machine = getActiveMachine() || detectMachine();

  console.log(`🔄 Switching to profile: ${profile}`);
  console.log(`🖥️  Machine: ${machine}`);

  applyProfileWithPlaceholders(profile, machine);
  resolveMachinePaths(machine);
  mergeMcpConfigs();

  console.log('✅ Config updated for profile + machine');
}
```

### 4. Atualizar Scripts npm

```json
{
  "switch:zai": "npm run validate && ts-node scripts/switch-profile-and-machine.ts --profile=zai",
  "switch:gemini": "npm run validate && ts-node scripts/switch-profile-and-machine.ts --profile=gemini",
  "switch:copilot": "npm run validate && ts-node scripts/switch-profile-and-machine.ts --profile=copilot"
}
```

---

## 📁 Arquitetura Final

### Ficheiros no Git (Compartilhados)

```
~/.config/opencode/
├── opencode.base.json        ✅ Template com placeholders {profile:*, machine:*}
├── profiles.json             ✅ Definições de perfis de models
├── machines.json             ✅ Perfis por máquina
├── opencode.template.json    ✅ Template antigo (manter por compatibilidade)
├── scripts/
│   ├── switch-profile-and-machine.ts  ✅ Novo (unificado)
│   ├── init-machine.ts              ✅ Existente (ainda útil)
│   └── ...
├── .gitignore               ✅ Configura o que NÃO entra no git
├── .opencode/
│   └── agent/              ✅ Definições de agentes
└── docs/                    ✅ Documentação
```

### Ficheiros Fora do Git (Machine-Specific)

```
~/.config/opencode/
├── opencode.json            ❌ Gitignored - Gerado automaticamente
├── .local/                  ❌ Gitignored - Config local
│   └── opencode.json       ❌ Overrides locais (opcional)
└── ...
```

### Local Auth (Nunca no Git)

```
~/.local/share/opencode/
├── auth.json                ❌ NUNCA no repo
├── antigravity-accounts.json  ❌ NUNCA no repo
└── ...
```

---

## 🔄 Workflow Correto

### Inicializar Nova Máquina

```bash
# 1. Clonar repo
git clone repo ~/.config/opencode
cd ~/.config/opencode

# 2. Adicionar profile da máquina em machines.json
# (editar machines.json)

# 3. Detectar e ativar
npm run detect:machine:set

# 4. Gerar config
npm run init:machine

# ✅ Agora opencode.json tem paths corretos!
```

### Trocar de Profile (entre sessões)

```bash
# ❌ Antigo (quebrava machine paths):
npm run switch:zai
npm run init:machine  # Tinha que correr manualmente

# ✅ Novo (faz tudo automaticamente):
npm run switch:zai  # Resolve TUDO: profile + machine
```

### Pull do Git (Outra Máquina)

```bash
# 1. Pull
git pull

# 2. Re-aplicar machine profile
npm run init:machine

# ✅ Paths atualizados para esta máquina!
```

### Push para Git (Nada quebra outras máquinas)

```bash
# 1. Fazer mudanças em profile/machines.json
vim profiles.json
vim machines.json

# 2. Validar
npm run validate

# 3. Commit e push
git add profiles.json machines.json
git commit -m "feat: add new profile"
git push

# ✅ opencode.json está no gitignore, não entra no commit!
```

---

## 🛠️ Implementação

### Passo 1: Atualizar `opencode.base.json`

Adicionar placeholders para models e agentes:
- `{profile:model}` - Modelo global
- `{profile:conductor.model}` - Modelo do conductor
- `{profile:build.model}` - Modelo do build
- ... (para todos os agentes)

### Passo 2: Criar `switch-profile-and-machine.ts`

Unificar `switch-profile.ts` e `init-machine.ts`:
- Ler profile de `profiles.json`
- Ler machine de `machines.json`
- Aplicar ambos com placeholders
- Gerar `opencode.json`

### Passo 3: Atualizar npm scripts

```json
{
  "scripts": {
    "switch:zai": "...",
    "switch:gemini": "...",
    "switch:copilot": "...",
    "switch:zai-fallback": "..."
  }
}
```

### Passo 4: Manter Scripts Antigos (por enquanto)

- `switch:zai` agora usa `switch-profile-and-machine.ts`
- `init:machine` mantido para casos avançados
- `detect:machine` mantido para diagnóstico

---

## 📊 Comparação de Sistemas

| Aspecto | Anterior (Quebrado) | Novo (Corrigido) |
|---------|---------------------|------------------|
| **Troca de profile** | `switch:zai` → paths quebrados | `switch:zai` → tudo resolvido |
| **Pull do git** | `git pull` → paths errados | `git pull` → `init:machine` |
| **Push do git** | `opencode.json` entra no commit | `opencode.json` no gitignore |
| **Multi-machine** | Frágil, quebra fácil | Robusto, isolado |
| **Placeholders** | Só `{machine:path}` | `{profile:*}` + `{machine:*}` |
| **Automação** | Manual (2 comandos) | Automático (1 comando) |

---

## ⚠️ Configuração Sensível (Nunca no Git)

### Auth Files (Paths ABSOLUTOS)

```bash
~/.local/share/opencode/auth.json                ❌
~/.local/share/opencode/antigravity-accounts.json  ❌
```

**Estes NUNCA devem entrar no repo** pois têm:
- API keys
- Refresh tokens
- Contas conectadas
- Secrets

### Solução: Já no `.gitignore`

```gitignore
# API keys and tokens
*_API_KEY*
*_TOKEN*
*_SECRET*
```

**E NUNCA comitar estes:**
```bash
# ❌ NÃO fazer
git add ~/.local/share/opencode/auth.json
git commit -m "add auth"  # DANGER!
```

---

## 🚀 Próximos Passos de Implementação

1. **Backup de segurança**
   ```bash
   cp opencode.base.json opencode.base.json.backup
   ```

2. **Atualizar `opencode.base.json` com placeholders**
   - Substituir models hardcoded por `{profile:*}`
   - Manter machine paths como `{machine:*}`

3. **Criar `switch-profile-and-machine.ts`**
   - Unificar lógica
   - Aplicar profile + machine

4. **Testar na máquina atual**
   ```bash
   npm run switch:zai
   # Verificar se paths estão corretos
   grep "/home/dsi" opencode.json  # Deve aparecer
   ```

5. **Testar noutra máquina (simulando)**
   ```bash
   # Mudar para outra máquina em machines.json
   npm run init:machine
   # Verificar se paths mudaram
   ```

6. **Documentar workflow**
   - Atualizar MACHINE_SETUP.md
   - Criar MULTI_MACHINE_WORKFLOW.md

---

## 📝 Documentação Necessária

### Novo Ficheiro: `docs/MULTI_MACHINE_WORKFLOW.md`

Conteúdo:
- Como adicionar nova máquina
- Como trocar entre perfis
- Como fazer sync entre máquinas
- O que entra no git vs o que não
- Troubleshooting comum

### Atualizar: `MACHINE_SETUP.md`

Adicionar:
- Secção de "Troubleshooting Multi-Machine"
- Exemplos de erros comuns
- Como verificar se config está correta

### Atualizar: `README.md`

Adicionar secção de "Multi-Machine Setup" com quick start.

---

## 🎯 Regras de Ouro

### 1. NO PODES NUNCA
- ❌ Commit `opencode.json` (gitignored)
- ❌ Commit `~/.local/share/opencode/auth.json`
- ❌ Hardcodear machine paths em `opencode.base.json`
- ❌ Hardcodear models em `opencode.base.json`

### 2. DEVES SEMPRE
- ✅ Usar placeholders `{profile:*}` e `{machine:*}`
- ✅ Adicionar machine profiles em `machines.json`
- ✅ Correr `npm run init:machine` depois de pull
- ✅ Validar com `npm run validate`

### 3. QUANDO TROCAR DE MÁQUINA
```bash
git pull
npm run detect:machine:set
npm run init:machine
# ✅ Config adaptada à nova máquina
```

### 4. QUANDO TROCAR DE PROFILE
```bash
npm run switch:zai
# ✅ Paths de máquina mantidos, profile atualizado
```

---

**Status:** ✅ SOLUÇÃO COMPLETA DEFINIDA
**Próximo Passo:** Implementar a solução?

Desejas que eu implemente agora?
