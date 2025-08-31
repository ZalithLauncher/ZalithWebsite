# Offline Account

### What Is an Offline Account?
An **offline account** is a locally simulated Minecraft account that bypasses official authentication. It is typically used by players who do not have an official account or in certain private server environments. Essentially, it acts as a **“pseudo-official” account** created through third-party launchers or server configurations, **without legitimate authorization**.  

### How Offline Accounts Bypass Verification
- When a server is set with `online-mode=false`, the Minecraft client **does not contact Mojang servers** for account validation.  
- Players can enter any username (e.g., `Player123`), and the client generates a **random UUID** (Universally Unique Identifier) to log in locally.  
- These accounts exist solely on the local machine or LAN, with **no interaction with official servers**.  

**Implementation Examples**:  
- **Third-Party Launchers (e.g., HMCL, PCL2)**: Offer an "Offline Mode" to create local accounts.  
- **Servers**: Configured with `online-mode=false`, they allow offline accounts to connect.  

### Common Uses
1. **Single-Player Access**  
   - Free access to all vanilla gameplay modes without an official account.  

2. **Special Server Play**  

| Type | Description |
| ---- | ----------- |
| Public Welfare Servers | Servers that lower entry barriers (e.g., student groups) often disable official verification for small domestic RPG, survival, or multiplayer servers. |
| LAN Multiplayer | Local network multiplayer without internet authentication (may require mod support). |

3. **Customization Flexibility**  
- **Local Skin & Cape Loading**: Load skins and capes directly via the launcher without using the official skin system.  
- **Free Username Switching**: Change usernames freely at each login (official accounts restrict changes to every 30 days).  

::: danger Warning
Using offline accounts for multiplayer gaming carries several risks:  
- **Account Impersonation**: Anyone can log in with the same username (e.g., `Notch`), making identity verification impossible.  
- **Account Theft Vulnerability**: Offline servers often lack password protection, allowing others to log in using your ID.  
- **Cheating Proliferation**: UUIDs are not tied to accounts, enabling players to evade bans by switching usernames.  
:::

### Offline vs Official Accounts

| Feature | Offline Account | Official Account |
| ------- | --------------- | ---------------- |
| **Legality** | ❌ Unauthorized; violates EULA | ✅ Officially authorized |
| **Identity Uniqueness** | ❌ Random UUIDs; may be duplicated | ✅ Unique, bound UUID |
| **Multiplayer Compatibility** | ⚠️ Limited to offline servers | ✅ Compatible with all online servers |
| **Long-Term Stability** | ⚠️ Relies on third-party tools; updates may break functionality | ✅ Maintained by Mojang; continuous updates |

::: tip 💡 Tip
The **NetEase version** of Minecraft, although official, operates independently of the international version. While it uses official authentication via NetEase accounts, its gameplay restrictions are **functionally different from offline accounts**.  
:::
