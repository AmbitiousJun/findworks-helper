<template>
<div class="json-import-dialog-wrap">
  <my-dialog 
    :width="650" 
    :height="330" 
    title="导入 JSON" 
    ref="myDialogRef"
  >
    <div class="tips-wrap">
      <p>1. 导入 JSON 功能适合数据迁移场景，数据可读性较差，支持全量导入</p>
      <p>2. 请确保 JSON 数据符合本站的数据格式（乱导入出 Bug 了我可不管（doge））</p>
    </div>
    <el-input
      v-model="jsonContent"
      :autosize="{ minRows: 6, maxRows: 6 }"
      resize="none"
      type="textarea"
      placeholder="请把需要导入的 JSON 粘贴在这"
    /> 
    <template #footer>
      <el-button @click="close">关闭</el-button>
      <el-button 
        type="primary"
        @click="handleImportJson"
      >
        导入
      </el-button>
    </template>
  </my-dialog>
</div>
</template>

<script lang="ts" setup>
import MyDialog from '@/components/framework/MyDialog.vue';

import { ref, DefineComponent } from 'vue';
import { ElMessage } from 'element-plus';
import { DataImporter } from '../../utils/data-operate/definition/dataimporter';
import { JsonImportImpl } from '../../utils/data-operate/impl/jsonimportimpl';

// 对话框组件实例
const myDialogRef = ref<DefineComponent>();

// 数据导入核心处理器
const importer = new DataImporter(new JsonImportImpl());

// 用户输入的 JSON 字符串
const jsonContent = ref<string>(<string>importer.generateTemplate());

// 导入数据
const handleImportJson = () => {
  const data = importer.resolveData(jsonContent.value);
  if (!data) {
    // 数据不合法
    return;
  }
  importer.putData(data, () => {
    ElMessage.success('数据导入成功');
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
  jsonContent.value = <string>importer.generateTemplate();
  myDialogRef.value.open();
}

defineExpose({
  open,
  close
});
</script>

<style lang="scss" scoped>
.json-import-dialog-wrap {
  .tips-wrap {
    font-size: 8px;
    color: #909399;
    margin: 10px 0;
  }
}
</style>