<template>
  <div>
    <el-form ref="form">
      <el-form-item>
        <el-input v-model="tempSearchObj.username" placeholder="用户名" style="width:200px;margin-right:10px;" />
        <el-button type="primary" icon="el-icon-search" @click="searchWithWord">  查询</el-button>
        <el-button @click="resetSearch">清空</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dialogTableVisible_editAndAdd = true">添加</el-button>
        <el-button type="danger" :disabled="selectedIds.length===0" @click="deleteCheckedUser">批量删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-table
          :data="usersInfo"
          style="width: 100%"
          border
          @selection-change="checkUser"
        >
          <!-- @select-all="checkUser" -->
          <!-- @select="checkUser" -->
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
            prop="prop"
            label="序号"
            width="100px"
          />
          <el-table-column
            header-align="center"
            align="center"
            prop="username"
            label="用户名"
            width="100px"
          />
          <el-table-column
            header-align="center"
            align="center"
            prop="nickName"
            label="用户昵称"
            width="100px"
          />
          <el-table-column
            header-align="center"
            align="center"
            label="权限列表"
            prop="roleName"
          >
            <!-- <template slot-scope="{row}">
              <span v-for="(character,index) in row.roles" :key="index" style="margin:0 5px;">{{ character }}</span>
            </template> -->
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="gmtCreate"
            label="创建时间"
          />
          <el-table-column
            header-align="center"
            align="center"
            prop="gmtModified"
            label="更新时间"
          />
          <el-table-column
            header-align="center"
            align="center"
            prop="prop"
            label="操作"
          >
            <template slot-scope="{row}">
              <HintButton title="分配角色" size="mini" type="info" icon="el-icon-info" @click="showAssignRole(row)" />
              <HintButton title="修改用户" size="mini" type="primary" icon="el-icon-edit" @click="showEditUser(row)" />
              <HintButton title="删除用户" size="mini" type="danger" icon="el-icon-delete" @click="deleteUser(row)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-pagination
          layout="prev, pager, next,->,sizes,total"
          :total="total"
          :page-sizes="[5,10,20]"
          :page-size="pageSize"
          :current-page="currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-form-item>
    </el-form>

    <el-dialog title="设置角色" :visible.sync="dialogTableVisible_assign" :before-close="cancelRoleAssign">
      <el-form ref="user_assign" label-width="80px">
        <el-form-item label="用户名">
          <el-input :disabled="true" :placeholder="currentUser.username" />
        </el-form-item>

        <el-form-item label="角色列表">
          <el-checkbox v-model="isCheckAll" :indeterminate="isIndeterminate" @change="checkAllRoleWithUser">全选</el-checkbox>
          <div style="margin:15px 0" />

          <el-checkbox-group v-model="userRoleIds" @change="handleCheckedChange">
            <el-checkbox v-for="role in allRole" :key="role.id" :label="role.id">{{ role.roleName }}</el-checkbox>
          </el-checkbox-group>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRoleAssign">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="confirmAssignRole">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="currentUser.id?'修改用户':'添加用户'"
      :visible.sync="dialogTableVisible_editAndAdd"
      width="width"
      :before-close="cancelUpdateAndAdd"
    >
      <el-form ref="user_edit" :model="currentUser" :rules="userRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="currentUser.username" />
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="currentUser.nickName" />
        </el-form-item>

        <el-form-item v-if="!currentUser.id" label="用户密码" prop="password">
          <el-input v-model="currentUser.password" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelUpdateAndAdd">取消</el-button>
        <el-button type="primary" @click="updataOrAddUser">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  data() {
    return {
      listLoading: false, // 是否显示列表加载的提示
      tempSearchObj: {
        username: '' // 搜集搜索条件输入的对象
      },
      searchObj: {
        username: '' // 包含搜索条件输入的对象
      },
      pageSize: 5, // 每页展示数据条数
      total: 0, // 数据总数
      currentPage: 1, // 当前页码数
      usersInfo: [], // 所有用户信息
      currentUser: {}, // 当前操作的user
      userRules: { // 用户校验规则
        username: [
          { required: true, message: '用户名必须输入', trigger: 'blur' },
          { min: 4, message: '用户名长度不能小于4位字符' }
        ],
        password: [
          { required: true, validator: this.validatePassword }
        ]
      },
      loading: false, // 是否在提交请求中
      allRole: [], // 所有角色列表
      userRoleIds: [], // 用户的角色Id列表
      isIndeterminate: false, // 是否是不确定的 ---全选按钮状态
      isCheckAll: false, // 分配角色是否全选
      selectedIds: [],
      // 分配角色的dialog
      dialogTableVisible_assign: false,
      // 编辑用户dialog
      dialogTableVisible_editAndAdd: false
    }
  },
  created() {
    // 获取所有的用户列表
    this.getAllUser()
  },
  methods: {
    // 分页器函数
    handleSizeChange(val) {
      this.pageSize = val
      // 获取所有的用户列表
      this.getAllUser()
    },
    handleCurrentChange(val) {
      // this.currentPage = val
      // 获取所有的用户列表
      this.getAllUser(val)
    },
    // 获取所有角色
    async getAllUser(page = 1) {
      this.currentPage = page
      this.listLoading = true
      const result = await this.$API.user.getPageList(this.currentPage, this.pageSize, this.searchObj)
      result.code === 200 ? this.listLoading = false : ''
      // console.log(result, '用户管理信息')
      const { items, total } = result.data
      // 保存所有用户数据(除了admin)
      this.usersInfo = items
      // this.usersInfo = items.filter(item => item.username !== 'admin')
      // 数据总条数
      this.total = total - 1
    },
    // 展示分配角色dialog，同时获取所有角色，用户已有角色
    async showAssignRole(row) {
      this.dialogTableVisible_assign = true
      // console.log(row, 'assign')
      this.currentUser = row
      //
      const result = await this.$API.user.getRoles(row.id)
      const { allRolesList, assignRoles } = result.data
      // console.log(result, ' 用户已有角色')
      // 判断是否全选
      this.isCheckAll = allRolesList.length === assignRoles.length
      // 中间状态
      this.isIndeterminate = assignRoles.length > 0 && assignRoles.length < allRolesList.length
      // 全部角色列表
      this.allRole = allRolesList
      // 当前用户已有角色
      this.userRoleIds = assignRoles.map((item) => item.id)
    },

    // 角色列表选中项发生改变的监听
    handleCheckedChange(value) {
      const { userRoleIds, allRole } = this
      this.isCheckAll =
        userRoleIds.length === allRole.length && allRole.length > 0
      this.isIndeterminate =
        userRoleIds.length > 0 && userRoleIds.length < allRole.length
    },
    // 用户选中全部角色的回调
    checkAllRoleWithUser(flagValue) {
      // console.log(flagValue, '值')
      // value 当前勾选状态true/false
      // 如果当前全选, userRoleIds就是所有角色id的数组, 否则是空数组
      this.userRoleIds = flagValue ? this.allRole.map((item) => item.id) : []
      // 如果当前不是全选也不全不选时, 指定为false
      this.isIndeterminate = false
    },
    // 取消分配角色
    cancelRoleAssign() {
      this.allRole = []
      this.userRoleIds = []
      this.currentUser = {}
      this.dialogTableVisible_assign = false
    },
    // 确认分配角色回调
    async confirmAssignRole() {
      const roleId = this.userRoleIds.join(',')
      // console.log(roleId, '角色ID串')
      try {
        await this.$API.user.assignRoles(this.currentUser.id, roleId)
        this.$message.success('分配角色成功')
        // 重新获取用户列表
        this.getAllUser(this.currentUser.id ? this.currentPage : 1)
        // 清空数据
        this.cancelRoleAssign()
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 根据关键字进行搜索用户
    searchWithWord() {
      this.searchObj = { ...this.tempSearchObj }
      this.getAllUser()
    },
    // 清空搜索关键字
    resetSearch() {
      // 将两个关键字对象重置
      this.searchObj = {
        username: ''
      }
      this.tempSearchObj = {
        username: ''
      }
      // 重新获取全部的用户
      this.getAllUser()
    },

    // 自定义密码校验
    validatePassword(rule, value, callback) {
      if (!value) {
        callback('密码必须输入')
      } else if (!value || value.length < 6) {
        callback('密码不能小于6位')
      } else {
        callback()
      }
    },
    // 展示编辑或添加用户dialog
    showEditUser(row) {
      this.currentUser = cloneDeep(row)
      this.dialogTableVisible_editAndAdd = true
      // console.log(row, 'edit')
    },
    // 取消用户的保存或更新
    cancelUpdateAndAdd() {
      this.dialogTableVisible_editAndAdd = false
      this.currentUser = {}
    },
    // 更新和添加用户
    async updataOrAddUser() {
      this.$refs.user_edit.validate(valid => {
        if (valid) {
          this.loading = true
          this.$API.user[this.currentUser.id ? 'update' : 'add'](this.currentUser).then((result) => {
            this.loading = false
            this.$message.success('保存成功!')
            this.getAllUser(this.currentUser.id ? this.page : 1)
            this.user = {}
            this.dialogTableVisible_editAndAdd = false
            this.selectedIds = []
            this.currentUser = {}
          })
        }
      })
    },
    // 删除用户根据Id
    async deleteUser(row) {
      console.log(row)
      const result = await this.$API.user.removeById(row.id)
      // console.log(result, 'result')
      if (result.code === 20000) {
        this.$message.success('删除用户成功')
        this.getAllUser(this.currentPage)
      } else {
        this.$message.error('删除用户失败')
      }
    },

    // 列表选中状态改变的回调
    checkUser(selection) {
      // console.log(selection '被选中的用户信息 ')
      this.selectedIds = selection.map(item => item.id)
      // this.selectedIds.push(row.id)
    },
    // 批量删除选中的用户
    async deleteCheckedUser() {
      try {
        await this.$API.user.removeUsers(this.selectedIds)
        // console.log(result, 'chenggong ')
        this.getAllUser(this.currentPage)
      } catch (error) {
        this.$message.error('删除失败')
      }
    }

  }
}
</script>

<style>

</style>
