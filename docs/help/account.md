# 登录账号

::: info 该文档编写者
- 墨北MovTery - 2025/9/9
- SerinaNya - 2026/1/24
:::


## 前言

在启动 Minecraft Java 版前，我们需要准备一个账号。  

本文档适用于新手，会尽可能避免高级操作，新人小白可放心食用！  

## 账号管理

启动器提供了账号管理页面，用于存储您所有登录过的账号。您可以通过启动器主菜单进入账号管理：  

![进入账号管理页面](/zh/docs/account/to_account.jpg)  

## 微软账号

在开始之前，您需要确保您拥有一个微软账号，且该微软账号购买过 Minecraft 游戏，并建立了游戏档案。  

### 确认游戏档案

- [购买 Minecraft](https://www.xbox.com/games/store/minecraft-java-bedrock-edition-for-pc/9nxp44l49shj)  
- [确认自己是否拥有 Minecraft](https://www.minecraft.net/msaprofile/mygames)
  - 若 Minecraft: Java 那一栏显示为“了解更多”，而非“立即购买”，则代表您购买过 Minecraft。  
  - 未购买 Minecraft  
  ![未购买 Minecraft](/zh/docs/account/not_purchased_minecraft.jpg)  
  - 已购买 Minecraft  
  ![已购买 Minecraft](/zh/docs/account/purchased_minecraft.png)  
- [我的游戏档案](https://www.minecraft.net/msaprofile/mygames/editprofile)  
  - 在购买游戏之后，我们还需要做些事情，那就是为自己创建一个游戏档案。您可以在 [中文 Minecraft Wiki](https://zh.minecraft.wiki/w/%E6%A1%A3%E6%A1%88) 了解游戏档案的作用。  
  - 就像网络昵称一样，为自己取一个希望在游戏内使用的用户名即可。  
  ![编辑游戏档案](/zh/docs/account/edit_profile.jpg)  

若您已经确认自己完成了上述步骤，您就可以在启动器内登录您的微软账号了！  

### 开始微软登录

在启动器的账号管理页面内，开始微软登录：  

![开始微软登录](/zh/docs/account/microsoft/start_microsoft_login.jpg)  

启动器将会启动一个新的任务用于获取设备码，该设备码将作为微软 OAuth 授权用户认证流程中，至关重要的一环。  
默认情况下，启动器将在获取到设备码的同时，将其复制到您的剪贴板中，然后启动器将进入到微软验证的网页。您要做的就是将这个设备码填入输入框，供微软验证：  

![设备码任务面板](/zh/docs/account/microsoft/get_device_code.jpg)  
![设备代码输入框](/zh/docs/account/microsoft/write_device_code.jpg)  

完成后，您就可以在该网页正常进行微软账号登录了！  

![微软登录](/zh/docs/account/microsoft/microsoft_login.jpg)  

在网页端完成登录后，您会看到这样的页面，点击接受按钮即可：  

![允许访问信息](/zh/docs/account/microsoft/accept_license.jpg)  
![大功告成！](/zh/docs/account/microsoft/microsoft_login_completed.jpg)

接下来，微软登录就告一段落了，在当前页面等待几秒钟，启动器将会自动开始 Minecraft 的登录验证，您可以在任务菜单内看到验证过程。  
验证成功后，您就可以在账号管理页面内，看到您的微软账号了！  

![微软账号](/zh/docs/account/microsoft/microsoft_account.jpg)


## 离线账号

启动器允许你在脱离网络时，使用离线账号访问游戏；当然，正版账号或外置账号也会被视为离线账户。  
您可以在启动器的账号管理页面创建离线账号：  

![创建离线账号](/zh/docs/account/offline/offline_username.jpg)  
![创建离线账号成功](/zh/docs/account/offline/offline_completed.jpg)

特别注意的是，账号命名应该严格遵守如下规则：
- 长度限制：3-16 字符
- 命名规范：仅包括英文字符（字母大小写）、下划线、数字，不可含有空格符号

启动器会在您输入用户名时，严格检查，若名称不规范，启动器会实时提醒您。  
若您未遵守这样的命名规范，大部分 Minecraft 游戏将无法正常运行，例如您在进入单人游戏存档，或者离线多人游戏服务器时，您将被踢出游戏：  

![离线账号命名不规范1](/zh/docs/account/offline/invalid_username1.jpg)  
![离线账号命名不规范2](/zh/docs/account/offline/invalid_username2.jpg)

## 外置登录账号

启动器通过 Authlib-Injector 为玩家提供第三方认证服务器登录支持，该工具充当玩家与服务器之间的身份验证桥梁，使玩家能够安全登录、管理会话和权限，同时让服务器及服主能够验证玩家身份并控制访问权限。

参见 [_认证服务器 / 外置登录_](./auth_server.md) 章节。
