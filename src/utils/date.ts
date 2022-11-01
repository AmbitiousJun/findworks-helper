// 时间相关工具模块

/**
 * 格式化日期
 * @param dat Date 类型对象
 * @returns 格式化后的结果 yyyy-MM-dd
 */
export const formatDate: (dat: Date) => string = dat => {
  //获取年月日，时间
  const year = dat.getFullYear();
  const mon = (dat.getMonth() + 1) < 10 ? "0" + (dat.getMonth()+1) : dat.getMonth() + 1;
  const date = dat.getDate() < 10 ? "0" + (dat.getDate()) : dat.getDate();
  const newDate = year + "-" + mon + "-" + date;
  return newDate;
}