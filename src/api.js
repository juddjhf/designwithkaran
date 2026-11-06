import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dwk_admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getPublic = async (path, fallback = []) => {
  try {
    const { data } = await api.get(path)
    return data
  } catch {
    return fallback
  }
}

export default api
