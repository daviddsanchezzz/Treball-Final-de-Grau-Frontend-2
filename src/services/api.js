import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/', // ajusta según tu backend
})

export default api
