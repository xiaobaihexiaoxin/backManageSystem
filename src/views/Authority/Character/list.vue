<template>
  <div>
    <el-input disabled :value="$route.query.roleName" />
    <el-tree
      ref="tree"
      style="margin: 20px 0"
      :data="allPermissions"
      node-key="id"
      show-checkbox
      default-expand-all
      :props="defaultProps"
    />
    <el-button :loading="loading" type="primary" @click="saveAssigned">保存</el-button>
    <el-button @click="$router.replace({name: 'Role'})">取消</el-button>
  </div>
</template>

<script>
export default {
  name: 'RoleAuth',

  data() {
    return {
      loading: false, // 用来标识是否正在保存请求中的标识, 防止重复提交
      allPermissions: [], // 所有权限
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted() {
    // 初始化页面数据
    this.getAssignList()
  },
  methods: {
    save() {
    },
    // 获取全部权限和角色有的权限
    getAssignList() {
      const roleId = this.$route.params.id
      try {
        this.$API.menu.default.toAssign(roleId).then(Response => {
          const allpermissions = Response.data.children
          // console.log(allpermissions, '总权限')
          this.allPermissions = allpermissions
          const checkedIds = this.getCheckedIds(allpermissions)
          // console.log(checkedIds, 'checkedIds')
          // element-ui提供了set、getCheckedKeys方法 获取和设置树节点的选中
          this.$refs.tree.setCheckedKeys(checkedIds)
        })
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 筛选出角色有的权限
    getCheckedIds(auths, initArr = []) {
      return auths.reduce((pre, item) => {
        if (item.select && item.level === 4) {
          pre.push(item.id)
        } else if (item.children) {
          this.getCheckedIds(item.children, initArr)
        }
        return pre
      }, initArr)// initArr 作为pre初始值
    },
    // 保存最新分配的权限
    saveAssigned() {
      this.getCheckedKeys()
    },
    getCheckedKeys() {
      this.loading = true
      const permission = this.$refs.tree.getCheckedKeys().join(',')
      // console.log(permission, 'permission')
      this.$API.menu.default.doAssign(this.$route.params.id, permission).then(result => {
        this.$message.success(result.$$message || '分配权限成功')
        // 保存下当前角色名和当前用户的角色列表
        const roleName = this.$route.query.roleName
        const roles = this.$store.state.user.roles
        this.$router.replace('/authority/character', () => {
          console.log('repalce compelete')
          // 当前用户的角色名权限变化，重新加载页面
          if (roles.indexOf(roleName)) {
            window.location.reload()
          }
        })
      })
    }
  }
}
</script>

<style>

</style>
