# 更换皮肤或披风

::: info 该文档编写者
第一版：TNTyep520 - 2025/11/01
第二版修订：墨北MovTery - 2025/11/04
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
