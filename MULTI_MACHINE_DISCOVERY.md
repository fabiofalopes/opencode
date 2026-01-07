# 📋 Resumo: Multi-Machine Config - Descoberto e Soluções

**Data:** 2026-01-06
**Status:** ✅ ENCONTRADO NA DOCUMENTAÇÃO DO OPENCODE

---

## 🎯 O Problema Que Descreveste

> "Imagina que trabalho com opencode em várias máquinas, mantenho `~/.config/opencode` que idealmente deve ser robusta o suficiente para fazer pushes para remote comum de várias máquinas sem que estes detalhes como que tipo de OS está a ser usado, ou que modelos são escolhidos para defaults ou que providers conectados... isto porque estas são sempre variáveis que constantemente estão a mudar e são ultra dependentes do user/máquina/local."

---

## ✅ BOA NOTÍCIA: O Sistema JÁ Existe!

O OpenCode TEM uma arquitetura de **Multi-Machine Config** que está desenhada exatamente para o teu caso de uso!

### Documentação Encontrada

1. **`docs/plans/CONFIG_INTELLIGENCE_MASTERPLAN.md`** - Arquitetura completa
   - Layer 3: Machine Profiles ✅
   - Phase 3.5: Multi-Machine Git Safety ✅

2. **`docs/MACHINE_SETUP.md`** - Guia de setup por máquina
   - Template system com placeholders `{machine:path}`
   - Git safety (opencode.json no .gitignore)

3. **`machines.json`** - Perfis por máquina já definidos
   - `macos-fabio` ✅
   - `linux-fabio` ✅
   - `linux-vm` (tua máquina atual) ✅

4. **`scripts/detect-machine.ts`** - Auto-deteção de máquina
5. **`scripts/init-machine.ts`** - Inicialização de machine profile
6. **`.gitignore`** - Configura o que NÃO entra no git

---

## ⚠️ O Bug Que Impede Que Funcione

### O Sistema Está Parcialmente Implementado

**O que existe (✅ Funciona):**
- ✅ Placeholders `{machine:path}` para paths
- ✅ Machine profiles em `machines.json`
- ✅ `init:machine` resolve placeholders
- ✅ `opencode.json` está no `.gitignore`

**O que falta (❌ Bug):**
- ❌ Placeholders `{profile:model}` para models
- ❌ `switch-profile.ts` não integra com machine profiles
- ❌ Quando trocas de profile, perde machine paths

### O Cenário Atual (Quebrado)

```bash
# Máquina A (linux-vm, user dsi)
npm run switch:zai
# ↓ switch-profile.ts gera opencode.json
# ↓ Usa opencode.base.json como base
# ↓ MAS não resolve machine placeholders!
# ↓ opencode.json fica com paths errados (/home/fabio) ❌

# SOLUÇÃO ATUAL (Manual):
npm run init:machine  # Tem que correr manualmente depois
```

### O Cenário Ideal (Deveria ser)

```bash
# Máquina A (linux-vm, user dsi)
npm run switch:zai
# ↓ Unifica profile + machine
# ↓ Resolve TODOS os placeholders
# ↓ opencode.json com paths corretos (/home/dsi) ✅

# NO PRECISA DE COMANDO EXTRA
```

---

## 🛠️ A Solução: Adicionar Placeholders de Profile

### O que Falta no `opencode.base.json`

**Atual (só machine placeholders):**
```json
{
  "model": "github-copilot/claude-sonnet-4.5",  ❌ Hardcoded
  "agent": {
    "conductor": {
      "model": "github-copilot/claude-sonnet-4.5"  ❌ Hardcoded
    },
    "build": {
      "model": "github-copilot/claude-sonnet-4.5"  ❌ Hardcoded
    }
  },
  "mcp": {
    "memory": {
      "command": [
        "docker", "run", "-i", "--rm",
        "-v", "/Users/fabiofalopes/mcp-memory:/data",  ❌ Hardcoded path
        ...
      ]
    }
  }
}
```

**Corrigido (todos os placeholders):**
```json
{
  "model": "{profile:model}",  ✅ Placeholder de profile
  "agent": {
    "conductor": {
      "model": "{profile:agent.conductor.model}"  ✅ Placeholder
    },
    "build": {
      "model": "{profile:agent.build.model}"  ✅ Placeholder
    }
  },
  "mcp": {
    "memory": {
      "command": [
        "docker", "run", "-i", "--rm",
        "-v", "{machine:mcp-memory}:/data",  ✅ Placeholder de machine
        ...
      ]
    }
  }
}
```

---

## 🔄 Workflow Multi-Machine Correto

### 1. Inicializar Nova Máquina

```bash
# Clonar repo
git clone <repo> ~/.config/opencode
cd ~/.config/opencode

# Instalar dependências
npm install

# Adicionar profile em machines.json
vim machines.json

# Detectar e ativar máquina
npm run detect:machine:set

# Gerar config inicial
npm run init:machine

# ✅ opencode.json agora tem:
#    - Paths corretos para esta máquina
#    - Model default do profile ativo (zai/gemini/copilot)
```

### 2. Trocar de Model Profile

```bash
# Com script corrigido:
npm run switch:zai
# ✅ Aplica profile E mantém machine paths

# Com script atual (QUEBRADO):
npm run switch:zai
npm run init:machine  # Tem que correr manualmente
```

### 3. Pull do Git (Troca de Máquina)

```bash
# Na máquina A
git add profiles.json machines.json
git commit -m "atualiza perfis"
git push

# Na máquina B (diferente, paths diferentes)
git pull
npm run init:machine  # ✅ Atualiza paths para máquina B
```

### 4. Push para Git (Não Quebra Outras Máquinas)

```bash
# O que PODE entrar no git:
git add profiles.json         ✅ Perfis de models (comum)
git add machines.json          ✅ Perfis por máquina
git add opencode.base.json    ✅ Template com placeholders
git add scripts/            ✅ Scripts (comuns)

# O que NUNCA deve entrar no git:
git add opencode.json       ❌ Gitignored (machine-specific)
git add ~/.local/share/opencode/auth.json  ❌ Nunca (sensitive)
```

---

## 📁 Arquitetura Multi-Machine

### No Git (Compartilhado entre Máquinas)

```
~/.config/opencode/
├── opencode.base.json          ✅ Template com placeholders
├── profiles.json               ✅ Perfis de models (zai/gemini/copilot)
├── machines.json               ✅ Perfis por máquina
├── opencode.template.json      ✅ Template antigo (compatibilidade)
├── scripts/                   ✅ Scripts de automação
├── .opencode/                ✅ Agentes (comum)
├── docs/                      ✅ Documentação
└── .gitignore                 ✅ Define o que NÃO entra no git
```

### Machine-Specific (Fora do Git)

```
~/.config/opencode/
└── opencode.json               ❌ Gitignored - Gerado automático

~/.local/share/opencode/
└── auth.json                   ❌ Nunca no repo - SENSITIVE
```

---

## 🎯 O Que Precisa Ser Implementado

### 1. Adicionar Placeholders de Profile ao `opencode.base.json`

**Para cada profile em `profiles.json`:**
- `{profile:model}` - Modelo global do profile
- `{profile:agent.conductor.model}` - Modelo do conductor
- `{profile:agent.build.model}` - Modelo do build
- `{profile:agent.code.model}` - Modelo do code
- ... (todos os 12 agentes)

### 2. Atualizar `switch-profile.ts`

**Adicionar lógica para:**
1. Ler profile de `profiles.json`
2. Ler machine de `machines.json`
3. Substituir placeholders `{profile:*}` com valores do profile
4. Substituir placeholders `{machine:*}` com valores da machine
5. Escrever `opencode.json` com tudo resolvido

### 3. Criar Script Unificado (Opcional)

`scripts/switch-profile-and-machine.ts` que faz tudo de uma vez.

### 4. Atualizar npm Scripts

```json
{
  "scripts": {
    "switch:zai": "ts-node scripts/switch-profile-and-machine.ts --profile=zai",
    "switch:gemini": "ts-node scripts/switch-profile-and-machine.ts --profile=gemini",
    "switch:copilot": "ts-node scripts/switch-profile-and-machine.ts --profile=copilot"
  }
}
```

---

## ✅ Benefícios da Solução

### Agora (Bug)
- ❌ `switch:zai` quebra machine paths
- ❌ Precisas de `init:machine` manual depois
- ❌ Perigoso comitar `opencode.json` por engano

### Depois da Correção
- ✅ `switch:zai` mantém machine paths
- ✅ Tudo resolvido automaticamente
- ✅ `opencode.json` no gitignore (seguro)
- ✅ Robusto para multi-machine sync

---

## 📚 Documentação Existente

### Ficheiros Encontrados

1. **`docs/plans/CONFIG_INTELLIGENCE_MASTERPLAN.md`**
   - Arquitetura Layer 3: Machine Profiles
   - Phase 3.5: Multi-Machine Git Safety
   - Schema de machine profiles

2. **`docs/MACHINE_SETUP.md`**
   - Guia de setup por máquina
   - Workflow de placeholder resolution
   - Troubleshooting

3. **`docs/plans/LINUX_VM_SETUP_LOG.md`**
   - Histórico de setup da tua máquina
   - Issue documentado: "Profile Switching Reverts Paths"

---

## 🎯 Próximos Passos

### Implementação (1-2 horas)

1. ✅ Backup do `opencode.base.json`
2. ✅ Adicionar placeholders `{profile:*}` para todos os models
3. ✅ Modificar `switch-profile.ts` para unificar profile + machine
4. ✅ Testar: `npm run switch:zai` → verificar paths
5. ✅ Testar: `git pull` + `npm run init:machine` → verificar paths
6. ✅ Atualizar documentação

### Validação

```bash
# Testar placeholders de machine
npm run init:machine
grep "/home/dsi" opencode.json  # Deve aparecer

# Testar placeholders de profile
npm run switch:zai
grep "glm-4.7" opencode.json  # Deve aparecer
grep "/home/dsi" opencode.json  # Deve continuar a aparecer

# Testar noutra máquina (simulado)
# Mudar _active em machines.json
npm run init:machine
grep "/home/fabio" opencode.json  # Deve mudar
```

---

## 💡 Conclusão

**A solução EXATA já existe no OpenCode**, mas:

1. ✅ **Machine placeholders** `{machine:*}` - IMPLEMENTADOS
2. ❌ **Profile placeholders** `{profile:*}` - FALTAM
3. ❌ **Unificação** de switch-profile + init-machine - FALTA

**O bug é simples de corrigir:**
- Adicionar placeholders de profile ao `opencode.base.json`
- Modificar `switch-profile.ts` para resolver ambos

**Desejas que eu implemente a correção agora?**

---

**Status:** ✅ PROBLEMA ENCONTRADO E SOLUÇÃO DEFINIDA
**Documentação:** `MULTI_MACHINE_SOLUTION.md` (completo)
**Implementação:** Pronta para começar
