# Changing Skins or Capes

::: info Author of this document
First Edition: TNTyep520 - 2025/11/01  
Second Edition Revision: MovTery - 2025/11/04
:::

## Preface

You can change your account’s skin and cape directly in the launcher. Currently, this feature supports **Microsoft accounts** and **offline accounts**.  
If you are using an **authentication server account**, please visit the corresponding website’s dashboard to modify your skin or cape.  

For Microsoft accounts, the launcher uses Mojang Studios’ officially authorized API to handle skin and cape changes, ensuring the process is safe and compliant.  

In the account management page of the launcher, click the icon shown below to begin the change.  
If your account is a Microsoft account, a submenu for changing skins and capes will open;  
if your account is an offline account, a file selector will open directly to let you choose a skin.  

![Choose the skin and cape change interface](/en/docs/account/microsoft/choose_skin_capes.jpg)  

This document is written for beginners and aims to avoid complex or advanced steps. Even if this is your first time, you can easily complete the setup.

## Changing the Skin

When the file selector opens, you need to choose a skin image file (only **PNG** format is supported, with a resolution of **64x64** pixels or **64x32** pixels).  
Then, the launcher will ask you to choose a skin model. Please select the model that matches your chosen skin:

![Choose skin model](/en/docs/account/microsoft/choose_skin_model.jpg)  

After you finish selecting, the launcher will immediately update the skin data.  

For Microsoft accounts, the launcher will send a POST request to the Mojang API to update the player’s skin data.  

![Send POST request for new skin](/en/docs/account/microsoft/post_new_skin.jpg)  

After success, the launcher will automatically refresh the player avatar to show the latest skin appearance.  

![Refresh local player avatar](/en/docs/account/microsoft/load_new_skin.jpg)  

Then you can see your newly changed skin in the game.  

![Skin](/en/docs/account/microsoft/game_new_skin.jpg)

## Changing the Cape

Currently, only Microsoft accounts are allowed to change capes.  
When changing a cape, the launcher will retrieve the player’s owned cape data through the Mojang API:  

![Get cape data](/en/docs/account/microsoft/get_capes.jpg)  

After successful retrieval, the launcher will display all your capes in a dialog and automatically localize them.  
You can select the cape you want to change here:  

![Change cape interface](/en/docs/account/microsoft/choose_capes.jpg)  
![Send new cape data](/en/docs/account/microsoft/post_new_capes.jpg)

Then you can see your newly changed cape in the game.  

![Cape](/en/docs/account/microsoft/game_new_capes.jpg)
