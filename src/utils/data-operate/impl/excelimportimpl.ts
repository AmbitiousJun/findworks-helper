// 导入 Excel 数据的实现

import { DataImportImpl } from './dataimportimpl';

import * as XLSX from 'xlsx';
import { openDownloadDialog, sheet2Blob } from '../../excel';
import { ElMessage } from 'element-plus';
import { 
  initDefaultSendingHistoryItem,
  initDefaultExamInfo,
  generateRandomId,
  computeProcessStatus
} from '../../entity';

export class ExcelImportImpl extends DataImportImpl<XLSX.WorkBook> {
  
  public generateTemplate(): string | void {
    const matrix = [
      ['公司名称', '投递类型', '投递时间', 'Offer 状态', '第 1 轮笔试', '第 1 轮面试'], 
      [
        '投了哪个公司，正常填即可',
        '官网|求职网站|公众号，填其他的默认是官网', 
        '格式: yyyy-MM-dd，单元格类型必须是\"文本\"',
        '未获得|已获得|已拒绝，填其他的默认是未获得',
        '未开始|通过|未通过，支持自定义笔试轮次，按照【第 i 轮笔试】的格式继续扩充列即可',
        '未开始|通过|未通过，支持自定义面试轮次，按照【第 i 轮面试】的格式继续扩充列即可'
      ]
    ];
    const sheet = XLSX.utils.aoa_to_sheet(matrix);
    openDownloadDialog(sheet2Blob(sheet), '模板.xlsx');
  }

  // 用户上传的文件不合法
  private throwUnvalidFileError() {
    ElMessage.error('文件不合法，请检查格式后重新上传');
    return null;
  }

  public resolveData(rawData: XLSX.WorkBook): CoreTableTypes.SendingHistoryItem[] | null {
    const sheetNames = rawData.SheetNames;
    if (sheetNames.length !== 1) {
      return this.throwUnvalidFileError();
    }
    // 将表格转换为对象数组
    const sheet = rawData.Sheets[sheetNames[0]];
    const items = XLSX.utils.sheet_to_json(sheet);
    // 校验数据
    const validPlainColumns = ['Offer 状态', '公司名称', '投递时间', '投递类型', '状态'];
    const validWrittenColumn = /第 \d+ 轮笔试/;
    const validInterviewColumn = /第 \d+ 轮面试/;
    // 分别统计笔试和面试的最多轮次
    let writtenNums = 0, interviewNums = 0;
    for (let i = 0; i < items.length; ++i) {
      let tmpWritten = 0, tmpInterview = 0;
      if (typeof items[i] !== 'object') {
        return this.throwUnvalidFileError();
      }
      for (const key in <object>items[i]) {
        if (validPlainColumns.includes(key)) {
          continue;
        }
        if (validWrittenColumn.test(key)) {
          tmpWritten++;
          if (key !== `第 ${tmpWritten} 轮笔试`) {
            return this.throwUnvalidFileError();
          }
          continue;
        }
        if (validInterviewColumn.test(key)) {
          tmpInterview++;
          if (key !== `第 ${tmpInterview} 轮面试`) {
            return this.throwUnvalidFileError();
          }
          continue;
        }
        return this.throwUnvalidFileError();
      }
      writtenNums = Math.max(writtenNums, tmpWritten);
      interviewNums = Math.max(interviewNums, tmpInterview);
    }
    // 复原数据
    const data: CoreTableTypes.SendingHistoryItem[] = [];
    (<{[propName: string]:any}[]>items).forEach(item => {
      const row = initDefaultSendingHistoryItem();
      item['公司名称'] && (row.company.name = item['公司名称']);
      if (item['Offer 状态'] && ['已获得', '未获得', '已拒绝'].includes(item['Offer 状态'])) {
        row.offerStatus = item['Offer 状态'];
      }
      if (item['投递时间'] && /^\d{4}-\d{2}-\d{2}$/.test(item['投递时间'])) {
        row.sendingDate = item['投递时间']
      }
      if (item['投递类型'] && ['官网', '求职网站', '公众号'].includes(item['投递类型'])) {
        row.company.type = item['投递类型']
      }
      for (let i = 1; i <= writtenNums; ++i) {
        if (!item[`第 ${i} 轮笔试`]) {
          break;
        }
        const writtenExam = initDefaultExamInfo();
        writtenExam.status = item[`第 ${i} 轮笔试`];
        row.process.writtenExaminations.push(writtenExam);
      }
      for (let i = 1; i <= interviewNums; ++i) {
        if (!item[`第 ${i} 轮面试`]) {
          break;
        }
        const interview = initDefaultExamInfo();
        interview.status = item[`第 ${i} 轮面试`];
        row.process.interviews.push(interview);
      }
      row.id = generateRandomId();
      row.process.status = computeProcessStatus(row);
      data.push(row);
    });
    return data;
  }
}