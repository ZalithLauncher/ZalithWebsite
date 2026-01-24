# Account Login

::: warning Notice
This guide is only applicable to [Zalith Launcher 2](/docs/projects/zl2)
:::

::: info Author
- MovTery - 2025/9/9
- SerinaNya - 2026/1/24
:::

## Introduction

Before launching Minecraft Java Edition, you need to prepare an account.  

This guide is beginner-friendly and avoids advanced operations, so new players can follow along safely.  

## Account Management

The launcher provides an Account Management page to store all your logged-in accounts. You can access it from the main menu:  

![Enter Account Management](/en/docs/account/to_account.jpg)  

## Microsoft Account

Before starting, ensure you have a Microsoft account that owns Minecraft and has a game profile.  

### Verify Game Ownership

- [Purchase Minecraft](https://www.xbox.com/games/store/minecraft-java-bedrock-edition-for-pc/9nxp44l49shj)  
- [Check if you own Minecraft](https://www.minecraft.net/msaprofile/mygames)
  - If the Minecraft: Java section shows **Learn More** instead of **Buy Now**, you own the game.  
  - Minecraft purchased:  
  ![Purchased Minecraft](/en/docs/account/purchased_minecraft.png)  
- [My Game Profile](https://www.minecraft.net/msaprofile/mygames/editprofile)  
  - After purchasing the game, you need to create a game profile.  
  - Pick a username to use in-game, similar to a nickname.  
  ![Edit Game Profile](/en/docs/account/edit_profile.png)  

Once verified, you can log in to your Microsoft account within the launcher.

### Start Microsoft Login

In the launcher's Account Management page, begin Microsoft login:  

![Start Microsoft Login](/en/docs/account/microsoft/start_microsoft_login.jpg)  

The launcher will start a task to obtain a device code, which is essential for Microsoft OAuth authentication.  
By default, the launcher will copy the device code to your clipboard and open the Microsoft verification webpage. Enter the code in the input box to proceed:  

![Device Code Task Panel](/en/docs/account/microsoft/get_device_code.jpg)  
![Enter Device Code](/en/docs/account/microsoft/write_device_code.jpg)  

After this, you can complete Microsoft login on the webpage:  

![Microsoft Login](/en/docs/account/microsoft/microsoft_login.jpg)  

Once logged in, click Accept to allow access:  

![Allow Access](/en/docs/account/microsoft/accept_license.jpg)  
![Login Complete](/en/docs/account/microsoft/microsoft_login_completed.jpg)

After a few seconds on this page, the launcher will automatically verify your Minecraft login. You can monitor progress in the task menu.  
Once verified, your Microsoft account will appear in Account Management:  

![Microsoft Account](/en/docs/account/microsoft/microsoft_account.jpg)

## Offline Account

The launcher allows using offline accounts without internet. Official or external accounts can also function as offline accounts.  
Create an offline account in the Account Management page:  

![Create Offline Account](/en/docs/account/offline/offline_username.jpg)  
![Offline Account Created](/en/docs/account/offline/offline_completed.jpg)

**Important:** Offline usernames must follow these rules:  
- Length: 3–16 characters  
- Characters: letters (a–z, A–Z), digits (0–9), and underscores only; no spaces or special symbols  

The launcher will validate your input in real time. Non-compliant names may prevent Minecraft from running properly, including singleplayer or offline multiplayer sessions:  

![Invalid Offline Username 1](/en/docs/account/offline/invalid_username1.jpg)  
![Invalid Offline Username 2](/en/docs/account/offline/invalid_username2.jpg)

## Third-Party Account

The launcher supports third-party authentication servers for players via Authlib-Injector. This tool acts as an authentication bridge between players and servers, enabling secure logins, session management, and access control. It also allows servers and their administrators to verify player identities and manage permissions.  

For more details, refer to the [_Third-Party Authentication Server_](./auth_server.md) section.
