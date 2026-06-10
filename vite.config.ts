import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Configuração de Proxy dinâmica
  // Em desenvolvimento, o Vite intercepta as chamadas para a API e repassa para o servidor remoto
  const proxy = env.API_PROXY_BASE && env.VITE_API_BASE
    ? {
        [env.VITE_API_BASE]: {
          target: env.API_PROXY_BASE,
          changeOrigin: true,
        },
      }
    : undefined

  return {
    base: env.VITE_APP_BASE,
    resolve: { tsconfigPaths: true },
    plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
    server: {
      port: Number(env.PORT) || 9518,
      host: true,
      ...(proxy ? { proxy } : {}),
    },
  }
})
