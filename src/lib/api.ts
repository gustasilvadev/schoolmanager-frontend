import axios from 'axios'
import { clearSession } from '@/context/AuthContext'

export function create(service: string) {
  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE}/${service}`,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  })

  instance.interceptors.request.use((config) => {
    console.log(
      '[API] →',
      config.method?.toUpperCase(),
      (config.baseURL ?? '') + (config.url ?? ''),
    )
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error)) {
        console.log('[API] ✗ status:', error.response?.status ?? 'sem resposta')
        console.log('[API] ✗ body:', JSON.stringify(error.response?.data))
        console.log('[API] ✗ code:', error.code)

        if (error.response?.status === 401) {
          clearSession()
          window.location.href = `${import.meta.env.BASE_URL}login`
        }

        const message = error.response?.data?.error ?? error.message
        return Promise.reject(new Error(message))
      }

      return Promise.reject(new Error(String(error)))
    },
  )

  return instance
}