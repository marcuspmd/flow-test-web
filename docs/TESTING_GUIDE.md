# 🧪 Guia de Testes - TestRunnerWithParsing

## 🎯 Objetivo

Validar a implementação completa do sistema de **parsing em tempo real** e **visualização de resultados de testes**.

---

## ⚡ Quick Start

### 1. Executar Aplicativo
```bash
cd /Users/marcusp/Documents/flow-test/web
npm run dev
```

**Esperado**:
- Terminal mostra: `✨ [rsbuild:dev] Server running at http://localhost:3000`
- Terminal mostra: `✨ [electron] Electron process started`
- Janela Electron abre automaticamente
- DevTools aberto (modo development)
- Console sem erros críticos

---

## 🧭 Navegação

### Acessar TestRunner
1. Na janela Electron, navegar para: `http://localhost:3000/runner`
2. Ou editar `main.ts` para abrir direto nesta rota (opcional)

**Esperado**:
- UI com control bar (inputs, botões)
- Logs panel vazio à esquerda
- Results panel vazio à direita
- Status badge mostrando "IDLE"

---

## 📝 Casos de Teste

### ✅ Teste 1: Browse File Dialog

**Steps**:
1. Clicar botão "📁 Browse File"
2. Selecionar arquivo YAML de teste (ex: `/Users/marcusp/Documents/flow-test/tests/start-flow.yaml`)

**Esperado**:
- Dialog do sistema operacional abre
- Após seleção, path aparece no input
- Botão "▶️ Run Test" fica habilitado

---

### ✅ Teste 2: Executar Teste Simples

**Setup**:
- Usar `tests/start-flow.yaml` (ou criar um YAML simples)

**Steps**:
1. Selecionar arquivo via browse
2. Clicar "▶️ Run Test"

**Esperado**:
- Status badge muda para "RUNNING" (azul)
- Logs começam a aparecer no painel esquerdo
- Mensagem inicial: `[INFO] 🚀 Execução iniciada: exec-xxxxx`
- Steps aparecem no painel direito conforme são parseados
- Progress bar atualiza (ex: "Step 1 of 3")
- Barra visual aumenta gradualmente

**Após conclusão**:
- Status badge muda para "SUCCESS" (verde) ou "ERROR" (vermelho)
- Mensagem final: `[INFO] ✅ Execução concluída: SUCESSO`
- Todos os steps estão visíveis no painel direito
- Cada step mostra TestResultViewer completo

---

### ✅ Teste 3: Validar Parsing de Step

**Escolher um step aleatório no painel direito e verificar**:

**Request Tab**:
- [ ] Method correto (GET, POST, etc.)
- [ ] URL completa
- [ ] Headers (se houver)
- [ ] Body (se houver)

**Response Tab**:
- [ ] Status code correto
- [ ] Body formatado (JSON pretty-print se aplicável)
- [ ] Headers de resposta
- [ ] Response time em ms

**Assertions Tab**:
- [ ] Lista de assertions
- [ ] Cada assertion mostra:
  - Path (ex: `body.success`)
  - Expected value
  - Actual value
  - Status (✅ passed ou ❌ failed)

**Variables Tab**:
- [ ] Captured variables (se houver)
  - Name
  - Value
  - Expression

**cURL Tab**:
- [ ] Comando cURL completo
- [ ] Possível copiar para clipboard
- [ ] Comando executável no terminal

---

### ✅ Teste 4: Stop Execution

**Steps**:
1. Iniciar execução de teste longo (ou com delays)
2. Durante execução, clicar "⏹️ Stop"

**Esperado**:
- Botão "Stop" só aparece durante execução
- Ao clicar:
  - Execução interrompe
  - Log mostra: `[INFO] Execução interrompida pelo usuário`
  - Status badge volta para "IDLE"
  - Steps parseados até o momento permanecem visíveis

---

### ✅ Teste 5: Clear Logs

**Steps**:
1. Executar um teste (para gerar logs)
2. Clicar "Clear" no header do Logs Panel

**Esperado**:
- Todos os logs são removidos
- Painel de logs fica vazio
- Results panel **não** é afetado (steps permanecem)

---

### ✅ Teste 6: Clear Results

**Steps**:
1. Executar um teste (para gerar results)
2. Clicar "Clear" no header do Results Panel

**Esperado**:
- Todos os steps são removidos
- Results panel mostra placeholder:
  - Ícone 🧪
  - Mensagem: "No test results yet. Run a test to see results here."
- Logs panel **não** é afetado (logs permanecem)

---

### ✅ Teste 7: Execution Error Handling

**Steps**:
1. Inserir path inválido (ex: `/invalid/path/test.yaml`)
2. Clicar "Run Test"

**Esperado**:
- Logs mostram erro do CLI
- Results panel mostra caixa vermelha com:
  - "❌ Error: [mensagem de erro]"
- Status badge mostra "ERROR" (vermelho)

---

### ✅ Teste 8: Multiple Executions

**Steps**:
1. Executar um teste
2. Aguardar conclusão
3. Sem limpar, executar novamente

**Esperado**:
- Logs do segundo teste são **anexados** (não substituem)
- Results do segundo teste são **anexados** (não substituem)
- É possível distinguir execuções diferentes pelos timestamps nos logs

**Opcional**: Implementar separação visual de execuções (futuro)

---

### ✅ Teste 9: Responsive Behavior

**Steps**:
1. Redimensionar janela Electron (arrastar bordas)
2. Testar em diferentes tamanhos

**Esperado**:
- Logs panel e Results panel redimensionam proporcionalmente
- Scroll bars aparecem quando conteúdo excede viewport
- Layout não quebra em tamanhos pequenos

---

### ✅ Teste 10: Logs Scrolling

**Steps**:
1. Executar teste que gera muitos logs (>50 linhas)

**Esperado**:
- Logs panel tem scroll vertical
- Scroll automático para o final (últimos logs visíveis)
- Scroll bar estilizada (conforme tema)

---

## 🐛 Troubleshooting

### Problema: Logs não aparecem

**Verificar**:
```javascript
// No DevTools Console
window.flowTestAPI // Deve retornar objeto
window.flowTestAPI.onExecutionLog // Deve ser função
```

**Solução**:
- Verificar `preload.ts` está carregado
- Verificar `main.ts` tem `preload: path.join(__dirname, 'preload.js')`

---

### Problema: Steps não são parseados

**Verificar**:
- Logs brutos no painel esquerdo
- Formato dos logs corresponde aos padrões esperados

**Debug**:
```typescript
// Adicionar console.log em flowTestParser.service.ts
private processLog(message: string): void {
  console.log('Processing log:', message);
  // ...
}
```

---

### Problema: TestResultViewer não renderiza

**Verificar**:
```javascript
// No DevTools Console
// Após execução
steps // Deve ser array de StepExecutionResult
steps[0].stepName // Deve existir
```

**Solução**:
- Verificar estrutura de dados em `steps`
- Verificar props de TestResultViewer

---

### Problema: Erro "Flow Test API não disponível"

**Causa**: Rodando no navegador web ao invés de Electron

**Solução**:
- Sempre usar janela do Electron (aberta por `npm run dev`)
- Não acessar `http://localhost:3000` no Chrome/Safari

---

## 📊 Critérios de Sucesso

### ✅ Mínimo Viável
- [ ] Aplicativo Electron abre sem erros
- [ ] File browser funciona
- [ ] Execução inicia e completa com sucesso
- [ ] Logs aparecem em tempo real
- [ ] Pelo menos 1 step é parseado e exibido
- [ ] TestResultViewer renderiza corretamente

### 🌟 Ideal
- [ ] Todos os 10 casos de teste passam
- [ ] Parser reconhece todos os tipos de log
- [ ] UI é responsiva e fluida
- [ ] Sem erros no console
- [ ] Performance aceitável (sem lag)

---

## 📸 Screenshots (Opcional)

### Capturar para documentação:
1. **Idle State** - UI vazia esperando teste
2. **Running State** - Logs + progress bar + steps parciais
3. **Success State** - Teste completo com verde
4. **Error State** - Teste com falha em vermelho
5. **TestResultViewer** - Close-up de um step completo

---

## 📋 Checklist Rápido

```
[ ] npm run dev executa sem erros
[ ] Electron window abre
[ ] Navega para /runner
[ ] Browse file funciona
[ ] Run test executa
[ ] Logs aparecem em tempo real
[ ] Steps são parseados
[ ] TestResultViewer renderiza
[ ] Progress bar atualiza
[ ] Status badge muda
[ ] Stop funciona
[ ] Clear logs funciona
[ ] Clear results funciona
```

---

## 🎯 Próximos Passos Após Testes

### Se tudo funcionar ✅
1. Marcar tarefa #15 como completa
2. Começar refinamentos (#16):
   - Export de resultados
   - Histórico de execuções
   - Melhorias de UX

### Se houver bugs 🐛
1. Documentar bugs encontrados
2. Priorizar por severidade
3. Criar issues/tasks para fixes
4. Iterar implementação

---

**Autor**: GitHub Copilot
**Data**: 24 de outubro de 2025
**Versão**: 1.0.0
