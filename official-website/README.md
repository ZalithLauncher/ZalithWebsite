# Zalith Launcher 官方网站

Zalith Launcher 官方网站的源码仓库，基于 React + Vite + Tailwind CSS 构建。

## 技术栈

- **框架**: React 19 + React Router 7
- **构建工具**: Vite 8
- **样式**: Tailwind CSS v4
- **动画**: Framer Motion
- **国际化**: i18next + react-i18next
- **图标**: Lucide React
- **Markdown 渲染**: marked

## 项目结构

```
official-website/
├── content/          # 博客 Markdown 源文件
├── public/           # 静态资源与构建产物
├── scripts/          # 构建脚本（博客索引、构建信息）
├── src/
│   ├── components/   # 可复用组件
│   ├── pages/        # 页面组件
│   ├── hooks/        # 自定义 Hooks
│   ├── i18n/         # 国际化配置与翻译
│   ├── lib/          # 工具函数
│   ├── types/        # TypeScript 类型定义
│   ├── data/         # 构建生成的数据索引
│   └── assets/       # 静态资源
└── vite.config.ts
```

## 可用脚本

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 本地预览构建产物
pnpm preview

# 运行 ESLint
pnpm lint
```

## 页面

- `/` - 首页
- `/download` - 下载中心
- `/blog` - 博客列表
- `/blog/:slug` - 博客详情
- `/privacy` - 隐私政策
- `/terms` - 服务条款

## 许可证

与主项目保持一致。
