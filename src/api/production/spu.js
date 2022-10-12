import request from '@/utils/request'
// 请求SPU列表
export const reqGetSpuList = (page, limit, category3Id) => {
  return request({
    method: 'get',
    url: `/admin/product/${page}/${limit}`,
    params: { category3Id }
  })
}
// 请求SPU基础售卖属性列表
export const reqGetSpuBaseSaleAttrList = () => {
  return request({
    method: 'get',
    url: `/admin/product/baseSaleAttrList`
  })
}
// 根据spuId获取对应的SPU信息
export const reqGetSpuInfo = (spuId) => {
  return request({
    method: 'get',
    url: `/admin/product/getSpuById/${spuId}`
  })
}

// 获取所有的品牌
export const reqAllTradeMark = () => {
  return request({
    method: 'get',
    url: `/admin/product/baseTrademark/getTrademarkList`
  })
}

// 获取SPU的图片

export const reqSpuImage = (spuId) => {
  return request({
    method: 'get',
    url: `/admin/product/spuImageList/${spuId}`
  })
}

// 保存SPU信息
export const reqSaveSpuInfo = (spuInfo) => {
  if (spuInfo.id) {
    return request({
      method: 'post',
      url: `/admin/product/updateSpuInfo`,
      data: spuInfo
    })
  } else {
    return request({
      method: 'post',
      url: `/admin/product/saveSpuInfo`,
      data: spuInfo
    })
  }
}

// 删除SPU信息
export const reqDeleteSpu = (spuId) => {
  return request({
    method: 'delete',
    url: `/admin/product/deleteSpu/${spuId}`
  })
}
