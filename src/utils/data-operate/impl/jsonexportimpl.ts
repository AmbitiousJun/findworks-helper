// JSON 数据导出实现

import { DataExportImpl } from './dataexportimpl';

export class JsonExportImpl extends DataExportImpl {

  public export(data: CoreTableTypes.SendingHistoryItem[], success: () => void): void {
    const json = JSON.stringify(data);
    navigator.clipboard.writeText(json);
    success && success();
  }
}