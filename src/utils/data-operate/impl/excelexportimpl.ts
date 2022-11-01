// Excel 数据导出实现

import { DataExportImpl } from './dataexportimpl';
import * as XLSX from 'xlsx';
import { openDownloadDialog, sheet2Blob } from '../../excel';

export class ExcelExportImpl extends DataExportImpl {

  /**
   * 将表格数据转换成二维矩阵
   * @param data 需要操作的数据
   */
  private generateMatrix(data: CoreTableTypes.SendingHistoryItem[]): unknown[][] {
    if (!data) {
      return [];
    }
    // 1 分别计算笔试、面试的最多场数
    let writtenNums = 0, interviewNums = 0;
    data.forEach(item => {
      writtenNums = Math.max(writtenNums, item.process.writtenExaminations.length);
      interviewNums = Math.max(interviewNums, item.process.interviews.length);
    })
    const res = new Array();
    // 2 设置表头
    const head: string[] = ['公司名称', '投递类型', '投递时间', '状态', 'Offer 状态'];
    for (let i = 1; i <= writtenNums; ++i) {
      head.push(`第 ${i} 轮笔试`);
    }
    for (let i = 1; i <= interviewNums; ++i) {
      head.push(`第 ${i} 轮面试`);
    }
    res.push(head);
    // 3 填充数据
    data.forEach(v => {
      const row: string[] = [
        v.company.name || '',
        v.company.type,
        v.sendingDate,
        v.process.status,
        v.offerStatus 
      ];
      v.process.writtenExaminations.forEach(vv => {
        row.push(vv.status || '');
      });
      row.push(...new Array(writtenNums - v.process.writtenExaminations.length).fill(''));
      v.process.interviews.forEach(vv => {
        row.push(vv.status || '');
      });
      row.push(...new Array(interviewNums - v.process.interviews.length).fill(''));
      res.push(row);
    });
    return res;
  }

  public export(data: CoreTableTypes.SendingHistoryItem[], success: () => void): void {
    // 构造 Excel 二维数组
    const matrix = this.generateMatrix(data);
    // 创建 Sheet 表
    const sheet = XLSX.utils.aoa_to_sheet(matrix);
    // 导出文件
    openDownloadDialog(sheet2Blob(sheet), '投递记录.xlsx');
    success && success();
  }
}