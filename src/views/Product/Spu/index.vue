<template>
  <div>
    <el-card class="box-card">
      <CategorySelect :is-show-table="true" @getCategory="getCategory" />
    </el-card>
    <el-card class="box-card" style="margin-top:20px;">
      <div v-show="scene==0">
        <el-button type="primary" :disabled="isDisabled" @click="addSpu">添加SPU</el-button>
        <el-table
          border
          :data="spuList"
          style="width: 100%;margin-top:20px"
        >
          <el-table-column
            type="index"
            label="序号"
            width="100px"
            align="center"
          />
          <el-table-column
            prop="spuName"
            label="SPU名称"
            width="160px"
            align="center"
          />
          <el-table-column
            prop="description"
            label="SPU描述"
            align="center"
            width=""
          >
            <template slot-scope="{row}">
              <el-tag
                type="success"
                style="margin:0px 8px; "
              >{{ row.description }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="400px"
          >
            <template slot-scope="{row}">
              <HintButton type="success" icon="el-icon-plus" size="mini" title="添加Sku" @click="addSku(row)" />
              <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改SPU" @click="editSpu(row)" />
              <HintButton type="info" icon="el-icon-info" size="mini" title="查看SPU信息" @click="showInfo(row)" />
              <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除此SPU" @click="deleteSpu(row)" />
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
      </div>
      <SpuForm v-show="scene == 1" ref="spu" :scene.sync="scene" :get-spu-list="getSpuList" />
      <SkuForm v-show="scene == 2" ref="sku" :scene.sync="scene" :get-spu-list="getSpuList" />
      <!-- 展示SKU实例的dialog -->
      <el-dialog :title="`${currentSpu.spuName}的sku列表`" :visible.sync="dialogTableVisible" @close="closeDialog">
        <el-table v-loading="loading" :data="skuBySpuIdList">
          <el-table-column property="skuName" label="sku名称" width="" />
          <el-table-column property="price" label="价格" width="" />
          <el-table-column property="weight" label="重量" width="" />
          <el-table-column label="默认图片" width="">
            <template slot-scope="{row}">
              <img :src="row.skuDefaultImg" style="height:100px;width:100px;">
            </template></el-table-column>
        </el-table>
      </el-dialog>
    </el-card>

  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: 'Spu',
  components: { SpuForm, SkuForm },
  data() {
    return {
      // 下方卡片，显示状态
      isShowTable: true,
      // 分页器参数
      page: 1,
      limit: 7,
      total: 0,
      // 一二三级Id
      category1Id: 0,
      category2Id: 0,
      category3Id: 0,
      // SPU数据列表
      spuList: [],
      // SPU下的sku实例数据列表
      skuBySpuIdList: [],
      // scene 控制下方Card内容 0:展示SPU列表数据 1:添加|修改SPU 2: 添加Sku
      scene: 0,
      // 展示SPU的sku实例时的dialog的变量
      dialogTableVisible: false,
      loading: true,
      currentSpu: {}
    }
  },
  computed: {
    isDisabled() {
      return (this.category1Id === 0) || (this.category2Id === 0) || (this.category3Id === 0)
    }
  },
  methods: {
    // 自定义事件getCategory的回调函数
    getCategory(obj) {
      if (obj.level === 1) {
        this.category1Id = obj.categoryId
      } else if (obj.level === 2) {
        this.category2Id = obj.categoryId
      } else {
        this.category3Id = obj.categoryId
        // 获得三级分类的id即可发送获取SPU的请求
        this.getSpuList()
      }
    },
    // 获取SPU列表
    async getSpuList() {
      const result = await this.$API.spu.reqGetSpuList(this.page, this.limit, this.category3Id)
      // console.log(result, 'SPU列表result')
      if (result.code === 200) {
        this.spuList = result.data.records
        this.page = result.data.current
        this.total = result.data.total
      }
    },
    // 更改当前页码时触发
    handleCurrentChange(afterPage) {
      // console.log(afterPage, '要跳转的页码')
      this.page = afterPage
      // 更新数据
      this.getSpuList()
    },
    // 更改每页显示数据数量
    handleSizeChange(pageSize) {
      this.limit = pageSize
      this.getSpuList()
    },
    // 添加一个SPU
    addSpu() {
      this.scene = 1
      this.$refs.spu.initSpuDataAdd(this.category3Id)
    },
    // 修改一个SPU
    editSpu(row) {
      this.scene = 1
      this.$refs.spu.initSpuDataEdit(row)
    },
    // 添加一个Sku
    addSku(row) {
      this.scene = 2
      this.$refs.sku.receiveSpuName(this.category1Id, this.category2Id, row)
    },
    // 删除一个Spu
    async deleteSpu(row) {
      const result = await this.$API.spu.reqDeleteSpu(row.id)
      // console.log(result, 'delete-result')
      if (result.code === 200) {
        this.$message({ message: `删除了${row.spuName}`, type: 'success' })
        this.getSpuList()
      }
    },
    // 展示SPU的所用实例sku
    async showInfo(row) {
      this.currentSpu = row
      // 显示dialog
      this.dialogTableVisible = true
      // 请求数据
      const result = await this.$API.sku.reqGetSkuBySpuId(row.id)
      // console.log(result, '查询结果')
      if (result.code === 200) {
        this.skuBySpuIdList = result.data
        this.loading = false
      }
    },
    closeDialog() {
      this.loading = true
      this.currentSpu = {}
      this.skuBySpuIdList = []
    }
  }
}
</script>

<style>

</style>
