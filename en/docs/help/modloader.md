# 模组加载器

::: warning 提醒
本文档仅适用于 [Zalith Launcher 2](/docs/projects/zl2)
:::

::: info 该文档编写者
墨北MovTery - 2025/9/9
:::

## 前言
模组加载器是 Minecraft Java 版想要游玩模组的必要手段，您可以在 [中文 Minecraft Wiki](https://zh.minecraft.wiki/w/%E5%8A%A0%E8%BD%BD%E5%99%A8Mod?variant=zh-cn) 中详细了解它。
启动器已提供目前主流模组加载器的安装方式：
- [Forge](https://files.minecraftforge.net/)
- [NeoForge](https://neoforged.net/)
- [Fabric](https://fabricmc.net/use/installer/)
- [Quilt](https://quiltmc.org/)  

本文档内容稍显高级，可能并不适用于新手。前置文档：  
- [下载安装游戏](/docs/help/download_game)

## 安装模组加载器
启动器将使用客户端的形式安装模组加载器，您需要在下载游戏版本时，在附加内容列表内，选择您想要安装的模组加载器：  

![附加内容列表](/zh/docs/addons.jpg) 

您需要注意，目前主流的模组加载器均不互相兼容，您不能同时安装多个模组加载器。启动器将会自动识别，并禁止您同时安装多个模组加载器。

### 附加内容

您也许注意到了，在附加内容列表内，列出了如下内容：  
- [OptiFine](https://optifine.net/home)
  - 中文译名：高清修复，在 [MC百科](https://www.mcmod.cn/class/36.html) 了解更多。  
  它可以作为版本单独安装，也可以作为模组，与 Forge 一起安装。  
  其作为模组安装时，版本号会标注其与 Forge 的适配情况。
- [Fabric API](https://modrinth.com/mod/fabric-api)
  - 库模组，在 [MC百科](https://www.mcmod.cn/class/3124.html) 了解更多。  
  适用于 Fabric，绝大多数 Fabric 模组都依赖它，由于它出现的频率实在是太高了，启动器支持您在安装 Fabric 版本的同时，一并安装 Fabric API 模组。
- [Quilted Fabric API](https://modrinth.com/mod/qsl)
  - 库模组，在 [MC百科](https://www.mcmod.cn/class/6788.html) 了解更多。  
  适用于 Quilt，同 Fabric API。

其中 OptiFine 较为特殊，它既可以作为版本单独进行安装，又能作为模组，与 Forge 一起安装。   
OptiFine 作为版本安装时，其会以库的形式载入原版 Minecraft 客户端，使您能够在不修改客户端的情况下，拥有 OptiFine 的所有功能，但正如上文所说，其载入的是原版 Minecraft 客户端，您无法获得模组加载支持。

### 通知权限

在安装模组加载器时，您可能需要授予启动器通知权限，启动器会在安装过程中，使用前台服务保证一些安装的正常运行。若不使用前台服务，启动器的安装进程极其容易被一些安卓系统终止。  
安卓系统要求，使用前台服务前，需要发送一条通知，以告知用户应用正在使用前台服务，[了解详情](https://developer.android.com/develop/background-work/services/fgs)。  
所以启动器会向您申请通知权限。

### 安装

选择好您想要安装的附加内容后，直接点击安装按钮，即可开始安装。  
启动器将会自动执行所需的安装步骤，不需要您的任何操作，请您耐心等待。  

![安装模组加载器](/zh/docs/install_modloader.jpg)

### 注意事项

由于模组下载源都在国外，您可能会遇到网络不稳定的情况，这个时候，您可能需要使用镜像源。