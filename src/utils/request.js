import axios from 'axios'
import {
    MessageBox,
    Message
} from 'element-ui'
import store from '@/store'
import {
    getToken
} from '@/utils/auth'

// 创建axios实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    timeout: 5000
})

// 请求拦截器：携带token字段
service.interceptors.request.use(
    config => {
        if (store.getters.token) {
            // 让每一个接口都带token => 保证安全性
            config.headers['token'] = getToken()
        }
        return config
    },
    error => {
        console.log(error)
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        const res = response.data

        // 服务器响应失败
        if (res.code !== 20000 && res.code != 200) {
            Message({
                message: res.message || 'Error',
                type: 'error',
                duration: 5 * 1000
            })

            // 50008: token不合法; 50012: 其他客户端已登录; 50014: token已过期;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                // 重新登录
                MessageBox.confirm('您已被注销，您可以取消以停留在此页面，或者重新登录', 'Confirm logout', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('user/resetToken').then(() => {
                        location.reload()
                    })
                })
            }
            return Promise.reject(new Error(res.message || 'Error'))
                // 服务器响应成功
        } else {
            return res
        }
    },
    error => {
        console.log('err' + error)
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service