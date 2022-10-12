<template>
  <div>
    <el-card class="box-card">
      <CategorySelect :is-show-table="isShowTable" @getCategory="getCategory" />
    </el-card>
    <el-card class="box-card" style="margin-top:20px;">
      <div v-show="isShowTable">
        <el-button type="primary" :disabled="isDisabled" @click="addAttr">添加属性</el-button>
        <el-table
          border
          style="width: 100%;margin-top:20px"
          height="500"
          :data="attrList"
        >
          <el-table-column
            type="index"
            label="序号"
            width="100px"
            align="center"
          />
          <el-table-column
            prop="attrName"
            label="属性"
            width="160px"
            align="center"
          />
          <el-table-column
            prop="attrValueList"
            label="属性值列表"
            align="center"
            width=""
          >
            <template slot-scope="attr">
              <el-tag
                v-for="attrValues in attr.row.attrValueList"
                :key="attrValues.id"
                type="success"
                style="margin:0px 8px; "
              >{{ attrValues.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="240px"
          >
            <template slot-scope="{row}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="editAttr(row)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttr(row)"> 删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <!-- 属性名收集 -->
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item label="属性名">
            <el-input v-model="attrObj.attrName" type="text" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <!-- 属性值收集 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="attrObj.attrName ==''" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="cancelAddAttrValue">取消</el-button>
        <el-table
          :data="attrObj.attrValueList"
          border
          style="width: 100%; margin:20px 0px;"
        >
          <el-table-column
            type="index"
            label="序号"
            width="width"
          />
          <el-table-column
            label="属性值名称"
            width="width"
          >
            <template slot-scope="{row}">
              <el-input
                v-if="row.flag"
                ref="attrValueNameInput"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                @blur="toLook(row)"
                @keydown.native.enter="toLook(row)"
              />
              <span v-else style="height:30px;padding:8px;display:block;" @click="tpEdit(row)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="width"
          >
            <template slot-scope="{row,$index}">
              <el-popconfirm
                confirm-button-text="确认删除"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                :title="`确定要删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                >删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="attrObj.attrName =='' || attrObj.attrValueList.length == 0 " @click="saveAddAttr">保存</el-button>
        <el-button @click="cancelAddAttr">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入loash深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      flag: true,
      // 一二三级分类id
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 属性列表
      attrList: [],
      // 是否展示属性表格
      isShowTable: true,
      // 添加的属性
      attrObj: {
        attrName: '',
        attrValueList: [
        ],
        categoryId: 0,
        categoryLevel: 3
      }
    }
  },
  computed: {
    isDisabled() {
      return (this.category1Id === '') || (this.category2Id === '') || (this.category3Id === '')
    }
  },
  methods: {
    // 自定义事件getCategory的回调函数
    getCategory(obj) {
      if (obj.level === 1) {
        this.category1Id = obj.categoryId
        // 清除二三级id
        this.category2Id = ''
        this.category3Id = ''
      } else if (obj.level === 2) {
        this.category2Id = obj.categoryId
        this.category3Id = ''
      } else {
        this.category3Id = obj.categoryId
        // 获得三级分类的id即可发送获取平台售卖属性的请求
        this.getGoodAttr()
      }
    },
    // 获取属性列表
    async getGoodAttr() {
      const result = await this.$API.attr.reqGetGoodAttr(this.category1Id, this.category2Id, this.category3Id)
      // console.log(result, '获得平台属性')
      if (result.code === 200) {
        this.attrList = result.data
      } else {
        Promise.reject(new Error('获取属性失败'))
      }
    },
    // 删除属性按钮回调
    async deleteAttr(row) {
      const result = await this.$API.attr.reqDeleteGoodAttr(row.id)
      console.log(result, 'result')
      if (result.code === 200) {
        this.getGoodAttr()
      } else {
        this.$message({ message: result.data, type: 'error' })
      }
    },
    // 添加属性按钮回调
    addAttr() {
      this.isShowTable = false
    },
    // 确认添加一个属性
    async saveAddAttr() {
      // console.log(this.attrObj, 'attrObj')
      this.attrObj.categoryId = this.category3Id
      // 处理参数，去除flag，和valueName为空的属性值名称
      this.attrObj.attrValueList = this.attrObj.attrValueList.filter((item) => {
        if (item.valueName !== '') {
          delete item.flag
          return item
        }
      })
      const result = await this.$API.attr.reqAddGoodAttr(this.attrObj)
      // console.log(result, '添加属性结果')
      if (result.code === 200) {
        // 添加完成后，清除数据
        this.attrObj = {
          attrName: '',
          attrValueList: [
          ],
          categoryId: 0,
          categoryLevel: 3
        }
        this.isShowTable = true
        this.getGoodAttr()
      }
    },
    // 取消添加属性
    cancelAddAttr() {
      this.isShowTable = true
      // 取消添加属性要将已保留的数据清除
      this.attrObj = {
        attrName: '',
        attrValueList: [
        ],
        categoryId: 0,
        categoryLevel: 3
      }
    },
    // 添加一个属性值
    addAttrValue() {
      const attrValue = {
        // 当编辑时，新增属性值时已有attrId，可直接获取
        attrId: this.attrObj.id,
        valueName: '',
        // 使用单独的flag切换查看，编辑模式
        flag: true
      }
      this.attrObj.attrValueList.push(attrValue)
      //  console.log(this.attrObj.attrValueList, 'attrValueList')
      this.$nextTick(() => {
        // dom更新时 获取焦点
        // console.log(this.$refs.attrValueNameInput, 'ref')
        this.$refs.attrValueNameInput.focus()
      })
    },
    // 取消添加一个属性值
    cancelAddAttrValue() {
      this.attrObj.attrValueList.shift()
    },
    // 删除某一个属性值
    deleteAttrValue(index) {
      // 要注意element UI的版本，不同版本的事件名不一样
      this.attrObj.attrValueList.splice(index, 1)
      // console.log(this.attrObj.attrValueList, '删除后的attrValueList')
    },
    // 编辑属性按钮的回调
    editAttr(row) {
      this.isShowTable = false
      // console.log(row, '要编辑的属性row')
      this.attrObj = cloneDeep(row)
      this.attrObj.attrValueList.forEach((item) => {
        this.$set(item, 'flag', false)
      })
    },
    // 切换为查看模式
    toLook(row) {
      // 去除属性值两端空格
      row.valueName = row.valueName.trim()
      // 判断属性值是否合法
      if (row.valueName === '') {
        this.$message({ message: '属性值名称不能为空', type: 'error' })
        return
      }
      const repet = this.attrObj.attrValueList.some((item) => {
        if (item !== row) {
          return item.valueName === row.valueName
        }
      })
      repet ? this.$message({ message: '属性值名称重复', type: 'error' }) : row.flag = false
    },
    // 切换为编辑模式
    tpEdit(row) {
      row.flag = true
      this.$nextTick(() => {
        // dom更新时 获取焦点
        console.log(this.$refs.attrValueNameInput, 'ref')
        this.$refs.attrValueNameInput.focus()
      })
    }
  }
}
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
  }
</style>
