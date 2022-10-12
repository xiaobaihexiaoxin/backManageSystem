import request from '@/utils/request'
// 获取品牌列表
export const reqGetTradeMarkList = (page, limit) => {
  return request({
    method: 'get',
    url: `/admin/product/baseTrademark/${page}/${limit}`
  })
}

// 添加一个basetrademark
export const reqAddUpdateTradeMark = (data) => {
  if (!data.id) {
    return request({
      method: 'post',
      url: `/admin/product/baseTrademark/save`,
      data
    })
  } else {
    // 修改品牌
    return request({
      method: 'put',
      url: `/admin/product/baseTrademark/update`,
      data
    })
  }
}
// 删除一个品牌
export const reqDeleteTradeMark = (id) => {
  return request({
    method: 'delete',
    url: `/admin/product/baseTrademark/remove/${id}`
  })
}

