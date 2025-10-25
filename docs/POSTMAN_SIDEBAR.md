# Sidebar Estilo Postman

Sistema completo de sidebar inspirado no Postman, com navegação por abas, gerenciamento de coleções e requests.

## 🎯 Características

### Componentes Principais

1. **PostmanSidebar** - Componente principal que integra todos os elementos
2. **SidebarTabs** - Navegação por abas (Collections, Environments, Flows, History)
3. **SidebarHeaderActions** - Header com botão criar e campo de busca
4. **CollectionList** - Lista de coleções com filtro de busca
5. **CollectionItem** - Item de coleção expansível com hierarquia
6. **RequestItem** - Item de request com método HTTP colorido

### Funcionalidades

- ✅ Navegação por abas (Collections, Environments, Flows, History)
- ✅ Botão de criar nova coleção
- ✅ Campo de busca em tempo real
- ✅ Coleções expansíveis com toggle
- ✅ Suporte a pastas e hierarquia (folders/subfolders)
- ✅ Requests com métodos HTTP coloridos (GET, POST, PUT, DELETE, PATCH, etc.)
- ✅ Estados visuais (selected, active)
- ✅ Botões de ações contextuais
- ✅ Scrollbar customizado
- ✅ Integração completa com Redux
- ✅ Filtro de busca em coleções e requests

## 📦 Estrutura de Arquivos

```
src/
├── components/
│   └── organisms/
│       └── Sidebar/
│           ├── PostmanSidebar.tsx        # Componente principal
│           ├── SidebarTabs.tsx           # Abas de navegação
│           ├── SidebarHeaderActions.tsx  # Header com criar e busca
│           ├── CollectionList.tsx        # Lista de coleções
│           ├── CollectionItem.tsx        # Item de coleção
│           ├── RequestItem.tsx           # Item de request
│           └── index.ts                  # Exports
├── store/
│   └── slices/
│       └── sidebarSlice.ts              # Redux state management
├── types/
│   └── sidebar.types.ts                 # TypeScript interfaces
├── data/
│   └── mockSidebarData.ts              # Dados de exemplo
└── pages/
    └── PostmanSidebarDemo.tsx          # Página de demonstração
```

## 🚀 Como Usar

### 1. Visualizar a Demo

Acesse a rota `/demo/postman-sidebar` no navegador:

```
http://localhost:3000/demo/postman-sidebar
```

### 2. Integrar no seu Projeto

```tsx
import { PostmanSidebar } from '../components/organisms/Sidebar';

function MyPage() {
  const handleCreateCollection = () => {
    // Lógica para criar coleção
  };

  const handleRequestClick = (requestId: string) => {
    // Lógica quando request é clicado
  };

  return (
    <PostmanSidebar
      onCreateCollection={handleCreateCollection}
      onRequestClick={handleRequestClick}
    />
  );
}
```

### 3. Gerenciar Estado via Redux

```tsx
import { useAppDispatch } from '../store';
import {
  setCollections,
  addCollection,
  toggleCollection,
  setSearchQuery
} from '../store/slices/sidebarSlice';

// Definir coleções
dispatch(setCollections(myCollections));

// Adicionar nova coleção
dispatch(addCollection(newCollection));

// Expandir/colapsar coleção
dispatch(toggleCollection(collectionId));

// Atualizar busca
dispatch(setSearchQuery('query'));
```

## 📋 Interfaces TypeScript

### SidebarCollection

```typescript
interface SidebarCollection {
  id: string;
  name: string;
  description?: string;
  folders: SidebarFolder[];
  requests: SidebarRequest[];
  isExpanded?: boolean;
}
```

### SidebarRequest

```typescript
interface SidebarRequest {
  id: string;
  name: string;
  method: HttpMethod; // 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'
  url?: string;
  collectionId: string;
  folderId?: string;
}
```

### SidebarFolder

```typescript
interface SidebarFolder {
  id: string;
  name: string;
  collectionId: string;
  parentId?: string;
  requests: SidebarRequest[];
  subfolders: SidebarFolder[];
  isExpanded?: boolean;
}
```

## 🎨 Customização de Estilos

Os estilos seguem o tema definido em `src/themes/`:

- `sidebar-background` - Cor de fundo da sidebar
- `primary-text` - Cor do texto principal
- `secondary-text` - Cor do texto secundário
- `layout-border` - Cor das bordas
- `brand` - Cor principal (usado em estados ativos)
- `method-get`, `method-post`, etc. - Cores dos métodos HTTP

## 🔧 Redux State

O estado da sidebar é gerenciado no slice `sidebarSlice`:

```typescript
interface SidebarState {
  activeTab: SidebarTab;
  searchQuery: string;
  collections: SidebarCollection[];
  environments: SidebarEnvironment[];
  history: SidebarHistoryItem[];
  expandedCollections: Set<string>;
  expandedFolders: Set<string>;
  selectedRequestId?: string;
  sidebarWidth: number;
  isCollapsed: boolean;
}
```

### Actions Disponíveis

- `setActiveTab(tab)` - Muda a aba ativa
- `setSearchQuery(query)` - Atualiza o filtro de busca
- `setCollections(collections)` - Define coleções
- `addCollection(collection)` - Adiciona nova coleção
- `removeCollection(id)` - Remove coleção
- `toggleCollection(id)` - Expande/colapsa coleção
- `setSelectedRequest(id)` - Define request selecionado

## 🧪 Testes

Para testar os componentes:

1. Execute `npm run dev`
2. Acesse `/demo/postman-sidebar`
3. Teste as funcionalidades:
   - Clique nas abas superiores
   - Use o campo de busca
   - Clique no botão "+" para criar coleção
   - Expanda/colapse coleções
   - Clique em requests

## 📝 Exemplo de Dados

Veja `src/data/mockSidebarData.ts` para exemplo completo de estrutura de dados.

```typescript
const myCollection: SidebarCollection = {
  id: 'col-1',
  name: 'My API',
  description: 'REST API endpoints',
  isExpanded: true,
  folders: [],
  requests: [
    {
      id: 'req-1',
      name: 'Get Users',
      method: 'GET',
      url: '/api/users',
      collectionId: 'col-1',
    },
    {
      id: 'req-2',
      name: 'Create User',
      method: 'POST',
      url: '/api/users',
      collectionId: 'col-1',
    },
  ],
};
```

## 🎯 Próximos Passos

- [ ] Implementar drag & drop para reorganizar items
- [ ] Adicionar suporte a variáveis de ambiente
- [ ] Implementar histórico de requests
- [ ] Adicionar flows/workflows
- [ ] Suporte a importação/exportação de coleções
- [ ] Testes unitários com Jest
- [ ] Testes E2E com Playwright
