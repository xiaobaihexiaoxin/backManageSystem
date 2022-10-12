import { reqGetDashboardChartData } from '@/api/dashboard.js'
import { cloneDeep } from 'lodash'
const state = {
  dashboardData: ''
}
const actions = {
  async getDashboardChartData(context) {
    const result = await reqGetDashboardChartData()
    if (result.code === 200) {
      // console.log(result.data, 'mock的图表数据')
      context.commit('REQGETDASHBOARDCHARTDATA', result.data)
    }
  }
}
const mutations = {
  REQGETDASHBOARDCHARTDATA(state, chartData) {
    state.dashboardData = cloneDeep(chartData)
  }
}
const getters = {
  // dashboard
  // 拜访趋势
  visitTrend(state) {
    return state.dashboardData.visitTrend || []
  },
  // 支付趋势
  payTrend(state) {
    return state.dashboardData.payTrend || []
  },
  // sale 订单销售X轴
  orderFullYearAxis(state) {
    return state.dashboardData.orderFullYearAxis || []
  },
  // sale 订单销售Y轴
  orderFullYear(state) {
    return state.dashboardData.orderFullYear || []
  },
  // sale 用户访问X轴
  userFullYearAxis(state) {
    return state.dashboardData.userFullYearAxis || []
  },
  // sale 用户访问Y轴
  userFullYear(state) {
    return state.dashboardData.userFullYear || []
  },
  // sale 排行榜
  orderRank(state) {
    return state.dashboardData.orderRank || []
  },
  // 门店排行
  userRank(state) {
    return state.dashboardData.userRank || []
  },
  // 搜索关键字
  searchWord(state) {
    return state.dashboardData.searchWord || []
  },
  // 渠道饼图数据
  saleRank(state) {
    return state.dashboardData.saleRank || []
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters

}
