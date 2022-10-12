<template>
  <div class="detail">
    <div class="card-header">
      <slot name="header" />
      <i class="el-icon-info" />
    </div>
    <div class="card-main">
      <slot name="main" />
    </div>
    <div class="card-charts">
      <slot name="charts" />
    </div>
    <div class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Detail'
}
</script>

<style>
.card-header>i{
  position: absolute;
  right: 10px;
}
.card-header{
  font-size: 14px;
  color: rgb(163, 163, 163);
  position: relative;
  margin-bottom: 10px;
}
.card-main{
  font-size: 30px;
  font-weight: 400;
}
.card-charts{
  height: 100px;
  font-size: 14px;
}
</style>
