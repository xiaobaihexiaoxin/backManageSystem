<template>
  <el-card>
    <div slot="header">
      销售类别占比
      <el-radio-group v-model="checkedRadio" size="mini">
        <el-radio-button label="全部渠道" />
        <el-radio-button label="线上" />
        <el-radio-button label="门店" />
      </el-radio-group>
      <hr style="height:1px;background:#d3d3d3;border:none;">
    </div>
    <PieChart :check-radio="checkedRadio" />
    <div />
  </el-card>
</template>

<script>
import PieChart from './Pie/index.vue'
export default {
  components: {
    PieChart
  },
  data() {
    return {
      // 按钮组参数
      checkedRadio: '全部渠道'
    }
  }
}
</script>

<style>

</style>
