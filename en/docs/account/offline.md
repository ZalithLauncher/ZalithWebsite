# Offline Account

### What is an Offline Account?
An offline account is a locally simulated Minecraft account that bypasses official verification. It is typically used by non-official players or in specific server environments. Essentially, it's a "pseudo-official account" simulated through third-party launchers or server configurations, **without legitimate authorization**.

### Bypassing Official Verification Mechanism and Implementation
- When the server setting `online-mode=false`, the Minecraft client **will not connect to Mojang servers for account validation**.
- Players can input any username (e.g., `Player123`), and the client will generate a **random UUID** (virtual identity identifier) and log in to the game.
- This account exists only in the local or LAN environment, with no data interaction with official servers.

- **Third-party Launchers (e.g., HMCL, PCL2)**: Provide an "Offline Mode" option, allowing players to create local accounts.
- **Servers**: When configured with `online-mode=false`, servers allow players to connect using offline accounts.

### Uses
1. Free access to all vanilla gameplay modes in single-player mode.
2. Play on certain special servers:

| Type | Description |
| ---- | ---- |
| Public Welfare Servers | To lower player barriers (e.g., student groups), they actively disable official verification (such as small domestic RPG, survival, or multiplayer servers). |
| Local Network Multiplayer | LAN-based multiplayer without internet verification (requires mod support).

3. Customization Flexibility
- **Local Skin & Cape Loading**: Directly load local skin & cape files through the launcher (no need for the official skin system).
- **Free Username Switching**: Change to any ID upon each login (official requires a 30-day cooldown period).

::: danger Warning
Using offline accounts for multiplayer gaming has the following risks:
- **Account Impersonation**: Any player can enter the server with the same username (e.g., `Notch`), making real identity verification impossible.
- **Account Theft Vulnerability**: Offline servers lack password verification mechanisms; others can "log in as you" simply by using your ID.
- **Cheating Proliferation**: Cheaters cannot be tracked via UUID (the same player can change IDs infinitely to evade bans).
:::

### Comparison with Official Accounts

| Comparison | **Offline Account** | **Official Account** |
| --- | --- | --- |
| **Legality** | ❌ Unauthorized, violates EULA | ✅ Officially Authorized |
| **Identity Uniqueness** | ❌ Randomly generated UUID, can be duplicated | ✅ Bound to a unique UUID |
| **Multiplayer Server Compatibility** | ⚠️ Limited to offline servers only | ✅ Supports all official/online servers |
| **Long-term Stability** | ⚠️ Depends on third-party tools, updates may be interrupted | ✅ Official continuous maintenance |

::: tip 💡 Tip
Although the NetEase version is considered official, its account system is independent from the international version, fundamentally different from offline accounts (login via NetEase account, but functionality is similarly restricted).