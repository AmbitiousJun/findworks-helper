// 定义数据导出实现方法

export abstract class DataExportImpl {

  // 导出数据
  public abstract export(data: CoreTableTypes.SendingHistoryItem[], success: () => void): void;
}