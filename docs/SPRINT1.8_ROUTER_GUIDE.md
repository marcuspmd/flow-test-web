# React Router Setup - Quick Guide

## 📋 Overview

Sprint 1.8 implementou React Router v6 com:
- ✅ Lazy loading de páginas
- ✅ Layout wrapper com Sidebar + Header
- ✅ Breadcrumb navigation automática
- ✅ Integração com Redux state
- ✅ Suspense com loading fallback

---

## 🗂️ File Structure

```
src/
├── router/
│   ├── index.tsx        # Router component com Suspense
│   └── routes.tsx       # Route configuration array
├── pages/
│   ├── App.tsx          # Main app wrapper (usa Router)
│   ├── HomePage.tsx     # Dashboard page
│   ├── CollectionsPage.tsx  # Collections management
│   └── SettingsPage.tsx     # Settings page
└── components/
    └── layout/
        └── AppLayout.tsx    # Layout wrapper (Sidebar + Header)
```

---

## 🚀 Quick Start

### 1. Router já está integrado no App.tsx

```tsx
// src/pages/App.tsx
import { Router } from '../router';

function App() {
  return (
    <ReduxProvider>
      <ThemeProvider>
        <ToastProvider maxToasts={5}>
          <Router />  {/* ✅ Router ativo */}
        </ToastProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
```

### 2. Rodar o projeto

```bash
npm run dev
```

### 3. Acessar as páginas

- **Home:** http://localhost:5173/
- **Collections:** http://localhost:5173/collections
- **Settings:** http://localhost:5173/settings

---

## 📄 Current Pages

### HomePage (/)
**Features:**
- Hero section com boas-vindas
- Stats grid (4 cards):
  - Collections count
  - Test suites count
  - Environments count
  - Total tests count
- Feature cards (6 cards):
  - Collections Organization
  - API Testing
  - Environment Management
  - Test Execution
  - Detailed Reporting
  - YAML Configuration

**Usage:**
```tsx
// Rota: /
<HomePage />
```

### CollectionsPage (/collections)
**Features:**
- Collections list em grid
- Empty state quando sem collections
- Create collection modal
- Collection cards com:
  - Nome e descrição
  - Contagem de suites
  - Data de criação
  - Ações (delete)
- Active collection highlighting

**Redux Integration:**
```tsx
const { collections, activeCollection } = useCollections();
```

### SettingsPage (/settings)
**Features:**
- **Appearance section:**
  - Theme toggle (Light/Dark)
- **Environments section:**
  - Lista de environments
  - Variáveis com show/hide toggle
  - Active environment badge
- **About section:**
  - Versão e informações

**Redux Integration:**
```tsx
const { theme, toggleTheme } = useUI();
const { environments, activeEnvironment } = useEnvironments();
```

---

## 🧩 Layout System

### AppLayout Component

**Responsabilidades:**
- Renderizar Sidebar com navegação
- Renderizar Header com breadcrumbs
- Envolver conteúdo das páginas
- Sincronizar navegação com Redux

**Estrutura:**
```tsx
<AppLayout>
  <Sidebar>
    <SidebarItem label="Home" icon="🏠" active={true} />
    <SidebarItem label="Collections" icon="📚" />
    <SidebarItem label="Settings" icon="⚙️" />
  </Sidebar>

  <ContentArea>
    <Header
      breadcrumbs={[{ label: 'Home' }]}
      actions={[]}
      environments={environments}
      selectedEnvironment={activeEnvironment}
      onEnvironmentChange={setActiveEnvironment}
      onThemeToggle={toggleTheme}
    />

    <MainContent>
      {children} {/* Página atual renderizada aqui */}
    </MainContent>
  </ContentArea>
</AppLayout>
```

---

## 🔀 Adding New Routes

### Step 1: Create Page Component

```tsx
// src/pages/NewPage.tsx
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: ${({ theme }) => theme['spacing-xl']};
`;

export default function NewPage() {
  return (
    <Container>
      <h1>New Page</h1>
      <p>Content here...</p>
    </Container>
  );
}
```

### Step 2: Add Route Configuration

```tsx
// src/router/routes.tsx
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const HomePage = lazy(() => import('../pages/HomePage'));
const CollectionsPage = lazy(() => import('../pages/CollectionsPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const NewPage = lazy(() => import('../pages/NewPage')); // ✅ Add import

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/collections',
    element: <CollectionsPage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    path: '/new-page',  // ✅ Add route
    element: <NewPage />,
  },
  {
    path: '*',
    element: <HomePage />,
  },
];
```

### Step 3: Add Navigation Item (opcional)

```tsx
// src/components/layout/AppLayout.tsx
<SidebarSection title="Navigation">
  <SidebarItem
    label="Home"
    icon="🏠"
    active={activeNavItem === 'home'}
    onClick={() => handleNavigation('home', '/')}
  />
  <SidebarItem
    label="Collections"
    icon="📚"
    active={activeNavItem === 'collections'}
    onClick={() => handleNavigation('collections', '/collections')}
  />
  <SidebarItem
    label="New Page"  // ✅ Add item
    icon="📄"
    active={activeNavItem === 'new-page'}
    onClick={() => handleNavigation('new-page', '/new-page')}
  />
  <SidebarItem
    label="Settings"
    icon="⚙️"
    active={activeNavItem === 'settings'}
    onClick={() => handleNavigation('settings', '/settings')}
  />
</SidebarSection>
```

### Step 4: Update Breadcrumb Logic (opcional)

```tsx
// src/components/layout/AppLayout.tsx
const getBreadcrumb = (): BreadcrumbItemData[] => {
  const path = location.pathname;
  if (path === '/') return [{ label: 'Home' }];
  if (path === '/collections') return [{ label: 'Collections' }];
  if (path === '/settings') return [{ label: 'Settings' }];
  if (path === '/new-page') return [{ label: 'New Page' }];  // ✅ Add breadcrumb
  return [{ label: 'Home' }];
};
```

---

## 🎨 Navigation Patterns

### Programmatic Navigation

```tsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/collections');
  };

  return <button onClick={handleClick}>Go to Collections</button>;
}
```

### Link Navigation

```tsx
import { Link } from 'react-router-dom';

function MyComponent() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/collections">Collections</Link>
      <Link to="/settings">Settings</Link>
    </nav>
  );
}
```

### Active Route Detection

```tsx
import { useLocation } from 'react-router-dom';

function MyComponent() {
  const location = useLocation();
  const isActive = location.pathname === '/collections';

  return (
    <div className={isActive ? 'active' : ''}>
      Collections
    </div>
  );
}
```

---

## 🔄 Lazy Loading

Todas as páginas são lazy-loaded para otimização:

```tsx
// ✅ Código é carregado apenas quando a rota é acessada
const HomePage = lazy(() => import('../pages/HomePage'));

// Durante carregamento, Suspense mostra fallback:
<Suspense fallback={<LoadingWrapper><Spinner /></LoadingWrapper>}>
  <Routes />
</Suspense>
```

**Benefícios:**
- Bundle inicial menor
- Carregamento mais rápido
- Melhor performance

---

## 🧪 Testing Navigation

### Manual Testing Checklist

- [ ] Navegar de Home → Collections → Settings
- [ ] Usar botão voltar do browser
- [ ] Usar botão avançar do browser
- [ ] Acessar URL diretamente (ex: `/collections`)
- [ ] Verificar breadcrumb atualiza corretamente
- [ ] Verificar active state no sidebar
- [ ] Verificar lazy loading (Network tab)
- [ ] Verificar 404 route (redireciona para Home)

### Browser DevTools

**Network Tab:**
- Verificar code splitting (chunks separados)
- Cada página deve carregar arquivo JS separado

**Redux DevTools:**
- `ui/setActiveNavItem` deve disparar ao navegar
- State deve persistir entre navegações

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"
**Causa:** Import path incorreto
**Fix:** Verificar caminho relativo correto

```tsx
// ❌ Errado
import { HomePage } from './HomePage';

// ✅ Correto
const HomePage = lazy(() => import('../pages/HomePage'));
```

### Página não renderiza
**Causa:** Rota não configurada
**Fix:** Adicionar em `routes.tsx`

### Sidebar não marca active
**Causa:** `activeNavItem` não sincronizado
**Fix:** Chamar `handleNavigation()` ao clicar

### Breadcrumb não atualiza
**Causa:** `getBreadcrumb()` não tem path
**Fix:** Adicionar case para novo path

---

## 📚 References

- [React Router v6 Docs](https://reactrouter.com/en/main)
- [Code Splitting](https://reactjs.org/docs/code-splitting.html)
- [Suspense](https://reactjs.org/docs/react-api.html#reactsuspense)

---

## ✅ Completion Status

Sprint 1.8 - React Router Setup: **100% Complete**

**Implemented:**
- ✅ React Router v6 installed
- ✅ 3 pages created (Home, Collections, Settings)
- ✅ Router configuration with lazy loading
- ✅ AppLayout wrapper with Sidebar + Header
- ✅ Navigation integration with Redux
- ✅ Breadcrumb generation
- ✅ Suspense loading states
- ✅ TypeScript strict mode (zero errors)

**Ready for Sprint 2!** 🚀
