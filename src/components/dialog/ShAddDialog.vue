<template>
<div class="sh-add-dialog-wrap">
  <my-dialog 
    :width="500" 
    :height="500" 
    :before-close="handleBeforeCloseDialog"
    :title="isEditMode ? '编辑' : '添加投递记录'" 
    ref="myDialogRef"
  >
    <el-form v-loading="formLoading" :model="formData" label-width="120">
      <!-- 公司名称 -->
      <el-form-item label="公司名称">
        <el-input placeholder="填之前最好先确认一下之前是否投过此公司" v-model="formData.company.name" />
      </el-form-item>

      <!-- 投递类型 -->
      <el-form-item label="投递类型">
        <el-select v-model="formData.company.type" placeholder="- 投递类型 -">
          <el-option
            v-for="item in SendingTypeSelections"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 公司官网，只有当投递类型为官网时才显示 -->
      <el-form-item v-if="formData.company.type === '官网'" label="官网地址">
        <el-input placeholder="推荐填招聘进度查询地址" v-model="formData.company.website" />
      </el-form-item>
      <!-- 求职网站名称，只有当投递类型为求职网站时才显示 -->
      <el-form-item v-if="formData.company.type === '求职网站'" label="求职网站名称">
        <el-input placeholder="选填，方便在表单中更好地展示" v-model="formData.company.employmentSiteInfo!.name" />
      </el-form-item>
      <!-- 求职网站官方网址，只有当投递类型为求职网站时才显示 -->
      <el-form-item v-if="formData.company.type === '求职网站'" label="求职网站地址">
        <el-input placeholder="选填" v-model="formData.company.employmentSiteInfo!.link" />
      </el-form-item>
      <!-- 公众号名称，只有当投递类型为公众号时才显示 -->
      <el-form-item v-if="formData.company.type === '公众号'" label="公众号名称">
        <el-input placeholder="选填" v-model="formData.company.mpName" />
      </el-form-item>

      <!-- 投递时间 -->
      <el-form-item label="投递时间">
        <el-date-picker
          v-model="formData.sendingDate"
          style="width: 100%;"
          type="date"
          placeholder="投递简历的时间，不选默认今天"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <!-- Offer 状态 -->
      <el-form-item label="Offer 状态">
        <el-radio-group v-model="formData.offerStatus">
          <el-radio-button label="未获得" />
          <el-radio-button label="已获得" />
          <el-radio-button label="已拒绝" />
        </el-radio-group>
      </el-form-item>

      <!-- 笔试信息 -->
      <el-form-item label="笔试信息">
        <div class="written-info-wrap">
          <exam-info 
            v-for="(item, index) in formData.process.writtenExaminations" 
            :info="item"
            :key="index"
            @update="handleUpdateExam('write', index, $event)"
            @delete="handleDeleteExam('write', index)"
          />
          <el-button 
            size="small" 
            type="success"
            link
            :icon="Plus"
            @click="handleAddExam('write')"
          >
            添加笔试
          </el-button>
        </div>
      </el-form-item>

      <!-- 面试信息 -->
      <el-form-item label="面试信息">
        <div class="interview-info-wrap">
          <exam-info 
            v-for="(item, index) in formData.process.interviews" 
            :info="item"
            :key="index"
            @update="handleUpdateExam('interview', index, $event)"
            @delete="handleDeleteExam('interview', index)"
          />
          <el-button 
            size="small" 
            type="success"
            link
            :icon="Plus"
            @click="handleAddExam('interview')"
          >
            添加面试
          </el-button>
        </div>
      </el-form-item>

      <!-- 备注 -->
      <el-form-item label="备注">
        <el-input 
          type="textarea"
          placeholder="薪资、公司福利等等附加信息……"
          :autosize="{ minRows: 4, maxRows: 8 }"
          v-model="formData.remark" />
      </el-form-item>
    </el-form>

    <!-- 对话框底部按钮 -->
    <template #footer>
      <div class="footer-wrap">
        <el-button 
          @click="handleSave" 
          type="primary" 
          :disabled="formLoading"
          :loading="formLoading"
          auto-insert-space
        >
          保存
        </el-button>
        <el-button 
          @click="handleBeforeCloseDialog" 
          :disabled="formLoading"
          auto-insert-space
        >
          关闭
        </el-button>
      </div>
    </template>
  </my-dialog>
</div>
</template>

<script lang="ts" setup>
import MyDialog from '@/components/framework/MyDialog.vue';
import ExamInfo from '@/components/ExamInfo.vue';

import { Plus } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

import { 
  initDefaultSendingHistoryItem,
  SendingTypeSelections,
  generateRandomId,
  computeProcessStatus
} from '../../utils/entity';

import { deepClone } from '../../utils/clone';

import mediator from '../../utils/persistence';

import { ref, defineExpose } from 'vue';
import type { DefineComponent} from 'vue';

// 对话框实例
const myDialogRef = ref<DefineComponent>();

// 表单加载
const formLoading = ref<boolean>(false);

// 是否是编辑模式
const isEditMode = ref<boolean>(false);

// 表单数据
const formData = ref<CoreTableTypes.SendingHistoryItem>(initDefaultSendingHistoryItem());

// 关闭对话框前的判断
const handleBeforeCloseDialog = () => {
  if (formLoading.value) {
    // 正在添加数据的时候就不允许关闭对话框
    return;
  }
  if (!myDialogRef.value) {
    console.error('获取对话框组件异常！');
    return;
  }
  // 编辑模式下可以直接关闭
  if (isEditMode.value) {
    myDialogRef.value.close(true);
    return;
  }
  ElMessageBox.confirm(
    '确认关闭对话框吗？（已填写的信息不会保存）',
    '提示',
    {
      confirmButtonText: '继续关闭',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    myDialogRef.value!.close(true);
  }).catch(() => {})
}

/**
 * 更新测验数据
 * @param type 测验类型，笔、面试
 * @param index 测验在数组中的索引
 * @param info 需要更新的新数据
 */
const handleUpdateExam = (
  type: string,
  index: number,
  info: CoreTableTypes.BaseExamInfo
) => {
  if (!type || (type !== 'write' && type !== 'interview')) {
    return;
  }
  let arr = formData.value.process.writtenExaminations;
  if (type === 'interview') {
    arr = formData.value.process.interviews;
  }
  // 删掉原本的数据，添上新数据
  arr.splice(index, 1, info);
}

/**
 * 删除测验
 * @param type 测验类型，笔、面试
 * @param index 测验在数组中的索引
 */
const handleDeleteExam = (type: string, index: number) => {
  if (!type || (type !== 'write' && type !== 'interview')) {
    return;
  }
  let arr = formData.value.process.writtenExaminations;
  if (type === 'interview') {
    arr = formData.value.process.interviews;
  }
  arr.splice(index, 1);
}

/**
 * 添加 笔、面 试信息
 * @param type 信息类型，write：笔试，interview：面试 
 */
const handleAddExam = (type: string) => {
  const info: CoreTableTypes.BaseExamInfo = {
    status: '未开始',
    date: '',
    remark: ''
  };
  if (type === 'write') {
    formData.value.process.writtenExaminations.push(info);
  } else if (type === 'interview') {
    formData.value.process.interviews.push(info);
  }
}

/**
 * 打开对话框
 * @param editMode 是否是编辑模式，默认 false
 * @param oldData 旧数据，必须是编辑模式，这个参数才会用到
 */
const open = (
  editMode: boolean = false,
  oldData?: CoreTableTypes.SendingHistoryItem
) => {
  if (!myDialogRef.value) {
    console.error('组件 MyDialog 实例获取失败！');
    return;
  }
  // 初始化表单数据
  if (editMode && oldData) {
    formData.value = <CoreTableTypes.SendingHistoryItem>deepClone(oldData);
    isEditMode.value = true;
  } else {
    formData.value = initDefaultSendingHistoryItem();
  }
  myDialogRef.value.open();
}

// 保存信息
const handleSave = () => {
  formLoading.value = true;
  // 获取当前的数据列表
  const data = mediator.getSendingHistorys();
  // 设置主键
  !isEditMode.value && (formData.value.id = generateRandomId());
  // 设置投递状态
  formData.value.process.status = computeProcessStatus(formData.value);
  // 追加或更新数据
  if (isEditMode && formData.value.id) {
    const idx = data.findIndex(v => v.id === formData.value.id);
    if (idx === -1) {
      data.push(formData.value);
    } else {
      data.splice(idx, 1, formData.value);
    }
  } else {
    data.push(formData.value);
  }
  // 更新数据
  mediator.updateSendingHistorys(data);
  // 提示信息
  ElMessage.success(isEditMode.value ? '修改成功' : '添加成功');
  formLoading.value = false;
  if (!myDialogRef.value) {
    console.error('获取对话框 MyDialog 实例失败！');
    return;
  }
  myDialogRef.value.close(true);
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.sh-add-dialog-wrap {
  .written-info-wrap, .interview-info-wrap {
    background-color: #f6f6f6;
    padding: 10px;
    width: 100%;
    border-radius: 5px;
  }
}
</style>