import axios from 'axios'
import { getStoredSession } from '../context/AuthContext'

export function createApi(service: string) {
  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE}/${service}`,
    headers: { 'Content-Type': 'application/json' },
  })

  instance.interceptors.request.use((config) => {
    const session = getStoredSession()
    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`
    }
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.error ?? error.message)
        : String(error)
      return Promise.reject(new Error(message))
    },
  )

  return instance
}
