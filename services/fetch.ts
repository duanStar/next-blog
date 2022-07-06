import axios from "axios";

const requestInstance = axios.create({
  baseURL: '/'
})

requestInstance.interceptors.request.use(config => config, err => Promise.reject(err))
requestInstance.interceptors.response.use(res => {
  if (res.status === 200) {
    return res.data
  } else {
    return {
      code: -1,
      msg: "error",
      data: null
    }
  }
}, err => Promise.reject(err))

export default requestInstance
