<template>
  <div ref="pieChart" class="pie-chart" />
</template>

<script>
import * as echats from 'echarts'
import { mapGetters } from 'vuex'

export default {
  props: {
    checkRadio: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      cateList: []
    }
  },
  computed: {
    ...mapGetters('dashboard', ['saleRank'])
  },
  watch: {
    // 监视saleRank属性是否请求到
    saleRank() {
      this.cateList = this.saleRank
      this.cateList = this.fullWay(this.saleRank)
      this.getPieChart()
    },
    checkRadio(newValue) {
      if (newValue === '线上') {
        this.cateList = this.oneWay(this.saleRank.online)
        this.getPieChart()
      } else {
        newValue === '门店' ? this.cateList = this.oneWay(this.saleRank.shop) : this.cateList = this.fullWay(this.saleRank)
        this.getPieChart()
      }
    }
  },
  methods: {
    getPieChart() {
      const pieChart = echats.init(this.$refs.pieChart)
      pieChart.setOption({
        title: {
          text: '联盟广告',
          subtext: '1048',
          left: 'center',
          top: 'center',
          textStyle: {
            fontSize: 24

          }
        },
        series: [
          {
            name: '全部渠道',
            type: 'pie',
            radius: ['35%', '60%'],
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}:{c}',
              fontSize: 16
            },
            labelLine: {
              show: true
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold',
                formatter: '{b}:{c}'
              }
            },
            color: ['orange', 'yellowgreen', 'skyblue', 'pink', 'darkred'],
            // data: [
            //   { value: 1048, name: '联盟广告' },
            //   { value: 735, name: '视频广告' },
            //   { value: 580, name: '搜索引擎' },
            //   { value: 484, name: ' 邮件营销' },
            //   { value: 300, name: '直接访问' }
            // ]
            data: this.cateList
          }
        ]
      })
      // 添加事件
      pieChart.on('mouseover', (params) => {
        const { name, value } = params.data
        // 直接修改配置项，无需重新运行整个配置项
        pieChart.setOption({
          title: {
            text: name,
            subtext: value
          }

        })
      })
    },
    oneWay(list) {
      var endArr = []
      list.name.forEach((name, index) => {
        var obj = { name: '', value: '' }
        obj.name = name
        obj.value = list.value[index]
        endArr.push(obj)
      })
      // console.log(endArr, 'endArr')
      return endArr
    },
    fullWay(list) {
      var endArr = []
      list.online.name.forEach((name, index) => {
        var obj = { name: '', value: '' }
        const value = list.online.value[index] + list.shop.value[index]
        obj.name = name
        obj.value = value
        endArr.push(obj)
      })
      return endArr
    }
  }
}
</script>

<style>
  .pie-chart{
    width: 100%;
    height: 360px;
  }
</style>
