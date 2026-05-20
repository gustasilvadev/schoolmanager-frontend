import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    resolve: { tsconfigPaths: true },
    plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
    server: {
      port: 9518,
      proxy: {
        '/api': {
          target: new URL(env.API_PROXY_BASE).origin,
          changeOrigin: true,
          // /api/{service}/{...rest} → /{base}/{service}/api/{...rest}
          rewrite: (path) => {
            const base = new URL(env.API_PROXY_BASE).pathname
            return path.replace(/^\/api\/([^/]+)(.*)/, `${base}/$1/api$2`)
          },
        },
      },
    },
  }
})
