# SchoolManager — Frontend

Frontend do **SchoolManager**, sistema de gestão escolar B2B (SaaS) com foco em produtividade administrativa e acadêmica. Esta aplicação consome os 6 microsserviços da plataforma através de um API Gateway centralizado.

## Sobre o projeto

O SchoolManager é voltado para escolas onde toda pessoa autenticada é um professor — administradores têm `role: ADMIN` e professores comuns têm `role: TEACHER`. Não há cadastro público: o primeiro administrador é provisionado via seed do backend, e os demais professores são criados pela área administrativa.

**Módulos do sistema:**

| Módulo | Descrição |
|---|---|
| Dashboard | Visão geral por papel (ADMIN / TEACHER) |
| Alunos | Cadastro, responsáveis e matrículas |
| Professores | Gestão de professores e habilitações |
| Turmas | Turmas, disciplinas e alocação de professores |
| Avaliações | Provas, lançamento de notas e médias finais |
| Avisos | Comunicados com visibilidade restrita e rastreio de leitura |
| Usuários | Gestão de contas de acesso (ADMIN) |
| Perfil | Dados do professor logado e troca de senha |

## Stack

| Camada | Tecnologia |
|---|---|
| Build / Dev server | [Vite](https://vitejs.dev/) |
| Framework | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Meta-framework | [TanStack Start](https://tanstack.com/start) (SSR) |
| Roteamento | [TanStack Router](https://tanstack.com/router) (file-based) |
| Data fetching / cache | [TanStack Query](https://tanstack.com/query) |
| Estilização | [Tailwind CSS 4](https://tailwindcss.com/) + `class-variance-authority` + `cn` |
| Componentes UI | Primitivos próprios sobre [Radix UI](https://www.radix-ui.com/) |
| HTTP | [axios](https://axios-http.com/) via factory `lib/api.ts` |
| Forms / validação | [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev/) |
| Tabelas / gráficos / planilhas | TanStack Table · [recharts](https://recharts.org/) · [xlsx](https://www.npmjs.com/package/xlsx) |
| Ícones / toasts / datas | [lucide-react](https://lucide.dev/) · [sonner](https://sonner.emilkowal.ski/) · [date-fns](https://date-fns.org/) |
| Lint / Format | ESLint (`@tanstack/eslint-config`) + Prettier |
| Testes | [Vitest](https://vitest.dev/) + Testing Library |

## Como rodar

```bash
npm install
npm run dev
```

Antes de rodar, configure as variáveis de ambiente (veja a seção abaixo).

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Sobe o dev server com proxy `/api` → API Gateway |
| `npm run build` | Build de produção (typecheck + SSR) |
| `npm run preview` | Pré-visualiza o build de produção |
| `npm test` | Roda os testes (Vitest) |
| `npm run lint` | ESLint |
| `npm run format` | Prettier `--write` + `eslint --fix` |
| `npm run check` | Prettier `--check` (sem alterar arquivos) |


## Estrutura de pastas

```
src/
├── routes/                    # Roteamento file-based (TanStack Router)
│   ├── __root.tsx             # Layout raiz (providers, Toaster)
│   ├── index.tsx              # "/" — redirect por role
│   ├── _auth.tsx              # Guard das rotas públicas (login)
│   ├── _auth/login/           # Tela de login
│   ├── admin.tsx              # Guard + layout da área ADMIN
│   ├── admin/                 # dashboard, alunos, professores, turmas,
│   │                          #   avaliacoes, avisos, usuarios, perfil
│   ├── teacher.tsx            # Guard + layout da área TEACHER
│   └── teacher/               # dashboard, turmas, avaliacoes, avisos, perfil
├── components/
│   ├── ui/                    # Primitivos (Button, Input, Alert) — cva + cn
│   ├── profile/               # Feature "perfil" em subcomponentes
│   ├── classes/               # Feature "turmas" compartilhada ADMIN/TEACHER
│   ├── tests/                 # Feature "avaliações" (testes e notas)
│   └── shared/                # Componentes reutilizáveis entre features
├── context/                   # AuthContext (sessão, token)
├── hooks/                     # useLogin, useTeachers, useNotices, useTests, ...
├── integrations/
│   ├── auth/authApi.ts        # login, logout
│   ├── users/usersApi.ts      # getMe, changePassword
│   ├── teachers/teachersApi.ts
│   ├── students/studentsApi.ts
│   ├── classes/classesApi.ts
│   ├── tests/testsApi.ts
│   ├── grades/gradesApi.ts
│   ├── finalAverages/finalAveragesApi.ts
│   ├── notices/noticesApi.ts
│   └── tanstack-query/        # Provider do TanStack Query
├── lib/                       # api.ts (factory axios + proxy) · utils.ts (cn)
├── types/                     # Contratos de dados/domínio
├── utils/                     # Helpers puros (máscaras)
├── styles.css                 # Tailwind + estilos globais
└── router.tsx                 # Configuração do router
```

**Convenções de roteamento:**
- Pastas prefixadas com `_` (ex: `_auth`) são layouts/guards e não aparecem na URL.
- Pastas prefixadas com `-` (ex: `-components`) são ignoradas pelo router — usadas para componentes específicos da rota.
- `routeTree.gen.ts` é **gerado automaticamente** pelo plugin do router — nunca edite à mão.

## Integração com o backend (API Gateway)

O frontend não chama cada microsserviço diretamente: todas as requisições passam por um **API Gateway** centralizado. O endereço do gateway é configurado exclusivamente no `.env` e no proxy do Vite — nunca em arquivos de código.

**Como o caminho é montado:**

1. `create('<service>')` em `lib/api.ts` → `baseURL = ${VITE_API_BASE}/<service>`
2. A função do domínio passa apenas a rota relativa (ex: `'/listNotices'`, `'/me'`)
3. O **proxy do Vite** intercepta `/api` e reescreve para `${API_PROXY_BASE}/api/<service>/<rota>`

Em dev, usamos chamada relativa + proxy para evitar CORS. Em produção, basta apontar `VITE_API_BASE` para a base completa do gateway — nenhum arquivo em `integrations/` precisa mudar.

> Para trocar o endereço do gateway, edite apenas `.env` e `vite.config.ts`. Os arquivos `integrations/<dominio>Api.ts` usam apenas `create('<service>')` + rota relativa.

## Status de implementação

### Área administrativa (ADMIN)

| Tela | Microsserviço | Status |
|---|---|---|
| Login / sessão | MS1 — AuthService | ✅ Completo |
| Perfil + troca de senha | MS1 — AuthService | ✅ Completo |
| Dashboard | — | ✅ Completo |
| Usuários | MS1 — AuthService | ✅ Completo |
| Professores | MS3 — TeacherService | ✅ Completo |
| Turmas | MS4 — ClassesService | ✅ Completo |
| Avaliações (testes e notas) | MS5 — TestService | ✅ Completo |
| Avisos | MS6 — NoticeService | ✅ Completo |
| Alunos | MS2 — StudentService | 🚧 Placeholder |

### Área do professor (TEACHER)

| Tela | Microsserviço | Status |
|---|---|---|
| Dashboard | MS3 / MS4 | ✅ Completo |
| Perfil + troca de senha | MS1 — AuthService | ✅ Completo |
| Turmas | MS4 — ClassesService | ✅ Completo |
| Avaliações | MS5 — TestService | ✅ Completo |
| Avisos | MS6 — NoticeService | 🚧 Placeholder |

### Pendente

- **Admin: Alunos** — integração com MS2 (StudentService): cadastro, responsáveis e matrículas.
- **Teacher: Avisos** — visão do professor: lista de avisos visíveis com status de leitura.
