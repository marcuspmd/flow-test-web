# MainWorkspace - Full Featured Version

## 🎯 Visão Geral

MainWorkspace completo que integra o PostmanSidebar com interface completa de API client estilo Postman, incluindo sistema de tabs, painéis de request/response e drag-and-drop.

## 🚀 Recursos Principais

### 1. **Sidebar Postman-Style**
- Integração completa com PostmanSidebar
- Drag horizontal para redimensionar (200px - 500px)
- Persistência de tamanho durante uso
- Visual feedback no drag handle

### 2. **Sistema de Tabs**
- Abrir múltiplas requests em tabs
- Indicador visual de tab ativa
- Badge com método HTTP colorido (GET, POST, PUT, DELETE, PATCH)
- Botão de fechar tab (✕)
- Scroll horizontal automático quando há muitas tabs

### 3. **Painel de Request**
- **URL Bar**: Seletor de método HTTP + input de URL + botão Send
- **Sub-tabs**: Params, Headers, Body, Auth
- **Height ajustável**: Drag vertical entre request/response (20% - 80%)
- Estado vazio para cada sub-tab

### 4. **Painel de Response**
- **Sub-tabs**: Body, Headers, Console
- **Estado vazio**: Indicação para "Hit Send to execute"
- Espaço reservado para exibição de resposta JSON/XML/HTML

### 5. **Welcome Screen**
- Exibido quando nenhuma tab está aberta
- Mensagem de boas-vindas com ícone 🚀
- Instruções para começar

## 📁 Estrutura de Componentes

### Styled Components

#### Layout Principal
- `WorkspaceWrapper` - Container principal (flex horizontal)
- `SidebarContainer` - Container do sidebar com width dinâmico
- `MainSection` - Área principal (flex vertical)

#### Drag Handles
- `DragHandle` - Resize horizontal do sidebar
- `VerticalDragHandle` - Resize vertical request/response

#### Tabs System
- `TabsContainer` - Container de tabs com scroll horizontal
- `Tab` - Tab individual com método, nome e botão fechar

#### Request Panel
- `RequestPanel` - Container do painel de request
- `URLBar` - Barra com método, URL e botão Send
- `RequestTabs` - Sub-tabs (Params, Headers, Body, Auth)
- `RequestBody` - Área de conteúdo do request

#### Response Panel
- `ResponsePanel` - Container do painel de response
- `ResponseTabs` - Sub-tabs (Body, Headers, Console)
- `ResponseBody` - Área de conteúdo da response

#### States
- `WelcomeScreen` - Tela inicial quando sem tabs
- `EmptyState` - Estado vazio genérico

## 🔧 Estados React

### Sidebar
- `sidebarWidth` - Largura atual do sidebar (px)
- `isDragging` - Flag de drag ativo (horizontal)

### Tabs
- `openTabs` - Array de tabs abertas
  ```typescript
  interface OpenTab {
    id: string;
    name: string;
    method: string;
    url: string;
  }
  ```
- `activeTabId` - ID da tab ativa

### Request
- `currentMethod` - Método HTTP selecionado
- `currentUrl` - URL atual
- `activeRequestTab` - Sub-tab ativa (params, headers, body, auth)

### Response
- `activeResponseTab` - Sub-tab ativa (body, headers, console)

### Panels
- `requestPanelHeight` - Altura do painel de request (%)
- `isDraggingVertical` - Flag de drag ativo (vertical)

## 🎨 Interações

### Abrir Request
1. Usuário clica em request no sidebar
2. `handleRequestClick(requestId)` é chamado
3. Busca dados do request em `mockCollections`
4. Verifica se já está aberto
5. Se não, cria nova tab e adiciona a `openTabs`
6. Define como `activeTabId`
7. Atualiza `currentMethod` e `currentUrl`

### Fechar Tab
1. Usuário clica no ✕ da tab
2. `closeTab(tabId, e)` é chamado
3. Remove tab de `openTabs`
4. Se for a tab ativa, seleciona última tab restante
5. Se não houver mais tabs, volta para WelcomeScreen

### Trocar Tab
1. Usuário clica em outra tab
2. `switchTab(tabId)` é chamado
3. Atualiza `activeTabId`
4. Atualiza `currentMethod` e `currentUrl` com dados da tab

### Resize Sidebar
1. Usuário arrasta `DragHandle`
2. `handleDragStart` define `isDragging = true`
3. `handleMouseMove` atualiza `sidebarWidth` (com limite 200-500px)
4. Otimização: só atualiza se diferença >= 3px
5. `handleMouseUp` define `isDragging = false`

### Resize Panels
1. Usuário arrasta `VerticalDragHandle`
2. `handleVerticalDragStart` define `isDraggingVertical = true`
3. `handleVerticalMouseMove` calcula posição relativa e atualiza `requestPanelHeight` (20-80%)
4. `handleMouseUp` define `isDraggingVertical = false`

## 🎨 Cores dos Métodos HTTP

```typescript
GET    → #059669 (verde)
POST   → #8e44ad (roxo)
PUT    → #546de5 (azul)
DELETE → #b91c1c (vermelho)
PATCH  → #343434 (cinza escuro)
```

## 🔌 Integração Redux

### Actions Utilizadas
- `setCollections(mockCollections)` - Inicializa coleções
- `setSelectedRequest(requestId)` - Define request selecionado

### Selectors
- (Nenhum selector usado diretamente no momento)

## 📝 Próximas Melhorias Possíveis

### Funcionalidade
- [ ] Executar requests de verdade (Send button)
- [ ] Exibir response real (JSON, headers, status)
- [ ] Editar params, headers, body
- [ ] Persistir tabs abertas no localStorage
- [ ] Atalhos de teclado (Ctrl+T, Ctrl+W, etc)
- [ ] Histórico de requests
- [ ] Auto-save de drafts

### UX
- [ ] Animações de transição entre tabs
- [ ] Indicador de request em andamento (loading)
- [ ] Syntax highlighting no editor de body
- [ ] Autocomplete para URLs
- [ ] Duplicate tab
- [ ] Reordenar tabs (drag-and-drop)

### Performance
- [ ] Virtualização de lista de collections (se > 100 items)
- [ ] Lazy load de request details
- [ ] Debounce em inputs

## 🐛 Notas Técnicas

### Event Listeners
Os event listeners de mouse são adicionados no `document` para capturar drag mesmo fora do componente:

```typescript
useEffect(() => {
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mousemove', handleVerticalMouseMove);
  document.addEventListener('mouseup', handleMouseUp);

  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mousemove', handleVerticalMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isDragging, isDraggingVertical]);
```

**Nota**: O `eslint-disable` é necessário porque os handlers são criados no render e não devem ser dependencies.

### Refs
- `lastWidthRef` - Usado para otimizar drag (só atualiza se >= 3px de diferença)

### Children Support
O componente aceita `children` para casos onde precisa renderizar conteúdo customizado:

```tsx
<MainWorkspace>
  <CustomContent />
</MainWorkspace>
```

Se `children` é passado, ele tem prioridade sobre o sistema de tabs.

## 🎯 Como Usar

### Uso Básico
```tsx
import MainWorkspace from './pages/MainWorkspace';

function App() {
  return <MainWorkspace />;
}
```

### Com Children
```tsx
<MainWorkspace>
  <div>Custom content</div>
</MainWorkspace>
```

## ✅ Checklist de Implementação

- [x] Layout responsivo com sidebar + main area
- [x] Drag horizontal para resize do sidebar
- [x] Sistema de tabs com open/close/switch
- [x] URL bar com método + URL + Send button
- [x] Request panel com sub-tabs
- [x] Response panel com sub-tabs
- [x] Drag vertical para resize de panels
- [x] Welcome screen quando sem tabs
- [x] Integração com PostmanSidebar
- [x] Integração com Redux (setCollections, setSelectedRequest)
- [x] Mock data de collections
- [x] Cores por método HTTP
- [x] TypeScript sem erros
- [x] Styled Components theming

## 📊 Métricas

- **Linhas de código**: ~520 linhas
- **Componentes Styled**: 17
- **Estados React**: 10
- **Handlers**: 7
- **Integração Redux**: 2 actions, 1 dispatch

## 🔄 Migrações

### De MainWorkspace.backup.tsx (simplificado)
A versão antiga tinha apenas:
- Sidebar + welcome screen básico
- Sem tabs
- Sem request/response panels
- ~116 linhas

A versão atual adiciona:
- Sistema completo de tabs ✅
- Request panel com URL bar e sub-tabs ✅
- Response panel com sub-tabs ✅
- Drag vertical para resize ✅
- ~520 linhas ✅
