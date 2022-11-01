<template>
<div class="tool-box-wrap">
  <!-- 第一行 两个添加数据的按钮 -->
  <div class="add-wrap">
    <el-button 
      type="primary" 
      :icon="CirclePlusFilled"
      @click="handleShowAddDialog"
    >
      添加投递
    </el-button>
    <el-button 
      type="primary" 
      plain
      @click="handleShowExcelImportDialog"
      :icon="Grid"
    >
      导入 Excel
    </el-button>
    <el-button 
      type="primary" 
      plain
      @click="handleShowJsonImportDialog"
      :icon="HelpFilled"
    >
      导入 JSON
    </el-button>
    <!-- 添加投递对话框 -->
    <sh-add-dialog ref="shAddDialogRef" />
    <!-- Excel 导入对话框 -->
    <excel-import-dialog ref="excelImportDialogRef" />
    <!-- JSOn 导入对话框 -->
    <json-import-dialog ref="jsonImportDialogRef" />
  </div>
  <!-- 第二行 统计信息相关 -->
  <div class="statistics-wrap">
    <el-button 
      type="success" 
      :icon="Histogram"
      @click="handleShowStatisticsDialog"
    >
      数据统计
    </el-button>
    <el-button 
      type="success" 
      plain
      :icon="Share"
      @click="handleShowDataExportDialog"
    >
      导出数据
    </el-button>
    <statistics-dialog ref="statisticsDialogRef" />
    <data-export-dialog ref="dataExportDialogRef" />
  </div>
</div>
</template>

<script lang="ts" setup>
import { CirclePlusFilled, Grid, Histogram, Share, HelpFilled } from '@element-plus/icons-vue';
import ShAddDialog from '@/components/dialog/ShAddDialog.vue';
import StatisticsDialog from '@/components/dialog/StatisticsDialog.vue';
import DataExportDialog from '@/components/dialog/DataExportDialog.vue';
import ExcelImportDialog from '@/components/dialog/ExcelImportDialog.vue';
import JsonImportDialog from './dialog/JsonImportDialog.vue';
import { ref } from 'vue';
import type { DefineComponent } from 'vue';

// 添加投递对话框组件实例
const shAddDialogRef = ref<DefineComponent>();
// 数据分析对话框组件实例
const statisticsDialogRef = ref<DefineComponent>();
// Excel 导出对话框组件实例
const dataExportDialogRef = ref<DefineComponent>();
// Excel 导入对话框组件实例
const excelImportDialogRef = ref<DefineComponent>();
// JSON 导入对话框组件实例
const jsonImportDialogRef = ref<DefineComponent>();

// 展示 JSON 导入对话框
const handleShowJsonImportDialog = () => {
  if (!jsonImportDialogRef.value) {
    console.error('组件实例 jsonImportDialog 获取失败！');
    return;
  }
  jsonImportDialogRef.value.open();
}

// 展示 Excel 导入对话框
const handleShowExcelImportDialog = () => {
  if (!excelImportDialogRef.value) {
    console.error('组件实例 excelImportDialog 获取失败！');
    return;
  }
  excelImportDialogRef.value.open();
}

// 展示数据导出对话框
const handleShowDataExportDialog = () => {
  if (!dataExportDialogRef.value) {
    console.error('组件实例 dataExportDialog 获取失败！');
    return;
  }
  dataExportDialogRef.value.open();
}

// 展示数据分析对话框
const handleShowStatisticsDialog = () => {
  if (!statisticsDialogRef.value) {
    console.error('组件实例 statisticsDialog 获取失败！');
    return;
  }
  statisticsDialogRef.value.open();
}

// 展示添加投递记录对话框
const handleShowAddDialog = () => {
  if (!shAddDialogRef.value) {
    console.error('组件实例 shAddDialog 获取失败！');
    return;
  }
  shAddDialogRef.value.open();
}
</script>

<style lang="scss" scoped>
.tool-box-wrap {
  width: 90%;
  margin: 20px auto 10px;
  .statistics-wrap {
    margin-top: 10px;
  }
}
</style>