# Redux Migration Examples

## 📖 Exemplos de Migração de Componentes para Redux

Este documento mostra como migrar componentes que usam estado local (useState) para usar o Redux Store.

---

## Exemplo 1: Migração de Theme Toggle

### ❌ Antes (useState local)

```typescript
import { useState } from 'react';

function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button onClick={toggleTheme}>
      Theme: {theme}
    </button>
  );
}
```

### ✅ Depois (Redux com useUI hook)

```typescript
import { useUI } from '../hooks';

function ThemeToggle() {
  const { theme, toggleTheme } = useUI();

  return (
    <button onClick={toggleTheme}>
      Theme: {theme}
    </button>
  );
}
```

**Benefícios:**
- ✅ Não precisa gerenciar localStorage manualmente
- ✅ Estado compartilhado entre todos os componentes
- ✅ Persistência automática
- ✅ Menos código

---

## Exemplo 2: Migração de Sidebar State

### ❌ Antes (Props drilling)

```typescript
// App.tsx
function App() {
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Layout>
      <Sidebar
        width={sidebarWidth}
        isCollapsed={isCollapsed}
        onWidthChange={setSidebarWidth}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      <Header
        sidebarCollapsed={isCollapsed}
        onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />
      <Content />
    </Layout>
  );
}

// Sidebar.tsx
interface SidebarProps {
  width: number;
  isCollapsed: boolean;
  onWidthChange: (width: number) => void;
  onToggle: () => void;
}

function Sidebar({ width, isCollapsed, onWidthChange, onToggle }: SidebarProps) {
  // ...
}
```

### ✅ Depois (Redux)

```typescript
// App.tsx
function App() {
  return (
    <Layout>
      <Sidebar />
      <Header />
      <Content />
    </Layout>
  );
}

// Sidebar.tsx
import { useUI } from '../hooks';

function Sidebar() {
  const {
    sidebar,
    setSidebarWidth,
    toggleSidebar,
  } = useUI();

  return (
    <SidebarWrapper width={sidebar.width}>
      <button onClick={toggleSidebar}>
        {sidebar.isCollapsed ? 'Expand' : 'Collapse'}
      </button>
      {/* Resto do componente */}
    </SidebarWrapper>
  );
}

// Header.tsx
import { useUI } from '../hooks';

function Header() {
  const { sidebar, toggleSidebar } = useUI();

  return (
    <HeaderWrapper>
      <button onClick={toggleSidebar}>Toggle Sidebar</button>
      {/* Resto do header */}
    </HeaderWrapper>
  );
}
```

**Benefícios:**
- ✅ Elimina props drilling
- ✅ Componentes mais simples e desacoplados
- ✅ Estado compartilhado sem passar props
- ✅ Sidebar e Header acessam o mesmo estado

---

## Exemplo 3: Migração de Navigation State

### ❌ Antes (Context API local)

```typescript
// NavigationContext.tsx
const NavigationContext = createContext<{
  activeItem: string;
  setActiveItem: (item: string) => void;
} | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeItem, setActiveItem] = useState('home');

  return (
    <NavigationContext.Provider value={{ activeItem, setActiveItem }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}

// Sidebar.tsx
import { useNavigation } from '../contexts/NavigationContext';

function Sidebar() {
  const { activeItem, setActiveItem } = useNavigation();

  return (
    <nav>
      <button
        className={activeItem === 'home' ? 'active' : ''}
        onClick={() => setActiveItem('home')}
      >
        Home
      </button>
      <button
        className={activeItem === 'collections' ? 'active' : ''}
        onClick={() => setActiveItem('collections')}
      >
        Collections
      </button>
    </nav>
  );
}
```

### ✅ Depois (Redux)

```typescript
// Não precisa mais de NavigationContext!

// Sidebar.tsx
import { useUI } from '../hooks';

function Sidebar() {
  const { activeNavItem, setActiveNavItem } = useUI();

  return (
    <nav>
      <button
        className={activeNavItem === 'home' ? 'active' : ''}
        onClick={() => setActiveNavItem('home')}
      >
        Home
      </button>
      <button
        className={activeNavItem === 'collections' ? 'active' : ''}
        onClick={() => setActiveNavItem('collections')}
      >
        Collections
      </button>
    </nav>
  );
}
```

**Benefícios:**
- ✅ Menos boilerplate (não precisa criar Context)
- ✅ Estado persistido automaticamente
- ✅ Funcionalidade idêntica com menos código

---

## Exemplo 4: Migração de Collections Management

### ❌ Antes (Estado local disperso)

```typescript
// CollectionsPage.tsx
function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addCollection = (collection: Collection) => {
    setCollections([...collections, collection]);
  };

  const deleteCollection = (id: string) => {
    setCollections(collections.filter(c => c.id !== id));
    if (activeId === id) {
      setActiveId(null);
    }
  };

  const updateCollection = (id: string, updates: Partial<Collection>) => {
    setCollections(collections.map(c =>
      c.id === id ? { ...c, ...updates } : c
    ));
  };

  return (
    <div>
      <CollectionsList
        collections={collections}
        activeId={activeId}
        onSelect={setActiveId}
        onDelete={deleteCollection}
      />
      <CollectionEditor
        collection={collections.find(c => c.id === activeId)}
        onUpdate={updateCollection}
      />
    </div>
  );
}
```

### ✅ Depois (Redux)

```typescript
// CollectionsPage.tsx
import { useCollections } from '../hooks';

function CollectionsPage() {
  const {
    collections,
    activeCollection,
    activeCollectionId,
    setActiveCollection,
    deleteCollection,
    updateCollection,
  } = useCollections();

  return (
    <div>
      <CollectionsList
        collections={collections}
        activeId={activeCollectionId}
        onSelect={setActiveCollection}
        onDelete={deleteCollection}
      />
      <CollectionEditor
        collection={activeCollection}
        onUpdate={(updates) => {
          if (activeCollectionId) {
            updateCollection(activeCollectionId, updates);
          }
        }}
      />
    </div>
  );
}
```

**Benefícios:**
- ✅ Estado compartilhado entre páginas
- ✅ Collections persistem após navegação
- ✅ Menos bugs (lógica centralizada no slice)
- ✅ Fácil adicionar undo/redo depois

---

## Exemplo 5: Environment Selector

### ❌ Antes (Estado local)

```typescript
function EnvironmentSelector() {
  const [environments] = useState([
    { id: 'dev', name: 'Development' },
    { id: 'prod', name: 'Production' },
  ]);
  const [activeEnv, setActiveEnv] = useState('dev');

  return (
    <select value={activeEnv} onChange={e => setActiveEnv(e.target.value)}>
      {environments.map(env => (
        <option key={env.id} value={env.id}>{env.name}</option>
      ))}
    </select>
  );
}
```

### ✅ Depois (Redux)

```typescript
import { useEnvironments } from '../hooks';

function EnvironmentSelector() {
  const {
    environments,
    activeEnvironment,
    setActiveEnvironment,
  } = useEnvironments();

  return (
    <select
      value={activeEnvironment?.id}
      onChange={e => setActiveEnvironment(e.target.value)}
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

**Benefícios:**
- ✅ Variáveis de ambiente acessíveis em toda aplicação
- ✅ Fácil gerenciar múltiplos ambientes
- ✅ CRUD de variáveis integrado

---

## Exemplo 6: Modal Management

### ❌ Antes (useState em cada página)

```typescript
// SettingsPage.tsx
function SettingsPage() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  return (
    <div>
      <button onClick={() => setShowConfirmDialog(true)}>
        Delete Account
      </button>

      {showConfirmDialog && (
        <Modal onClose={() => setShowConfirmDialog(false)}>
          Are you sure?
        </Modal>
      )}
    </div>
  );
}
```

### ✅ Depois (Redux)

```typescript
import { useUI } from '../hooks';
import { useAppDispatch } from '../store';
import { setModalOpen } from '../store/store.exports';

function SettingsPage() {
  const dispatch = useAppDispatch();
  const { modals } = useUI();

  const openConfirmDialog = () => {
    dispatch(setModalOpen({ modal: 'confirmDialog', isOpen: true }));
  };

  const closeConfirmDialog = () => {
    dispatch(setModalOpen({ modal: 'confirmDialog', isOpen: false }));
  };

  return (
    <div>
      <button onClick={openConfirmDialog}>Delete Account</button>

      {modals.confirmDialog && (
        <Modal onClose={closeConfirmDialog}>
          Are you sure?
        </Modal>
      )}
    </div>
  );
}
```

**Benefícios:**
- ✅ Estado global de modals
- ✅ Pode abrir/fechar modals de qualquer componente
- ✅ Facilita implementar modal stacking
- ✅ closeAllModals() para fechar todos de uma vez

---

## 🎯 Quando Migrar para Redux?

### ✅ Migre quando:
- Estado precisa ser compartilhado entre múltiplos componentes
- Há props drilling (passar props por vários níveis)
- Estado precisa persistir entre navegações
- Estado complexo com muitas operações (CRUD)
- Precisa de histórico/undo/redo

### ❌ NÃO migre quando:
- Estado é local e simples (ex: toggle de um dropdown)
- Componente isolado (não compartilha estado)
- Estado temporário/efêmero
- Form state gerenciado por biblioteca específica (React Hook Form)

---

## 📝 Checklist de Migração

Ao migrar um componente para Redux:

- [ ] Identificar qual slice usar (UI, Collections, Environments)
- [ ] Remover useState/useContext local
- [ ] Importar hook customizado apropriado
- [ ] Desestruturar apenas state/actions necessários
- [ ] Atualizar handlers para usar Redux actions
- [ ] Remover localStorage manual (já persiste automaticamente)
- [ ] Remover props que agora vêm do Redux
- [ ] Testar com Redux DevTools
- [ ] Verificar se não há re-renders excessivos

---

## 🚀 Próximos Passos

Componentes candidatos para migração:

1. **Main.tsx** - Migrar `activeItem` e `selectedEnv` para Redux
2. **Sidebar** - Migrar width e collapsed state (já parcialmente feito)
3. **Header** - Usar Redux para environment selector
4. **Collections views** - Usar `useCollections()` quando criadas

---

**Versão:** 1.0.0
**Data:** Outubro 2025
