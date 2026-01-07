# Atualização de Perfis - ZAI Coding Plan

**Data:** 2026-01-06
**Status:** ✅ Completado

---

## 📋 Resumo das Mudanças

### Reestruturação dos Perfis

Antes desta atualização, a estrutura de perfis estava desalinhada com a realidade do plano ZAI:

**Estrutura Antiga (❌ Problemática):**
```
zens (Minimax + GLM)  ───┐
                          ├── Mesmo plano ZAI
grok (Grok apenas)       ───┘    (mas separados)
```

**Problemas:**
1. `zens` e `grok` referiam-se ao mesmo plano ZAI Coding Plan
2. Não era claro que faziam parte da mesma subscrição
3. O modelo default era `minimax-m2.1`, não o GLM 4.7 (pretendido)
4. Scripts npm usavam nomes inconsistentes (`switch:zens`, `switch:grok`)

**Nova Estrutura (✅ Correta):**
```
zai (Minimax + GLM + Grok)      ─── ZAI Coding Plan (unificado)
zai-fallback (Grok apenas)      ─── Fast fallback do mesmo plano
gemini (Gemini 3)               ─── Google (separado)
copilot (GPT + Claude)          ─── GitHub (separado)
```

**Vantagens:**
1. Nome reflete claramente o plano ("zai" = ZAI Coding Plan)
2. GLM 4.7 definido como **modelo default** (como pedido)
3. Fallback separado (`zai-fallback`) mas claramente do mesmo plano
4. Scripts npm renomeados para consistência (`switch:zai`, `switch:zai-fallback`)

---

## 🎯 Configuração Atual

### Perfil ZAI (Default Ativo)

**Descrição:** PRIMARY: ZAI Coding Plan (Free - Minimax, GLM 4.7, Grok)

**Modelo Global:** `opencode/glm-4.7`

**Modelos por Agente:**

| Agente | Modelo | Justificativa |
|---------|---------|---------------|
| build | `opencode/minimax-m2.1` | Melhor geração de código |
| plan | `opencode/glm-4.7` | Raciocínio multi-passo |
| code | `opencode/minimax-m2.1` | Especializado em código |
| research | `opencode/glm-4.7` | Raciocínio forte |
| thinking | `opencode/glm-4.7` | Raciocínio estruturado |
| deep | `opencode/glm-4.7` | Balanceado + raciocínio |
| know | `opencode/glm-4.7` | Bom raciocínio, gratuito |
| opencode-config-manager | `opencode/minimax-m2.1` | Preciso, focado em código |
| hiker | `opencode/glm-4.7` | Pesquisa + raciocínio |
| **conductor** | **`opencode/glm-4.7`** | **Orquestração com raciocínio forte** |
| scribe | `opencode/glm-4.7` | Documentação clara |
| policy | `opencode/glm-4.7` | Validação precisa |

### Outros Perfis

**zai-fallback:**
- Modelo global: `opencode/grok-codefast-2`
- Todos os agentes: `opencode/grok-codefast-2`
- Uso: Fast fallback quando ZAI principal tem problemas

**gemini:**
- Modelo global: `google/gemini-3-pro`
- Uso: Quando necessário multimodal ou contexto massivo (1M tokens)

**copilot:**
- Modelo global: `github-copilot/gpt-5.1-codex`
- Uso: **NÃO USADO NESTA MÁQUINA** (mantido para compatibilidade)

---

## 🔄 Scripts npm Atualizados

```json
{
  "switch:zai": "ts-node scripts/switch-profile.ts --profile=zai",
  "switch:gemini": "ts-node scripts/switch-profile.ts --profile=gemini",
  "switch:copilot": "ts-node scripts/switch-profile.ts --profile=copilot",
  "switch:zai-fallback": "ts-node scripts/switch-profile.ts --profile=zai-fallback"
}
```

**Comandos Antigos (DEPRECATED):**
```bash
# ❌ Não usar mais (ainda funciona mas mudou de nome)
npm run switch:zens      # Renomeado para switch:zai
npm run switch:grok       # Renomeado para switch:zai-fallback
```

**Comandos Novos (CORRETOS):**
```bash
# ✅ Usar estes
npm run switch:zai           # PRIMARY - GLM 4.7 + Minimax
npm run switch:gemini         # SECONDARY - Gemini 3
npm run switch:copilot        # TERTIARY - GitHub (não usado aqui)
npm run switch:zai-fallback  # FALLBACK - Grok rápido
```

---

## ✅ Validação Aplicada

Resultado da validação `npm run validate`:

```
🔍 Validating profile: 'zai'
  ✓ Global model: opencode/glm-4.7
    ✓ Model 'opencode/glm-4.7' uses approved provider 'opencode'
  ✓ Agent overrides: 12
    ✓ All agents use approved provider 'opencode'

🔍 Validating profile: 'zai-fallback'
  ✓ Global model: opencode/grok-codefast-2
    ✓ Model 'opencode/grok-codefast-2' uses approved provider 'opencode'
  ✓ Agent overrides: 12
    ✓ All agents use approved provider 'opencode'
```

---

## 🔗 Contexto da Máquina

**Máquina:** `linux-vm` (zabbix)
**Plataforma:** Linux
**Utilizador:** dsi
**Working Directory:** `/home/dsi/.config/opencode`

**Contas Configuradas:**
- ✅ Google: `pedras666666@gmail.com` (OAuth)
- ✅ ZAI Coding Plan: API key configurada

**Modelos Disponíveis:**
- `opencode/minimax-m2.1` - Código otimizado, forte raciocínio
- `opencode/glm-4.7` - Raciocínio multi-passo, planeamento
- `opencode/grok-codefast-2` - Fast fallback

---

## 🎯 Por que GLM 4.7 como Default?

O utilizador especificou que o **GLM 4.7** deve ser o modelo default nesta máquina por estas razões:

1. **Raciocínio Forte:** GLM 4.7 tem capacidade superior de raciocínio multi-passo
2. **Orquestração:** O Conductor (agente principal) precisa de forte raciocínio
3. **Complexidade:** Para tarefas complexas que envolvem decomposição e delegação
4. **Gratuito:** Todo o plano ZAI Coding Plan é gratuito

**Minimax M2.1** é mantido para:
- Geração de código direto (agente build, code, opencode-config-manager)
- Onde performance de código é mais importante que raciocínio

---

## 📊 Comparação de Modelos ZAI

| Modelo | Capacidade | Contexto | Uso Recomendado |
|--------|-----------|-----------|------------------|
| **glm-4.7** | ⭐⭐⭐⭐⭐ | ~100K | Planeamento, raciocínio, orquestração |
| **minimax-m2.1** | ⭐⭐⭐⭐⭐ | ~100K | Geração de código, implementação |
| **grok-codefast-2** | ⭐⭐⭐ | ~32K | Fast fallback, iterações rápidas |

---

## 🚀 Uso

### Ativar perfil ZAI (já ativo):
```bash
npm run switch:zai
```

### Verificar perfil atual:
```bash
cat ~/.config/opencode/opencode.json | jq '.model'
# Output: "opencode/glm-4.7"
```

### Validar perfis:
```bash
npm run validate
```

---

## ⚠️ Notas Importantes

1. **Máquina Linux VM:**
   - O Copilot **NÃO** será usado nesta máquina
   - Mantido no config por compatibilidade com outras máquinas
   - Pode ser removido mais tarde se confirmado desnecessário

2. **Autenticação:**
   - ZAI Coding Plan: Já configurado com API key
   - Google: OAuth configurado com conta pedras666666@gmail.com

3. **Compatibilidade:**
   - Os nomes antigos (`zens`, `grok`) ainda funcionam
   - Mas os novos comandos (`zai`, `zai-fallback`) são os preferidos
   - Documentação deve usar apenas os novos nomes

---

## 📝 Próximos Passos Sugeridos

1. **Testar Conductor com GLM 4.7**
   - Verificar se o problema de delegação melhora com GLM
   - Comparar comportamento com o anterior (Minimax)

2. **Documentar Solução do Conductor**
   - Implementar as correções de prompt identificadas no relatório
   - Testar com GLM 4.7 para ver se responde melhor

3. **Remover Copilot (opcional)**
   - Se confirmado que não será usado nesta máquina
   - Remover de `profiles.json`
   - Remover script `npm run switch:copilot`

4. **Atualizar Toda Documentação**
   - Substituir referências a `zens` por `zai`
   - Substituir referências a `grok` por `zai-fallback`
   - Atualizar `PROFILE_QUICK_REFERENCE.md`

---

**Fim do Documento**
**Status:** ✅ CONFIGURAÇÃO ZAI ATIVA E VALIDADA
