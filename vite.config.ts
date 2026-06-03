import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // API Gateway: todas as chamadas /api/<service>/<rota> são encaminhadas para
  // <API_PROXY_BASE>/api/<service>/<rota>.
  // O gateway resolve o roteamento por <service>; o front não conhece os MS direto.
  const proxy = env.API_PROXY_BASE
    ? (() => {
        const gateway = new URL(env.API_PROXY_BASE)
        const base = gateway.pathname.replace(/\/$/, '')
        return {
          '/api': {
            target: gateway.origin,
            changeOrigin: true,
            rewrite: (path: string) => `${base}${path}`,
          },
        }
      })()
    : undefined

  return {
    base: '/20261prj5/schoolmanagement/',
    resolve: { tsconfigPaths: true },
    plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
    server: {
      port: 9518,
      host: true,
      ...(proxy ? { proxy } : {}),
    },
  }
})
