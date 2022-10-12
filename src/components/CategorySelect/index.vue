<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select v-model="cForm.category1Id" placeholder="请选择" :disabled="!isShowTable" @change="handlerOne">
          <el-option v-for="c1 in category1" :key="c1.id" :label="c1.name" :value="c1.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类" value="">
        <el-select v-model="cForm.category2Id" placeholder="请选择" :disabled="cForm.category1Id==0 || !isShowTable" @change="handlerTwo">
          <el-option v-for="c2 in category2" :key="c2.id" :label="c2.name" :value="c2.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类" value="">
        <el-select v-model="cForm.category3Id" placeholder="请选择" :disabled="cForm.category2Id==0 || !isShowTable" @change="handlerThree">
          <el-option v-for="c3 in category3" :key="c3.id" :label="c3.name" :value="c3.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: {
    isShowTable: {
      type: Boolean,
      dafault: true
    }
  },
  data() {
    return {
      // 一级分类的数据
      category1: [],
      category2: [],
      category3: [],
      // 表单收集到的数据
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  mounted() {
    this.getCategory1()
  },
  methods: {
    // 获得一级分类的数据
    async getCategory1() {
      const result = await this.$API.attr.reqGetCategory1()
      // console.log(result, '获取一级分类')
      if (result.code === 200) {
        this.category1 = result.data
      }
    },
    // 有了一级分类，在发送获取二级分类的请求
    async handlerOne() {
      // 当一级分类选中的值发生变化时，清空二三级分类数据
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      this.category2 = []
      this.category3 = []
      // 给父组件发送一级Id
      this.$emit('getCategory', { categoryId: this.cForm.category1Id, level: 1 })
      const result = await this.$API.attr.reqGetCategory2(this.cForm.category1Id)
      // console.log(result, '获取二级分类')
      if (result.code === 200) {
        this.category2 = result.data
      }
    },
    // 有了一二级分类，在发送获取三级分类的请求
    async handlerTwo() {
      // 当二级分类变化时，清空三级分类
      this.cForm.category3Id = ''
      this.category3 = []
      // 给父组件发送二级Id
      this.$emit('getCategory', { categoryId: this.cForm.category2Id, level: 2 })
      const result = await this.$API.attr.reqGetCategory3(this.cForm.category2Id)
      // console.log(result, '获取三级分类')
      if (result.code === 200) {
        this.category3 = result.data
      }
    },
    // 获得三级分类请求的回调
    handlerThree() {
      // 给父组件发送一级Id
      this.$emit('getCategory', { categoryId: this.cForm.category3Id, level: 3 })
    }
  }

}
</script>

<style>

</style>
