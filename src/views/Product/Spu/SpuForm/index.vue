<template>
  <div>
    <el-form ref="spuForm" label-width="80px" :model="spuData">
      <!-- SPU名称 -->
      <el-form-item label="SPU名称">
        <el-input v-model="spuData.spuName" placeholder="SPU名称" />
      </el-form-item>
      <!-- SPU归属的品牌 -->
      <el-form-item label="品牌" value="">
        <el-select v-model="spuData.tmId" placeholder="请选择品牌">
          <el-option v-for="tradeMark in tradeMarkList" :key="tradeMark.id" :label="tradeMark.tmName" :value="tradeMark.id" />
        </el-select>
      </el-form-item>
      <!-- SPU的描述 -->
      <el-form-item label="SPU描述">
        <el-input v-model="spuData.description" type="textarea" rows="5" />
      </el-form-item>
      <!-- 上传SPU图片 -->
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="图片显示失败">
        </el-dialog>
      </el-form-item>
      <!-- SPU属性 -->
      <el-form-item :inline="true" label="销售属性">
        <el-select v-model="spuAttrId" :placeholder="`还有${unSelectedAttrNum.length}未选择`">
          <el-option v-for="attr in unSelectedAttrNum" :key="attr.id" :label="attr.name" :value="attr.id" />
        </el-select>
        <el-button type="primary" icon="el-icon-plus" style="margin-left:20px;" :disabled="!spuAttrId" @click="addSaleAttr">添加销售属性</el-button>
      </el-form-item>
      <el-form-item>
        <!-- SPU属性表格 -->
        <el-table
          :data="spuData.spuSaleAttrList"
          border
          style="width: 100%;"
        >
          <el-table-column
            type="index"
            label="序号"
            width="100px"
          />
          <el-table-column
            prop="saleAttrName"
            label="属性名"
            width="100px"
          />
          <el-table-column
            prop="spuSaleAttrList"
            label="属性值名称列表"
            width=""
          >
            <template slot-scope="{row}">
              <el-tag
                v-for="tag in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
                @close="handleClose(row.spuSaleAttrValueList,tag)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                v-if="row.isShowInput"
                ref="saveTagInput"
                v-model="inputValue"
                size="small"
                class="input-new-tag"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              />
              <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">添加</el-button>
              {{ row.isShowInput }}
            </template>
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width=""
          >
            <template slot-scope="{row,$index}">
              <el-button type="danger" @click="deleteSaleAttr(row,$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="saveSpuInfo">保存SPU</el-button>
        <el-button @click="cancelAddSPU">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  props: {
    scene: {
      type: Number,
      default: 0
    },
    getSpuList: {
      type: Function,
      default: () => {
      }
    }
  },
  data() {
    return {
      // 上传图片参数
      dialogImageUrl: '',
      dialogVisible: false,
      // 所有品牌列表
      tradeMarkList: [],
      // SPU图片列表
      spuImageList: [],
      // SPu基础售卖属性列表
      spuAttrList: [],
      // 品牌id
      trademarkId: '',
      // spuAttrId
      spuAttrId: '',
      // 当前SPU信息
      spuData: {
        id: 0,
        tmId: 0,
        spuName: '',
        category3Id: '',
        description: '',
        spuImageList: [],
        spuSaleAttrList: []
      },
      // tag-input内容
      inputValue: ''
    }
  },
  computed: {
    // 筛选出spu没有的属性
    unSelectedAttrNum() {
      return this.spuAttrList.filter((item) => {
        return this.spuData.spuSaleAttrList.every((item1) => {
          return item.name !== item1.saleAttrName
        })
      })
    }

  },
  methods: {
    // 照片上传成功回调
    handleAvatarSuccess(res, file, fileList) {
      // console.log(res, file, fileList, '上传成功了')
      this.spuImageList = fileList
    },
    // 照片墙移除方法
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      this.spuImageList = fileList
    },
    // 照片墙预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // tag 相关方法
    // 删除所点击的tag
    handleClose(spuSaleAttrValueList, tag) {
      // console.log(spuSaleAttrValueList, tag)
      spuSaleAttrValueList.splice(spuSaleAttrValueList.indexOf(tag), 1)
    },
    // 显示tag属性值名称输入框
    showInput(row) {
      console.log(row, 'input-row')
      row.isShowInput = true
      // this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 确认添加tag
    handleInputConfirm(row) {
      // console.log(row, 'attrList')
      const attrValueObj = {
        baseSaleAttrId: row.baseSaleAttrId,
        isChecked: null,
        saleAttrName: row.saleAttrName,
        saleAttrValueName: '123213',
        spuId: this.spuData.id
      }
      attrValueObj.saleAttrValueName = this.inputValue
      if (this.inputValue) {
        row.spuSaleAttrValueList.push(attrValueObj)
      }
      row.isShowInput = false
      this.inputValue = ''
    },
    // 编辑时发送的请求
    initSpuDataEdit(row) {
      this.getAllTradeMark()
      this.getSpuBaseSaleAttrList()
      this.getSpuImageList(row)
      this.getSpuInfo(row)
    },
    // 添加时发送的请求
    initSpuDataAdd(category3Id) {
      // console.log(category3Id, '点击添加SPU按钮')
      // 添加对应的三级列表id
      this.spuData.category3Id = category3Id
      this.getAllTradeMark()
      this.getSpuBaseSaleAttrList()
    },
    // 1.获取品牌列表
    async getAllTradeMark() {
      const tradeMark = await this.$API.spu.reqAllTradeMark()
      // console.log(tradeMark.data, 'trademark')
      if (tradeMark.code === 200) {
        this.tradeMarkList = tradeMark.data
      }
    },
    // 2.获取基础属性列表
    async getSpuBaseSaleAttrList() {
      const spuAttr = await this.$API.spu.reqGetSpuBaseSaleAttrList()
      // console.log(spuAttr, 'spuAttr')
      if (spuAttr.code === 200) {
        this.spuAttrList = spuAttr.data
      }
    },
    // 3.根据id获取SPU图片列表
    async getSpuImageList(row) {
      const spuImage = await this.$API.spu.reqSpuImage(row.id)
      // console.log(spuImage, 'spuImage')
      if (spuImage.code === 200) {
        const listArr = spuImage.data
        listArr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = listArr
      }
    },
    // 4.根据id获取SPU信息
    async getSpuInfo(row) {
      const Info = await this.$API.spu.reqGetSpuInfo(row.id)
      // console.log(Info, 'SPU信息')
      if (Info.code === 200) {
        this.spuData = Info.data
        this.spuData.spuSaleAttrList.forEach((item) => {
          this.$set(item, 'isShowInput', false)
        })
      }
    },
    // 取消添加SPU时
    cancelAddSPU() {
      this.$emit('update:scene', 0)
      // 清空数据
      this.spuAttrList = []
      this.tradeMarkList = []
      this.spuImageList = []
      this.spuData = {
        id: 0,
        tmId: 0,
        spuName: '',
        category3Id: 0,
        description: '',
        spuImageList: [
          {
            id: 0,
            imgName: '',
            imgUrl: '',
            spuId: 0
          }
        ],
        spuSaleAttrList: [
          {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: '',
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: '',
                saleAttrName: '',
                saleAttrValueName: '',
                spuId: 0
              }
            ]
          }
        ]
      }
    },
    // 添加一个销售属性
    addSaleAttr() {
      // 根据spuAttrId 判断saleAttrName
      let name = ''
      if (this.spuAttrId === 1) {
        name = '颜色'
      } else {
        this.spuAttrId === 2 ? name = '版本' : name = '尺码'
      }
      // 设置销售属性对象
      const saleAttrObj = {
        baseSaleAttrId: this.spuAttrId,
        saleAttrName: name,
        spuId: this.spuData.id,
        spuSaleAttrValueList: [],
        isShowInput: false

      }
      this.spuData.spuSaleAttrList.push(saleAttrObj)
      // 清空spuAttrId值
      this.spuAttrId = ''
    },
    // 删除一个销售属性
    deleteSaleAttr(row, index) {
      console.log(row, index, '执行了删除属性函数')
      this.spuData.spuSaleAttrList.splice(index, 1)
    },
    // 保存SPU数据
    async saveSpuInfo() {
      // 添加对应的商品图片
      this.spuData.spuImageList = this.spuImageList.map((item) => {
        return {
          // 利用map方法将新增图片的name,和上传后返回的在服务器地址映射成imgName，imgUrl
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url
        }
      })
      const result = await this.$API.spu.reqSaveSpuInfo(this.spuData)
      // console.log(result, '保存后返回的结果')
      if (result.code === 200) {
        this.$message({ message: '保存SPU成功', type: 'success' })
        // 通知父组件切换状态，并清除数据
        this.cancelAddSPU()
        this.getSpuList()
      }
    }
  }
}
</script>

<style>
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin: 20px 0px;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
    .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
