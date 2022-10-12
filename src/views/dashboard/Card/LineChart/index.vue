<template>

  <div ref="line" class="chartLine" />

</template>

<script>
import * as echarts from 'echarts'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('dashboard', ['visitTrend'])
  },
  watch: {
    'visitTrend'() {
      // 监视到 visitTrend 被获取到 就渲染图表
      this.formCharts()
    }
  },
  methods: {
    formCharts() {
      const lineChart = this.$refs.line
      const myChart = echarts.init(lineChart)
      myChart.setOption({
        xAxis: {
          show: false,
          type: 'category'

        },
        yAxis: {
          show: false
        },
        series: [{
          type: 'line',
          data: this.visitTrend,
          // 拐点样式设置
          itemStyle: {
            opacity: 0
          },
          lineStyle: {
            color: 'purple'
            // 拐点处如何连接
          },
          // 填充颜色
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'purple' // 0% 处的颜色
              }, {
                offset: 1, color: 'white' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        }],
        grid: {
          top: 0,
          left: -30,
          right: -30,
          bottom: 0
        },
        tooltip: {
          // 提示框文字的颜色
          textStyle: {
            color: 'red'
          }
        }
      })
    }
  }
}
</script>

<style>
.chartLine{
  height: 100%;
  width: 100%;
  margin: 0px;
  padding: 0;
}
</style>
