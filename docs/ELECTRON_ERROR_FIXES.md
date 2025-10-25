# Correções de Erros do Electron

## 🐛 Problemas Identificados

### 1. Monaco Editor: "Monaco initialization: error"
**Causa**: Monaco Editor tenta carregar workers que não funcionam corretamente no Electron devido ao CSP e protocolo `file://`.

**Solução**: Configuração customizada do Monaco para Electron.

### 2. Test Execution Failed
**Causa**: `window.flowTestAPI` não estava disponível ou não foi verificado corretamente.

**Solução**: Melhor tratamento de erro e banner de aviso.

### 3. Porta Incorreta (3001 vs 3000)
**Causa**: Configuração desatualizada no `main.ts`.

**Solução**: Atualizado para porta 3000.

---

## ✅ Correções Aplicadas

### 1. Monaco Editor Configuration
**Arquivo**: `/web/src/config/monaco.config.ts`

```typescript
// Configuração diferenciada para Electron vs Browser
if (window.flowTestAPI) {
  // Electron: Usa fake worker para evitar erros
  (self as any).MonacoEnvironment = {
    getWorker: function (_workerId: string, _label: string) {
      return new Worker(
        URL.createObjectURL(
          new Blob(['self.onmessage = () => {};'], { type: 'text/javascript' })
        )
      );
    },
  };
} else {
  // Browser: Usa workers normais
  (self as any).MonacoEnvironment = {
    getWorkerUrl: function (_moduleId: string, label: string) {
      // ... paths para workers
    },
  };
}
```

**Import adicionado em**: `/web/src/index.tsx`
```typescript
import './config/monaco.config';
```

---

### 2. Electron API Check Melhorado
**Arquivo**: `/web/src/services/flowTestElectron.service.ts`

```typescript
export const executeFlowTest = async (
  options: TestExecutionOptions,
  onLog?: (level: string, message: string) => void
): Promise<TestExecutionResult> => {
  // Verificação mais robusta
  if (typeof window === 'undefined' || !window.flowTestAPI) {
    const errorMsg = 'Flow Test API not available. Please run this app in Electron (npm run dev).';
    console.error(errorMsg);
    onLog?.('error', errorMsg);
    throw new Error(errorMsg);
  }
  // ...
};
```

---

### 3. Electron Banner (Warning UI)
**Arquivo**: `/web/src/components/molecules/ElectronBanner.tsx`

**Características:**
- ✅ Detecta automaticamente se está no Electron
- ✅ Mostra banner de aviso se não estiver
- ✅ Pode ser dismissed pelo usuário
- ✅ Recheck após 1s (caso API carregue depois)

**Adicionado em**: `/web/src/pages/App.tsx`
```typescript
<ElectronBanner />
<ToastProvider maxToasts={5}>
  <Router />
</ToastProvider>
```

---

### 4. Porta Corrigida (3000)
**Arquivos atualizados:**
- ✅ `/web/electron/main.ts` - `RENDERER_URL` e CSP
- ✅ `/web/ELECTRON_README.md`
- ✅ `/web/MIGRATION_ELECTRON_SUMMARY.md`
- ✅ `/web/docs/ELECTRON_SECURITY.md`

---

## 🎯 Resultado Esperado

### Antes:
```
❌ Monaco initialization: error: Event
❌ Uncaught (in promise) Event
❌ Test execution failed
❌ dragEvent is not defined
❌ Conectando em porta errada (3001 vs 3000)
```

### Depois:
```
✅ Monaco Editor carrega sem erros
✅ Test execution com mensagem clara se não estiver no Electron
✅ Banner de aviso visível no browser
✅ Porta correta (3000)
✅ Sem erros no console
```

---

## 🧪 Como Testar

### 1. Testar no Electron (modo correto)
```bash
cd web
npm run dev
```

**Verificar:**
- ✅ Janela Electron abre
- ✅ Sem banner de aviso
- ✅ Monaco Editor funciona
- ✅ `window.flowTestAPI` disponível no console
- ✅ Execução de testes funciona

### 2. Testar no Browser (para ver banner)
```bash
cd web
npm run dev:renderer
# Abrir http://localhost:3000
```

**Verificar:**
- ✅ Banner roxo no topo
- ✅ Mensagem clara sobre Electron
- ✅ Botão "Dismiss" funciona
- ✅ Monaco Editor funciona (com workers)

---

## 📊 Arquivos Criados/Modificados

### Criados:
1. `/web/src/config/monaco.config.ts` - Configuração Monaco
2. `/web/src/components/molecules/ElectronBanner.tsx` - Banner de aviso

### Modificados:
1. `/web/src/index.tsx` - Import do monaco.config
2. `/web/src/pages/App.tsx` - Adicionado ElectronBanner
3. `/web/src/components/index.ts` - Export ElectronBanner
4. `/web/src/services/flowTestElectron.service.ts` - Melhor error handling
5. `/web/electron/main.ts` - Porta 3000 e CSP atualizada
6. `/web/ELECTRON_README.md` - Documentação atualizada
7. `/web/MIGRATION_ELECTRON_SUMMARY.md` - Diagrama atualizado
8. `/web/docs/ELECTRON_SECURITY.md` - CSP documentada

---

## 🔍 Troubleshooting

### Monaco ainda dá erro?
- Verificar se `monaco.config.ts` está sendo importado no `index.tsx`
- Limpar cache: `rm -rf node_modules/.cache dist`
- Rebuild: `npm run build`

### Banner não aparece no browser?
- Abrir console e verificar: `window.flowTestAPI`
- Deve ser `undefined` no browser
- Deve ser `object` no Electron

### Test execution falha no Electron?
- Verificar se `preload.js` está sendo carregado
- Console deve ter: `✅ Electron Main Process Initialized`
- DevTools → Application → Console (verificar erros)

---

**Status**: ✅ Correções Completas
**Próximo**: Testar no Electron e validar que todos os erros foram resolvidos
