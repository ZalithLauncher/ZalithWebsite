# 更换皮肤或披风

::: info 该文档编写者
第一版：TNTyep520 - 2025/11/1  
第二版修订：墨北MovTery - 2025/11/4
:::

## 前言

您可以在启动器中更换账号的皮肤与披风。目前，该功能支持 **微软账号** 与 **离线账号** 使用。  
若您使用的是 **认证服务器账号**，请前往相应网站的仪表盘进行皮肤或披风的更改。  

对于微软账号，启动器通过 Mojang Studios 官方授权的 API 接口实现皮肤与披风的更换，确保操作过程安全、合规。  

在启动器的账号管理页面中，点击下图所示图标，即可开始进行更改。  
若您的账号为微软账号，则打开皮肤与披风更换的二级菜单；  
若您的账号为离线账号，则直接打开文件选择器，开始选择皮肤。  

![选择更换皮肤与披风界面](/zh/docs/account/microsoft/choose_skin_capes.jpg)  

本文档面向初学者编写，力求避免复杂或高级的操作步骤。即使您是第一次接触相关内容，也能轻松完成设置。

## 更换皮肤

进入文件选择器时，您需要选择一个皮肤图片文件 (仅限 **PNG** 格式，分辨率限制：**64x64** 像素或 **64x32** 像素)。  
随后，启动器会让您选择皮肤模型，请根据您所选的皮肤挑选相对应的模型:

![选择皮肤模型](/zh/docs/account/microsoft/choose_skin_model.jpg)  

当您选择完成后，启动器将会立即更新皮肤数据。  

若是微软账号，启动器会向 Mojang API 发送一个 POST 请求，以更新玩家的皮肤数据。  

![发送皮肤 POST 请求](/zh/docs/account/microsoft/post_new_skin.jpg)  

成功后，启动器将自动刷新玩家头像，以显示最新的皮肤外观。

![刷新本地玩家头像](/zh/docs/account/microsoft/load_new_skin.jpg)  

然后您就可以在游戏中可见您刚才更换的皮肤了。

![皮肤](/zh/docs/account/microsoft/game_new_skin.jpg)

## 更换披风

目前仅允许微软账号更换披风。  
在更换披风时，启动器会通过 Mojang API 获取玩家已拥有的披风数据：  

![获取披风数据](/zh/docs/account/microsoft/get_capes.jpg)  

获取成功后，启动器会通过对话框展示您所有的披风，且自动进行本地化。  
您可以在这里选择想要更换的披风：  

![更换披风界面](/zh/docs/account/microsoft/choose_capes.jpg)  
![发送新披风数据](/zh/docs/account/microsoft/post_new_capes.jpg)

然后您就可以在游戏中可见您刚才更换的披风了。

![披风](/zh/docs/account/microsoft/game_new_capes.jpg)

## 高级内容

本板块仅详细描述相关技术细节，并不适合小白。

### 微软账号

更换皮肤的相关实现细节：
 - 得到您选择的皮肤文件后，会验证皮肤图片的合法性（格式保证为 PNG，分辨率为 Mojang 允许的 64x64 或 64x32）
 - 如果图片合法，则要求您选择模型类型
 - 将皮肤图片文件读取为字节数组
 - 通过 Mojang API 上传皮肤数据，相关文档：[Minecraft WIKI](https://zh.minecraft.wiki/w/Mojang_API#%E4%B8%8A%E4%BC%A0%E7%9A%AE%E8%82%A4)
 - 如果因为账号验证问题导致上传失败，启动器会重新登录账号，然后再次尝试上传皮肤

更换披风的相关实现细节：
 - 首先，启动器会通过 Mojang API 获取您的玩家数据，相关文档：[Minecraft WIKI](https://zh.minecraft.wiki/w/Mojang_API#%E8%8E%B7%E5%8F%96%E9%85%8D%E7%BD%AE%E4%BF%A1%E6%81%AF)
 - 在玩家配置信息内，包含您的账号所拥有的全部披风数据
 - 启动器会将披风数据以列表的形式展现给您，同时基于披风的 `alias` 值尝试进行本地化，相关源码：
   - _Capes.kt：[Github](https://github.com/ZalithLauncher/ZalithLauncher2/blob/main/ZalithLauncher/src/main/java/com/movtery/zalithlauncher/game/account/wardrobe/_Capes.kt)
 - 启动器会根据您的选择，通过 Mojang API 尝试重置或更改您的披风，相关文档：[Minecraft WIKI](https://zh.minecraft.wiki/w/Mojang_API#%E6%98%BE%E7%A4%BA%E6%8A%AB%E9%A3%8E)
 - 如果因为账号验证问题导致更改失败，启动器会重新登录账号，然后再次尝试更改披风

### 离线账号

为什么离线账号能够在无网络的本地环境中使用自定义皮肤？

在启动器早期版本中，是通过生成资源包的方式实现离线皮肤功能。然而这种方法限制较多，在部分游戏版本中无法生效，并在 1.19.3 之后彻底失效。

在目前的实现中，启动器通过离线 Yggdrasil API 服务器来支持自定义皮肤功能。  
其原理与 [HMCL](https://docs.hmcl.net/launcher/offline-skin.html) 一致：利用 Authlib-Injector 提供的自定义验证服务器 URL（即 API 地址）功能，连接到由启动器在本地搭建的验证服务器，从而为玩家提供皮肤数据。

启动器的离线 Yggdrasil API 服务器基于 [CIO 引擎（CIO Engine）](https://ktor.io/docs/server-engines.html) 运行。
相关实现可参考以下源码：  
- OfflineYggdrasilServer：[Github](https://github.com/ZalithLauncher/ZalithLauncher2/blob/main/ZalithLauncher/src/main/java/com/movtery/zalithlauncher/game/account/offline/OfflineYggdrasilServer.kt)

通过这种方式，即使在完全脱网的原版 Minecraft 环境中，您也能正常看到自己设置的皮肤。
