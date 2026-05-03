# SchoolManager — Frontend

Frontend do **SchoolManager**, sistema de gestão escolar B2B (SaaS) com foco em produtividade administrativa e acadêmica. Esta aplicação consome os 6 microsserviços da plataforma (autenticação, alunos, professores, turmas, avaliações e avisos).

## Sobre o projeto

O SchoolManager é um sistema voltado para escolas, onde toda pessoa autenticada é um professor — administradores são professores com permissão elevada (`role: ADMIN`), e professores comuns têm `role: TEACHER`. Não há cadastro público: o primeiro administrador é provisionado via seed do backend, e os demais professores são criados pela área administrativa.

Funcionalidades planejadas (em construção):

- **Dashboard** — visão geral do dia
- **Alunos** — cadastro, responsáveis, matrículas
- **Professores** — gestão de professores e suas permissões
- **Turmas** — turmas, disciplinas e alocação de professores
- **Avaliações** — provas, lançamento de notas e médias finais
- **Avisos** — comunicados com visibilidade restrita e rastreio de leitura
- **Perfil** — dados do professor logado e troca de senha

## Stack

| Camada | Tecnologia |
|--------|------------|
| Build / Dev server | [Vite](https://vitejs.dev/) |
| Framework | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Meta-framework | [TanStack Start](https://tanstack.com/start) |
| Roteamento | [TanStack Router](https://tanstack.com/router) (file-based) |
| Data fetching / cache | [TanStack Query](https://tanstack.com/query) |
| Estilização | [Tailwind CSS 4](https://tailwindcss.com/) |
| Componentes UI | [shadcn/ui](https://ui.shadcn.com/) |
| Ícones | [lucide-react](https://lucide.dev/) |
| Lint / Format | ESLint + Prettier |
| Testes | [Vitest](https://vitest.dev/) + Testing Library |

## Como rodar

```bash
npm install
npm run dev
```

A aplicação sobe em [http://localhost:3000](http://localhost:3000).

### Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Sobe o dev server na porta 3000

## Estrutura de pastas

```
src/
├── routes/                  # Rotas (file-based, TanStack Router)
│   ├── __root.tsx           # Layout raiz
│   ├── index.tsx            # Rota "/"
│   ├── _auth.tsx            # Layout das rotas públicas
│   ├── _auth/
│   │   └── login/           # Tela de login
│   ├── _app.tsx             # Layout das rotas autenticadas
│   └── _app/
│       ├── -components/     # Sidebar, header (compartilhados)
│       ├── dashboard/
│       ├── alunos/
│       ├── professores/
│       ├── turmas/
│       ├── avaliacoes/
│       ├── avisos/
│       └── perfil/
├── components/ui/           # Componentes do shadcn/ui
├── lib/                     # Utilitários genéricos (cn, etc.)
├── utils/                   # Máscaras, formatadores
├── integrations/            # Providers (TanStack Query, etc.)
├── styles.css               # Tailwind + estilos globais
└── router.tsx               # Configuração do router
```

**Convenções:**

- Pastas prefixadas com `_` (ex: `_auth`, `_app`) são **layouts** e não aparecem na URL.
- Pastas prefixadas com `-` (ex: `-components`) são **ignoradas pelo router** — usadas para colocar componentes específicos da rota.
- Cada rota tem seu próprio `-components/` para componentes que só ela usa. Componentes reutilizáveis ficam em `src/components/`.

## Status

Em desenvolvimento inicial — estrutura de pastas e rotas básicas montadas, integrações com os microsserviços em andamento. Este README será atualizado conforme o projeto evolui.
