// 表格数据实体相关工具模块

import { formatDate } from './date';

/**
 * 计算应聘流程的状态
 * @param sh 要计算的应聘信息对象
 * @returns 计算出来的应聘结果
 */
export const computeProcessStatus = (sh: CoreTableTypes.SendingHistoryItem): ('已投递' | '进行中' | '已结束') => {
  if (!sh) {
    return '已投递';
  }
  // 1 拿到 offer 了就标记为结束
  if (['已获得', '已拒绝'].includes(sh.offerStatus)) {
    return '已结束'; 
  }
  // 2 如果笔试或面试过程中有不通过的，也标记为结束
  const wes = sh.process.writtenExaminations;
  if (wes) {
    for (let i = 0; i < wes.length; i++) {
      if (wes[i].status === '未通过') {
        return '已结束';
      }
    }
  }
  const itvs = sh.process.interviews;
  if (itvs) {
    for (let i = 0; i < itvs.length; i++) {
      if (itvs[i].status === '未通过') {
        return '已结束';
      }
    }
  }
  // 如果存在笔试或面试的记录，那么当前就是进行中
  if ((wes && wes.length > 0) || (itvs && itvs.length > 0)) {
    return '进行中';
  }
  // 以上条件都不满足，就是还没有被回复
  return '已投递';
}

/**
 * 生成一个全局唯一的 uuid
 * @param len id 长度
 * @param radix 基数，及 id 中可出现的字符种类数
 */
export const generateRandomId = (len: number = 16, radix: number = 16) => {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  let uuid = [], i;
  radix = radix || chars.length;
 
  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
  } else {
    // rfc4122, version 4 form
    let r;
 
    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '';
    uuid[14] = '4';
 
    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random()*16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}

// 初始化一个空的投递记录对象
export const initDefaultSendingHistoryItem: (
  () => CoreTableTypes.SendingHistoryItem
) = () => {
  return {
    id: '',
    remark: '',
    company: {
      name: '',
      type: '官网',
      website: '',
      employmentSiteInfo: {
        name: '',
        link: ''
      },
      mpName: ''
    },
    process: {
      status: '已投递',
      writtenExaminations: [],
      interviews: []
    },
    offerStatus: '未获得',
    sendingDate: formatDate(new Date())
  };
}

/**
 * 生成一个默认的测验信息
 */
export const initDefaultExamInfo: (
  () => CoreTableTypes.BaseExamInfo
) = () => {
  return {
    status: '未开始',
    date: '',
    remark: ''
  }
}

// 投递类型可选项
export const SendingTypeSelections: [
  { label: string; value: string; },
  { label: string; value: string; },
  { label: string; value: string; },
] = [
  { label: '官网', value: '官网' },
  { label: '求职网站', value: '求职网站' },
  { label: '公众号', value: '公众号' },
]

// 笔 / 面 试状态可选项
export const ExamStatusSelections: [
  { label: string; value: string; },
  { label: string; value: string; },
  { label: string; value: string; },
] = [
  { label: '未开始', value: '未开始' },
  { label: '通过', value: '通过' },
  { label: '未通过', value: '未通过' },
]