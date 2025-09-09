# Authentication Servers

::: warning Notice
This guide is only applicable to [Zalith Launcher 2](/docs/projects/zl2)
:::

::: info Author
MoBei MovTery - 2025/9/9
:::

## Introduction

The launcher uses Authlib-Injector to provide support for authentication server logins. This tool acts as a bridge between players and servers, allowing secure login, session management, and permissions control, while enabling server admins to verify player identities and manage access.  
Most third-party multiplayer servers use this authentication method, so understanding it helps players quickly log in and enjoy Minecraft third-party servers.

Common authentication servers:  
- [LittleSkin](https://littleskin.cn/)
- [RedstoneSkin](https://mcskin.com.cn/)
- [Ely.by](https://ely.by/)

This guide is slightly advanced but aims to make it understandable for beginners.

## Adding a Yggdrasil API

To use an authentication server, you need the Yggdrasil API URL provided by the server. The launcher uses this API to log in to accounts.  

For example, on Ely.by, you can find the `Minecraft Authorization (Ru)` option in `User Center` → `Bottom Bar`:  

![Auth Option](/en/docs/account/auth_server/ely_by_yggdrasil_doc.png)  

Then, visit Ely.by's documentation site to get the Yggdrasil API URL:  

![Ely.by Yggdrasil API URL](/en/docs/account/auth_server/ely_by_yggdrasil_api.png)  

Open the launcher, go to Account Management, click `Add Auth`, and paste the Yggdrasil API URL:  

![Enter Yggdrasil API URL](/en/docs/account/auth_server/write_yggdrasil_api_url.jpg)

After confirming, the launcher will start a task to verify the authentication server. If successful, the server will appear in the sidebar of Account Management:  

![Account Manager Sidebar](/en/docs/account/auth_server/ely_by_login.jpg)

## Using Sites with ALI Support

The launcher supports Authlib-Injector API URL Indication (ALI). If a site implements this feature, the launcher can automatically detect its Yggdrasil API URL.  

When adding an authentication server, you can directly enter the domain name, e.g.:  
- LittleSkin: `littleskin.cn`  
- RedstoneSkin: `mcskin.cn`  
- Ely.by: `ely.by`  

If the server does not support ALI, you must manually enter its standard Yggdrasil API URL.

## Logging In

Adding a Yggdrasil API URL adds a new login method. You can log in to accounts registered on that authentication server:  

![Ely.by Login](/en/docs/account/auth_server/ely_by_login_dialog.png)  

The launcher will also check if the API provides a registration link.  
If you do not have an account on that server, you can quickly access its registration page through the launcher.

If your account has multiple roles, the launcher will display them in a list for selection:  

![LittleSkin Role Selection](/en/docs/account/auth_server/little_skin_select_role.jpg)  

After successful login, your authentication server account will be added to the account list:  

![Ely.by Account Added](/zh/docs/account/auth_server/ely_by_account.jpg)
