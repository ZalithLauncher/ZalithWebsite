# 外置登录

::: info 该文档编写者
- 墨北MovTery - 2025/9/9
- SerinaNya - 2026/1/27
:::

## 前言

启动器通过 authlib-injector 为玩家提供外置登录支持。该工具充当玩家与服务器之间的身份验证桥梁，使玩家能够安全登录、管理会话和权限，同时让服务器及服主能够验证玩家身份并控制访问权限。  
不少多人游戏服务器都采用这种认证方式，因此了解认证服务器的使用方法有助于玩家快速登录并畅玩 Minecraft 第三方多人服务器。  

目前常用的认证服务器：  
- [LittleSkin](https://littleskin.cn/)
- [红石皮肤站](https://mcskin.com.cn/)
- [Ely.by](https://ely.by/) <Badge text="国内不常用" type="warning" />

## 添加认证服务器

要想使用外置登录，您需要先添加由认证服务器提供的 Yggdrasil API 地址，启动器才能够使用该认证服务器进行登录账号等操作。  

1. 以 [LittleSkin](https://littleskin.cn/) 为例，您可以在 LittleSkin `用户中心` - `仪表盘` 中，找到 `外置登录 / Yggdrasil` 卡片：  

    ![LittleSkin外置账号卡片](/zh/docs/account/auth_server/little_skin_yggdrasil_card.png)  

2. 在 LittleSkin 的文档中可以找到 LittleSkin 的 Yggdrasil API 地址：  

    ```plain
    https://littleskin.cn/api/yggdrasil
    ```

    ![LittleSkin 的 Yggdrasil API 地址](/zh/docs/account/auth_server/little_skin_yggdrasil_api.png)  

3. 打开启动器，进入账号管理页面，点击 `添加认证服务器` 按钮，将刚刚获取到的 Yggdrasil API 地址填入输入框。  

    ![输入 Yggdrasil API 地址](/zh/docs/account/auth_server/write_yggdrasil_api_url.jpg)

4. 点击确认后，启动器会开启一个新的任务，识别这个认证服务器。若信息无误，您可以在账号管理的侧边栏看到刚刚添加的认证服务器：  

    ![账号管理器侧边栏](/zh/docs/account/auth_server/little_skin_login.jpg)


## 使用简化的认证服务器地址

启动器支持 authlib-injector 的 API 地址指示 _(ALI)_ 功能。

若认证服务器实现了该功能，您就不用输入完整的冗长的 Yggdrasil API 地址，只需要简单地输入网站的域名即可。

例如：  
- LittleSkin：`littleskin.cn`
- 红石皮肤站：`mcskin.cn`
- Ely.by：`ely.by`

并非所有认证服务器都支持此功能。若您使用的认证服务器并不支持该功能，启动器将无法自动解析出完整地 Yggdrasil API 地址，这种情况下您只能输入完整的 Yggdrasil API 地址。

## 登录账号

添加认证服务器相当于是添加了新的登录方式，您可以在启动器上，登录您在认证服务器上注册的账号：  

![LittleSkin登录账号](/zh/docs/account/auth_server/little_skin_login_dialog.png)  

当然，启动器会在添加 Yggdrasil API 地址时，顺便检查其是否一并提供了注册地址。  
若您在该认证服务器上没有注册账号，您可以通过启动器快速访问该服务器的注册网址。

若您的账号存在多个角色，启动器会以列表的形式展示给您，您可以选择您想要使用的角色：  

![LittleSkin选择角色](/zh/docs/account/auth_server/little_skin_select_role.jpg)  

登录成功后，您的认证服务器账号将被添加到账号列表中：  

![添加了LittleSkin账号](/zh/docs/account/auth_server/little_skin_account.jpg)