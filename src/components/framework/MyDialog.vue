<template>
<div v-show="dialogVisible" ref="myDialog" class="my-dialog-wrap">
  <!-- 灰色遮罩 -->
  <Teleport to="body">
    <div 
      ref="myDialogModal"
      @click="close"
      class="my-dialog-modal" />
  </Teleport>
  <!-- 对话框头部 -->
  <div class="my-dialog__header">
    <div class="title">{{ title }}</div>
    <div class="close-icon-wrap">
      <el-icon @click="close"><Close /></el-icon>
    </div>
  </div>
  <div class="container">
    <slot></slot>
  </div>
  <div class="footer-wrap">
    <slot name="footer"></slot>
  </div>
</div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineExpose } from 'vue';

// 遮罩层 DOM 结点
const myDialogModal = ref();
// 对话框 DOM 结点
const myDialog = ref();
// 控制对话框是否显示
const dialogVisible = ref(false);

const props = defineProps<{
  width: number;
  height: number;
  title: string;
}>();

/**
 * 打开对话框
 */
const open: () => void = () => {
  dialogVisible.value = true;
  // 先将 DOM 元素渲染完成之后再执行动画
  setTimeout(() => {
    // 1 弹出遮罩层
    const dialogModal: HTMLElement = myDialogModal.value;
    dialogModal.style.width = '100vw';
    dialogModal.style.height = '100vh';
    // 2 设置对话框大小
    const dialog: HTMLElement = myDialog.value;
    dialog.style.width = `${props.width}px`;
    dialog.style.height = `${props.height}px`;
    // 3 将对话框的距顶部距离调整到 50%, 设置不透明度
    dialog.style.top = '50%';
    dialog.style.opacity = '1';
  })

}

/**
 * 关闭对话框
 */
const close: () => void = () => {
  // 1 关闭遮罩层
  const dialogModal: HTMLElement = myDialogModal.value;
  dialogModal.style.width = '0';
  dialogModal.style.height = '0';
  // 2 将对话框的距顶部距离调整到 45%
  const dialog: HTMLElement = myDialog.value;
  dialog.style.top = '45%';
  dialog.style.opacity = '0';
  dialogVisible.value = false;
}

defineExpose({
  open,
  close 
})
</script>

<style lang="scss" scoped>
.my-dialog-wrap {
  width: 0;
  height: 0;
  position: fixed;
  background-color: #fff;
  border-radius: 10px;
  left: 50%;
  top: 45%;
  opacity: 0;
  transition: opacity .3s, top .3s;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 12px 0 rgba(.1, .1, .1, .1);
  z-index: 1000;
  .my-dialog__header {
    position: relative;
    padding: 15px 5px;
    border-bottom: 1px solid #ddd;
    font-size: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      width: fit-content;
      margin-left: 10px;
      color: #303133;
    }
    .close-icon-wrap {
      margin-right: 10px;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: .3s;
      color: #909399;
      &:hover {
        color: #409eff;
      }
    }
  }
  .footer-wrap {
    position: absolute;
    bottom: 0;
    padding: 15px;
  }
  .container {
    padding: 15px;
  }
}
</style>

<style>
.my-dialog-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  background-color: #303133;
  opacity: .5;
  z-index: 500;
}
</style>