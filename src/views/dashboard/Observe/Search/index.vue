<template>
  <el-card>
    <div slot="header">
      线上热门搜索
      <el-dropdown>
        <span class="el-dropdown-link">
          <i class="el-icon-more" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <hr style="height:1px;background:#d3d3d3;border:none;">
      <el-row :gutter="10">
        <el-col :span="12"> <LineChart /></el-col>
        <el-col :span="12"> <LineChart /></el-col>
      </el-row>
      <el-table
        :data="searchWordList"
        style="width: 100%;color:red;"
        border
      >
        <el-table-column
          label="排名"
          type="index"
          width="100px"
        />
        <el-table-column
          label="搜索关键字"
          prop="word"
          width="width"
        />
        <el-table-column
          label="用户数"
          prop="count"
          width="width"
        />
        <el-table-column
          label="周涨幅"
          prop="user"
          width="width"
        />
      </el-table>
      <el-pagination
        style="margin-top:20px;text-align:right"
        layout="prev, pager, next,sizes,total"
        :total="searchWord.length"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :page-sizes="[5, 7, 10]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>
</template>

<script>
import LineChart from './LineChart/index.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    LineChart
  },
  data() {
    return {
      // 当前页码
      currentPage: 1,
      // 每页数据条数
      pageSize: 5,
      // 总的数据列表
      fullSearchList: [],
      // 当前展示的数据列表
      searchWordList: []
    }
  },
  computed: {
    ...mapGetters('dashboard', ['searchWord']),
    startIndex() {
      return (this.currentPage - 1) * this.pageSize
    },
    endIndex() {
      return (this.currentPage * this.pageSize)
    }
  },
  watch: {
    searchWord(newValue) {
      this.fullSearchList = newValue
      // 获取到总的数据后，默认渲染出第一页数据
      this.handleCurrentChange()
    }
  },
  methods: {
    // 分页器函数
    handleSizeChange(val) {
      this.pageSize = val
      // 重新获取列表数据
      this.handleCurrentChange()
    },
    // currentPage或pageSize改变，重新获取数据
    handleCurrentChange() {
      this.searchWordList = this.fullSearchList.slice(this.startIndex, this.endIndex)
    }
  }

}
</script>

<style>
/* 下拉菜单样式 */
  .el-dropdown-link {
    cursor: pointer;
    color: black;
    font-weight: 700;
    font-size: 18px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }

  .el-card__header {
    position: relative;
  }
  /* 卡片头部右侧绝对定位 */
  .el-dropdown,.el-radio-group{
    position: absolute;
    top: 10px;
    right: 30px;
  }
  /* 表格头部样式 */
  .has-gutter .cell{
    color:gray;
    font-weight: 400;
    font-size: 12px;
  }
</style>
