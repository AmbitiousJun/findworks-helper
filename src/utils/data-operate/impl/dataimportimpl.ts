// 数据导入实现层

import mediator from '../../persistence';
import { ElMessageBox } from 'element-plus';

export abstract class DataImportImpl<T> {

  // 生成模板（字符串、文件）
  public abstract generateTemplate(): string | void;
  // 解析数据
  public abstract resolveData(rawData: T): CoreTableTypes.SendingHistoryItem[] | null;
  // 添加数据
  public putData(data: CoreTableTypes.SendingHistoryItem[], success: () => void): void {
    let oldData = mediator.getSendingHistorys();
    const save = () => {
      oldData = mediator.getSendingHistorys();
      oldData.push(...data);
      mediator.updateSendingHistorys(oldData);
      success && success();
    }
    if (oldData && oldData.length > 0) {
      ElMessageBox.confirm(
        '检测到网站中存在旧数据，是否清空？',
        '提示',
        {
          confirmButtonText: '清了吧',
          cancelButtonText: '先留着',
          type: 'info'
        }
      ).then(() => {
        mediator.updateSendingHistorys([]);
      }).catch(() => {}).finally(() => save());
    } else save();
  }
}
