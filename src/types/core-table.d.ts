// 表单中的数据类型
declare namespace CoreTableTypes {

  // 投递记录项
  interface SendingHistoryItem {
    // 公司信息
    company?: Company;
    // 应聘进度
    process?: Process;
    // Offer 状态（未获得，已获得，已拒绝）
    offerStatus?: string;
  }

  // 投递了哪一家公司
  interface Company {
    // 公司名称
    name?: string;
    // 投递类型（官网、求职网站、公众号等）
    type?: string;
    // 公司官网连接（只有当投递类型为 官网 时，这一属性才生效）
    website?: string;
    // 求职网站信息（只有当投递类型为 求职网站 时，这一属性才生效）
    employmentSiteInfo?: { 
      // 网站名称
      name: string; 
      // 网站连接
      link: string;
    };
    // 公众号名称（只有当投递类型为 公众号 时，这一属性才生效）
    mpName?: string;
  }

  // 求职进程记录
  interface Process {
    // 状态（已投递，进行中，已结束）
    status?: string;
    // 笔试记录（有的公司可能不止一轮笔试，所以这里设置成数组）
    writtenExaminations?: WrittenExamination[];
    // 面试记录（有的公司可能不止一轮面试，所以这里设置成数组）
    interviews?: Interview[];
  }

  // 笔试或者面试的基础信息
  interface BaseExamInfo {
    // 状态（未开始，通过，未通过）
    status?: string;
    // 进行日期（yyyy-MM-dd）
    date?: string;
    // 备注
    remark?: string;
  }

  // 面试信息
  interface Interview extends BaseExamInfo {
  }

  // 笔试信息
  interface WrittenExamination extends BaseExamInfo {
  }
}