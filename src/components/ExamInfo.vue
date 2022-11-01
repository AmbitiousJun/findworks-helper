<template>
<div class="exam-info-wrap">
  <!-- 展示模式 -->
  <div v-if="!isEdit" class="view-wrap">
    <div class="info">
      <!-- 当前测验状态 -->
      <div class="status">状态：{{ info.status }}</div>
      <!-- 测验的日期 -->
      <div class="date">日期：{{ beautifyExamDate(info.date) }}</div>
    </div>
    <div class="oper-btn">
      <el-button 
        link 
        size="small"
        auto-insert-space
        @click="openEditMode"
        type="primary"
      >
        编辑
      </el-button>
      <el-button 
        link 
        size="small"
        auto-insert-space
        type="danger"
        @click="handleDeleteCurrent"
      >
        删除
      </el-button>
    </div>
  </div>
  <!-- 编辑模式 -->
  <div v-else class="edit-wrap">
    <el-form :model="backupModel" labelWidth="100">
      <!-- 测验状态 -->
      <el-form-item label="状态">
        <el-select size="small" v-model="backupModel!.status" placeholder="- 测验状态 -">
          <el-option
            v-for="item in ExamStatusSelections"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 测验开始时间 -->
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="backupModel!.date"
          style="width: 100%;"
          size="small"
          type="date"
          placeholder="测验开始时间"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <!-- 备注 -->
      <el-form-item label="备注">
        <el-input
          v-model="backupModel!.remark"
          :rows="3"
          size="small"
          resize="none"
          type="textarea"
          placeholder="备注信息"
        />
      </el-form-item>
      <el-form-item style="margin-top: 10px">
        <el-button 
          size="small" 
          type="primary"
          plain
          @click="handleExportNewInfo"
          auto-insert-space
        >
          保存
        </el-button>
        <el-button 
          size="small" 
          type="warning"
          plain
          @click="isEdit = false"
          auto-insert-space
        >
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script lang="ts" setup>
import { defineProps, ref, computed } from 'vue';
import { 
  ExamStatusSelections,
  initDefaultExamInfo
} from '../utils/entity';

// 事件
const emits = defineEmits(['delete', 'update']);

// 需要从外面接收的属性
const props = defineProps<{
  info: CoreTableTypes.BaseExamInfo
}>();

// 备份的 info 用于修改
const backupModel = ref<CoreTableTypes.BaseExamInfo>();

// 当前是否是编辑模式
const isEdit = ref<boolean>(false);

// 转换日期，更加友好地展示
const beautifyExamDate = computed(() => {
  return (date?: string) => {
    if (date === null || date === undefined || date.trim() === '') {
      return '暂无';
    }
    return date;
  }
});

// 删除当前测验信息
const handleDeleteCurrent = () => {
  emits('delete');
}

// 导出新数据
const handleExportNewInfo = () => {
  emits('update', backupModel.value);
  isEdit.value = false;
}

// 打开编辑模式
const openEditMode = () => {
  // 1 拷贝数据
  const origin = props.info;
  if (!origin) {
    backupModel.value = initDefaultExamInfo();
  } else {
    backupModel.value = JSON.parse(JSON.stringify(origin));
  }
  // 2 打开编辑模式
  isEdit.value = true;
}

</script>

<style lang="scss" scoped>
.exam-info-wrap {
  color: #606266;
  border-left: 2px solid #409eff;
  padding-left: 10px;
  margin-bottom: 10px;;
  .view-wrap {
    display: flex;
    justify-content: space-between;
    .info {
      display: flex;
      .date {
        margin-left: 10px;
      }
    }
  }
}
</style>

<style lang="scss">
.exam-info-wrap {
  .el-form-item__label {
    font-size: 12px;
  }
}
</style>