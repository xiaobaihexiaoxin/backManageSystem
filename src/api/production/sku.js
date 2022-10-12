import request from '@/utils/request.js'
// 获取SPU售卖属性
export const reqGetSpuSaleAttrList = (spuId) => {
  return request({
    method: 'get',
    url: `/admin/product/spuSaleAttrList/${spuId}`
  })
}

// 获取平台属性
export const reqGetAttrInfoList = (category1Id, category2Id, category3Id) => {
  return request({
    method: 'get',
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
  })
}
// 保存添加一个SKU
export const reqSaveSku = (skuInfo) => {
  return request({
    method: 'post',
    url: `/admin/product/saveSkuInfo`,
    data: skuInfo
  })
}
// 获得sku列表
export const reqGetSkuList = (page, limit) => {
  return request({
    method: 'get',
    url: `/admin/product/list/${page}/${limit}`
  })
}

// 删除sku
export const reqDeleteSku = (skuId) => {
  return request({
    method: 'delete',
    url: `/admin/product/deleteSku/${skuId}`
  })
}

// 根据spuId查询商品
export const reqGetSkuBySpuId = (spuId) => {
  return request({
    method: 'get',
    url: `/admin/product/findBySpuId/${spuId}`
  })
}

// 上下架sku
export const reqGetSaleStatus = (skuId, isSale) => {
  if (isSale) {
    // 上架
    return request({
      method: 'get',
      url: `/admin/product/onSale/${skuId}`
    })
  } else {
    // 下架sku
    return request({
      method: 'get',
      url: `/admin/product/cancelSale/${skuId}`
    })
  }
}

// 通过skuId获得sku详情
export const reqGetSkuDetailBySkuId = (skuId) => {
  return request({
    method: 'get',
    url: `/admin/product/getSkuById/${skuId}`
  })
}
