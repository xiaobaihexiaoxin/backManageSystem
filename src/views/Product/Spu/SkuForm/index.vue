<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        {{ spuName }}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuData.skuName" type="text" placeholder="SKU名称" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuData.price" type="number" placeholder="价格(元)" />
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuData.weight" type="text" placeholder="重量(千克)" />
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuData.skuDesc" type="textarea" placeholder="规格描述" rows="5" />
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item v-for="attr in attrInfoList" :key="attr.id" :label="attr.attrName">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form-item v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id" :label="saleAttr.saleAttrName">
          <el-select v-model="saleAttr.saleAttrIdAndValueId" placeholder="请选择">
            <el-option
              v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
              :value="`${saleAttr.id}:${saleAttrValue.id}`"
            />
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          :data="spuImageList"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          >
          <el-table-column
            align="center"
            width="100px"
            type="selection"
          />
          <el-table-column
            label="图片"
            align="center"
          >
            <template slot-scope="{row}">
              <img
                :src="row.imgUrl"
                style="width: 100px; height: 100px"
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="imgName"
            label="名称"
          />
          <el-table-column
            align="center"
            prop="prop"
            label="操作"
          >
            <template slot-scope="{row, $index}">
              <el-button v-show="!row.isDefault" type="primary" @click="setDefault(row,$index)">设为默认</el-button>
              <el-button v-show="row.isDefault">默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSkuData">保存</el-button>
        <el-button @click="cancelAddSku">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  props: {
    scene: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      spuName: '',
      // 存储sku对应的数据
      spuImageList: [],
      // 售卖属性
      spuSaleAttrList: [],
      // 平台属性
      attrInfoList: [],
      // skuData 要提交的数据
      skuData: {
        // createTime: '2022-09-17T01:21:29.903Z',
        // id: 0,
        // isSale: 0,
        // 父组件传递的参数
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // v-model双向绑定的参数
        price: 0,
        weight: '',
        skuName: '',
        skuDefaultImg: '',
        skuDesc: '',
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: '',
          //   id: 0,
          //   skuId: 0, 后台添加
          //   valueId: 0,
          //   valueName: ''
          // }
        ],
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: '',
          //   imgUrl: '',
          //   isDefault: '',
          //   // skuId: 0,
          //   spuImgId: 0
          // }
        ],
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   // skuId: 0,
          //   spuId: 0
          //   saleAttrId: 0,
          //   saleAttrName: '',
          //   saleAttrValueId: 0,
          //   saleAttrValueName: '',
          // }
        ]
      },
      imageDataList: []
    }
  },
  methods: {
    // 获取SPU的名称，发送图片，售卖属性，平台属性请求
    receiveSpuName(category1Id, category2Id, row) {
      // console.log(row, '添加Sku')
      this.spuName = row.spuName
      this.skuData.category3Id = row.category3Id
      this.skuData.spuId = row.id
      this.skuData.tmId = row.tmId
      this.getSpuImageList(row)
      this.getSpusaleAttrList(row)
      this.getAttrInfoList(category1Id, category2Id, row)
    },
    // 获取SPU图片
    async getSpuImageList(row) {
      // 与spuForm使用同一个api
      const spuImageResult = await this.$API.spu.reqSpuImage(row.id)
      // console.log(spuImageResult, 'sku使用的图片')
      if (spuImageResult.code === 200) {
        this.spuImageList = spuImageResult.data
        this.spuImageList.forEach(item => {
          this.$set(item, 'isDefault', false)
        })
      }
    },
    // 获取售卖属性
    async getSpusaleAttrList(row) {
      const spuSaleAttrResult = await this.$API.sku.reqGetSpuSaleAttrList(row.id)
      // console.log(spuSaleAttrResult, 'sku使用的售卖属性')
      if (spuSaleAttrResult.code === 200) {
        this.spuSaleAttrList = spuSaleAttrResult.data
      }
    },
    // 获取平台属性
    async getAttrInfoList(category1Id, category2Id, row) {
      const AttrInfoList = await this.$API.sku.reqGetAttrInfoList(category1Id, category2Id, row.category3Id)
      // console.log(AttrInfoList)
      if (AttrInfoList.code === 200) {
        this.attrInfoList = AttrInfoList.data
      }
    },
    // 图片列表选择项变化时触发，
    handleSelectionChange(val) {
      // console.log(val, '选择项改变参数')
      this.imageDataList = val
    },
    // 将图片设为默认图片
    setDefault(row) {
      // console.log(row, '图片信息')
      // 排他
      this.spuImageList.forEach(item => {
        item.isDefault = false
      })
      // 图片isDefault设为默认
      row.isDefault = true
      // 保存默认图片路径
      this.skuData.skuDefaultImg = row.imgUrl
    },
    // 取消添加Sku按钮回调
    cancelAddSku() {
      // 清空数据
      this.spuImageList = []
      this.attrInfoList = []
      this.spuSaleAttrList = []
      this.imageDataList = []
      this.skuData = {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        price: 0,
        weight: '',
        skuName: '',
        skuDefaultImg: '',
        skuDesc: '',
        skuAttrValueList: [],
        skuImageList: [],
        skuSaleAttrValueList: []
      }
      // 切换card内容
      this.$emit('update:scene', 0)
    },
    async saveSkuData() {
      console.log('保存数据发送')
      // 整理数据
      // 1.图片数据
      this.skuData.skuImageList = this.imageDataList
      // 2.平台属性数据
      this.attrInfoList.forEach(item => {
        const [attrId, valueId] = item.attrIdAndValueId.split(':')
        // 插入skuData的平台属性列表
        this.skuData.skuAttrValueList.push({ attrId, valueId })
      })
      // 3.销售属性数据
      this.spuSaleAttrList.forEach(item => {
        const [saleAttrId, saleAttrValueId] = item.saleAttrIdAndValueId.split(':')
        this.skuData.skuSaleAttrValueList.push({ saleAttrId, saleAttrValueId })
      })
      const result = await this.$API.sku.reqSaveSku(this.skuData)
      // console.log(result, '保存sku数据')
      if (result.code === 200) {
        // 发出提示
        this.$message({ message: '添加SKU成功', type: 'success' })
        // 切换card内容，清空数据
        this.cancelAddSku()
      }
    }

  }
}
</script>

<style>

</style>
