import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const proxy = env.API_PROXY_BASE
    ? (() => {
        const base = new URL(env.API_PROXY_BASE).pathname.replace(/\/$/, '')
        return {
          '/api': {
            target: new URL(env.API_PROXY_BASE).origin,
            changeOrigin: true,
            rewrite: (path: string) => {
              const match = path.match(/^\/api\/([^/]+)/)
              if (!match) return path
              return `${base}/${match[1]}${path}`
            },
          },
        }
      })()
    : undefined

  return {
    resolve: { tsconfigPaths: true },
    plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
    server: {
      port: 5173,
      ...(proxy ? { proxy } : {}),
    },
  }
})
