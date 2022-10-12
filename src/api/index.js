// 引入商品管理四个模块请求的的接口文件
import * as trademark from './production/trademark.js'
import * as attr from './production/attr.js'
import * as sku from './production/sku.js'
import * as spu from './production/spu.js'

// 引入权限管理相关接口
import * as user from './authority/user.js'
import * as character from './authority/character.js'
import * as menu from './authority/menu.js'
// 对外暴露
export default {
  // 商品
  trademark,
  attr,
  sku,
  spu,
  // 权限
  user,
  character,
  menu
}
