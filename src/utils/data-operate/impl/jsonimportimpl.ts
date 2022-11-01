// 导入 JSON 数据的实现

import { DataImportImpl } from './dataimportimpl';
import { 
  initDefaultSendingHistoryItem, 
  initDefaultExamInfo,
  generateRandomId,
  computeProcessStatus
} from '../../entity';
import { ElMessage } from 'element-plus';

export class JsonImportImpl extends DataImportImpl<string> {

  public generateTemplate(): string | void {
    return JSON.stringify([initDefaultSendingHistoryItem()]); 
  }

  public resolveData(rawData: string): CoreTableTypes.SendingHistoryItem[] | null {
    // 1 判断 JSON 是否合法
    let data: CoreTableTypes.SendingHistoryItem[];
    try {
      data = JSON.parse(rawData);
    } catch(err) {
      ElMessage.error('不是合法的 JSON 数据');
      return null;
    }
    const localData: CoreTableTypes.SendingHistoryItem[] = [];
    data.forEach(v => {
      const row = initDefaultSendingHistoryItem();
      v.id && (row.id = v.id);
      v.remark && (row.remark = v.remark);
      if (v.offerStatus && ['未获得', '已获得', '已拒绝'].includes(v.offerStatus)) {
        row.offerStatus = v.offerStatus;
      }
      if (v.sendingDate && /^\d{4}-\d{2}-\d{2}$/.test(v.sendingDate)) {
        row.sendingDate = v.sendingDate;
      }
      if (v.company) {
        row.company.name = v.company.name || '';
        ['官网', '求职网站', '公众号'].includes(v.company.type) && (row.company.type = v.company.type);
        row.company.mpName = v.company.mpName || '';
        row.company.website = v.company.website || '';
        if (v.company.employmentSiteInfo) {
          row.company!.employmentSiteInfo!.name = v.company.employmentSiteInfo.name || '';
          row.company!.employmentSiteInfo!.link = v.company.employmentSiteInfo.link || '';
        }
      }
      if (v.process) {
        if (v.process.writtenExaminations instanceof Array) {
          v.process.writtenExaminations.forEach(vv => {
            const exam = initDefaultExamInfo();
            if (vv.date && /^\d{4}-\d{2}-\d{2}$/.test(vv.date)) {
              exam.date = vv.date;
            }
            exam.remark = vv.remark || '';
            if (vv.status && ['未开始', '通过', '未通过'].includes(vv.status)) {
              exam.status = vv.status;
            }
            row.process.writtenExaminations.push(exam);
          });
        }
        if (v.process.interviews instanceof Array) {
          v.process.interviews.forEach(vv => {
            const exam = initDefaultExamInfo();
            if (vv.date && /^\d{4}-\d{2}-\d{2}$/.test(vv.date)) {
              exam.date = vv.date;
            }
            exam.remark = vv.remark || '';
            if (vv.status && ['未开始', '通过', '未通过'].includes(vv.status)) {
              exam.status = vv.status;
            }
            row.process.interviews.push(exam);
          });
        }
      }
      row.id = generateRandomId();
      row.process.status = computeProcessStatus(row);
      localData.push(row);
    });
    return localData;
  }
}