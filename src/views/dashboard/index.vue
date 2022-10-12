<template>
  <div class="dashboard-container">
    <Card />
    <Sale />
    <Observe />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Card from './Card/Card.vue'
import Sale from './Sale/index.vue'
import Observe from './Observe/index.vue'
export default {
  name: 'Dashboard',
  components: {
    Card,
    Sale,
    Observe
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    // 获取图表数据
    this.$store.dispatch('dashboard/getDashboardChartData')
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
