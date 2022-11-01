<template>
<div id="app">
  <!-- 网站顶部标题栏 -->
  <my-header />
  <!-- 工具盒 -->
  <tool-box />
  <!-- 搜索模块 -->
  <search ref="searchRef" />
  <!-- 网站核心表格 -->
  <core-table ref="coreTableRef" />

  <use-tips-dialog ref="useTipsDialogRef" />
</div>
</template>

<script lang="ts" setup>
import MyHeader from '@/components/framework/Header.vue';
import ToolBox from '@/components/ToolBox.vue';
import Search from '@/components/Search.vue';
import CoreTable from '@/components/CoreTable.vue';
import UseTipsDialog from './components/dialog/UseTipsDialog.vue';

import coreTableHelper from './utils/coretable';
import SearchHelper from './utils/search';

import { ref, DefineComponent, onMounted } from 'vue';

// 使用须知对话框组件实例
const useTipsDialogRef = ref<DefineComponent>();

// 表格组件实例
const coreTableRef = ref<DefineComponent>();

// 搜索组件实例
const searchRef = ref<DefineComponent>();

onMounted(() => {
  if (!useTipsDialogRef.value) {
    console.error('加载使用须知对话框组件失败！');
  } else {
    useTipsDialogRef.value.open();
  }
  // 设置表格实例
  coreTableHelper.setComponent(coreTableRef.value);
  // 设置搜索实例
  SearchHelper.setComponent(searchRef.value);
})
</script>

<style scoped>
</style>