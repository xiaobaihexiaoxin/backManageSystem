import request from '@/utils/request.js'
// 获取一级分类
export const reqGetCategory1 = () => {
  return request({
    method: 'get',
    url: `/admin/product/getCategory1`
  })
}
// 获取二级分类
export const reqGetCategory2 = (category1Id) => request({ method: 'get', url: `/admin/product/getCategory2/${category1Id}` })
// 获取三级分类
export const reqGetCategory3 = (category2Id) => request({ method: 'get', url: `/admin/product/getCategory3/${category2Id}` })

// 获取商品基础属性
export const reqGetGoodAttr = (category1Id, category2Id, category3Id) => {
  return request({
    method: 'get',
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
  })
}
// 添加属性
export const reqAddGoodAttr = (data) => {
  return request({
    method: 'post',
    url: `/admin/product/saveAttrInfo`,
    data
  })
}

// 删除属性
export const reqDeleteGoodAttr = (attrId) => {
  return request({
    method: 'delete',
    url: `/admin/product/deleteAttr/${attrId}`
  })
}
