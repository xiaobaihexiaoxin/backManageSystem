<template>
  <div>
    <div class="title">
      <span>线上搜索数</span>
      <i class="el-icon-info" />
    </div>
    <div class="content"> 12467   17.6% <i class="el-icon-caret-top" style="color:red" /></div>
    <div ref="searchChart" class="search-chart" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  mounted() {
    this.getSearchChart()
  },
  methods: {
    getSearchChart() {
      const dom1Chart = echarts.init(this.$refs.searchChart)
      dom1Chart.setOption({
        grid: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        },
        xAxis: {
          data: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12]
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        // 填充颜色
        series: [{
          type: 'line',
          data: [13, 25, 35, 18, 13, 13, 25, 35, 26, 13],
          color: 'orange',
          // 拐点样式设置
          itemStyle: {
            opacity: 0
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'orange' // 0% 处的颜色
              }, {
                offset: 1, color: 'white' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        }]
      })
    }
  }
}
</script>

<style>
  .title,.content{
    margin: 20px;
  }
  .title>span {
    color:gray;
    font-size:14px;
    margin-right:10px;
  }

 .search-chart{
   display: inline-block;
    width: 100%;
    height: 100px;
  }

</style>
