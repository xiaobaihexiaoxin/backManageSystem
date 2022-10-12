<template>
  <div ref="bar" class="chartBar" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  props: {
    rate: {
      default: 0,
      type: Number
    }
  },
  watch: {
    'rate'() {
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
          min: 0,
          max: 100
        },
        yAxis: {
          // 均分
          type: 'category',
          show: false
        },
        series: [{
          type: 'bar',
          data: [this.rate],
          showBackground: true,
          backgroundStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'white' // 0% 处的颜色
              }, {
                offset: 1, color: 'gray' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          },
          barWidth: '10',
          // 标签文本
          label: {
            show: true,
            formatter: '|',
            position: 'right',
            distance: 0,
            color: 'darkred',
            fontWeight: 700,
            fontSize: 20
          },
          color: 'orange'
        }],
        grid: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
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
