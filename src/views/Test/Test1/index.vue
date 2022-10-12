<template>
  <div>
    <el-button v-show="$store.state.user.buttons.indexOf('btn.Add1')!==-1" type="primary">添加1</el-button>
    <el-button v-show="$store.state.user.buttons.indexOf('btn.Add2')!==-1" type="primary">添加2</el-button>
  </div>
</template>

<script>
export default {
}
</script>

<style>

</style>
