# 🔍 RELATÓRIO: Análise Crítica do Problema do Agente Conductor

**Data:** 2026-01-06
**Sessão:** Análise profunda de configuração
**Status:** 🔴 CRÍTICO - Problema Identificado

---

## 📋 Resumo Executivo

O agente **Conductor** está a falhar na sua função de orquestrador por um **problema fundamental de design**: quando configurado para delegar tarefas, se o modelo não conseguir reconhecer ou implementar o protocolo de delegação via ferramenta `task`, ele recai para comportamentos de fallback que o tornam inútil (output de texto genérico sem ações concretas).

**Sintoma Principal:** O Conductor diz ao utilizador o que fazer, em vez de delegar para subagentes que o fazem por si.

---

## 🏗️ Arquitetura Atual

### Configuração do Conductor

**Ficheiro:** `.opencode/agent/conductor.md`

```yaml
tools:
  write: false
  edit: false
  bash: false
  read: true
  grep: true
  glob: true
  list: true
  patch: false
  todowrite: true
  todoread: true
  task: true            # ← FERRAMENTA CRÍTICA PARA DELEGAÇÃO
  sequential_thinking: true

permission:
  edit: deny
  bash: deny
  webfetch: deny
```

**Modelo Atual (do perfil `copilot`):**
- `github-copilot/claude-sonnet-4.5`

**Ferramentas Disponíveis:**
1. ✅ `task` - Delegar para subagentes
2. ✅ `todowrite`/`todoread` - Gerir estado
3. ✅ `sequential_thinking` - Pensamento estruturado
4. ✅ `read`/`grep`/`glob`/`list` - Leitura apenas
5. ❌ `write`/`edit`/`bash` - DESATIVADOS (por design)

---

## ⚠️ O Problema: Gap de Implementação

### O que DEVE acontecer (Design):

```
1. Receber pedido do utilizador
2. Usar sequential_thinking para decompor em passos
3. Iniciar todowrite com os passos
4. Para cada passo:
   a. Determinar qual subagente é apropriado
   b. Usar ferramenta task() com instruções claras
   c. AGUARDAR resultado do subagente
   d. Validar output e atualizar todowrite
5. Finalizar
```

### O que ESTÁ a acontecer (Realidade):

```
1. Receber pedido do utilizador
2. Usar sequential_thinking (✅ works)
3. Iniciar todowrite (✅ works)
4. Para cada passo:
   a. Determinar subagente (✅ works)
   b. [GAP] Não invoca task() - em vez disso:
      - Gera texto: "Delegaria para @code para fazer X"
      - OU: "O agente @code faria: passos 1, 2, 3..."
      - OU: "Recomendo que executes estes comandos..."
   c. ✗ NADA é executado
   d. ✗ todowrite fica inalterado
5. ✗ Usuário frustrado
```

---

## 🔬 Análise das Causas Raiz

### 1. **Ambiguidade na Prompt do Conductor**

**Problema:** O prompt diz "delegar", mas não diz **COMO** delegar programaticamente.

**Excerto do prompt atual (linha 38-47):**
```markdown
## 2. Delegation Protocol (The Handoff)
- Use the `task` tool to call sub-agents.
- **CRITICAL**: Execute ONE task at a time. Wait for the result.
- **Handoff Template**:
  Target: @[agent]
  Input: [Specific context/files/goal]
  Constraints: [What NOT to do]
  Expected Output: [Format/Result]
```

**Avaliação:** ❌ AMBIGUO
- Explica O QUÊ, mas não o COMO técnico
- Não mostra exemplos de chamada real da ferramenta `task`
- Não enfatiza que **SÓ** funciona via invocação da ferramenta
- Modelo pode interpretar como "explicar a delegação" em vez de "executar delegação"

### 2. **Comportamento de Fallback do Modelo**

Quando o modelo é treinado para ser útil mas tem ferramentas restritas:

| Opção | Comportamento | Resultado |
|--------|---------------|-----------|
| Opção A | Tentar usar write/edit/bash | 🔴 BLOCKED (permission deny) |
| Opção B | Usar task() | 🟢 VALID, mas **não treinado** |
| Opção C | Explicar em texto | 🟡 Fallback - **não executa** |

**Modelo escolhe Opção C** porque:
- É o path de menor resistência
- "Explicar" parece útil para o utilizador
- Não há reforço explícito para invocar task()
- O padrão de conversação natural é dizer, não executar

### 3. **Falta de Exemplos Concretos**

O prompt do Conductor **NÃO tem exemplos de uso da ferramenta `task`**:

```markdown
# ❌ O que existe agora:
Target: @[agent]
Input: [Specific context/files/goal]
Constraints: [What NOT to do]
Expected Output: [Format/Result]

# ❌ O que falta:
# Exemplo de uso real:
task(
  subagent_type="code",
  prompt="Create a REST API endpoint at /api/users with CRUD operations",
  description="Implement users API endpoint"
)

# Output esperado:
# @code: [Executes and returns result]
```

---

## 🧪 Contexto da Máquina Atual

**Máquina:** `linux-vm` (zabbix)
**Plataforma:** Linux
**Utilizador:** dsi
**Working Directory:** `/home/dsi/.config/opencode`

**Perfis Disponíveis:**
1. ✅ `zens` - OpenCode Zens (Minimax & GLM) - **FREE, Unlimited**
2. ✅ `gemini` - Google Gemini 3 - **FREE**
3. ✅ `copilot` - GitHub Copilot - **PAID** (Atual)
4. ✅ `grok` - OpenCode Grok - **FREE, Single model**

**Modelo Atual:** `github-copilot/claude-sonnet-4.5`

---

## 🎯 Análise Comportamental: Por que funciona "às vezes"?

O utilizador reportou: *"parece que vai de funcionar incrivelmente bem... para faz o mínimo possível"*

### Análise do Comportamento Inconsistente

**Cenário A: Funciona bem**
- Prompt: "Configure o OpenCode para usar Gemini"
- Conductor reconhece que é uma **tarefa de configuração**
- Tem instruções explícitas na prompt (opencode-config-manager)
- **Invoca task() com @opencode-config-manager**
- Resultado: ✅ Tarefa completada

**Cenário B: Fails**
- Prompt: "Implemente uma API REST com FastAPI"
- Conductor precisa decompor em múltiplas tarefas:
  1. @know para pesquisar FastAPI
  2. @plan para arquitetura
  3. @code para implementação
  4. @scribe para documentação
- **Gap:** Modelo não "internaliza" que PRECISA invocar task() para cada passo
- Em vez disso, gera: "Delegaria para @know para pesquisar..."
- Resultado: ❌ Nada acontece

**Hipótese:** O modelo pode estar a falhar porque:
- A prompt não usa `Few-Shot Prompting` (exemplos múltiplos)
- Não há exemplos negativos ("NÃO faça isto:")
- A ordem de precedência de ferramentas não está clara
- O modelo não sabe que `task()` é a ÚNICA forma de progresso

---

## 🔍 Investigação Técnica

### Ferramenta `task()` - Como funciona

**Definição na interface:**
```typescript
task(
  subagent_type: "general" | "explore" | "code" | "research" | "thinking" | "scribe" | "policy",
  prompt: string,
  description?: string
)
```

**Fluxo de execução:**
1. Conductor invoca `task()` com parâmetros
2. OpenCode inicializa o subagente especificado
3. Subagente executa com suas próprias ferramentas
4. Resultado é retornado ao Conductor
5. Conductor processa resultado e atualiza estado

**Pontos Críticos:**
- ✅ Conductor NÃO executa código direto
- ✅ Subagentes têm permissões diferenciadas
- ✅ Cada subagente usa modelo específico
- ❌ **Não há validação que task() foi invocado**

---

## 📊 Estado da Configuração

### MCP Servers Ativos

**Funcionando (11):**
- ✅ code_interpreter
- ✅ context7
- ✅ gh_grep
- ✅ duckduckgo
- ✅ fetch
- ✅ sequential_thinking
- ✅ memory
- ✅ wikipedia
- ✅ arxiv
- ✅ paper_search
- ✅ hackernews

**Com Problemas (6):**
- ❌ content_pdf_marker (timeout)
- ❌ content_pdf_reader (connection closed)
- ❌ perplexity (connection closed)
- ❌ memory_vector_qdrant (connection closed)
- ❌ research_scraper_firecrawl (connection closed)
- ❌ research_search_searxng (connection closed)

**Desativados (6):**
- ⚪ ollama_bridge
- ⚪ qdrant_mcp
- ⚪ neo4j_mcp
- ⚪ brave
- ⚪ github
- ⚪ integration_suite_aio

**Nota:** O estado dos MCPs **NÃO afeta** o problema do Conductor, pois ele não usa MCPs diretamente para delegação.

---

## 🐛 Diagnóstico Específico

### Problema Identificado: **"Orchestration Gap"**

**Componente Causador:** Prompt insuficiente do Conductor

**Sintomas:**
1. Modelo não invoca `task()` consistentemente
2. Recai para output de texto descritivo
3. Usuário fica com instruções manuais sem execução
4. Sessão estagna com "roadblocks fictícios"

**Impacto:**
- 🔴 Alto - Torna o Conductor inútil em tarefas complexas
- 🔴 Médio - Reduz confiança do utilizador no sistema
- 🔴 Baixo - Nenhum impacto em agentes individuais (funcionam bem)

---

## 💡 Soluções Propostas (Prioritárias)

### 🔥 Solução 1: Reescrever a Prompt do Conductor com Few-Shot Examples

**Objetivo:** Fornecer exemplos concretos de uso da ferramenta `task()`

**Abordagem:**
```markdown
## 3. Delegation Protocol (COM INVOCAR)

### INCORRETO ❌
"Delegaria para @code para criar o ficheiro main.py"
Resultado: Nada acontece. O utilizador recebe apenas texto.

### CORRETO ✅
```python
task(
  subagent_type="code",
  prompt="Create main.py with a FastAPI application",
  description="Implement FastAPI main file"
)
```
Resultado: @code é invocado, executa a tarefa, retorna resultado.

### Exemplos Completos

**Exemplo 1: Tarefa Simples**
Input: "Create a Python script to parse JSON files"

Sua ação:
1. todowrite: [{"id": "1", "content": "Create JSON parser script", "status": "in_progress"}]
2. task(
     subagent_type="code",
     prompt="Create a Python script that parses JSON files from a directory and outputs summary statistics",
     description="Implement JSON parser script"
   )
3. [Wait for result]
4. todowrite: [{"id": "1", "content": "Create JSON parser script", "status": "completed"}]
```

**Vantagem:** Treina o modelo com exemplos positivos e negativos.

### 🔥 Solução 2: Adicionar Validação de Ferramenta

**Objetivo:** Garantir que `task()` seja invocado quando apropriado

**Implementação (no prompt):**
```markdown
## CRITICAL RULE: Progress via task() Only

Before any output, ask yourself:
- "Did I invoke task() to execute this work?"
- If NO: You MUST invoke task() before responding.
- If YES: You can report the result.

You cannot complete work without invoking task().
Writing explanations is NOT completing work.
```

**Vantagem:** Reforça que progresso só via `task()`.

### 🟡 Solução 3: Reduzir Ambiguidade com Ferramentas Restritas

**Objetivo:** Tornar impossível o fallback para texto

**Implementação (no prompt):**
```markdown
## RESTRIÇÕES DE OUTPUT

Você TEM permissão para:
- ✅ Invocar task()
- ✅ Usar todowrite()
- ✅ Ler ficheiros (read/grep/glob/list)
- ✅ Usar sequential_thinking()

Você NÃO TEM permissão para:
- ❌ Descrever o que faria (delegue via task())
- ❌ Dar instruções ao utilizador (delegue via task())
- ❌ Explicar processos sem executar (delegue via task())

Pergunta antes de output: "Esta ação executa trabalho real?"
- Se NÃO: Use task()
- Se SIM: Pode responder
```

**Vantagem:** Elimina o path de fallback para texto.

---

## 🧪 Teste de Hipóteses

### Hipótese A: O modelo não entende a sintaxe de task()

**Teste:**
1. Adicionar exemplos de chamada com sintaxe real
2. Executar sessão de teste
3. Verificar se invoca task()

**Expectativa:** Se funcionar → Solução 1 é suficiente

### Hipótese B: O modelo prefere explicar em vez de executar

**Teste:**
1. Adicionar regra explícita de "não explicar sem executar"
2. Executar sessão de teste
3. Verificar comportamento

**Expectativa:** Se funcionar → Solução 3 é suficiente

### Hipótese C: O modelo não reconhece prioridade de ferramentas

**Teste:**
1. Reordenar ferramentas no YAML (task primeiro)
2. Executar sessão de teste
3. Verificar se prioriza task()

**Expectativa:** Baixa probabilidade de sucesso

---

## 📝 Recomendações Imediatas

### 1. TESTAR COM OUTROS MODELOS
- Switchar para perfil `gemini` (google/gemini-3-pro)
- Verificar se modelo do Google responde melhor
- Comparar comportamento entre Claude e Gemini

**Comando:**
```bash
npm run switch:gemini
```

### 2. APLICAR CORREÇÕES NA PROMPT
- Reescrever `conductor.md` com Few-Shot Examples
- Adicionar regras de output restritivo
- Enfatizar que `task()` é a única forma de progresso

### 3. CRIAR SUITE DE TESTES
- Testar delegação com prompts padrão
- Verificar se task() é invocado
- Documentar comportamento por modelo

### 4. CONSIDERAR ARQUITETURA ALTERNATIVA
- Implementar validação externa que force uso de task()
- Criar wrapper que detecta quando Conductor não delega
- Adicionar mensagens de erro explícitas quando task() não é usado

---

## 🎯 Próximos Passos Sugeridos

1. **AGORA:** Analisar com o utilizador se quer testar com modelo diferente
2. **HOJE:** Aplicar correções na prompt do Conductor (Soluções 1, 2, 3)
3. **AMANHÃ:** Criar testes de validação
4. **ESTA SEMANA:** Documentar melhorias e replicar para outros agentes

---

## 🔗 Referências

**Ficheiros Relevantes:**
- `.opencode/agent/conductor.md` - Prompt do Conductor
- `opencode.base.json` - Configuração base de agentes
- `profiles.json` - Perfis de modelos
- `AGENTS.md` - Regras gerais de agentes

**Documentação:**
- `docs/AGENT_MD_SCHEMA.md` - Schema de agentes
- `docs/AGENT_SPEC_CONFIG.md` - Especificações de configuração
- `docs/SYSTEM_CONTEXT.md` - Contexto do sistema

**Histórico Recente:**
- Git commit: `1141713` (Merge de branch origin/main)
- Alteração em: `opencode.json` (paths atualizados para linux-vm)

---

## 📌 Notas para o Utilizador

**O que estás a experimentar é um problema conhecido de agentic AI:**

Quando o modelo não está treinado ou explicitamente instruído a usar uma ferramenta específica para um propósito crítico, ele recorre ao comportamento padrão de "ajudar" - que é explicar, não executar.

**Não é um bug da OpenCode**, mas sim um **gap de prompt engineering** que precisa de ser preenchido com:
- Exemplos claros (Few-Shot)
- Regras restritivas de output
- Validação explícita de ferramentas

**Boas notícias:** É fixável com melhorias na prompt, sem necessidade de alterações ao core do sistema.

---

**Fim do Relatório**
**Status:** 🔴 AGUARDANDO DECISÃO DO UTILIZADOR
