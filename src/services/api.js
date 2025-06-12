import axios from 'axios'

const api = axios.create({
  baseURL: 'https://tfg-backend-xu86.onrender.com', // tu URL de Render
})

export default api
