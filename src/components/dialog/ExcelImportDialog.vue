<template>
<div class="excel-import-dialog-wrap">
  <my-dialog 
    :width="650" 
    :height="400" 
    title="导入 Excel" 
    ref="myDialogRef"
  >
    <el-upload
      drag
      :limit="1"
      action=""
      :before-upload="handleUploadFile"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        拖拽 Excel 文件到这里 或者 <em>点此进行上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          <p>
            1. 请确保上传的文件严格按照本站规定的格式（
            <el-button 
              text 
              @click="handleDownloadTemplateFile"
              size="small"
              type="primary">点此下载模板文件</el-button>
            ）
          </p>
          <p>2. 笔试、面试的场次可根据实际进行扩充，列名格式：【第 i 轮面试】（注意 i 左右各有一个空格）</p>
          <p>3. 填入违规的数据时，系统会默认将其指定为默认值</p>
        </div>
      </template>
    </el-upload>
  </my-dialog>
</div>
</template>

<script lang="ts" setup>
import MyDialog from '@/components/framework/MyDialog.vue';
import { DataImporter } from '../../utils/data-operate/definition/dataimporter';
import { ExcelImportImpl } from '../../utils/data-operate/impl/excelimportimpl';

import { ref, DefineComponent } from 'vue';

import { UploadFilled } from '@element-plus/icons-vue';
import { UploadRawFile, ElMessage } from 'element-plus';
import * as XLSX from 'xlsx';

// 对话框组件实例
const myDialogRef = ref<DefineComponent>();

// 导入数据核心处理器
const importer = new DataImporter(new ExcelImportImpl());

// 生成一个模板 Excel 文件，供用户填写
const handleDownloadTemplateFile = () => {
  importer.generateTemplate();
}

/**
 * 将文件读取成工作簿对象
 * @param file 要读取的文件
 * @param callback 回调，将读取出来的 WorkBook 传回
 */
const readFileToWorkBook = (
  file: UploadRawFile,
  callback: (workBook: XLSX.WorkBook) => void
) => {
  const reader = new FileReader();
  reader.onload = e => {
    const data = e.target?.result;
    const workBook = XLSX.read(data, { type: 'binary' });
    callback && callback(workBook);
  }
  reader.readAsBinaryString(file);
}

// 处理上传的文件
const handleUploadFile = (file: UploadRawFile) => {
  // 将文件读取成 WorkBook
  readFileToWorkBook(file, (workBook) => {
    // 将数据转换为系统可识别的格式
    const data = importer.resolveData(workBook);
    if (!data) {
      // 数据读取失败
      return;
    }
    importer.putData(data, () => {
      ElMessage.success('数据成功导入');
      close();
    });
  });
  // 禁止自动上传
  return false;
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

<style scoped>
</style>