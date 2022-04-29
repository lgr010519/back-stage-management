import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import Layout from '@/layout'
export const constantRoutes = [{
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },

    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () =>
                import ('@/views/dashboard/index'),
            meta: {
                title: '首页',
                icon: 'dashboard'
            }
        }]
    },
    {
        path: '/product',
        component: Layout,
        name: 'Product',
        meta: {
            title: '商品管理',
            icon: 'el-icon-goods'
        },
        children: [{
                path: 'trademark',
                name: 'TradeMark',
                component: () =>
                    import ('@/views/product/tradeMark'),
                meta: {
                    title: '品牌管理'
                }
            },
            {
                path: 'attr',
                name: 'Attr',
                component: () =>
                    import ('@/views/product/Attr'),
                meta: {
                    title: '平台属性管理'
                }
            },
            {
                path: 'spu',
                name: 'Spu',
                component: () =>
                    import ('@/views/product/Spu'),
                meta: {
                    title: 'Spu管理'
                }
            },
            {
                path: 'sku',
                name: 'Sku',
                component: () =>
                    import ('@/views/product/Sku'),
                meta: {
                    title: 'Sku管理'
                }
            }
        ]
    },
    // 404页面必须放在最后
    {
        path: '*',
        redirect: '/404',
        hidden: true
    }
]

const createRouter = () => new Router({
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRoutes
})

const router = createRouter()
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // 重置路由
}

export default router