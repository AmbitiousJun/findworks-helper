<template>
<div class="statistics-dialog-wrap">
  <my-dialog 
    :width="1050" 
    :height="600" 
    title="数据统计" 
    ref="myDialogRef"
  >
    <span style="display: flex; align-items: center; margin-bottom: 10px"><el-icon style="margin-right: 5px;color: red"><WarnTriangleFilled /></el-icon>注意：数据统计的数据源以当前表格中的实际数据为准，需要统计所有投递记录时，请先复原表格数据。</span>
    <!-- 投递时间分布柱状图 -->
    <el-carousel type="card" height="350px">
      <el-carousel-item v-for="item in swipers" :key="item">
        <div :class="['chart-item', `${item}-wrap`]">
          <div :id="item"></div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </my-dialog>
</div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';
import MyDialog from '@/components/framework/MyDialog.vue';
import coreTableHelper from '../../utils/coretable';
import { ref, DefineComponent } from 'vue';
import { deepClone } from '../../utils/clone';

// 对话框组件实例
const myDialogRef = ref<DefineComponent>();

// 图表的统一宽高
const chartSize = {
  width: 500,
  height: 400
};

// 轮播图
const swipers = ref<string[]>([
  'total-send',  // 总投递
  'reply-percent',  // 回复率 
  'written-exam-count',  // 笔试数
  'interviews-count', // 面试数
  'written-distribution',  // 笔试分布
  'interviews-distribution',  // 面试分布
  'sending-status-distribution',  // 投递状态分布
  'offer-status-distribution',  // Offer 状态分布
  'sending-type-distribution',  // 投递类型分布
  'sending-date-distribution',  // 投递时间分布
]);

// 使用当前表单中的实际数据进行统计
const data = ref<CoreTableTypes.SendingHistoryItem[]>();

// 渲染时间分布
const renderSendingDateDistribution = () => {
  if (!data.value) {
    return;
  }
  // 提取出所有计算的天数以及当天的投递数
  const dates: { x: string[], y: number[] } = { x: [], y: [] };
  // 将表格数据按照日期从小到大进行排序
  const arr = <CoreTableTypes.SendingHistoryItem[]>deepClone(data.value);
  arr.sort((o1, o2) => {
    const d1 = new Date(o1.sendingDate).getTime();
    const d2 = new Date(o2.sendingDate).getTime();
    return d1 - d2;
  });
  arr.forEach(v => {
    if (dates.x.length > 0 && v.sendingDate === dates.x[dates.x.length - 1]) {
      dates.y[dates.y.length - 1]++;
    } else {
      // 遇到新日期
      dates.x.push(v.sendingDate);
      dates.y.push(1);
    }
  })
  // 重新创建一个元素
  const dom = document.createElement('div');
  dom.id = 'sending-date-distribution';
  dom.style.width = `${chartSize.width}px`;
  dom.style.height = `${chartSize.height}px`;
  const parent = document.querySelector(`.statistics-dialog-wrap .sending-date-distribution-wrap`)!;
  parent.innerHTML = ''; 
  parent.appendChild(dom);
  const chart = echarts.init(dom);
  chart.setOption({
    title: {
      text: '投递日期分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: 'center',
      // right: '4%',
      // bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: dates.x,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '投递数',
        type: 'bar',
        barWidth: '60%',
        data: dates.y
      }
    ]
  });
}

// 渲染投递类型分布
const renderSendingTypeDistribution = () => {
  if (!data.value) {
    return;
  }
  // 计算 官网、求职网站、公众号 的个数
  let official = 0, jobSite = 0, mp = 0;
  data.value.forEach(v => {
    if (v.company.type === '官网') {
      official++;
    } else if (v.company.type === '求职网站') {
      jobSite++;
    } else {
      mp++;
    }
  });
  renderPie('sending-type-distribution', '投递类型分布', [
    { value: official, name: '官网' },
    { value: jobSite, name: '求职网站' },
    { value: mp, name: '公众号' }
  ]);
}

// 渲染 Offer 状态
const renderOfferStatusDistribution = () => {
  if (!data.value) {
    return;
  }
  // 计算 未获得、已获得、已拒绝 的个数
  let notObtain = 0, obtain = 0, refuse = 0;
  data.value.forEach(v => {
    if (v.offerStatus === '未获得') {
      notObtain++;
    } else if (v.offerStatus === '已获得') {
      obtain++;
    } else {
      refuse++;
    }
  });
  renderPie('offer-status-distribution', 'Offer 状态分布', [
    { value: notObtain, name: '未获得' },
    { value: obtain, name: '已获得' },
    { value: refuse, name: '已拒绝' }
  ]);
}

// 渲染投递状态分布
const renderSendingStatusDistribution = () => {
  if (!data.value) {
    return;
  }
  // 计算 已投递、进行中、已结束 的个数
  let sended = 0, ongoing = 0, end = 0;
  data.value.forEach(v => {
    if (v.process.status === '已投递') {
      sended++;
    } else if (v.process.status === '已结束') {
      end++;
    } else {
      ongoing++;
    }
  });
  renderPie('sending-status-distribution', '投递状态分布', [
    { value: sended, name: '已投递' },
    { value: ongoing, name: '进行中' },
    { value: end, name: '已结束' }
  ]);
}

// 渲染面试分布
const renderInterviewsDistribution = () => {
  if (!data.value) {
    return;
  }
  // 计算 未开始、通过、未通过的个数
  let noStart = 0, pass = 0, unPass = 0;
  data.value.forEach(v => {
    v.process.interviews.forEach(vv => {
      if (vv.status === '未开始') {
        noStart++;
      } else if (vv.status === '未通过') {
        unPass++;
      } else {
        pass++;
      }
    });
  });
  renderPie('interviews-distribution', '面试分布', [
    { value: noStart, name: '未开始' },
    { value: pass, name: '通过' },
    { value: unPass, name: '未通过' }
  ]);
}

// 渲染笔试分布
const renderWrittenDistribution = () => {
  if (!data.value) {
    return;
  }
  // 计算 未开始、通过、未通过的个数
  let noStart = 0, pass = 0, unPass = 0;
  data.value.forEach(v => {
    v.process.writtenExaminations.forEach(vv => {
      if (vv.status === '未开始') {
        noStart++;
      } else if (vv.status === '未通过') {
        unPass++;
      } else {
        pass++;
      }
    });
  });
  renderPie('written-distribution', '笔试分布', [
    { value: noStart, name: '未开始' },
    { value: pass, name: '通过' },
    { value: unPass, name: '未通过' }
  ]);
}

// 渲染面试数
const renderInterviewsCount = () => {
  if (!data.value) {
    return;
  }
  // 计算面试数，并随机生成一个上限值
  let count = 0;
  data.value.forEach(v => {
    count += v.process.interviews.length;
  })
  const limit = Math.random() * (count * 8 / 3) + (count * 4 / 3)
  renderGauge('interviews-count', count, '#ee6666', '', '面试数', Math.round(limit));
}

// 渲染笔试数
const renderWrittenExaminationCount = () => {
  if (!data.value) {
    return;
  }
  // 计算笔试数，并随机生成一个上限值
  let count = 0;
  data.value.forEach(v => {
    count += v.process.writtenExaminations.length;
  })
  const limit = Math.random() * (count * 8 / 3) + (count * 4 / 3)
  renderGauge('written-exam-count', count, '#fac858', '', '笔试数', Math.round(limit));
}

// 渲染投递回复率
const renderReplyPercent = () => {
  if (!data.value) {
    return;
  }
  // 计算回复率
  let replyPercent = 0;
  data.value.forEach(v => {
    if (v.process.status !== '已投递') {
      replyPercent++;
    }
  });
  renderGauge('reply-percent', (replyPercent * 100.0 / data.value.length | 0).toFixed(2), '#91cc75', '%', '回复率');
}

// 渲染总投递仪表盘
const renderTotalSend = () => {
  if (!data.value) {
    return;
  }
  // 计算总投递数，并随机生成一个上限值
  const totalSend = data.value.length;
  const limit = Math.random() * (totalSend * 8 / 3) + (totalSend * 4 / 3)
  renderGauge('total-send', totalSend, '#5470c6', '份', '总投递', Math.round(limit));
}

/**
 * 渲染仪表盘 
 * @param id dom 结点的 id
 * @param value 仪表盘中的数值
 * @param color 仪表盘颜色
 * @param suffix 数值单位（ %，份 等 ）
 * @param name 仪表盘名称 
 * @param max 数值上限 
 */
const renderGauge = (
  id: string,
  value: number | string,
  color: string,
  suffix: string,
  name: string,
  max: number = 100
) => {
  // 重新创建一个元素
  const dom = document.createElement('div');
  dom.id = id;
  dom.style.width = `${chartSize.width}px`;
  dom.style.height = `${chartSize.height}px`;
  const parent = document.querySelector(`.statistics-dialog-wrap .${id}-wrap`)!;
  parent.innerHTML = ''; 
  parent.appendChild(dom);
  const chart = echarts.init(dom);
  chart.setOption({
    color,
    tooltip: {
      formatter: `{b} : {c} ${suffix}`
    },
    series: [
      {
        name,
        type: 'gauge',
        max,
        progress: {
          show: true
        },
        detail: {
          valueAnimation: true,
          formatter: `{value} ${suffix}`
        },
        data: [
          {
            value,
            name
          }
        ]
      }
    ]
  });
}

/**
 * 渲染饼图
 * @param id 渲染的 DOM 的 id
 * @param name 饼图的名称
 * @param datas 饼图的数据
 */
const renderPie = (
  id: string,
  name: string,
  datas: { value: number; name: string }[]
) => {
  // 重新创建一个元素
  const dom = document.createElement('div');
  dom.id = id;
  dom.style.width = `${chartSize.width}px`;
  dom.style.height = `${chartSize.height}px`;
  const parent = document.querySelector(`.statistics-dialog-wrap .${id}-wrap`)!;
  parent.innerHTML = ''; 
  parent.appendChild(dom);
  const chart = echarts.init(dom);
  chart.setOption({
    title: {
      text: name,
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: '15%'
    },
    series: [
      {
        name,
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '30',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: datas
      }
    ]
  });
}

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
  setTimeout(() => {
    // 1 获取表单数据
    data.value = coreTableHelper.getData();
    // 2 渲染总投递仪表盘
    renderTotalSend();
    // 3 渲染投递回复率
    renderReplyPercent();
    // 4 渲染笔试数
    renderWrittenExaminationCount();
    // 5 渲染面试数
    renderInterviewsCount();
    // 6 渲染笔试分布
    renderWrittenDistribution();
    // 7 渲染面试分布
    renderInterviewsDistribution();
    // 8 渲染投递状态分布
    renderSendingStatusDistribution();
    // 9 渲染 Offer 状态分布
    renderOfferStatusDistribution();
    // 10 渲染投递类型分布
    renderSendingTypeDistribution();
    // 11 渲染投递日期分布图
    renderSendingDateDistribution();
  })
}

defineExpose({
  open,
  close
});
</script>

<style lang="scss" scoped>
.statistics-dialog-wrap {
  .chart-item {
    float: left;
  }
  .chart-item > div {
    width: 500px;
    height: 400px;
  }
}
</style>