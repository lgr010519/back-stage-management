import Vue from 'vue'

import 'normalize.css/normalize.css' // css初始化文件

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // 全局css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // 权限控制
if (process.env.NODE_ENV === 'production') {
    const {
        mockXHR
    } = require('../mock')
    mockXHR()
}

Vue.use(ElementUI)

Vue.config.productionTip = false

// 引入相关API请求接口
import API from '@/api'
Vue.prototype.$API = API

import CategorySelect from '@/components/CategorySelect'
Vue.component(CategorySelect.name, CategorySelect)

import HintButton from '@/components/HintButton'
Vue.component(HintButton.name, HintButton)

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})