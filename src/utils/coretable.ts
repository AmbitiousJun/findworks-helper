// 将表格组件进一步封装成一个类，提供 API 给外部其他组件进行调用

import { DefineComponent } from 'vue';

class CoreTable {

  /**
   * 表格组件实例对象，由 App 组件对其进行初始化
   */
  private component: DefineComponent | undefined;

  /**
   * 获取表单中的数据
   */
  public getData(): CoreTableTypes.SendingHistoryItem[] {
    this.checkInit();
    return this.component!.getData();
  }

  /**
   * 设置数据到表格中
   * @param data 需要设置到表单中的数据，这些数据是临时性的，用户刷新浏览器之后会从缓存中重新读取
   */
  public setData(data: CoreTableTypes.SendingHistoryItem[]): void {
    if (!data) {
      return;
    }
    this.checkInit();
    this.component!.setData(data);
  }

  /**
   * 设置表格组件实例对象
   * @param cpn 表格组件实例对象
   */
  public setComponent(cpn?: DefineComponent): void {
    if (!cpn) {
      throw new Error('请确保传入有效的表格组件实例对象');
    } 
    this.component = cpn;
  }

  /**
   * 检查当前对象是否初始化了，没初始化就抛异常
   */
  public checkInit(): void {
    if (!this.component) {
      throw new Error('对象 CoreTable 未进行初始化！');
    }
  }
}

export default new CoreTable();