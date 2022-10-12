<template>
  <el-row :gutter="10">
    <el-col :span="12">
      <Search />
    </el-col>
    <el-col :span="12">
      <Category />
    </el-col>
  </el-row>
</template>

<script>
import Search from './Search/index.vue'
import Category from './Category/index.vue'
export default {
  components: {
    Search,
    Category
  }

}
</script>

<style scoped>
.el-col {
  margin:20px 0px;
}
</style>
