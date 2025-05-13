import { defineAdditionalConfig } from 'vitepress';
import zh from './locales/zh';

export default defineAdditionalConfig({
  lang: 'zh-Hans',
  description: "Zalith Launcher是一款基于PojavLauncher开发的Minecraft启动器，可在Android设备上运行Minecraft: Java Edition",

  themeConfig: zh
});