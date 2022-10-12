<template>
  <div ref="bar" class="chartBar" />
</template>

<script>
import * as echarts from 'echarts'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('dashboard', ['payTrend'])
  },
  watch: {
    'payTrend'() {
      // 监视到 visitTrend 被获取到 就渲染图表
      this.formCharts()
    }
  },
  methods: {
    formCharts() {
      const barChart = this.$refs.bar
      const myChart = echarts.init(barChart)
      myChart.setOption({
        xAxis: {
          show: false,
          type: 'category'
        },
        yAxis: {
          show: false
        },
        series: [{
          type: 'bar',
          data: this.payTrend,
          color: 'skyblue'
        }],
        grid: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        },
        tooltip: {
          // 提示框文字的颜色
          textStyle: {
            color: 'orange'
          }
        }
      })
    }
  }
}
</script>

<style>
.chartBar{
  height: 100%;
  width: 100%;
    margin: 0px;
  padding: 0;
}
</style>
