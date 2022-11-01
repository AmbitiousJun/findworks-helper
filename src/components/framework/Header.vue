<template>
<div class="header-wrap">
  <div class="header-inner">
    <div class="left-wrap">
      <img class="logo-img" :src="Logo" alt="Logo">
      <span class="title">Find Works Helper</span>
    </div>
    <div class="right-wrap">Hello World</div>
  </div>
</div>
</template>

<script lang="ts" setup>
import Logo from '@/assets/icon.jpg';
</script>

<style lang="scss" scoped>
.header-wrap {
  min-width: 700px;
  border-bottom: 1px solid #ccc;
  padding: 5px 0;
  box-shadow: 0 2px 12px 0 rgba(.1, .1, .1, .1);
  position: sticky;
  top: 0;
  background-color: #fff;
  .header-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90vw;
    min-width: 700px;
    margin: 0 auto;
    .left-wrap {
      display: flex;
      align-items: center;
      .logo-img {
        margin-right: 10px;
        width: 50px;
        height: 50px;
      }
      .title {
        font-size: 25px;
        font-family: monospace;
        color: #303133;
      }
    }
    .right-wrap {
      font-size: 25px;
      font-family: monospace;
      color: #EBEDF0;
      border-radius: 10px;
      background-color: #909399;
      padding: 5px 10px;
    }
  }
}
</style>