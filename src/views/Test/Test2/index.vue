<template>
  <div>

    <el-button v-show="$store.state.user.buttons.indexOf('btn.Add3')!==-1" type="primary">添加3</el-button>
    <el-button v-show="$store.state.user.buttons.indexOf('btn.Add4')!==-1" type="primary">添加4</el-button>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
