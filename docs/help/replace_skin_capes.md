# 更换皮肤或披风

::: info 该文档编写者
TNTyep520 - 2025/11/1
:::

## 前言

**Mojang API** 是由 **Mojang Studios** 提供的**应用程序编程接口 (API)**, 该接口允许开发者通过自有程序安全地访问并**获取 Minecraft 玩家档案**等相关数据。

**Zalith Launcher 2** 使用经 **Mojang Studios** 批准的官方 API 接口, 以安全、合规的方式访问 **Minecraft: Java Edition** 的在线服务。本文档将指导您如何在微软账户更换皮肤与披风。

本文档面向初学者编写, 尽量避免涉及复杂或高级的操作步骤。即使您是第一次接触相关内容, 也可以轻松上手。

在开始之前, 您需要登录至微软账户, 若您还不知道如何登录, 可点击下方跳转:

- [登陆账号](/docs/help/account.md)

## 皮肤与披风

通过启动器主菜单中进入账户管理:

![进入账户管理页面](/zh/docs/account/to_account.jpg)

在启动器的账户管理页面内, 选择相对应的正版账户档案, 点击此图标:

![选择更换皮肤与披风界面](/zh/docs/account/microsoft/choose_skin_capes.jpg)

### 更换皮肤

默认情况下, 当您更换皮肤时, 启动器将提示选择一个皮肤文件 (分辨率为 **128×128 像素**)

随后, 启动器会让您选择皮肤模型, 请根据您所选的皮肤挑选相对应的模型:

![选择皮肤模型](/zh/docs/account/microsoft/choose_skin_model.jpg)

当您选择完成后, 启动器会向 **Mojang API** 发送一个 **POST 请求**, 以更新玩家的皮肤数据。

![发送皮肤 POST 请求](/zh/docs/account/microsoft/post_new_skin.jpg)

若 **POST 请求**与服务器成功建立连接并完成验证后, 启动器将自动刷新玩家头像, 以显示最新的皮肤外观。

![刷新本地玩家头像](/zh/docs/account/microsoft/load_new_skin.jpg)

然后您就可以在游戏中可见您刚才更换的皮肤了。

![皮肤](/zh/docs/account/microsoft/game_new_skin.jpg)

### 更换披风

在更换披风时, 启动器会通过 **Mojang API** 获取玩家披风数据, 随后会让您选择披风:

![获取披风数据](/zh/docs/account/microsoft/get_capes.jpg)

![更换披风界面](/zh/docs/account/microsoft/choose_capes.jpg)

当一切完成后, 启动器将会发送 **POST 请求**以更新披风数据:

![发送新披风数据](/zh/docs/account/microsoft/post_new_capes.jpg)

然后您就可以在游戏中可见您刚才更换的披风了。

![披风](/zh/docs/account/microsoft/game_new_capes.jpg)
