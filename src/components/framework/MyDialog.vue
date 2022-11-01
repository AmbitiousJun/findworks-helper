<template>
<div v-show="dialogVisible" ref="myDialog" class="my-dialog-wrap">
  <!-- 灰色遮罩 -->
  <Teleport to="body">
    <div 
      ref="myDialogModal"
      @click="close(false)"
      class="my-dialog-modal" />
  </Teleport>
  <!-- 对话框头部 -->
  <div class="my-dialog__header">
    <span class="title">{{ title }}</span>
  </div>
  <div class="container">
    <slot></slot>
  </div>
  <div class="footer-wrap">
    <slot name="footer">
      <el-button 
        auto-insert-space
        type="primary"
        @click="close(false)"
      >
        关闭
      </el-button>
    </slot>
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
  // 对话框宽度
  width: number;
  // 对话框高度
  height: number;
  // 对话框标题
  title: string;
  // 对话框关闭前的钩子，返回 true 继续关闭，否则不关闭
  beforeClose?: () => boolean;
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
 * @param force 是否强制关闭
 */
const close = (force: boolean = false) => {
  if (!force && props.beforeClose && !props.beforeClose()) {
    // 调用方阻止了此次关闭
    return;
  }
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
    font-size: 16px;
    text-align: center;
    font-weight: 600;
    .title {
      width: fit-content;
      color: #303133;
      letter-spacing: 3px;
    }
  }
  .footer-wrap {
    position: absolute;
    bottom: 0;
    padding: 15px;
    width: 100%;
  }
  .container {
    padding: 15px;
    max-height: 75%;
    overflow-y: auto;
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