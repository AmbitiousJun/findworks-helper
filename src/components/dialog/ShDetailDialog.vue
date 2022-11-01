<template>
<div class="sh-detail-dialog-wrap">
  <my-dialog 
    :width="550" 
    :height="500" 
    title="详情" 
    ref="myDialogRef"
  >
    <!-- 公司名称 -->
    <div v-if="data.company.name" class="company-name-wrap">
      <h2 class="company-name">{{ data.company.name }}</h2>
    </div>
    <!-- 投递时间 -->
    <div v-if="data.sendingDate" class="sending-date-wrap">
      <el-icon><Calendar /></el-icon>
      <span style="margin-left: 8px">{{ data.sendingDate }}</span>
    </div>
    <!-- 投递类型 -->
    <div class="sending-type-wrap padding-card">
      <h3 class="label">通过 <span>{{ data.company.type }}</span> 投递</h3>
      <div v-if="data.company.type === '官网'" class="official-wrap">
        <div class="type-info" v-if="data.company.website">
          链接：
          <el-link 
            target="_blank" 
            :href="data.company.website" 
            type="primary"
          >
            {{ data.company.website }}
          </el-link>
        </div>
      </div>
      <div v-if="data.company.type === '求职网站'" class="employ-site-wrap">
        <div class="type-info" v-if="data.company.employmentSiteInfo!.name">
          网站名称：<el-tag effect="dark">{{ data.company.employmentSiteInfo!.name }}</el-tag>
        </div>
        <div class="type-info" v-if="data.company.employmentSiteInfo!.link">
          网站链接：
          <el-link 
            target="_blank" 
            :href="data.company.employmentSiteInfo!.link" 
            type="primary"
          >
            {{ data.company.employmentSiteInfo!.link }}
          </el-link>
        </div>
      </div>
      <div v-if="data.company.type === '公众号'" class="mp-wrap">
        <div class="type-info" v-if="data.company.mpName">
          公众号名称：<el-tag effect="dark">{{ data.company.mpName }}</el-tag>
        </div>
      </div>
    </div>
    <!-- 当前进行状态 -->
    <div class="process-status-wrap base-status-wrap padding-card">
      <h3 class="label">当前进度</h3>
      <div class="process-status base-status">
        <div :style="{ backgroundColor: colorMap.processStatus[data.process.status] }" class="indicator"></div>
        <div class="status">{{ data.process.status }}</div>
      </div>
    </div>
    <!-- Offer -->
    <div class="offer-status-wrap base-status-wrap padding-card">
      <h3 class="label">Offer</h3>
      <div class="offer-status base-status">
        <div :style="{ backgroundColor: colorMap.offerStatus[data.offerStatus] }" class="indicator"></div>
        <div class="status">{{ data.offerStatus }}</div>
      </div>
    </div>
    <!-- 笔试信息 -->
    <div v-if="data.process.writtenExaminations.length > 0" class="written-exam-wrap padding-card">
      <h3 class="label">笔试信息</h3>
      <el-timeline style="margin-top: 20px;">
        <el-timeline-item 
          v-for="(item, index) in data.process.writtenExaminations"
          :timestamp="item.date || '未指定'"
          :color="colorMap.exam[item.status || '未开始']"
          placement="top"
        >
          <el-card shadow="hover">
            <h4 style="margin-bottom: 8px;">
              第 {{ index + 1 }} 轮笔试
              <el-tag 
                :color="colorMap.exam[item.status || '未开始']" 
                :type="typeMap.exam[item.status || '未开始']" 
                effect="dark"
              >
                {{ item.status }}
              </el-tag>
            </h4>
            <p v-if="item.remark">{{ item.remark }}</p>
            <p v-else style="color: #909399">无备注信息</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
    <!-- 面试信息 -->
    <div v-if="data.process.interviews.length > 0" class="interviews-wrap padding-card">
      <h3 class="label">面试信息</h3>
      <el-timeline style="margin-top: 20px;">
        <el-timeline-item 
          v-for="(item, index) in data.process.interviews"
          :timestamp="item.date || '未指定'"
          :color="colorMap.exam[item.status || '未开始']"
          placement="top"
        >
          <el-card shadow="hover">
            <h4 style="margin-bottom: 8px;">
              第 {{ index + 1 }} 轮面试
              <el-tag 
                :color="colorMap.exam[item.status || '未开始']" 
                :type="typeMap.exam[item.status || '未开始']"
                effect="dark"
              >
                {{ item.status }}
              </el-tag>
            </h4>
            <p v-if="item.remark">{{ item.remark }}</p>
            <p v-else style="color: #909399">无备注信息</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
    <!-- 备注信息 -->
    <div v-if="data.remark" class="remark-wrap padding-card">
      <h3 class="label">备注</h3>
      <div style="margin-top: 10px;">{{ data.remark }}</div>
    </div>
  </my-dialog>
</div>
</template>

<script lang="ts" setup>
import MyDialog from '@/components/framework/MyDialog.vue';
import { computed, DefineComponent, ref } from 'vue';
import { Calendar } from '@element-plus/icons-vue';
import { initDefaultSendingHistoryItem } from '../../utils/entity';

// 对话框组件实例
const myDialogRef = ref<DefineComponent>();

// 要展示详情的数据
const data = ref<CoreTableTypes.SendingHistoryItem>(initDefaultSendingHistoryItem());

const colorMap = ref<{[propName:string]:any}>({
  processStatus: { '已投递': '#409eff', '进行中': '#e6a23c', '已结束': '#f56c6c' },
  offerStatus: { '未获得': '#f56c6c', '已获得': '#67c23a', '已拒绝': '#e6a23c' },
  exam: { '未开始': '#409eff', '通过': '#67c23a', '未通过': '#f56c6c' }
});

const typeMap = ref<{[propName:string]:any}>({
  exam: { '未开始': 'primary', '通过': 'success', '未通过': 'danger' }
});

// 打开对话框
const open = (item: CoreTableTypes.SendingHistoryItem) => {
  if (!myDialogRef.value) {
    console.error('打开对话框组件 MyDialog 失败！');
    return;
  }
  data.value = item;
  myDialogRef.value.open();
}

const close = () => {
  if (!myDialogRef.value) {
    console.error('打开对话框组件 MyDialog 失败！');
    return;
  }
  myDialogRef.value.close();
}

defineExpose({
  open,
  close
});
</script>

<style lang="scss" scoped>
.sh-detail-dialog-wrap {
  color: #303133;
  .sending-date-wrap {
    color: #909399;
    font-size: 12px;
    display: flex;
    align-items: center;
    margin-top: 10px;
  }
  .padding-card {
    background-color: #f6f6f6;
    border-radius: 10px;
    padding: 10px;
    margin-top: 10px;
    .label {
      span {
        color: #409eff;
      }
    }
    .type-info {
      margin-top: 10px;
    }
  }
  .base-status-wrap {
    display: flex;
    justify-content: space-between;
    .base-status {
      display: flex;
      align-items: center;
      font-size: 15px;
      .indicator {
        width: 8px;
        height: 8px;
        background-color: #303133;
        border-radius: 50%;
        margin-right: 8px;
        transform: translateY(25%);
      }
    }
  }
}
</style>