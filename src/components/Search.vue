<template>
<div class="search-wrap">
  <!-- 搜索框 -->
  <div class="input-wrap">
    <el-input 
      size="large"
      placeholder="随便搜！" 
      @keyup.enter.native="handleSearch"
      clearable
      v-model="searchContent" 
    />
    <el-button 
      type="primary"
      style="margin-left: 20px;"
      @click="handleSearch"
      size="large"
      :icon="Search" 
    />
  </div>
  <!-- 过滤复选框 -->
  <div class="column-filters-wrap">
    <!-- 投递类型 -->
    <div class="sending-type-wrap flex-block">
      <div class="label">投递类型</div>
      <el-checkbox-group v-model="columnFilters.sendingType" size="small">
        <el-checkbox-button
          v-for="(item, index) in ['官网', '求职网站', '公众号']"
          :key="index"
          :label="item"
        >
          {{ item }}
        </el-checkbox-button>
      </el-checkbox-group>
    </div>
    <!-- 投递时间 -->
    <div class="sending-date-wrap flex-block">
      <div class="label">投递时间</div>
      <el-radio-group size="small" v-model="columnFilters.sendingDate">
        <el-radio-button 
          v-for="(item, index) in ['全部', '一天内', '一周内', '一月内', '半年内', '一年内']"
          :key="index"
          :label="item" 
        />
      </el-radio-group>
    </div>
    <!-- 投递状态 -->
    <div class="sending-status-wrap flex-block">
      <div class="label">投递状态</div>
      <el-checkbox-group v-model="columnFilters.sendingStatus" size="small">
        <el-checkbox-button
          v-for="(item, index) in ['已投递', '进行中', '已结束']"
          :key="index"
          :label="item"
        >
          {{ item }}
        </el-checkbox-button>
      </el-checkbox-group>
    </div>
    <!-- Offer 状态 -->
    <div class="offer-status-wrap flex-block">
      <div class="label">Offer 状态</div>
      <el-checkbox-group v-model="columnFilters.offerStatus" size="small">
        <el-checkbox-button
          v-for="(item, index) in ['未获得', '已获得', '已拒绝']"
          :key="index"
          :label="item"
        >
          {{ item }}
        </el-checkbox-button>
      </el-checkbox-group>
    </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import mediator from '../utils/persistence';
import coreTableHelper from '../utils/coretable';

import { ref, watch } from 'vue';
import { Search } from '@element-plus/icons-vue';

// 搜索内容
const searchContent = ref<string>('');

// 复选框过滤
const columnFilters = ref<{
  sendingType: ('官网' | '求职网站' | '公众号')[],
  sendingDate: '全部' | '一天内' | '一月内' | '一周内' | '半年内' | '一年内',
  sendingStatus: ('已投递' | '进行中' | '已结束')[],
  offerStatus: ('未获得' | '已获得' | '已拒绝')[],
}>({
  sendingType: ['官网', '求职网站', '公众号'],
  sendingDate: '全部',
  sendingStatus: ['已投递', '进行中', '已结束'],
  offerStatus: ['未获得', '已获得', '已拒绝'],
});

// 只要列过滤条件发生改变，就重新查询
watch(columnFilters.value, () => handleSearch());

// 触发搜索
const handleSearch = () => {
  // 1 处理用户输入的内容
  searchContent.value = searchContent.value.trim();
  // 2 获取系统中的数据
  let data = mediator.getSendingHistorys();
  // 3 根据搜索关键词进行过滤
  data = keywordFilter(searchContent.value, data);
  // 4 根据列进行过滤
  data = columnFilter(data);
  // 5 将数据更新到表格中
  coreTableHelper.setData(data);
}

/**
 * 将数据按照列进行过滤
 * @param dataArr 需要进行过滤的数组
 */
const columnFilter = (
  dataArr: CoreTableTypes.SendingHistoryItem[]
): CoreTableTypes.SendingHistoryItem[] => {
  const columns = columnFilters.value;
  // 1 过滤投递类型
  dataArr = dataArr.filter(v => columns.sendingType.findIndex(vv => vv === v.company.type) !== -1);
  // 2 过滤投递时间
  const days = { '全部': 1e9 + 7, '一天内': 1, '一月内': 30, '一周内': 7, '半年内': 180, '一年内': 365 };
  const today = new Date().getTime();
  dataArr = dataArr.filter(v => {
    const target = new Date(v.sendingDate).getTime();
    let sub = today - target;
    if (sub < 0) {
      return false;
    }
    sub = sub / 1000 / 60 / 60 / 24;
    return sub <= days[columns.sendingDate];
  });
  // 3 过滤投递状态
  dataArr = dataArr.filter(v => columns.sendingStatus.findIndex(vv => vv === v.process.status) !== -1);
  // 4 过滤 Offer 状态
  dataArr = dataArr.filter(v => columns.offerStatus.findIndex(vv => vv === v.offerStatus) !== -1);
  return dataArr;
}

/**
 * 将数据按照关键词进行过滤
 * @param keyword 需要进行过滤的关键词
 * @param dataArr 需要进行过滤的数组
 */
const keywordFilter = (
  keyword: string,
  dataArr: CoreTableTypes.SendingHistoryItem[]
): CoreTableTypes.SendingHistoryItem[] => {
  // 1 如果关键词为空，就默认搜全部
  if (!keyword) {
    return dataArr;
  }
  // 2 过滤数组
  return dataArr.filter(v => {
    // 直接将当前数据转成字符串
    const json = JSON.stringify(v);
    // 在字符串中的找得到关键字就保留
    return json.indexOf(keyword) !== -1;
  })
}

defineExpose({
  handleSearch
});
</script>

<style lang="scss" scoped>
.search-wrap {
  width: 90%;
  margin: 20px auto 10px;
  .input-wrap {
    display: flex;
  }
  .column-filters-wrap {
    background-color: #f4f4f5;
    padding: 10px;
    border-radius: 5px;
    margin-top: 20px;
    display: inline-block;
    width: 100%;
    .label {
      margin-right: 20px;
      font-size: 12px;
      color: #303133;
    }
    .flex-block {
      float: left;
      display: flex;
      margin: 10px;
      align-items: center;
    }
  }
}
</style>