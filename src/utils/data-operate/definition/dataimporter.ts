// 数据导入器

import { DataImportImpl } from '../impl/dataimportimpl';

export class DataImporter<T> {

  private importImpl: DataImportImpl<T>;

  constructor(impl: DataImportImpl<T>) {
    this.importImpl = impl;
  }

  /**
   * 生成数据导入模板
   */
  public generateTemplate(): string | void {
    return this.importImpl.generateTemplate();
  }

  /**
   * 解析从外部导入的数据，统一转换成系统识别的数据格式
   * @param data 需要进行解析的数据
   */
  public resolveData(data: T): CoreTableTypes.SendingHistoryItem[] | null {
    return this.importImpl.resolveData(data);
  }

  /**
   * 将已经识别好的数据添加到系统中
   * @param data 识别好的数据
   * @param success 数据添加成功之后的回调
   */
  public putData(data: CoreTableTypes.SendingHistoryItem[], success: () => void): void {
    this.importImpl.putData(data, success);
  }
}