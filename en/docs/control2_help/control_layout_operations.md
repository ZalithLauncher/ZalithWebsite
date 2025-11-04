# Control Layout Operations

::: info Author
MovTery - 2025/11/4
:::

## Operation States

Control layouts have the following three states (for understanding only; the actual code is not implemented exactly this way):  
- Physical mouse operation  
- Gamepad operation  
- None (touch operation)  

Control layouts will show or hide control layers based on the current state.  
You can use state changes to provide different key logic for mouse/keyboard and gamepad operations.

### Specific Operations

The launcher dynamically adjusts the control layout state according to your type of input, switching the visibility of control layers in different states.

- **Touch Operation**  
  When you use your finger or swipe on the mouse layer to control the virtual mouse, the launcher recognizes it as a touch operation.  
  At the implementation level, this state is not explicitly labeled, but conceptually it is used for state detection.  
  The main purpose of touch operation is to exit the following states:  
  - Physical mouse operation  
  - Gamepad operation  

- **Physical Mouse Operation**  
  When you move a real mouse, the launcher marks it as a physical mouse operation. This mark triggers the control layout to switch to the `Physical mouse operation` state.  

- **Gamepad Operation**  
  When you perform any action with a gamepad, the launcher marks it as a gamepad operation. This mark triggers the control layout to switch to the `Gamepad operation` state.

## Game States

The launcher divides the game state into two types:

- **In-Game**  
  When Minecraft captures the mouse (for example, to control the camera), the launcher determines the state as `In-Game`.
- **In-Menu** (also referred to as Out-of-Game)  
  When Minecraft does not capture the mouse (for example, when a GUI screen is open), the launcher determines the state as `In-Menu`.

By distinguishing between these two states, the control layout can automatically show or hide control layers or controls, allowing different key operation schemes for in-game and menu states.
