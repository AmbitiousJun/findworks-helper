// 将搜索组件进一步封装成类，暴露 API

import { DefineComponent } from 'vue';

class Search {

  /**
   * 组件实例对象
   */
  private component: DefineComponent | undefined;

  // 设置组件到类中
  public setComponent(cpn?: DefineComponent): void {
    this.component = cpn;
  }

  // 检查当前对象是否已经初始化完成
  public checkInit(): void {
    if (!this.component) {
      throw new Error('对象未初始化！');
    }
  }

  // 触发组件的搜索功能
  public search(): void {
    this.checkInit();
    this.component!.handleSearch();
  }
}

export default new Search();