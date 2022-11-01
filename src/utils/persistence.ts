// 专门处理表单数据与本地缓存中的 序列化、反序列化 

import { deepClone } from './clone';

class SendingHistorysMediator {

  /**
   * 存放所有的监听器
   */
  private listeners: { [propName: string]: (newData: CoreTableTypes.SendingHistoryItem[]) => void };

  /**
   * 存放在本地缓存中的 key
   */
  private sendingHistorysKey = 'sending-historys';

  constructor() {
    this.listeners = {};
  }

  // 从本地缓存中反序列化出数据
  public getSendingHistorys(): CoreTableTypes.SendingHistoryItem[] {
    const json = localStorage.getItem(this.sendingHistorysKey);
    if (!json) {
      return [];
    }
    // 复原出原始数据
    const originData = <CoreTableTypes.SendingHistoryItem[]>JSON.parse(json);
    // 排序
    this.sortData(originData);
    // 返回原始数据的克隆版本
    return <CoreTableTypes.SendingHistoryItem[]>deepClone(originData);
  }

  // 将数据按照业务进行排序
  private sortData(data: CoreTableTypes.SendingHistoryItem[]) {
    if (!data) {
      return;
    }
    data.sort((s1, s2) => {
      if (s1.offerStatus !== s2.offerStatus) {
        // 已获得 > 未获得 > 已拒绝
        const level = { '已获得': 1, '未获得': 2, '已拒绝': 3 };
        return level[s1.offerStatus] - level[s2.offerStatus];
      }
      if (s1.process.status !== s2.process.status) {
        // 进行中 > 已投递 > 已结束
        const level = { '进行中': 1, '已投递': 2, '已结束': 3 };
        return level[s1.process.status] - level[s2.process.status];
      }
      if (s1.company.type !== s2.company.type) {
        // 官网 > 公众号 > 求职网站
        const level = { '官网': 1, '公众号': 2, '求职网站': 3 };
        return level[s1.company.type] - level[s2.company.type];
      }
      if (s1.sendingDate !== s2.sendingDate) {
        // 晚投的排前面
        const d1 = new Date(s1.sendingDate).getTime();
        const d2 = new Date(s2.sendingDate).getTime();
        return d2 - d1;
      }
      // 其他情况下，升序排列
      return -1;
    })
  }
  
  // 序列化数据到本地缓存 
  public updateSendingHistorys(newData: CoreTableTypes.SendingHistoryItem[]) {
    if (!newData) {
      return;
    }
    // 将其转换为 JSON 字符串，存当本地缓存
    const json = JSON.stringify(newData);
    localStorage.setItem(this.sendingHistorysKey, json);
    // 传递最新数据
    this.sortData(newData);
    this.notifyAll(newData);
  }

  // 注册监听器，当数据发生变化时，通知监听者
  public addListener(
    name: string,
    callback: (newData: CoreTableTypes.SendingHistoryItem[]) => void
  ) {
    if (!name || name.trim() === '' || !callback || this.listeners[name]) {
      console.error('参数异常，监听器添加失败！');
      return;
    }
    this.listeners[name] = callback;
  }

  // 删除监听器
  public removeListener(name: string) {
    if (!name || !this.listeners[name]) {
      return;
    }
    delete this.listeners[name];
  }

  // 通知所有监听者，数据已发生改变，同时将数据传递给监听者
  private notifyAll(newData: CoreTableTypes.SendingHistoryItem[]) {
    for (const key in this.listeners) {
      const cb = this.listeners[key];
      cb && cb(<CoreTableTypes.SendingHistoryItem[]>deepClone(newData));
    }
  }
}

export default new SendingHistorysMediator();