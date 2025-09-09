# Mod Loaders

::: warning Notice
This guide is only applicable to [Zalith Launcher 2](/docs/projects/zl2)
:::

::: info Author
MovTery - 2025/9/9
:::

## Introduction
A mod loader is essential for playing mods on Minecraft Java Edition. You can learn more about it on the [Minecraft Wiki](https://minecraft.wiki/w/Mod).  
The launcher provides installation methods for the most popular mod loaders:
- [Forge](https://files.minecraftforge.net/)
- [NeoForge](https://neoforged.net/)
- [Fabric](https://fabricmc.net/use/installer/)
- [Quilt](https://quiltmc.org/)  

This guide is slightly advanced and may not be suitable for beginners. Prerequisite guide:  
- [Downloading and Installing the Game](/en/docs/help/download_game)

## Installing a Mod Loader
The launcher installs mod loaders in client mode. When downloading a game version, select the mod loader you want to install from the Add-ons list:  

![Add-ons List](/en/docs/addons.jpg) 

Note that major mod loaders are **not compatible** with each other. You cannot install multiple mod loaders simultaneously. The launcher will automatically detect this and prevent multi-loader installation.

### Add-ons

In the add-ons list, you may notice the following:  
- [OptiFine](https://optifine.net/home)
  - OptiFine can be installed as a standalone version or as a mod alongside Forge.  
  When installed as a mod, the version number indicates its Forge compatibility.
- [Fabric API](https://modrinth.com/mod/fabric-api)
  - Library mod, Required for most Fabric mods. Because it is so commonly used, the launcher allows installing Fabric API automatically when installing a Fabric version.
- [Quilted Fabric API](https://modrinth.com/mod/qsl)
  - Library mod, Required for Quilt, similar to Fabric API.

OptiFine is special because it can be installed as a standalone version or as a mod with Forge.  
When installed as a version, OptiFine loads the vanilla Minecraft client as a library, allowing you to use all OptiFine features without modifying the client. However, in this mode, mod loader support is not available.

### Notification Permission

When installing a mod loader, you may need to grant notification permission. The launcher uses a foreground service during installation to ensure smooth operation. Without a foreground service, Android may terminate the installation process.  
Android requires a notification to inform the user when a foreground service is used. [Learn more](https://developer.android.com/develop/background-work/services/fgs).  
Thus, the launcher requests notification permission.

### Installation

After selecting the add-ons you want, click the Install button to begin.  
The launcher will automatically perform all installation steps without further action from you. Please wait patiently.  

![Installing a Mod Loader](/en/docs/install_modloader.jpg)
