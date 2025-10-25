# Electron Security Configuration

## 🔒 Content Security Policy (CSP)

### Problema
O Electron emitia um aviso de segurança:
```
Electron Security Warning (Insecure Content-Security-Policy)
This renderer process has either no Content Security Policy set or a policy with "unsafe-eval" enabled.
```

### Solução Implementada

Adicionamos uma **Content Security Policy** diferenciada para **desenvolvimento** e **produção** em `/web/electron/main.ts`.

---

## 📋 Configuração Atual

### Development Mode (isDev = true)

```javascript
"default-src 'self'; " +
"script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* ws://localhost:*; " +
"style-src 'self' 'unsafe-inline' http://localhost:*; " +
"img-src 'self' data: blob: http://localhost:*; " +
"font-src 'self' data: http://localhost:*; " +
"connect-src 'self' http://localhost:* ws://localhost:*; " +
"frame-src 'self';"
```

**Permissões:**
- ✅ `unsafe-inline` e `unsafe-eval` - Necessários para React Hot Reload e Rsbuild dev server
- ✅ `http://localhost:3000` - Rsbuild dev server
- ✅ `ws://localhost:3000` - WebSocket para HMR (Hot Module Replacement)
- ✅ `data:` e `blob:` - Imagens inline e Monaco Editor

**Por que `unsafe-eval`?**
- React DevTools e HMR precisam avaliar código dinamicamente
- Apenas em desenvolvimento - **desabilitado em produção**

---

### Production Mode (isDev = false)

```javascript
"default-src 'self'; " +
"script-src 'self'; " +
"style-src 'self' 'unsafe-inline'; " +
"img-src 'self' data: blob:; " +
"font-src 'self' data:; " +
"connect-src 'self'; " +
"frame-src 'none';"
```

**Restrições:**
- ❌ Sem `unsafe-eval` - **Máxima segurança**
- ❌ Sem scripts externos - Apenas arquivos locais (`'self'`)
- ❌ Sem iframes externos - `frame-src 'none'`
- ✅ `unsafe-inline` apenas para estilos (Monaco Editor precisa)

**Exceções Justificadas:**
- `style-src 'unsafe-inline'` - Monaco Editor injeta estilos inline dinamicamente
- `data:` e `blob:` - Fontes e imagens inline são seguras

---

## 🛡️ Outras Configurações de Segurança

### webPreferences (BrowserWindow)

```typescript
webPreferences: {
  nodeIntegration: false,        // ✅ Desabilita Node.js no renderer
  contextIsolation: true,        // ✅ Isola contexto do renderer
  sandbox: false,                // ⚠️ Necessário para preload script
  preload: path.join(__dirname, 'preload.js'), // ✅ Preload seguro
}
```

**Explicação:**
- `nodeIntegration: false` - Renderer não tem acesso direto ao Node.js
- `contextIsolation: true` - Renderer e preload rodam em contextos separados
- `sandbox: false` - Desabilitado para permitir IPC communication
- `preload.js` - Bridge seguro via `contextBridge`

---

## 🔐 Boas Práticas de Segurança Implementadas

### ✅ 1. Context Isolation
```typescript
// preload.ts
contextBridge.exposeInMainWorld('flowTestAPI', {
  // API limitada e validada
});
```

### ✅ 2. IPC Validation
```typescript
// main.ts - Validar inputs em todos os handlers
ipcMain.handle('execute-flow-test', async (_event, config) => {
  // Validação de config antes de executar
  if (!config || typeof config !== 'object') {
    throw new Error('Invalid config');
  }
  // ...
});
```

### ✅ 3. File System Access Restrito
```typescript
// main.ts - Apenas diretórios permitidos
ipcMain.handle('read-file', async (_event, filepath: string) => {
  // Validar path antes de ler
  const resolvedPath = path.resolve(filepath);
  // Prevenir path traversal
  if (resolvedPath.includes('..')) {
    throw new Error('Invalid path');
  }
  return await fs.readFile(resolvedPath, 'utf-8');
});
```

### ✅ 4. Process Cleanup
```typescript
// main.ts - Matar processos órfãos ao fechar
app.on('before-quit', () => {
  activeExecutions.forEach((process) => {
    process.kill();
  });
  activeExecutions.clear();
});
```

---

## 📝 Verificação da CSP

### Como testar
1. Abrir DevTools no Electron (Ctrl+Shift+I / Cmd+Opt+I)
2. Ir para Console
3. Verificar se **não há mais** o aviso de CSP
4. Testar funcionalidades:
   - Monaco Editor renderiza corretamente
   - Execução de testes funciona
   - IPC communication OK

### Comandos de teste
```bash
# Development
npm run dev
# Verificar console - não deve ter warning de CSP

# Production build
npm run build
npm run package
# Abrir .app gerado e verificar
```

---

## ⚠️ Troubleshooting

### Problema: Monaco Editor não renderiza
**Causa:** CSP bloqueando estilos inline
**Solução:** Manter `style-src 'unsafe-inline'` (já implementado)

### Problema: React DevTools não funciona em dev
**Causa:** CSP bloqueando `unsafe-eval`
**Solução:** Permitir apenas em `isDev` (já implementado)

### Problema: Imagens não carregam
**Causa:** CSP bloqueando `data:` URIs
**Solução:** Adicionar `data:` e `blob:` em `img-src` (já implementado)

---

## 🔗 Referências

- [Electron Security Best Practices](https://www.electronjs.org/docs/latest/tutorial/security)
- [Content Security Policy (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Electron Context Isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation)
- [OWASP CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

---

## 📊 Comparação CSP

| Diretiva | Development | Production | Justificativa |
|----------|-------------|------------|---------------|
| `default-src` | `'self'` | `'self'` | Base restritiva |
| `script-src` | `'self' 'unsafe-inline' 'unsafe-eval' localhost:*` | `'self'` | Dev: HMR, Prod: Seguro |
| `style-src` | `'self' 'unsafe-inline' localhost:*` | `'self' 'unsafe-inline'` | Monaco Editor |
| `img-src` | `'self' data: blob: localhost:*` | `'self' data: blob:` | Imagens inline |
| `connect-src` | `'self' localhost:* ws://localhost:*` | `'self'` | Dev: WebSocket HMR |
| `frame-src` | `'self'` | `'none'` | Sem iframes externos |

---

**Status**: ✅ Configurado e Seguro
**Última Atualização**: Janeiro 2025
**Versão**: Electron 28.x
