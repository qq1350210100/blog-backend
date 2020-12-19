## 技术博客

线上地址：[个人技术博客 http://8.129.105.196:3333/blog](http://8.129.105.196:3333/blog)

### 简介

该博客是一个较为完整的个人项目。
开发、搭建个人博客主要是为了熟悉 web 项目整体流程，了解各端项目分工，实践所学技术、知识。
而且网站搭建完成后，也能作为信息展示平台，用来记录个人所用所学、所见所闻、所感所想。一举多得。

当前进度：约 `75%`。

前端源码：[https://github.com/pb0710/blog-frontend](https://github.com/pb0710/blog-frontend)
后端源码：[https://github.com/pb0710/blog-backend](https://github.com/pb0710/blog-backend)

支持功能：

- 用户注册、登录 ✅
- 用户个人资料、配置项 编辑、同步 ✅
- markdown 文章展示、编辑、发布 ✅
- 用户详情页
- 关于页 ✅
- 适配移动端响应式 ✅
- 国际化 ✅
- 切换主题 ✅
- 搜索 ✅
- 文档入口 ✅
- 文章阅读数、点赞 ✅
- 文章评论 ✅
- 用户关注订阅

技术栈：

- nodejs
- koa、koa-router、koa-swagger-decorator、koa-session、koa-static、koa-aysnc-busboy
- 100% typescript 编写
- 连接 mysql

### 开发

node: 14^

本地运行调试

```shell
npm run dev
```

生产版本打包

```shell
npm run build
```

生产环境运行（使用了 pm2 维持常驻）

```shell
npm run server
```
