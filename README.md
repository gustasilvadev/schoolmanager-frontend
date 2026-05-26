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

| Camada                         | Tecnologia                                                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Build / Dev server             | [Vite](https://vitejs.dev/)                                                                                       |
| Framework                      | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)                                    |
| Meta-framework                 | [TanStack Start](https://tanstack.com/start)                                                                      |
| Roteamento                     | [TanStack Router](https://tanstack.com/router) (file-based)                                                       |
| Data fetching / cache          | [TanStack Query](https://tanstack.com/query)                                                                      |
| Estilização                    | [Tailwind CSS 4](https://tailwindcss.com/) + `class-variance-authority` (cva) + `cn`                              |
| Componentes UI                 | Primitivos próprios sobre [Radix UI](https://www.radix-ui.com/)                                                   |
| HTTP                           | [axios](https://axios-http.com/) (via factory `lib/api.ts`, com proxy para o gateway)                             |
| Forms / validação              | [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev/)                                         |
| Tabelas / gráficos / planilhas | TanStack Table · [recharts](https://recharts.org/) · [xlsx](https://www.npmjs.com/package/xlsx)                   |
| Ícones / toasts / datas        | [lucide-react](https://lucide.dev/) · [sonner](https://sonner.emilkowal.ski/) · [date-fns](https://date-fns.org/) |
| Lint / Format                  | ESLint + Prettier                                                                                                 |
| Testes                         | [Vitest](https://vitest.dev/) + Testing Library                                                                   |

## Como rodar

```bash
npm install
npm run dev
```

A aplicação sobe em [http://localhost:9518](http://localhost:9518).

### Scripts disponíveis

| Comando           | Descrição                                                        |
| ----------------- | ---------------------------------------------------------------- |
| `npm run dev`     | Sobe o dev server na porta 9518 (com proxy `/api` → API Gateway) |
| `npm run build`   | Build de produção (typecheck + SSR)                              |
| `npm run preview` | Pré-visualiza o build de produção                                |
| `npm test`        | Roda os testes (Vitest)                                          |
| `npm run lint`    | ESLint                                                           |
| `npm run format`  | Prettier `--write` + `eslint --fix`                              |
| `npm run check`   | Prettier `--check` (sem alterar arquivos)                        |

### Variáveis de ambiente (`.env`)

| Variável         | Descrição                                                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_API_BASE`  | Base usada pelo axios. Em dev: `/api` (capturada pelo proxy). Em produção: URL completa do gateway, ex.: `http://academico3.rj.senac.br/20261prj5/schoolmanagement/apigateway/api`. |
| `API_PROXY_BASE` | Base do API Gateway (inclui `/apigateway`) usada **só** pelo proxy do Vite em dev.                                                                                                  |

## Estrutura de pastas

```
src/
├── routes/                  # Rotas (file-based, TanStack Router)
│   ├── __root.tsx           # Layout raiz (providers, Toaster)
│   ├── index.tsx            # Rota "/" (redirect por role)
│   ├── _auth.tsx            # Guard das rotas públicas (login)
│   ├── _auth/login/         # Tela de login
│   ├── admin.tsx            # Guard + layout da área ADMIN
│   ├── admin/               # dashboard, alunos, professores, turmas,
│   │                        #   avaliacoes, avisos, usuarios, perfil
│   ├── teacher.tsx          # Guard + layout da área TEACHER
│   └── teacher/             # dashboard, turmas, avaliacoes, avisos, perfil
├── components/
│   ├── ui/                  # Primitivos (Button, Input, Alert) — cva + cn
│   └── profile/             # Feature "perfil" quebrada em subcomponentes
├── context/                 # AuthContext (sessão, token)
├── hooks/                   # useLogin, useLogout, useAuth, useProfile, ...
├── integrations/
│   ├── auth/authApi.ts      # login, logout
│   ├── users/usersApi.ts    # getMe, changePassword
│   └── tanstack-query/      # provider do TanStack Query
├── lib/                     # api.ts (factory axios + proxy) · utils.ts (cn)
├── types/                   # Contratos de dados/domínio (@/types)
├── utils/                   # Helpers puros (máscaras)
├── styles.css               # Tailwind + estilos globais
└── router.tsx               # Configuração do router
```

**Convenções:**

- Pastas prefixadas com `_` (ex: `_auth`) são **layouts/guards** e não aparecem na URL.
- Pastas prefixadas com `-` (ex: `-components`) são **ignoradas pelo router** — usadas para colocar componentes específicos da rota.
- Cada rota tem seu próprio `-components/` para componentes que só ela usa. Componentes reutilizáveis ficam em `src/components/`.

## Integração com o backend (API Gateway)

O front **não** chama cada microsserviço direto: todas as requisições passam por um **API Gateway**.
O prefixo do gateway fica centralizado em **um único lugar** — `.env` + proxy do Vite — e nunca
é repetido nos arquivos de `integrations/`.

**URL final (mesma que funciona no Postman):**

```
http://academico3.rj.senac.br/20261prj5/schoolmanagement/apigateway/api/<service>/<rota>
# ex.: .../apigateway/api/users/me   ·   .../apigateway/api/auth/login
```

**Como o caminho é montado:**

1. `create('<service>')` (`lib/api.ts`) → `baseURL = ${VITE_API_BASE}/<service>` → `/api/<service>`.
2. A função do domínio passa só a rota relativa (`'/me'`, `'/login'`) → request `/api/<service>/<rota>`.
3. O **proxy do Vite** (`vite.config.ts`) intercepta `/api` e reescreve para
   `${API_PROXY_BASE}/api/<service>/<rota>` (com `API_PROXY_BASE` incluindo `/apigateway`).

Em dev usamos chamada **relativa + proxy** para evitar CORS entre `localhost:9518` e o gateway
(o Postman não sofre CORS, por isso lá a URL completa funciona direto). Em produção, basta
apontar `VITE_API_BASE` para a base completa do gateway — o código das integrações não muda.

> Para mudar o endereço do gateway, edite **apenas** `.env` e `vite.config.ts`. Os arquivos em
> `integrations/<dominio>Api.ts` continuam usando só `create('<service>')` + rota relativa.

## Status

Em desenvolvimento. A base de autenticação e o roteamento por papel estão prontos; as telas de
funcionalidade ainda são placeholders aguardando integração com os microsserviços.

**Pronto e integrado (MS1 — AuthService):**

- ✅ **Login / sessão** — `authApi.login`, `AuthContext`, persistência de token, interceptor de `401` (logout + redirect).
- ✅ **Perfil + troca de senha** — `usersApi.getMe` / `changePassword`, página de perfil componentizada (`components/profile/`).
- ✅ **Roteamento por papel** — guards e layouts de `ADMIN` e `TEACHER` (`admin.tsx`, `teacher.tsx`, `_auth.tsx`) com sidebar/header.
- ✅ **Infra de UI/HTTP** — primitivos (`Button`/`Input`/`Alert`), factory axios com proxy para o **API Gateway**, toasts (sonner).

**Andamento / pendente:**

- 🚧 **Telas scaffolded** (rota existe, sem UI/integração): dashboard, alunos, professores, turmas, avaliações, avisos, usuários.
- ❌ **Integrações MS2–MS6** (Student, Teacher, Classes, Test, Notice) ainda não implementadas — cada uma será um `integrations/<dominio>Api.ts` consumindo o gateway no padrão `api/<service>/<rota>`.

Este README será atualizado conforme o projeto evolui.
