<template>
  <div>
    <el-form ref="form">
      <el-form-item>
        <el-input v-model="tempSearchObj.roleName" placeholder="角色名称" style="width:200px;margin-right:10px;" />
        <el-button type="primary" icon="el-icon-search" @click="searchRole"> 查询</el-button>
        <el-button @click="clearData">清空</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addRole">添加</el-button>
        <el-button type="danger" :disabled="currentRoleIds.length === 0">批量删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-table
          :data="characterInfo"
          style="width: 100%"
          border
          @selection-change="handlerCheckedChange"
        >
          <el-table-column
            type="selection"
            header-align="center"
            align="center"
            width="50px"
          />
          <el-table-column
            type="index"
            header-align="center"
            align="center"
            label="序号"
            width="100px"
          />
          <el-table-column
            header-align="center"
            align="center"
            label="角色名称"
          >
            <template slot-scope="{row}">
              <span v-if="!row.showEdit">{{ row.roleName }}</span>
              <div v-else>
                <el-input v-model="row.roleName" style="display:inline-block;width:80%;margin-right:10px;" @keyup.enter.native="updateRole(row)" />
                <el-button type="warning" size="mini" icon="el-icon-unlock" @click="cancelEditRole(row)">取消</el-button>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            header-align="center"
            align="center"
            prop="prop"
            label="操作"
          >
            <template slot-scope="{row}">
              <HintButton title="分配权限" size="mini" type="info" icon="el-icon-info" @click="test(row)">
              <!-- @click="$router.push(`/acl/role/auth/${row.id}?roleName=${row.roleName}`)" -->
              </HintButton>
              <HintButton v-if="!row.showEdit" title="修改角色" size="mini" type="primary" icon="el-icon-edit" @click="editRole(row)" />
              <HintButton v-else title="修改角色" size="mini" type="primary" icon="el-icon-check" @click="updateRole(row)" />
              <HintButton title="删除角色" size="mini" type="danger" icon="el-icon-delete" @click="deleteRole(row)" />
            </template>

          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-pagination
          layout="prev, pager, next,->,sizes,total"
          background
          :total="total"
          :page-sizes="[5,10,20]"
          :page-size="pageSize"
          :current-page="currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-form-item>
    </el-form>
    <!-- 添加角色的dialog -->
    <el-dialog
      title="添加角色"
      :visible.sync="dialogVisible_addRole"
      width="400px"
      top="15%"
      style="border-radius:10px;"
    >
      请输入新角色
      <el-input v-model="currentRole.roleName" />
      <div slot="footer">
        <el-button @click="cancelSaveRole">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 包含搜索关键字的对象
      searchObj: {
        roleName: ''
      },
      // 暂存收集关键字对象
      tempSearchObj: {
        roleName: ''
      },
      // 分页器参数
      pageSize: 5,
      total: 20,
      currentPage: 1,
      // 角色信息
      characterInfo: [
      ],
      // 当前编辑的角色
      currentRole: {},
      // 当前选中的角色Id
      currentRoleIds: [],
      // dialog参数
      dialogVisible_addRole: false
    }
  },
  mounted() {
    this.getCharacterPageList()
  },
  methods: {
    test(row) {
      console.log(row.id, row.roleName, 'query')
      this.$router.push(`/authority/character/auth/${row.id}?roleName=${row.roleName}`)
    },
    // 分页器回调函数
    handleSizeChange(val) {
      this.pageSize = val
      this.getCharacterPageList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getCharacterPageList(this.currentPage)
    },
    // 根据关键字收搜索角色
    searchRole() {
      this.searchObj = { ...this.tempSearchObj }
      this.getCharacterPageList()
    },
    // 获取角色信息
    async getCharacterPageList(page = 1) {
      this.currentPage = page
      const result = await this.$API.character.default.getPageList(this.currentPage, this.pageSize, this.searchObj)
      // console.log(result, '角色信息')
      this.characterInfo = result.data.items
      this.characterInfo.forEach(item => {
        this.$set(item, 'showEdit', false)
      })
      this.total = result.data.total
    },
    // 展示添加角色dialog
    addRole() {
      this.dialogVisible_addRole = true
    },
    // 取消保存新角色
    cancelSaveRole() {
      this.dialogVisible_addRole = false
      this.currentRole = {}
    },
    // 保存新角色
    async saveRole() {
      try {
        await this.$API.character.default.save(this.currentRole)
        this.$message.success('添加新角色成功')
        // 清空数据后，重新获取角色列表
        this.cancelSaveRole()
        this.getCharacterPageList()
      } catch (error) {
        this.$message.error(error)
      }
    },
    clearData() {
      this.tempSearchObj = { username: '' }
      this.searchObj = { username: '' }
      this.currentRole = {}
      this.currentRoleIds = []
      this.getCharacterPageList()
    },
    // 删除角色
    async deleteRole(row) {
      try {
        await this.$API.character.default.removeById(row.id)
        this.$message.success('删除成功')
        this.getCharacterPageList()
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 切换成修改角色
    editRole(row) {
      row.showEdit = true
    },
    // 取消修改角色
    cancelEditRole(row) {
      row.showEdit = false
      this.$message.warning('取消角色修改')
    },
    // 确认修改角色
    async updateRole(row) {
      const result = await this.$API.character.default.updateById(row)
      // console.log(result, '更新结果')
      if (result.code === 20000) {
        this.$message.success('修改角色成功')
        this.getCharacterPageList()
      } else {
        this.$message.error('修改失败')
      }
    },
    // 选中的角色项改变的回调
    handlerCheckedChange(selection) {
      this.currentRoleIds = selection.map(item => item.id)
    }
  }
}
</script>

<style>
  .el-dialog{
    border-radius: 10px;
  }
</style>
