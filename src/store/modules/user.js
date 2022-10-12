import { login, logout, getInfo } from '@/api/user'
// token相关
import { getToken, setToken, removeToken } from '@/utils/auth'
// 重置路由
import { resetRouter, asyncRoutes, anyRoutes, constantRoutes } from '@/router'

import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    // 按钮权限标记
    buttons: [],
    // 角色权限标记
    roles: [],
    // 路由标记
    routes: [],
    // 异步路由和根据用户信息返回的路由标记对比后的---异步路由数组
    resultAsyncRoutes: [],
    resultAllRoutes: [],
    // 动态路由是否获得
    isTrueOfRoutes: false
  }
}

const state = getDefaultState()

const mutations = {
// 清空state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储用户信息
  SET_USERINFO: (state, userInfo) => {
    const { name, avatar, buttons, roles, routes } = userInfo
    state.name = name
    state.avatar = avatar
    state.buttons = buttons
    state.roles = roles
    state.routes = routes
  },
  // 最终计算出来的异步路由
  SET_RESULTASYNCROUTES(state, resultAsyncRoutes) {
    // 最终的异步路由
    state.resultAsyncRoutes = resultAsyncRoutes
    // 注意顺序，使得dishboard在路由最前面(除login/404/*等路由)，
    state.resultAllRoutes = [...constantRoutes, ...resultAsyncRoutes, ...anyRoutes]
    // state.resultAllRoutes = constantRoutes.concat(anyRoutes, resultAsyncRoutes)
    // 给路由器添加新路由
    router.addRoutes(state.resultAllRoutes)
    state.isTrueOfRoutes = true
    // console.log(router, 'router')
  }

}

// 动态路由对比函数
const computedAsyncRoutes = (asyncRoutes, routes) => {
  // 此时的routes是服务器返回的路由标记数组
  return asyncRoutes.filter(item => {
    if (routes.indexOf(item.name) !== -1) {
      if (item.children && item.children.length) {
        // 递归筛选子路由 假设routes 中存在Product的子路由nameSku,此时的Product子元素item的children 等于 第二次方法执行对子路由筛选出的Sku
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}

const actions = {
  // 用户登录 action
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    // console.log(username, password, '携带的数据')
    const result = await login({ username: username.trim(), password: password })
    // console.log(result, '登录结果')
    if (result.code === 20000) {
      commit('SET_TOKEN', result.data.token)

      setToken(result.data.token)
      return 'ok'
    } else {
      Promise.reject(new Error('登录失败'))
    }
  },

  // get user info
  getInfo({ commit, state }) {
    console.log('被调用了')
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        // 保存用户信息
        commit('SET_USERINFO', data)
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, response.data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

