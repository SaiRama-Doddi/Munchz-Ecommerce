import axios from 'axios'

const api = axios.create({
  baseURL:  "/product/api/",
  timeout: 10000
})

export default api
