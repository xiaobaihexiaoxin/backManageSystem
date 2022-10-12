import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 * 所有用户都可以访问
 */
export const constantRoutes = [
  // 登录路由
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  // 404路由
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 默认路由-->首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }
    ]
  }

]

// 异步路由，需要相关权限
export const asyncRoutes = [
  // 商品管理相关路由
  {
    name: 'Product',
    path: '/product',
    component: Layout,
    meta: { title: '商品管理', icon: 'el-icon-goods' },
    children: [
      {
        path: 'tradeMark',
        name: 'Trademark',
        component: () => import ('@/views/Product/tradeMark'),
        meta: { title: '品牌管理' }
      },
      {
        path: 'sku',
        name: 'Sku',
        component: () => import ('@/views/Product/Sku'),
        meta: { title: 'Sku管理' }
      },
      {
        path: 'attr',
        name: 'Attr',
        component: () => import ('@/views/Product/Attr'),
        meta: { title: '平台属性管理' }
      },
      {
        path: 'spu',
        name: 'Spu',
        component: () => import ('@/views/Product/Spu'),
        meta: { title: 'Spu管理' }
      }
    ]
  },
  // 店铺管理路由
  {
    name: 'Work',
    path: '/shop',
    component: Layout,
    meta: { title: '店铺管理', icon: 'el-icon-goods' },
    children: [
      {
        path: 'discount',
        name: 'Discount',
        component: () => import ('@/views/Shop/Discount'),
        meta: { title: '优惠管理' }
      },
      {
        path: 'order',
        name: 'OrderList',
        component: () => import ('@/views/Shop/Order'),
        meta: { title: 'Sku管理' }
      },
      {
        path: 'staff',
        name: 'ClientUser',
        component: () => import ('@/views/Shop/Staff'),
        meta: { title: '平台属性管理' }
      }
    ]
  },
  // 权限管理相关路由
  {
    path: '/authority',
    name: 'Acl',
    component: Layout,
    redirect: '/authority/user/index',
    meta: { title: '权限管理', icon: 'el-icon-info' },
    children: [
      {
        path: '/user/index',
        name: 'User',
        component: () => import('@/views/Authority/User'),
        meta: { title: '用户管理', icon: 'el-icon-user' }
      },
      {
        path: 'character',
        name: 'Role',
        component: () => import('@/views/Authority/Character'),
        meta: { title: '角色管理', icon: 'el-icon-user' }
      },
      {
        name: 'RoleAuth',
        path: 'character/auth/:id', // :id
        component: () => import('@/views/Authority/Character/list.vue'),
        meta: {
          activeMenu: '/Authority/Character/index',
          title: '角色授权'
        },
        hidden: true
      },
      {
        path: 'menu',
        name: 'Permission',
        component: () => import('@/views/Authority/Menu'),
        meta: { title: '菜单管理', icon: 'el-icon-user' }
      }
    ]
  },
  {
    path: '/test',
    name: 'Test',
    component: Layout,
    redirect: '/test/test1',
    meta: { title: '测试管理', icon: 'el-icon-test' },
    children: [
      {
        path: 'test1',
        name: 'Test1',
        component: () => import('@/views/Test/Test1'),
        meta: { title: '测试管理1', icon: 'el-icon-user' }
      },
      {
        path: 'test2',
        name: 'Test2',
        component: () => import('@/views/Test/Test2'),
        meta: { title: '测试管理2', icon: 'el-icon-user' }
      }

    ]
  }
]

// 任意路由  404 page must be placed at the end !!!
export const anyRoutes = [{ path: '*', redirect: '/404', hidden: true }]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

router.beforeEach((to, form, next) => {
  // console.log(to, form)
  // console.log(store._modules.root.state.user.isTrueOfRoutes, '1')
  const partPath = to.fullPath.split('?')
  // console.log(partPath)
  if (['/login', '/', '/404', '/dashboard'].indexOf(partPath[0]) === -1) {
    if (!store._modules.root.state.user.isTrueOfRoutes) {
      store.dispatch('user/getInfo').then(result => {
        console.log(store._modules.root.state.user.isTrueOfRoutes, '2')
        // router.replace(to)
        next({
          ...to,
          replace: true
        })
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router
