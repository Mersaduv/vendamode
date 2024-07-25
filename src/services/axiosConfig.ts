import axios, { AxiosInstance } from 'axios'

// const baseURL = 'https://apivendamode.liara.run'
const baseURL = 'http://localhost:5244'

const instance: AxiosInstance = axios.create({
  baseURL
})

export default instance
