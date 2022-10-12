<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <CardDetail>
            <template v-slot:header>
              总销售额
            </template>
            <template v-slot:main>
              ￥ {{ dashboardData.salesTotal }}
            </template>
            <template v-slot:charts>
              <span style="margin-right:10px;">周同比</span>{{ dashboardData.salesGrowthLastMonth }}
              <i v-if="isGrowthMonth === 'up'" class="el-icon-caret-top" style="color:red;" />
              <i v-else class="el-icon-caret-bottom" style="color:green;" />
              <span style="margin:0 10px;">日同比</span> {{ dashboardData.salesGrowthLastDay }}
              <i v-if="isGrowthDay ==='up'" class="el-icon-caret-top" style="color:red;" />
              <i v-else class="el-icon-caret-bottom" style="color:green;" />

            </template>
            <template v-slot:footer>
              <hr style="background:gray;">
              日销售额￥ {{ dashboardData.salesToday }}
            </template>
          </CardDetail>
        </el-card></el-col>
      <el-col :span="6">
        <el-card>
          <CardDetail>
            <template v-slot:header>
              访问量
            </template>
            <template v-slot:main>
              {{ dashboardData.visitTotal }}
            </template>
            <template v-slot:charts>
              <LineChart />
            </template>
            <template v-slot:footer>
              <hr style="background:gray;">
              日访问量 {{ dashboardData.visitToday }}
            </template>
          </CardDetail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <CardDetail>
            <template v-slot:header>
              支付笔数
            </template>
            <template v-slot:main>
              {{ dashboardData.payTotal }}
            </template>
            <template v-slot:charts>
              <BarChart />
            </template>
            <template v-slot:footer>
              <hr style="background:gray;">
              转化率 {{ dashboardData.payRate }}
            </template>
          </CardDetail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <CardDetail>
            <template v-slot:header>
              运营活动效果
            </template>
            <template v-slot:main>
              {{ dashboardData.activityRate }}
            </template>
            <template v-slot:charts>
              <ProcessChart :rate="dashboardData.activityRate" />
            </template>
            <template v-slot:footer>
              <hr style="background:gray;">
              <span style="margin-right:10px;">周同比</span>  {{ dashboardData.activityGrowthLastMonth }}
              <i v-if="isActGrowthMonth === 'up'" class="el-icon-caret-top" style="color:red;" />
              <i v-else class="el-icon-caret-bottom" style="color:green;" />

              <span style="margin:0 10px;">日同比</span>{{ dashboardData.activityGrowthLastDay }}
              <i v-if="isActGrowthDay === 'up'" class="el-icon-caret-top" style="color:red;" />
              <i v-else class="el-icon-caret-bottom" style="color:green;" />

            </template>
          </CardDetail>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>
<script>
import CardDetail from './Detail/index.vue'
import LineChart from './LineChart/index.vue'
import BarChart from './BarChart/index.vue'
import ProcessChart from './ProcessChart/index.vue'
import { mapState } from 'vuex'

export default {
  name: 'Card',
  components: {
    CardDetail,
    LineChart,
    BarChart,
    ProcessChart
  },
  computed: {
    ...mapState('dashboard', ['dashboardData']),
    // 周同比，日同比图标展示
    isGrowthDay() {
      return this.dashboardData.salesGrowthLastDay > 0 ? 'up' : 'down'
    },
    isGrowthMonth() {
      return this.dashboardData.salesGrowthLastMonth > 0 ? 'up' : 'down'
    },
    isActGrowthDay() {
      return this.dashboardData.activityGrowthLastDay > 0 ? 'up' : 'down'
    },
    isActGrowthMonth() {
      return this.dashboardData.activityGrowthLastMonth > 0 ? 'up' : 'down'
    }
  }
}
</script>

<style>
</style>
