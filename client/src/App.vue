<script setup>
// 不需要引入 HelloWorld 了
// router-view 会自动加载当前 URL 对应的组件
</script>

<template>
  <router-view />
</template>

<style>
/* 这里写全局样式，比如把页面背景改成淡灰色 */
body {
  margin: 0;
  padding: 0;
  background-color: #f5f7fa;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}
</style>