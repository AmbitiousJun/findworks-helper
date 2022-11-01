// 拷贝数据相关模块

export const deepClone = (obj: { [propName: string]: any }) => {
  if (!obj) {
    return;
  }
  const copyObj = obj instanceof Array ? [] : <{ [propName: string]: any }>{}; 
  for (const key in obj) {
    const value = obj[key];
    if (typeof value !== 'object') {
      // 基本类型
      copyObj[key] = value;
    } else {
      if (value instanceof Date) {
        copyObj[key] = new Date(value);
      } else {
        copyObj[key] = deepClone(value);
      }
    }
  }
  return copyObj;
}