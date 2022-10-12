// 引入二次封装的mockRequest
import mockRequest from '@/utils/mockRequest'

export const reqGetDashboardChartData = () => {
  return mockRequest({
    url: '/home/list',
    method: 'get'
  })
}
