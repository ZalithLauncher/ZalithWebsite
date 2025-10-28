# 版本隔离

::: info 该文档编写者
墨北MovTery - 2025/9/9
:::

## 前言

版本隔离是启动器管理不同版本数据的一大重要手段，允许您在各版本之前持有完全不同的游戏数据。  
Zalith Launcher 的版本隔离方式与目前主流的启动器，如 [PCL2](https://afdian.com/a/LTCat?tab=home)、[HMCL](https://hmcl.huangyuhui.net/) 、[FCL](https://github.com/FCL-Team/FoldCraftLauncher) 等启动器的版本隔离机制一致。  

本文档内容稍显高级，可能并不适用于新手！

## 运作机制

启动器会将版本文件夹视为 `.minecraft` 文件夹，传递给 Minecraft，让 Minecraft 将您的游戏数据，如存档、资源包、版本配置等数据，存储在版本文件夹内。  

开启版本隔离前，游戏数据将全部堆放在 `.minecraft` 文件夹内，Minecraft 的文件结构将会是：  

```text
.minecraft\
- .fabric
- assets
- config
- libraries
- logs
- mods\
  - fabric-api-0.133.4+1.21.8.jar
- resourcepacks\
  - FreshAnimations_v1.9.4.zip
- saves\
  - 新的世界
- versions\
  - 1.21.8-Fabric 0.17.2\
    - 1.21.8-Fabric 0.17.2.jar
    - 1.21.8-Fabric 0.17.2.json
- options.txt
```

这非常不利于版本管理，所有未开启版本隔离的版本，都会将数据堆放在这里，非常杂乱。在您使用模组加载器时，还会面临模组兼容性问题。  

开启版本隔离后，游戏数据将以版本文件夹为根目录，Minecraft 的文件结构将变更为：  

```text
.minecraft\
- assets
- libraries
- versions\
  - 1.21.8-Fabric 0.17.2\
    - .fabric
    - config
    - logs
    - mods\
      - fabric-api-0.133.4+1.21.8.jar
    - resourcepacks\
      - FreshAnimations_v1.9.4.zip
    - saves\
      - 新的世界
    - 1.21.8-Fabric 0.17.2.jar
    - 1.21.8-Fabric 0.17.2.json
    - options.txt
```

这样启动器要做的事情就非常简单了，仅仅只需要管理版本文件夹，即可管理您的整个版本数据，例如单独管理您的模组、资源包、存档、光影包等资源：  

![存档管理](/zh/docs/version_manager/saves.jpg)

