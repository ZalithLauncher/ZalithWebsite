# Version Isolation

::: warning Notice
This guide is only applicable to [Zalith Launcher 2](/docs/projects/zl2)
:::

::: info Author
MovTery - 2025/9/9
:::

## Introduction

Version isolation is an important feature of the launcher for managing different game versions. It allows each version to have completely separate game data.  
Zalith Launcher's version isolation mechanism is consistent with other mainstream launchers, such as [PCL2](https://afdian.com/a/LTCat?tab=home), [HMCL](https://hmcl.huangyuhui.net/), and [FCL](https://github.com/FCL-Team/FoldCraftLauncher).

This guide is slightly advanced and may not be suitable for beginners.

## How It Works

The launcher treats each version folder as a `.minecraft` directory and passes it to Minecraft, so that Minecraft stores all your game data such as saves, resource packs and version configurations inside the version folder.  

Before enabling version isolation, all game data is stored in the main `.minecraft` folder. Its structure looks like this:  

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

This makes version management difficult. All versions without isolation share the same `.minecraft` folder, which becomes cluttered. Using mod loaders also increases the risk of mod compatibility issues.  

After enabling version isolation, each version folder becomes the root directory for its own game data. The file structure changes to:  

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
      - New World
    - 1.21.8-Fabric 0.17.2.jar
    - 1.21.8-Fabric 0.17.2.json
    - options.txt
```

This makes the launcher's job very simple: by managing each version folder, it can handle all data for that version independently, including mods, resource packs, saves, shaders, and other resources.  

![Saves](/en/docs/version_manager/saves.jpg)