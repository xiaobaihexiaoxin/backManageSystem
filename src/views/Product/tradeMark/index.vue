<template>
  <div>
    <h1>tradeMark</h1>
    <el-button type="primary" icon="el-icon-plus" style="margin:10px 0px" @click="addUpdateTradeMark">添加</el-button>
    <el-table
      :data="trademarkInfo.records"
      style="width: 100%"
      border
    >
      <el-table-column
        type="index"
        label="序号"
        width="80px"
        align="center"
      />
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width=""
        align="center"
      />
      <el-table-column
        label="品牌logo"
        width=""
        align="center"
      >
        <template slot-scope="{row}">
          <slot>
            <img :src="row.logoUrl" alt="图片加载失败" style="width: 80px; height: 60px">
          </slot>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width=""
        align="center"
      >
        <template slot-scope="{row}">
          <el-button ref="delete" type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-edit" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- layout 是分页器各部分的位置 -> 表示向右 -->
    <el-pagination
      style="margin-top:20px;text-align:center"
      :current-page="trademarkInfo.current"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,-> ,sizes, total"
      :total="trademarkInfo.total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- dialog修改和添加的对话框 -->
    <el-dialog :title="tmForm.id? '修改品牌': '添加品牌'" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" :label-width="formLabelWidth" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" style="width:60%" />
        </el-form-item>
        <el-form-item label="品牌logo" :label-width="formLabelWidth" prop="logoUrl">
          <!--
            上传执行成功执行一次 on-success
            :on-success="handleAvatarSuccess"
            上传之前执行一次 before-upload
            :before-upload="beforeAvatarUpload" -->
          <!-- action 设置图片上传地址 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl " :src="tmForm.logoUrl " class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件,且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelTradeMark">取 消</el-button>
        <el-button type="primary" @click="confirmTradeMark()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 20) {
        callback(new Error('品牌名称长度在2~20之间'))
      } else {
        // 验证通过 使用callback()函数放行
        callback()
      }
    }
    return {
      // 代表分页器第几页
      page: 1,
      // 代表分页器显示品牌数量
      limit: 5,
      trademarkInfo: {},
      // dialog是否显示
      dialogFormVisible: false,
      // 对话框数据
      tmForm: {
        tmName: '',
        logoUrl: '',
        delivery: false
      },
      // label宽度
      formLabelWidth: '120px',
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 10 个字符', trigger: 'blur' },
          { validator: validateTmName, trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请上传品牌logo' }
        ]
      }
    }
  },
  mounted() {
    this.getTradeMarkList()
  },
  methods: {
    // 获取品牌列表数据
    async getTradeMarkList() {
      const result = await this.$API.trademark.reqGetTradeMarkList(this.page, this.limit)
      if (result.code === 200) {
        this.trademarkInfo = result.data
        this.page = result.data.current
        this.limit = result.data.size
      } else {
        Promise.reject(new Error('获取品牌列表失败'))
      }
    },
    // 更改当前页码时触发
    handleCurrentChange(afterPage) {
      // console.log(afterPage, '要跳转的页码')
      this.page = afterPage
      // 更新数据
      this.getTradeMarkList()
    },
    // 更改每页显示数据数量
    handleSizeChange(pageSize) {
      this.limit = pageSize
      this.getTradeMarkList()
    },
    // 上传图片的方法 图片上传成功
    handleAvatarSuccess(res) {
      this.tmForm.logoUrl = res.data
    },
    // 图片上传前 判断图片格式大小
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 添加修改品牌信息
    addUpdateTradeMark() {
      this.dialogFormVisible = true
      this.tmForm = { tmName: '', logoUrl: '' }
    },
    updateTradeMark(row) {
      this.dialogFormVisible = true
      // console.log(row, 'row')
      this.tmForm = { ...row }
    },
    // 确认添加或修改
    confirmTradeMark() {
      this.$refs.ruleForm.validate(async(success) => {
        // console.log(success, '表单是否验证成功')
        // success 代表是否验证成功
        if (success) {
          this.dialogFormVisible = false
          const result = await this.$API.trademark.reqAddUpdateTradeMark(this.tmForm)
          //  console.log(result, '添加品牌结果')
          if (result.code === 200) {
            this.$message({ message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功', type: 'success' })
            this.getTradeMarkList()
          }
        } else {
          this.$message({ message: '请按要求提交信息', type: 'error' })
        }
      })
    },
    // 取消添加或修改
    cancelTradeMark() {
      this.dialogFormVisible = false
      this.tmForm = { tmName: '', logoUrl: '' }
    },
    // 删除品牌
    async deleteTradeMark(row) {
      // this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(async() => {
      // 确认删除执行的逻辑
      //   const result = await this.$API.trademark.reqDeleteTradeMark(row.id)
      //   if (result.code === 200) {
      //     this.$message({ message: '删除品牌成功', type: 'success' })
      //     // 重新获取品牌列表
      //     this.getTradeMarkList()
      //   } else {
      //     this.$message({ message: '删除品牌失败', type: 'error' })
      //   }
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   })
      // })
      const result = await this.$API.trademark.reqDeleteTradeMark(row.id)
      if (result.code === 200) {
        this.$message({ message: '删除品牌成功', type: 'success' })
        // 重新获取品牌列表
        this.getTradeMarkList()
      } else {
        this.$message({ message: '删除品牌失败', type: 'error' })
      }
    }
  }
}
</script>

<style>
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
