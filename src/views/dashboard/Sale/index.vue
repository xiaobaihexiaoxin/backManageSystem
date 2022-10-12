<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 头部左侧内容 -->
        <el-tabs v-model="activeName" class="tab">
          <el-tab-pane label="销售额" name="sale" />
          <el-tab-pane label="访问量" name="visitorVolume" />
        </el-tabs>
        <!-- 头部右侧内容 -->
        <div class="right">
          <span @click="getNowDay">今日</span>
          <span @click="getNowWeek">本周</span>
          <span @click="getNowMonth">本月</span>
          <span @click="getNowYear">本年</span>
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            size="mini"
            style="width:240px"
            value-format="yyyy-MM-dd"
          />
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="18">
            <!-- 图表 -->
            <div ref="saleChart" class="charts" />
          </el-col>
          <el-col :span="6">
            <!-- 排行榜 -->
            <ul>
              <li>门店{{ title }}排名</li>
              <li v-for="trade,index in rankType" :key="index"> <div>{{ trade.no }}</div> <span>{{ trade.name }}</span> <span>{{ trade.money }}</span> </li>
            </ul>
          </el-col>
        </el-row>
      </div>

    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      activeName: 'sale',
      // 排行榜数据类型
      rankType: '',
      // 日期选择参数---快捷项
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      // 日期选择参数---日期数组
      dateValue: []
    }
  },
  computed: {
    // 排行榜前三添加top-three类名
    isTopThree() {
      return true
    },
    // 计算第二个Card图表名
    title() {
      return this.activeName === 'sale' ? '销售额' : '访问量'
    },
    ...mapGetters('dashboard', ['orderFullYearAxis', 'orderFullYear', 'userFullYearAxis', 'userFullYear', 'orderRank', 'userRank'])
  },
  watch: {
    // 当图表标题发生变化时,重新渲染
    title() {
      if (this.activeName === 'sale') {
        this.getChart(this.orderFullYearAxis, this.orderFullYear)
        this.rankType = this.orderRank
      } else {
        this.getChart(this.userFullYearAxis, this.userFullYear)
        this.rankType = this.userRank
      }
    },
    // 任意图表数据改变，说明已获得图表数据，
    orderFullYearAxis() {
    // 调用方法生成表格
      this.getChart(this.orderFullYearAxis, this.orderFullYear)
      // 设置排行榜数据
      this.rankType = this.orderRank
    }
  },
  mounted() {
  },
  methods: {
    // sale 图表
    getChart(xAxis, data) {
      const SaleChart = echarts.init(this.$refs.saleChart)
      SaleChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        title: {
          text: this.title + '趋势',
          textStyle: {
            fontSize: 16
          },
          left: '-5px'
        },
        grid: {
          left: 10,
          right: '4%',
          bottom: '3%',
          top: 50,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            // 接收的横轴参数
            data: xAxis,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            // 接收的纵轴参数
            data: data,
            color: 'skyBlue',
            barWidth: 30
          }
        ]
      })
    },
    getNowDay() {
      // 清空达特Value数组
      // this.dateValue = []
      const date = new Date()
      // console.log(date, '今日日期')
      // 设置开始结束日期
      this.dateValue = [date, date]
    },
    getNowWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.dateValue = [start, end]
    },
    getNowMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      // console.log(start, end, '本月')
      this.dateValue = [start, end]
    },
    getNowYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      // console.log(start, end, '本月')
      this.dateValue = [start, end]
    }
  }
}
</script>

<style>
  /* card样式 */
 .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }

  /*
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  */

  .clearfix:after {
    clear: both;
  }

  .box-card {
    margin-top:20px;
    width: 100%;
  }
  /* tab样式 */
  .el-tabs__item{
    font-size: 20px;
  }

   .clearfix{
    display: flex;
    justify-content: space-between;
    position: relative;
  }
  .tab{
    width:100%
  }
  .right{
    position: absolute;
    right:10px;
  }
  .right span{
    font-size: 14px;
    margin-right: 20px;
  }
  /* charts表格样式 */
  .charts{
    width:100%;
    height: 400px;
    /* background:orange; */
  }
  /* 排行榜样式 */
  ul>li{
    list-style:none;
    margin:22px 0;
    position: relative;
  }
  ul>li>div{
    width:20px;
    height:20px;
    border-radius:50%;
    display:inline-block;
    background: #d9d9d9;
    text-align:center;
    line-height:20px;
    margin-right:20px;
  }
  li>span:nth-of-type(2) {
    position: absolute;
    right: 14px;
  }
  ul>li:nth-of-type(2)>div,ul>li:nth-of-type(3)>div,ul>li:nth-of-type(4)>div{
    background:black;
    color:white;
  }

</style>
