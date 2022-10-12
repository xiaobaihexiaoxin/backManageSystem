<template>
  <div>
    <el-card>
      <el-table
        :data="skuInfoList"
        border
        style="width: 100%"
      >
        <el-table-column
          align="center"
          type="index"
          label="当前序号"
          width="50px"
        />
        <el-table-column
          prop="skuName"
          label="商品名称"
          width=""
        />
        <el-table-column
          prop="skuDesc"
          label="描述"
          width=""
        />
        <el-table-column
          align="center"
          label="默认图片"
          width="150px"
        >
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" style="height:100px;width:100px;">
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="80px"
          align="center"
        />
        <el-table-column
          prop="weight"
          label="重量"
          width="80px"
          align="center"
        />
        <el-table-column
          prop="prop"
          label="操作"
          width="350px"
          align="center"
        >
          <template slot-scope="{row}">
            <el-button v-show="!row.isSale" type="success" size="mini" icon="el-icon-circle-check" @click="upOrDownSku(row)" />
            <el-button v-show="row.isSale" type="info" size="mini" icon="el-icon-circle-close" @click="upOrDownSku(row)" />
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editSku(row)" />
            <el-button type="info" size="mini" icon="el-icon-info" @click="getSkuDetail(row)" />
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteSku(row)" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        style="margin-top:20px;text-align:center"
        :page-sizes="[3, 5, 7, 10]"
        :page-size="limit"
        :current-page="page"
        layout="prev, pager, next, jumper, ->, sizes, total "
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </el-card>
    <!-- sku详情的drawer组件 -->
    <el-drawer
      title="sku详情"
      size="50%"
      :visible.sync="drawer"
      :direction="direction"
      :with-header="false"
    >
      <el-form ref="form" label-width="80px" style="padding:50px">
        <el-form-item label="名称:">
          {{ skuDetail.skuName }}
        </el-form-item>
        <el-form-item label="描述:">
          {{ skuDetail.skuDesc }}
        </el-form-item>
        <el-form-item label="价格:">
          {{ skuDetail.price }}
        </el-form-item>
        <el-form-item label="平台属性:">
          <el-tag v-for="attr in skuDetail.skuAttrValueList" :key="attr.id" type="success" style="margin-left:20px;">{{ attr.attrId }}:{{ attr.valueId }}</el-tag>
        </el-form-item>
        <el-form-item label="商品图片:">
          <div class="block">
            <el-carousel trigger="click" height="300px" style="width:600px;" indicator-position="outside" type="card">
              <el-carousel-item v-for="item in skuDetail.skuImageList" :key="item.id">
                <img :src="item.imgUrl" style="height:300px;width:300px;">
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      // 分页器数据
      page: 1,
      limit: 10,
      total: 0,
      // 商品列表数据
      skuInfoList: [],
      // 当前商品详情
      skuDetail: {},
      // 控制drawer的显示隐藏
      drawer: false,
      direction: 'rtl'
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    // 获得sku数据
    async getSkuList() {
      const result = await this.$API.sku.reqGetSkuList(this.page, this.limit)
      // console.log(result, '商品列表')
      if (result.code === 200) {
        this.skuInfoList = result.data.records
        this.page = result.data.current
        this.limit = result.data.size
        this.total = result.data.total
      }
    },
    // 分页器回调函数
    // 更改当前页码时触发
    handleCurrentChange(afterPage) {
      // console.log(afterPage, '要跳转的页码')
      this.page = afterPage
      // 更新数据
      this.getSkuList()
    },
    // 更改每页显示数据数量
    handleSizeChange(pageSize) {
      this.limit = pageSize
      this.getSkuList()
    },

    // 删除当前sku
    async deleteSku(row) {
      // console.log(row, '删除sku')
      const result = await this.$API.sku.reqDeleteSku(row.id)
      // console.log(result, '删除结果')
      if (result.code === 200) {
        this.$message({ message: '删除当前sku成功', type: 'success' })
        // 重新获取列表数据
        this.getSkuList()
      }
    },
    // 编辑当前的sku
    editSku(row) {
      this.$message({ message: '正在开发', type: 'info' })
    },
    // 上架sku
    async upOrDownSku(row) {
      // 通过isSale判断切换
      row.isSale === 0 ? row.isSale = 1 : row.isSale = 0
      let saleFlag = ''
      row.isSale === 0 ? saleFlag = '下架' : saleFlag = '上架'
      const result = await this.$API.sku.reqGetSaleStatus(row.id, row.isSale)
      // console.log(result, '上架sku')
      if (result.code === 200) {
        this.$message({ message: `sku${saleFlag}成功`, type: 'success' })
      } else {
        this.$message({ message: `sku${saleFlag}失败`, type: 'error' })
      }
    },
    // 通过skuId获取当前sku详情
    async getSkuDetail(row) {
      const result = await this.$API.sku.reqGetSkuDetailBySkuId(row.id)
      // console.log(result, 'sku详情')
      if (result.code === 200) {
        this.skuDetail = result.data
        // 显示drawer
        this.drawer = true
      }
    }
  }
}
</script>

<style scoped>
  /* sku详情轮播图样式 */
 .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: orange!important;;
  }

  .el-carousel__item:nth-child(2n+1) {
     background-color: orange;
  }
  .el-carousel__indicators {
       /* 指示器 */
        left: unset;
        transform: unset;
        right: 2%;
  }
  >>>.el-carousel__button {
       /* 指示器按钮 */
        width: 14px;
        height: 14px;
        border: none;
        border-radius: 50%;
        background-color:rgba(0, 0, 0, 0.3) !important;
  }
  >>>.is-active .el-carousel__button {
       /* 指示器激活按钮 */
        background: orange !important;
  }
</style>
