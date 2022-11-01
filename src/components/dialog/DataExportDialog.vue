<template>
<div class="excel-export-dialog-wrap">
  <my-dialog 
    :width="400" 
    :height="250" 
    title="导出选项" 
    ref="myDialogRef"
  >
    请选择导出的数据范围：
    <el-radio-group style="margin-top: 10px;" v-model="exportOption">
      <el-radio :label="1">全部数据</el-radio>
      <el-radio :label="2">当前过滤出来的数据</el-radio>
    </el-radio-group>
    <div class="tips-wrap">
      <p>导出 Excel 只会导出表格中展示的数据（不包含链接、备注等详细信息），如需全量导出请使用 JSON 导出</p>
    </div>
    <template #footer>
      <el-button type="primary" plain @click="close">关闭</el-button>
      <el-button @click="handleExportExcel" type="primary">导出 Excel</el-button>
      <el-button @click="handleExportJson" type="primary">导出 JSON</el-button>
    </template>
  </my-dialog>
</div>
</template>

<script lang="ts" setup>
import mediator from '../../utils/persistence';
import coreTableHelper from '../../utils/coretable';

import { ref, DefineComponent } from 'vue';

import MyDialog from '@/components/framework/MyDialog.vue';
import { ElMessage } from 'element-plus';
import { DataExporter } from '../../utils/data-operate/definition/dataexporter';
import { JsonExportImpl } from '../../utils/data-operate/impl/jsonexportimpl';
import { ExcelExportImpl } from '../../utils/data-operate/impl/excelexportimpl';

// 对话框组件实例
const myDialogRef = ref<DefineComponent>();

// 导出选项，1 全部数据，2 当前表格中的数据
const exportOption = ref<number>(1);

// JSON 导出核心处理器
const jsonExporter = new DataExporter(new JsonExportImpl());

// Excel 导出核心处理器
const excelExporter = new DataExporter(new ExcelExportImpl());

// 根据导出选项获取到需要导出的数据列表
const getData = (): CoreTableTypes.SendingHistoryItem[] => {
  if (exportOption.value === 1) {
    return mediator.getSendingHistorys();
  }
  return coreTableHelper.getData();
}

// 导出 JSON 格式数据
const handleExportJson = () => {
  const data = getData();
  jsonExporter.export(data, () => {
    ElMessage.success('数据已拷贝到剪贴板，请妥善保存');
    close();
  });
}

// 执行导出逻辑
const handleExportExcel = () => {
  const data = getData();
  excelExporter.export(data, () => {
    ElMessage.success('数据已导出');
    close();
  });
}

// 关闭对话框
const close = () => {
  if (!myDialogRef.value) {
    console.error('获取对话框组件实例失败！');
    return;
  }
  myDialogRef.value.close();
}

// 开启对话框
const open = () => {
  if (!myDialogRef.value) {
    console.error('获取对话框组件实例失败！');
    return;
  }
  myDialogRef.value.open();
}

defineExpose({
  open,
  close
});
</script>

<style lang="scss" scoped>
.excel-export-dialog-wrap {
  .tips-wrap {
    font-size: 8px;
    margin-top: 10px;
    color: #909399;
  }
}
</style>