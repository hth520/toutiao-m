// 请求模块

import axios from 'axios'
import store from '@/store'

const request = axios.create({
  // baseURL: 'http://ttapi.research.itcast.cn/' // 接口的基准路径
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 请求发起经过这里
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // 如果请求出错了 (还没发出去) 会经过这里
  return Promise.reject(error)
})

export default request
