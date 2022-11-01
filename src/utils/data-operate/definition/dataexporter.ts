// 数据导出器

import { DataExportImpl } from '../impl/dataexportimpl';

export class DataExporter {

  private exporter: DataExportImpl;

  constructor(exporter: DataExportImpl) {
    this.exporter = exporter;
  }

  /**
   * 导出数据
   * @param data 需要导出的数据
   */
  public export(data: CoreTableTypes.SendingHistoryItem[], success: () => void): void {
    this.exporter.export(data, success);
  }
}