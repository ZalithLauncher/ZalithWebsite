# Tips for Replace Microsoft Account Skins and Capes

::: info Author
TNTyep520 - 2025/11/1
:::

::: warning Notice
This document applies only to **version 2.0.0_beta-20250920a or later**.
:::

## Introduction

The **Mojang API** is an **Application Programming Interface (API)** provided by **Mojang Studios**.

This interface allows developers to securely access and retrieve **Minecraft player profile data** and related information through their own applications.

**Zalith Launcher 2** uses the officially approved API interface provided by **Mojang Studios** to securely and compliantly access the online services of **Minecraft: Java Edition**.

This document provides instructions on how to change your skin and cape when using a Microsoft account.

This guide is written for beginners and avoids complex or advanced operations wherever possible.

Even if this is your first time performing these actions, you can follow it easily.

Before you begin, make sure you are logged in to your Microsoft account.

If you are not sure how to log in, click the link below for guidance:

- [Login to your account](/docs/help/account.md)

## Skins and Capes

Access the account management section from the main menu of the launcher:

![Go to Account Management Page](/en/docs/account/to_account.jpg)

In the account management page of the launcher, select the corresponding legitimate account profile and click this icon:

![Select Skin and Cape Menu](/en/docs/account/microsoft/choose_microsoft.jpg)

### Replace Skins

By default, when you change your skin, the launcher will prompt you to select a skin file (recommended resolution: **128×128 pixels**).

Next, the launcher will ask you to choose a skin model.

Please select the model that corresponds to the skin you have chosen:

![Choose Skin Model](/en/docs/account/microsoft/choose_microsoft_skin_model.jpg)

After making your selection, the launcher will send a **POST** request to the **Mojang API** to update your player skin data.

![Send Skin POST Request](/en/docs/account/microsoft/post_microsoft_skin.jpg)

Once the **POST** request successfully connects to the server and completes authentication, the launcher will automatically refresh your player avatar to display the updated skin.

![Refresh Local Player Avatar](/en/docs/account/microsoft/loading_microsoft_skin.jpg)

You can then see your newly changed skin in the game.

![Skin](/en/docs/account/microsoft/microsoft_new_skin.jpg)

### Replace Capes

When changing your cape, the launcher will retrieve your cape data from the **Mojang API**, and then prompt you to select a cape:

![Retrieve Cape Data](/en/docs/account/microsoft/post_microsoft_capes.jpg)

![Choose Cape Interface](/en/docs/account/microsoft/choose_microsoft_capes.jpg)

After completing all selections, the launcher will send a **POST** request to update your cape data:

![Send New Cape Data](/en/docs/account/microsoft/post_microsoft_new_capes.jpg)

You can then see your newly changed cape in the game.

![Cape](/en/docs/account/microsoft/microsoft_new_capes.jpg)
