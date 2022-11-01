<template>
<div class="core-table-wrap">
  <el-button 
    :icon="Delete"
    type="danger"
    style="margin-bottom: 10px;"
    @click="handleBatchDelete"
    :disabled="checkRows.length <= 0"
  >
    批量删除
  </el-button>
  <el-table 
    :data="tableData" 
    border
    style="width: 100%;"
    max-height="60vh"
    empty-text="快别当 fw 了，赶紧给我投起来！(=ﾟωﾟ)ﾉ"
    stripe
    v-loading="tableLoading"
    @row-click="handleShowRowDetail"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" align="center" />
    <!-- 公司名称 -->
    <el-table-column show-overflow-tooltip width="400" class-name="no-wrap" align="center" prop="company.name" label="公司名称" />
    <!-- 投递类型 -->
    <el-table-column show-overflow-tooltip align="center" label="投递类型" width="120">
      <template #default="scope">
        <!-- 官网类型 -->
        <template v-if="scope.row.company.type === '官网'">
          <el-link 
            type="primary" 
            v-if="scope.row.company.website"
            :href="scope.row.company.website"
            target="_blank"
          >
            官网
          </el-link> 
          <span v-else>官网</span>
        </template>
        <!-- 求职网站类型 -->
        <template v-if="scope.row.company.type === '求职网站'">
          <el-link 
            type="primary" 
            v-if="scope.row.company.employmentSiteInfo.name && scope.row.company.employmentSiteInfo.link"
            :href="scope.row.company.employmentSiteInfo.link"
            target="_black"
          >
            {{ '求职网站：' + scope.row.company.employmentSiteInfo.name }}
          </el-link> 
          <span v-else>求职网站</span>
        </template>
        <!-- 公众号类型 -->
        <template v-if="scope.row.company.type === '公众号'">
          <span>{{ scope.row.company.mpName ? '公众号：' + scope.row.company.mpName : '公众号' }}</span>
        </template>
      </template>
    </el-table-column>
    <!-- 投递时间 -->
    <el-table-column align="center" prop="sendingDate" label="投递时间" width="120" />
    <!-- 状态 -->
    <el-table-column align="center" label="状态" width="120">
      <template #default="scope">
        <el-tag 
          :type="typeMaps.processStatus[<'已投递' | '进行中' | '已结束'>scope.row.process.status]"
        >
          {{ scope.row.process.status }}
        </el-tag>
      </template>
    </el-table-column>
    <!-- Offer 状态 -->
    <el-table-column align="center" label="Offer 状态" width="120">
      <template #default="scope">
        <el-tag 
          :type="typeMaps.offerStatus[<'未获得' | '已获得' | '已拒绝'>scope.row.offerStatus]"
        >
          {{ scope.row.offerStatus }}
        </el-tag>
      </template>
    </el-table-column>
    <!-- 笔试 -->
    <el-table-column label="笔试" align="center">
      <!-- 笔试有多轮，使用 v-for 进行展示 -->
      <el-table-column 
        width="120" 
        :label="item" 
        v-for="(item, index) in writtenExamBrands"
        align="center"
      >
        <template #default="scope">
          <el-tag 
            v-if="scope.row.process.writtenExaminations[index]"
            :type="typeMaps.exam[<'未开始' | '未通过' | '通过'>scope.row.process.writtenExaminations[index].status]"
          >
            {{ scope.row.process.writtenExaminations[index].status }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table-column>
    <!-- 面试 -->
    <el-table-column label="面试" align="center">
      <!-- 面试有多轮，使用 v-for 进行展示 -->
      <el-table-column 
        width="120" 
        :label="item" 
        v-for="(item, index) in interviewBrands"
        align="center"
      >
        <template #default="scope">
          <el-tag 
            v-if="scope.row.process.interviews[index]"
            :type="typeMaps.exam[<'未开始' | '未通过' | '通过'>scope.row.process.interviews[index].status]"
          >
            {{ scope.row.process.interviews[index].status }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column min-width="120" fixed="right" label="操作" align="center">
      <template #default="scope">
        <el-button 
          link 
          type="primary" 
          size="small"
          @click="handleEditShItem(scope.row)"
          auto-insert-space
        >
          编辑
        </el-button>
        <el-button 
          link 
          type="danger" 
          size="small"
          @click="handleDeleteShItem(scope.row, scope.$index)"
          auto-insert-space
        >
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 编辑对话框 -->
  <sh-add-dialog ref="shAddDialogRef" />
  <!-- 详情对话框 -->
  <sh-detail-dialog ref="shDetailDialogRef" />
</div>
</template>

<script lang="ts" setup>
import mediator from '../utils/persistence';
import SearchHelper from '../utils/search';

import { ElMessageBox } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';
import { onMounted, ref, computed, DefineComponent } from 'vue';

import ShAddDialog from './dialog/ShAddDialog.vue';
import ShDetailDialog from './dialog/ShDetailDialog.vue';

// 表格数据
const tableData = ref<CoreTableTypes.SendingHistoryItem[]>();

// 编辑对话框组件实例
const shAddDialogRef = ref<DefineComponent>();

// 详情对话框实例
const shDetailDialogRef = ref<DefineComponent>();

// 表格加载
const tableLoading = ref<boolean>(false);

// 勾选中的行
const checkRows = ref<CoreTableTypes.SendingHistoryItem[]>([]);

// 统一处理数据和 el-tag 的类型之间的映射
const typeMaps: {
  processStatus: { '已投递': string; '进行中': string; '已结束': string; };
  offerStatus: { '未获得': string; '已获得': string; '已拒绝': string; };
  exam: { '未开始': string; '未通过': string; '通过': string; };
} = {
  processStatus: { '已投递': '', '进行中': 'warning', '已结束': 'danger' },
  offerStatus: { '未获得': 'danger', '已获得': 'success', '已拒绝': 'warning' },
  exam: { '未开始': '', '未通过': 'danger', '通过': 'success' },
}

// 计算所有数据中最多轮次的笔试
const writtenExamBrands = computed(() => {
  const data = tableData.value || [];
  let maxLength = 0;
  data.forEach(v => maxLength = Math.max(v.process.writtenExaminations.length, maxLength));
  const brands = [];
  for (let i = 1; i <= maxLength; i++) {
    brands.push(`第 ${i} 轮笔试`);
  }
  return brands
});

// 计算所有数据中最多轮次的面试
const interviewBrands = computed(() => {
  const data = tableData.value || [];
  let maxLength = 0;
  data.forEach(v => maxLength = Math.max(v.process.interviews.length, maxLength));
  const brands = [];
  for (let i = 1; i <= maxLength; i++) {
    brands.push(`第 ${i} 轮面试`);
  }
  return brands
});

// 显示表格行详情
const handleShowRowDetail = (row: CoreTableTypes.SendingHistoryItem, column: {[propName:string]: any}) => {
  if (!shDetailDialogRef.value) {
    console.error('获取对话框组件 ShDetailDialog 失败！');
    return;
  }
  if (column.label !== '操作') {
    shDetailDialogRef.value.open(row);  
  }
}

// 表格复选框勾选状态切换时触发
const handleSelectionChange = (rows?: CoreTableTypes.SendingHistoryItem[]) => {
  if (!rows) {
    return;
  }
  checkRows.value = rows;
}

/**
 * 编辑投递记录
 * @param row 一行数据
 */
const handleEditShItem = (
  row: CoreTableTypes.SendingHistoryItem
): void => {
  if (!row || !shAddDialogRef.value) {
    console.error('参数异常，无法进入编辑模式！');
    return;
  }
  shAddDialogRef.value.open(true, row);
}

// 删除表格中的一行或多行数据，同时刷新表格中的数据
const removeRowsAndRefresh = (ids: string[]) => {
  if (!ids || ids.length === 0) {
    return;
  }
  // 1 删除本地缓存中的数据
  const historys = mediator.getSendingHistorys();
  const newHistorys = historys.filter(history => history.id && !ids.includes(history.id));
  mediator.updateSendingHistorys(newHistorys);
  // 2 重新触发搜索，更新表格中的数据
  SearchHelper.search();
}

// 批量删除表格中选中的行
const handleBatchDelete = () => {
  // 将选中的记录的 id 提取出来
  const ids = checkRows.value.map(v => v.id);
  ElMessageBox.confirm(
    `确认删除这 ${ids.length} 条数据吗 ？（不可恢复）`,
    '提示',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '不删了',
      type: 'warning'
    }
  ).then(() => {
    removeRowsAndRefresh(<string[]>ids);
  }).catch(() => {})
}

/**
 * 删掉表格中的一行
 * @param row 一行数据
 * @param index 第几行（从 0 开始）
 */
const handleDeleteShItem = (
  row: CoreTableTypes.SendingHistoryItem,
  index: number
): void => {
  if (!row || index < 0 || index >= tableData.value!.length) {
    return;
  }
  // 1 弹框确认
  ElMessageBox.confirm(
    `确认删除公司【${row.company.name}】的投递记录吗？（不可恢复）`,
    '提示',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '不删了',
      type: 'warning'
    }
  ).then(() => {
    if (!tableData.value) {
      console.error('表单数据获取失败！');
      return;
    }
    removeRowsAndRefresh(<string[]>[tableData.value[index].id]);
  }).catch(() => {})
}

/**
 * 返回当前表格中的数据
 * 此函数为开放给外部组件调用
 */
const getData = (): CoreTableTypes.SendingHistoryItem[] => {
  return tableData.value || [];
}

/**
 * 设置临时性的数据到表格中
 * 此函数为开放给外部组件调用，以便操作表格数据
 * @param data 要设置的数据
 */
const setData = (data: CoreTableTypes.SendingHistoryItem[]): void => {
  if (!data) {
    console.error('无效的表格数据');
    return;
  }
  tableLoading.value = true;
  tableData.value = data;
  tableLoading.value = false;
}

// 加载缓存中的表单数据，并开启实时监听
const loadDataAndRegisterListener = () => {
  tableLoading.value = true;
  tableData.value = mediator.getSendingHistorys();
  tableLoading.value = false;

  mediator.addListener('coreTable', (newData) => {
    tableLoading.value = true;
    tableData.value = newData;
    tableLoading.value = false;
  });
}

onMounted(() => {
  loadDataAndRegisterListener();
});

defineExpose({
  setData,
  getData
});
</script>

<style lang="scss" scoped>
.core-table-wrap {
  width: 90%;
  margin: 20px auto;
  padding-bottom: 20px;
}
</style>

<style lang="scss">
.core-table-wrap {
  // 让文本不换行
  .no-wrap > .cell {
    white-space: nowrap;
  }
}
</style>