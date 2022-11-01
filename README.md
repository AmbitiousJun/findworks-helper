# Find Works Helper

**创作初衷：**找工作投简历的时候，如果投了很多家公司，管理投递记录以及统计相关数据会很不方便。于是！我就做了这个找工作辅助器，非常的银杏（其实用 Excel 管理一下就行了，但是我 **~~懒~~**（不会用 Excel））。

**主要功能：**简历投递记录的增删改查功能，表格筛选查询功能，统计功能以及 Excel 导入导出功能等。

**注意事项：**本项目是纯前端项目，没有登录，没有后台，更不能保存用户数据。表格中的记录全都是存放在本地浏览器缓存中，如果要清除浏览器缓存的话请慎重！

**阿巴阿巴：**如果觉得这个网站还可以，能帮到你的话，可以帮我点个小小的 Star 喔~，当然了，如果关于这个项目还有什么比较新奇的点子可以联系博主，联系方式请见[我的个人博客](https://blog.ambitiousjun.cn/)。

## 技术栈

前端：

- Vite 前端构建工具
- Vue 3 开发框架
- TypeScript
- ElementUI 组件库
- echarts 可视化图表生成工具
- js-xlsx 纯前端的 Excel 导入导出工具

后端：无

## 使用方法

1. 项目已经部署上线到了个人的云服务器，可以直接访问使用，地址：[https://fw.ambitiousjun.cn/](https://fw.ambitiousjun.cn/)

   > 小声 bb：三级域名选用 `fw`，一方面是 `Find Works` 的缩写，另一方面则是时刻提醒自己有多 “fw”，还没找到工作呢？

2. 通过本地运行

   ### 环境要求

   - node.js，直接去官网下载就行了，我的版本号是 14+

   - tsc，TypeScript 的编译器

     ```shell
     npm install -g typescript
     ```

   ### 步骤

   1. 拉取项目到本地

      ```shell
      git clone https://github.com/AmbitiousJun/findworks-helper.git
      ```

   2. 安装依赖

      ```shell
      cd ./findworks-helper
      npm install
      ```

   3. 运行

      ```shell
      npm run dev
      ```

## 功能展示

1. 添加投递记录

   ![image-20221101235555571](https://ambitious-bucket1-1305921962.cos.ap-guangzhou.myqcloud.com//imgsimage-20221101235555571.png)

2. 表单效果

   ![image-20221101235642195](https://ambitious-bucket1-1305921962.cos.ap-guangzhou.myqcloud.com//imgsimage-20221101235642195.png)

3. 搜索框和过滤器

   ![image-20221101235708272](https://ambitious-bucket1-1305921962.cos.ap-guangzhou.myqcloud.com//imgsimage-20221101235708272.png)

4. 数据统计

   ![image-20221101235733648](https://ambitious-bucket1-1305921962.cos.ap-guangzhou.myqcloud.com//imgsimage-20221101235733648.png)

5. 数据导出

   ![image-20221101235758279](https://ambitious-bucket1-1305921962.cos.ap-guangzhou.myqcloud.com//imgsimage-20221101235758279.png)

6. 数据导入

   ![image-20221101235825202](https://ambitious-bucket1-1305921962.cos.ap-guangzhou.myqcloud.com//imgsimage-20221101235825202.png)

   ![image-20221101235837176](https://ambitious-bucket1-1305921962.cos.ap-guangzhou.myqcloud.com//imgsimage-20221101235837176.png)

7. 记录详情

   ![image-20221101235956118](https://ambitious-bucket1-1305921962.cos.ap-guangzhou.myqcloud.com//imgsimage-20221101235956118.png)

   ![image-20221102000012819](https://ambitious-bucket1-1305921962.cos.ap-guangzhou.myqcloud.com//imgsimage-20221102000012819.png)

   
