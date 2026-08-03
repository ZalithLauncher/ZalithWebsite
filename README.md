### Zalith Launcher 官网源码 / Zalith Launcher Official Website Source Code

这是 Zalith Launcher 官网的源码仓库。  
_This is the source code of Zalith Launcher's official website._

如果您有意愿参与开发，欢迎提出建议、反馈问题或贡献代码！  
_If you are willing to participate in development, you're welcome to submit suggestions, questions or contribute!_

## 技术栈 / Tech Stack

- Vite + React 19 + TypeScript
- Tailwind CSS 4
- React Router / react-i18next（多语言）/ framer-motion（动画）

## 本地开发 / Development

```bash
pnpm install
pnpm dev        # 启动开发服务器
pnpm build      # 构建产物（含构建信息与博客数据生成）
pnpm lint       # ESLint 检查
pnpm preview    # 预览构建产物
```

## 目录结构 / Structure

- `src/pages` — 页面组件
- `src/components` — 通用组件（含下载页 `Download.tsx`）
- `src/hooks/useLatestRelease.ts` — 版本与各镜像下载源数据获取
- `src/i18n` — 多语言文案
- `content/blog` — 博客 Markdown 源文件（由 `scripts/build-blog.ts` 构建）
- `scripts` — 构建辅助脚本

## 下载源说明 / Download Sources

下载页聚合多个下载渠道：

- **GitHub 官方** — 官方 Release
- **国内加速** — fishcpy 提供
- **Foxington 源** — 第三方镜像（仅 ZL1）
- **枫源镜像** — FrostLynx 提供，主站 [fyhub.cn](https://fyhub.cn)（仅 ZL2，为 ZL2 默认下载源）
- **柠枺镜像** — Lemwood 提供

网页端下载链接统一跳转镜像主站验证页，由主站完成验证与节点调度，前端不直接调用程序下载 API。
