# WeChat Reminder 提醒助手

通用日程提醒系统，支持多种提醒模式（生日、会议、上课、日程、自定义），通过企业微信定时推送提醒消息。

## 功能特性

- 🎂 **生日提醒** - 支持农历日期，每年自动重复
- 📅 **会议提醒** - 设置时间地点
- 📚 **上课提醒** - 每周重复
- 📝 **日程提醒** - 通用日程管理
- 🔔 **自定义提醒** - 完全自定义
- 📋 **批量导入** - 文本格式批量添加

## 技术栈

- **后端**: NestJS + TypeScript + Prisma + PostgreSQL
- **前端**: Vue 3 + TypeScript + Vite
- **推送**: 企业微信应用消息

## 快速开始

### 1. 安装依赖

```bash
# 后端
cd backend
npm install

# 前端
cd ../frontend
npm install
```

### 2. 配置环境变量

```bash
cd backend
cp .env.example .env
# 编辑 .env 填入你的配置
```

### 3. 初始化数据库

```bash
cd backend
npx prisma generate
npx prisma db push
```

### 4. 启动开发服务

```bash
# 后端 (端口 3000)
cd backend
npm run start:dev

# 前端 (端口 5173)
cd frontend
npm run dev
```

## 部署到 Railway

1. 将代码推送到 GitHub
2. 登录 [Railway](https://railway.app)
3. 创建新项目，选择从 GitHub 部署
4. 配置环境变量
5. 部署完成

## 企业微信配置

1. 注册企业微信 (https://work.weixin.qq.com)
2. 创建应用，获取 AgentId 和 Secret
3. 在应用中添加成员（你自己）
4. 填写 .env 中的配置

## API 文档

启动后访问 `/api/docs` 查看 Swagger 文档。

## 许可证

MIT
