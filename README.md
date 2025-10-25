# Flow Test App

Interface web moderna para o Flow Test Engine, baseada no design do Bruno API Client.

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilização utility-first
- **Rsbuild** - Build tool moderno e rápido
- **Styled Components** - CSS-in-JS para componentes complexos
- **Redux Toolkit** - Gerenciamento de estado (futuro)

## 📁 Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
│   ├── atoms/         # Componentes básicos (Button, Input, etc.)
│   ├── molecules/     # Componentes compostos
│   └── organisms/     # Componentes complexos
│       └── Sidebar/   # Sistema de sidebar VS Code-style
│           ├── MiniSidebar.tsx          # Barra lateral de ícones (60px)
│           ├── SidebarContentArea.tsx   # Área de conteúdo dinâmica
│           ├── CollectionsView.tsx      # View de coleções
│           ├── EnvironmentsView.tsx     # View de ambientes
│           ├── HistoryView.tsx          # View de histórico
│           └── SettingsView.tsx         # View de configurações
├── pages/            # Páginas da aplicação
├── providers/        # Context providers (Theme, etc)
├── hooks/            # Custom hooks
├── store/            # Redux store e slices
│   └── slices/       # Redux slices (sidebarSlice, etc.)
├── utils/            # Funções utilitárias
├── styles/           # Estilos globais
├── themes/           # Temas (light/dark)
└── types/            # Tipos TypeScript
```

## 🗂️ Arquitetura do Sidebar

O projeto implementa um sistema de sidebar inspirado no VS Code:

### Mini-Sidebar (60px)
- Barra lateral fixa com ícones de navegação
- Suporte a tooltips no hover
- Indicador visual da view ativa
- Ícones: Collections (VscFiles), Environments (MdOutlineSettingsApplications), History (VscHistory), Settings (VscSettings)

### Área de Conteúdo Dinâmica
- Largura ajustável (280px - 600px)
- Drag handle para resize
- Views lazy-loaded e com estado preservado
- Transições suaves entre views

### Gerenciamento de Estado
- Redux slice `sidebarSlice` para estado global
- Controle de `activeView`, `sidebarWidth`, collections, etc.
- Integração com tema dark/light

## 🎨 Design System

O projeto utiliza um design system inspirado no Bruno:

- **Cores**: Paleta semântica com suporte a dark mode
- **Tipografia**: Inter font family
- **Componentes**: Atoms, Molecules, Organisms (Atomic Design)

### Temas

- ☀️ **Light Mode**: Interface clara e clean
- 🌙 **Dark Mode**: Interface escura para trabalho noturno

## 🛠️ Scripts Disponíveis

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint

# Formatação
npm run prettier
```

## 🚦 Começando

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Abrir no navegador:**
   ```
   http://localhost:3000
   ```

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados em `dist/`.

## 🎯 Roadmap

- [ ] Sidebar com lista de suites
- [ ] Editor de requests HTTP
- [ ] Visualizador de respostas
- [ ] Gerenciador de ambientes
- [ ] Histórico de execuções
- [ ] Exportação de relatórios
- [ ] Integração com CLI do Flow Test

## 🤝 Contribuindo

Este projeto está em desenvolvimento ativo. Contribuições são bem-vindas!

## 📄 Licença

MIT
