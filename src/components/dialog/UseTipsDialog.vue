<template>
<div class="use-tips-dialog-wrap">
  <my-dialog 
    :width="600" 
    :height="380" 
    title="使用须知" 
    ref="myDialogRef"
  >
    <p>1. <b>创作初衷：</b>找工作投简历的时候，如果投了很多家公司，管理投递记录以及统计相关数据会很不方便。于是！我就做了这个找工作辅助器，非常的银杏（其实用 Excel 管理一下就行了，但是我 <del style="font-size: 16px; font-weight:600;">懒</del>（不会用 Excel））。</p>
    <p style="margin-top: 5px">2. <b>主要功能：</b>简历投递记录的增删改查功能，表格筛选查询功能，统计功能以及 Excel 导入导出功能等。</p>
    <p style="margin-top: 5px">3. <b style="color:red">注意事项：</b>本项目是纯前端项目，没有登录，没有后台，更不能保存用户数据。表格中的记录全都是存放在本地浏览器缓存中，如果要清除浏览器缓存的话请慎重！</p>
    <p style="margin-top: 5px">4. <b>阿巴阿巴：</b>如果觉得这个网站还可以，能帮到你的话，可以帮我点个小小的 Star 喔~，仓库地址：<el-link target="_blank" type="primary" href="https://github.com/AmbitiousJun/findworks-helper">https://github.com/AmbitiousJun/findworks-helper</el-link>。当然了，如果关于这个项目还有什么比较新奇的点子可以联系博主，联系方式请见<el-link href="https://blog.ambitiousjun.cn" target="_blank" type="primary">我的个人博客</el-link>。</p>
    <template #footer>
      <el-button 
        style="width:100%;" 
        type="primary"
        round
        plain
        @click="close"
        auto-insert-space>关闭</el-button>
    </template>
  </my-dialog>
</div>
</template>

<script lang="ts" setup>
import { DefineComponent } from 'vue';
import MyDialog from '../framework/MyDialog.vue';

import { ref } from 'vue';

const myDialogRef = ref<DefineComponent>();

// 关闭对话框
const close = (): void => {
  if (!myDialogRef.value) {
    console.error('获取对话框组件实例失败！');
    return;
  }
  myDialogRef.value.close();
}

// 打开对话框
const open = (): void => {
  if (!myDialogRef.value) {
    console.error('获取对话框组件实例失败！');
    return;
  }
  myDialogRef.value.open();
}

defineExpose({
  open
});
</script>

<style scoped>
</style>