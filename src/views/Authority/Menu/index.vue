<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :expand-row-keys="expandKeys"
    >
      >
      <el-table-column
        prop="name"
        label="名称"
        width=""
        header-align="center"
      />
      <el-table-column
        prop="code"
        label="权限值"
        width=""
        align="center"
      />
      <el-table-column
        label="跳转权限值"
        width=""
      />
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="{row}">
          <HintButton :disabled="row.level===4" :title="getAddTitle(row.level)" size="mini" type="primary" icon="el-icon-plus" @click="addOrUpdataMenu(row)" />
          <HintButton :disabled="row.level===1" :title="row.level===4? '修改功能':'修改菜单'" size="mini" type="primary" icon="el-icon-edit" @click="editMenu(row)" />
          <HintButton :disabled="row.level===1" title="删除" size="mini" type="danger" icon="el-icon-delete" @click="removeMenu(row)" />
        </template>

      </el-table-column>
    </el-table>

    <!-- 添加或编辑的dialog -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible_add"
      width="width"
      :before-close="dialogBeforeClose"
    >
      <el-form ref="form" :model="currentMenu" label-width="120px">
        <el-form-item v-show="currentMenu.level>2 && !currentMenu.id" label="父级名称">
          <el-input v-model="currentMenu.pname" disabled />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="currentMenu.name" />
        </el-form-item>
        <el-form-item label="功能权限值" prop="code">
          <el-input v-model="currentMenu.code" />
        </el-form-item>
        <el-form-item v-show="currentMenu.level === 4" label="跳转路由权限值" prop="toCode">
          <el-input v-model="currentMenu.toCode" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetData">取 消</el-button>
        <el-button type="primary" @click="saveMenu">确 定</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      expandKeys: [], // 需要自动展开的项
      tableData: [],
      // #region
      // tableData: [{
      //   id: 0,
      //   date: '全部数据',
      //   authorityValue: 0,
      //   skipAuthorityValue: 0,
      //   children: [{
      //     id: 11,
      //     date: '商品管理',
      //     authorityValue: 1,
      //     skipAuthorityValue: 1,
      //     children: [{
      //       id: 1121,
      //       date: 'sku管理',
      //       authorityValue: 2,
      //       skipAuthorityValue: 2,
      //       children: [{
      //         id: 112131,
      //         date: 'sku图片管理',
      //         authorityValue: 3,
      //         skipAuthorityValue: 3
      //       }, {
      //         id: 112132,
      //         date: 'sku信息管理',
      //         authorityValue: 3,
      //         skipAuthorityValue: 3
      //       }]
      //     }, {
      //       id: 1122,
      //       date: 'spu管理',
      //       authorityValue: '2',
      //       skipAuthorityValue: 2,
      //       children: [{
      //         id: 112231,
      //         date: 'spu图片管理',
      //         authorityValue: 3,
      //         skipAuthorityValue: 3
      //       }, {
      //         id: 112232,
      //         date: 'spu信息管理',
      //         authorityValue: 3,
      //         skipAuthorityValue: 3
      //       }]
      //     },
      //     {
      //       id: 1123,
      //       date: '品牌管理',
      //       authorityValue: '2',
      //       skipAuthorityValue: 2,
      //       children: [{
      //         id: 112331,
      //         date: '品牌图片管理',
      //         authorityValue: 3,
      //         skipAuthorityValue: 3
      //       }, {
      //         id: 112332,
      //         date: '品牌信息管理',
      //         authorityValue: 3,
      //         skipAuthorityValue: 3
      //       }]

      //     }]
      //   }, {
      //     id: 12,
      //     date: '权限管理',
      //     authorityValue: 1,
      //     skipAuthorityValue: 1,
      //     children: [{
      //       id: 1221,
      //       date: '用户管理',
      //       authorityValue: 2,
      //       skipAuthorityValue: 2,
      //       children: [{
      //         id: 122131,
      //         date: 'sku图片管理',
      //         authorityValue: 3,
      //         skipAuthorityValue: 3
      //       }, {
      //         id: 122132,
      //         date: 'sku信息管理',
      //         authorityValue: 3,
      //         skipAuthorityValue: 3
      //       }]
      //     }, {
      //       id: 1222,
      //       date: '角色管理',
      //       authorityValue: '2',
      //       skipAuthorityValue: 2,
      //       children: [{
      //         id: 122231,
      //         date: '角色图片管理',
      //         authorityValue: 3,
      //         skipAuthorityValue: 3
      //       }, {
      //         id: 122232,
      //         date: '角色信息管理',
      //         authorityValue: 3,
      //         skipAuthorityValue: 3
      //       }]
      //     },
      //     {
      //       id: 1223,
      //       date: '菜单管理',
      //       authorityValue: '2',
      //       skipAuthorityValue: 2,
      //       children: [{
      //         id: 122331,
      //         date: '菜单图片管理',
      //         authorityValue: 3,
      //         skipAuthorityValue: 3
      //       }, {
      //         id: 122332,
      //         date: '菜单信息管理',
      //         authorityValue: 3,
      //         skipAuthorityValue: 3
      //       }]
      //     }]
      //   }]
      // }],
      // #endregion
      // 添加、修改的dialog
      dialogVisible_add: false,
      // 当前操作的菜单项
      currentMenu: {
        code: '',
        level: 0,
        name: '',
        toCode: ''
      }

    }
  },
  computed: {
    // 动态计算得到Dialog的标题
    dialogTitle() {
      const { id, level } = this.currentMenu
      if (id) {
        return level === 4 ? '修改功能' : '修改菜单'
      } else {
        return level === 4
          ? '添加功能'
          : `添加${level === 2 ? '一级' : '二级'}菜单`
      }
    }
  },
  mounted() {
    this.menuList()
  },
  methods: {

    // 获取菜单列表
    async menuList() {
      const result = await this.$API.menu.default.getPermissionList()
      // console.log(result, '菜单列表')
      this.tableData = result.data.children
      this.expandKeys.push(this.tableData[0].id)
    },
    // 计算路由等级
    getAddTitle(level) {
      if (level === 1 || level === 2) {
        return '添加菜单'
      } else if (level === 3) {
        return '添加功能'
      }
    },
    // 添加菜单
    async addOrUpdataMenu(row) {
      // console.log(row.id, '参数')
      // 赋值level toCode
      this.dialogVisible_add = true

      this.currentMenu.pid = row.id
      this.currentMenu.level = row.level + 1
      this.currentMenu.toCode = row.code
      this.currentMenu.type = this.currentMenu.level === 4 ? 2 : 1
      this.currentMenu.pname = row.name // 用于显示父名称, 但提交请求时是不需要的
    },
    // 保存菜单
    async saveMenu() {
      const { pname, ...perm } = this.currentMenu // pname不需要携带
      const result = await this.$API.menu.default[ perm.id ? 'updatePermission' : 'addPermission'](perm)
      this.$message.success(
        result.message || `${perm.id ? '修改' : '添加'}${pname}成功!`
      )
      this.menuList()
      this.resetData()
    },
    // 取消添加菜单
    resetData() {
      this.currentMenu = {
        code: '',
        level: 0,
        name: '',
        toCode: ''
      }
      this.dialogVisible_add = false
    },
    // 关闭回调函数
    dialogBeforeClose() {
      this.resetData()
    },
    // 编辑菜单或功能
    editMenu(row) {
      this.dialogVisible_add = true
      this.currentMenu = row
    },
    // 删除菜单
    async removeMenu(row) {
      console.log(row, 'delete menu')
      this.$confirm("此操作会永久删除数据，是否继续?,'提示'", {
        type: 'warning'
      }).then(async() => {
        const result = await this.$API.menu.default.removePermission(row.id)
        this.$message.success(`${row.name}删除成功` || result.message)
        this.menuList()
      }).catch((error) => {
        if (error === 'cancel') { this.$message.error('已取消删除') }
      })
    }
  }
}
</script>

<style>

</style>
