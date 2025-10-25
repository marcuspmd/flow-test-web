# Redux Store - Guia de Uso

## 📦 Visão Geral

O Redux Store do Flow Test Engine foi configurado com **Redux Toolkit** e possui:

- ✅ **3 Slices principais**: UI, Collections, Environments
- ✅ **Persistência automática** no localStorage
- ✅ **Redux DevTools** habilitado em desenvolvimento
- ✅ **TypeScript** totalmente tipado
- ✅ **Hooks customizados** para facilitar uso

---

## 🏗️ Estrutura

```
src/
├── store/
│   ├── index.ts                    # Store configuration
│   ├── store.exports.ts            # Centralized exports
│   └── slices/
│       ├── uiSlice.ts              # UI state (theme, sidebar, navigation)
│       ├── collectionsSlice.ts     # Collections & Test Suites
│       └── environmentsSlice.ts    # Environments & Variables
├── hooks/
│   ├── index.ts
│   ├── useUI.ts                    # Hook para UI state
│   ├── useCollections.ts           # Hook para Collections
│   └── useEnvironments.ts          # Hook para Environments
└── providers/
    └── ReduxProvider.tsx           # Redux Provider wrapper
```

---

## 🎯 Slices

### 1. **UI Slice** (`uiSlice.ts`)

Gerencia estado da interface do usuário.

**Estado:**
```typescript
{
  theme: 'dark' | 'light',
  sidebar: {
    isCollapsed: boolean,
    width: number
  },
  activeNavItem: string,
  activeEnvironment: string,
  modals: {
    confirmDialog: boolean,
    settingsDialog: boolean
  }
}
```

**Actions:**
- `setTheme(theme)` - Define tema
- `toggleTheme()` - Alterna entre dark/light
- `setSidebarCollapsed(collapsed)` - Colapsa/expande sidebar
- `toggleSidebar()` - Alterna sidebar
- `setSidebarWidth(width)` - Define largura da sidebar
- `setActiveNavItem(item)` - Define item de navegação ativo
- `setActiveEnvironment(env)` - Define ambiente ativo
- `setModalOpen({ modal, isOpen })` - Abre/fecha modal
- `closeAllModals()` - Fecha todos os modais

---

### 2. **Collections Slice** (`collectionsSlice.ts`)

Gerencia coleções de testes e suítes.

**Estado:**
```typescript
{
  collections: Collection[],
  activeCollectionId: string | null,
  activeSuiteId: string | null,
  activeStepId: string | null,
  isLoading: boolean,
  error: string | null
}
```

**Tipos:**
```typescript
interface Collection {
  id: string;
  name: string;
  description?: string;
  suites: TestSuite[];
  createdAt: string;
  updatedAt: string;
}

interface TestSuite {
  id: string;
  node_id: string;
  suite_name: string;
  description?: string;
  base_url?: string;
  variables?: Variable[];
  steps: TestStep[];
  metadata?: {
    priority?: 'critical' | 'high' | 'medium' | 'low';
    tags?: string[];
  };
}
```

**Actions:**

**Collections:**
- `addCollection(collection)` - Adiciona coleção
- `updateCollection({ id, updates })` - Atualiza coleção
- `deleteCollection(id)` - Remove coleção

**Test Suites:**
- `addTestSuite({ collectionId, suite })` - Adiciona suite
- `updateTestSuite({ collectionId, suiteId, updates })` - Atualiza suite
- `deleteTestSuite({ collectionId, suiteId })` - Remove suite

**Seleção:**
- `setActiveCollection(id)` - Define coleção ativa
- `setActiveSuite(id)` - Define suite ativa
- `setActiveStep(id)` - Define step ativo

---

### 3. **Environments Slice** (`environmentsSlice.ts`)

Gerencia ambientes e suas variáveis.

**Estado:**
```typescript
{
  environments: Environment[],
  activeEnvironmentId: string,
  isLoading: boolean,
  error: string | null
}
```

**Tipos:**
```typescript
interface Environment {
  id: string;
  name: string;
  displayName: string;
  variables: EnvironmentVariable[];
  createdAt: string;
  updatedAt: string;
}

interface EnvironmentVariable {
  key: string;
  value: string;
  type: 'text' | 'secret';
  enabled: boolean;
}
```

**Ambientes Padrão:**
- `dev` - Development (localhost:3000)
- `staging` - Staging (staging-api.example.com)
- `prod` - Production (api.example.com)

**Actions:**

**Environments:**
- `addEnvironment(environment)` - Adiciona ambiente
- `updateEnvironment({ id, updates })` - Atualiza ambiente
- `deleteEnvironment(id)` - Remove ambiente
- `setActiveEnvironment(id)` - Define ambiente ativo

**Variables:**
- `addVariable({ environmentId, variable })` - Adiciona variável
- `updateVariable({ environmentId, key, updates })` - Atualiza variável
- `deleteVariable({ environmentId, key })` - Remove variável
- `toggleVariable({ environmentId, key })` - Liga/desliga variável

---

## 🎣 Hooks Customizados

### `useUI()`

Hook para gerenciar UI state.

```typescript
import { useUI } from '../hooks';

function MyComponent() {
  const {
    theme,
    sidebar,
    activeNavItem,
    toggleTheme,
    setSidebarWidth,
    setActiveNavItem,
  } = useUI();

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

**Retorna:**
```typescript
{
  // State
  theme: 'dark' | 'light',
  sidebar: { isCollapsed: boolean, width: number },
  activeNavItem: string,
  activeEnvironment: string,
  modals: {...},

  // Actions
  setTheme: (theme: ThemeMode) => void,
  toggleTheme: () => void,
  setSidebarCollapsed: (collapsed: boolean) => void,
  toggleSidebar: () => void,
  setSidebarWidth: (width: number) => void,
  setActiveNavItem: (item: string) => void,
  setActiveEnvironment: (env: string) => void,
}
```

---

### `useCollections()`

Hook para gerenciar collections.

```typescript
import { useCollections } from '../hooks';

function CollectionsList() {
  const {
    collections,
    activeCollection,
    activeSuite,
    addCollection,
    setActiveCollection,
    deleteCollection,
  } = useCollections();

  const handleAddCollection = () => {
    addCollection({
      id: crypto.randomUUID(),
      name: 'New Collection',
      suites: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div>
      <button onClick={handleAddCollection}>Add Collection</button>
      {collections.map(c => (
        <div key={c.id} onClick={() => setActiveCollection(c.id)}>
          {c.name}
        </div>
      ))}
    </div>
  );
}
```

**Retorna:**
```typescript
{
  // State
  collections: Collection[],
  activeCollectionId: string | null,
  activeSuiteId: string | null,
  activeStepId: string | null,
  isLoading: boolean,
  error: string | null,

  // Computed
  activeCollection: Collection | undefined,
  activeSuite: TestSuite | undefined,

  // Actions - Collections
  addCollection: (collection: Collection) => void,
  updateCollection: (id: string, updates: Partial<Collection>) => void,
  deleteCollection: (id: string) => void,

  // Actions - Test Suites
  addTestSuite: (collectionId: string, suite: TestSuite) => void,
  updateTestSuite: (collectionId: string, suiteId: string, updates: Partial<TestSuite>) => void,
  deleteTestSuite: (collectionId: string, suiteId: string) => void,

  // Actions - Selection
  setActiveCollection: (id: string | null) => void,
  setActiveSuite: (id: string | null) => void,
  setActiveStep: (id: string | null) => void,
}
```

---

### `useEnvironments()`

Hook para gerenciar environments.

```typescript
import { useEnvironments } from '../hooks';

function EnvironmentSelector() {
  const {
    environments,
    activeEnvironment,
    activeVariables,
    setActiveEnvironment,
    updateVariable,
  } = useEnvironments();

  return (
    <select
      value={activeEnvironment?.id}
      onChange={(e) => setActiveEnvironment(e.target.value)}
    >
      {environments.map(env => (
        <option key={env.id} value={env.id}>
          {env.displayName}
        </option>
      ))}
    </select>
  );
}
```

**Retorna:**
```typescript
{
  // State
  environments: Environment[],
  activeEnvironmentId: string,
  isLoading: boolean,
  error: string | null,

  // Computed
  activeEnvironment: Environment | undefined,
  activeVariables: EnvironmentVariable[],

  // Actions - Environments
  addEnvironment: (environment: Environment) => void,
  updateEnvironment: (id: string, updates: Partial<Environment>) => void,
  deleteEnvironment: (id: string) => void,
  setActiveEnvironment: (id: string) => void,

  // Actions - Variables
  addVariable: (environmentId: string, variable: EnvironmentVariable) => void,
  updateVariable: (environmentId: string, key: string, updates: Partial<EnvironmentVariable>) => void,
  deleteVariable: (environmentId: string, key: string) => void,
  toggleVariable: (environmentId: string, key: string) => void,
}
```

---

## 🔧 Uso Direto do Redux (sem hooks)

Se preferir usar diretamente os hooks do Redux:

```typescript
import { useAppSelector, useAppDispatch } from '../store';
import { toggleTheme, setActiveNavItem } from '../store/store.exports';

function MyComponent() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.ui.theme);
  const activeNav = useAppSelector(state => state.ui.activeNavItem);

  return (
    <div>
      <button onClick={() => dispatch(toggleTheme())}>
        Toggle Theme
      </button>
      <button onClick={() => dispatch(setActiveNavItem('settings'))}>
        Go to Settings
      </button>
    </div>
  );
}
```

---

## 💾 Persistência (localStorage)

O estado do Redux é **automaticamente persistido** no localStorage através do middleware `localStorageMiddleware`.

**Chave de armazenamento:** `flowtest-state`

**Estado persistido:**
- ✅ `ui` (tema, sidebar, navegação)
- ✅ `collections` (coleções e suites)
- ✅ `environments` (ambientes e variáveis)

**Carregar estado salvo:**
O estado é carregado automaticamente ao inicializar a aplicação através da função `loadState()`.

**Limpar estado:**
```typescript
localStorage.removeItem('flowtest-state');
window.location.reload(); // Recarrega com estado inicial
```

---

## 🛠️ Redux DevTools

As Redux DevTools estão habilitadas em **modo development**.

**Como usar:**
1. Instale a extensão [Redux DevTools](https://github.com/reduxjs/redux-devtools) no navegador
2. Abra o DevTools do navegador (F12)
3. Navegue até a aba "Redux"
4. Visualize:
   - State tree completo
   - Actions dispatched
   - State diffs
   - Time-travel debugging

---

## 📊 Exemplo Completo

```typescript
import { useUI, useCollections, useEnvironments } from '../hooks';

function Dashboard() {
  // UI State
  const { theme, toggleTheme, sidebar, setSidebarWidth } = useUI();

  // Collections State
  const {
    collections,
    activeCollection,
    addCollection,
    setActiveCollection,
  } = useCollections();

  // Environments State
  const {
    environments,
    activeEnvironment,
    setActiveEnvironment,
  } = useEnvironments();

  const handleCreateCollection = () => {
    const newCollection = {
      id: crypto.randomUUID(),
      name: 'My API Tests',
      description: 'Testing my API endpoints',
      suites: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addCollection(newCollection);
    setActiveCollection(newCollection.id);
  };

  return (
    <div>
      <h1>Dashboard - Theme: {theme}</h1>
      <button onClick={toggleTheme}>Toggle Theme</button>

      <h2>Environment: {activeEnvironment?.displayName}</h2>
      <select
        value={activeEnvironment?.id}
        onChange={(e) => setActiveEnvironment(e.target.value)}
      >
        {environments.map(env => (
          <option key={env.id} value={env.id}>
            {env.displayName}
          </option>
        ))}
      </select>

      <h2>Collections ({collections.length})</h2>
      <button onClick={handleCreateCollection}>
        Create Collection
      </button>

      {collections.map(c => (
        <div
          key={c.id}
          onClick={() => setActiveCollection(c.id)}
          style={{
            fontWeight: c.id === activeCollection?.id ? 'bold' : 'normal'
          }}
        >
          {c.name} ({c.suites.length} suites)
        </div>
      ))}
    </div>
  );
}
```

---

## ✅ Checklist de Integração

Ao criar novos componentes que precisam de state global:

- [ ] Importar hook customizado (`useUI`, `useCollections`, `useEnvironments`)
- [ ] Desestruturar apenas o que precisa (evitar re-renders desnecessários)
- [ ] Usar actions para atualizar estado (nunca mutar diretamente)
- [ ] Adicionar TypeScript types para props/state
- [ ] Testar com Redux DevTools para debug
- [ ] Verificar se estado persiste corretamente no localStorage

---

## 🚀 Próximos Passos

Com o Redux Store configurado, você pode:

1. **Migrar estado local** de componentes para Redux quando necessário
2. **Criar novos slices** para features adicionais (ex: `requestHistorySlice`)
3. **Adicionar middleware** customizado (ex: analytics, logging)
4. **Implementar async actions** com Redux Thunk (já incluído no Toolkit)
5. **Otimizar re-renders** com selectors memoizados (Reselect)

---

**Versão:** 1.0.0
**Data:** Outubro 2025
**Sprint:** 1.7 - Redux Store Setup ✅
