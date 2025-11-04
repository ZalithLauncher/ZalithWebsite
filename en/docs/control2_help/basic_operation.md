# Basic Operations in the Editor

::: info Author
MovTery - 2025/10/29
:::

## Preface

Before getting started, let’s get familiar with the control layout editor and its core functions.  
Mastering these basics will help you create your own personalized and efficient control layout!

## Control Layout Editor

First, go to the Control Layout Management page, select your layout, and click "Edit Control Layout" to enter the editor.

![Enter the control layout editor](/en/docs/control2_help/basic_operation/edit_layout.png)

Tap the floating ball to open the Editor Menu:

![Editor menu](/en/docs/control2_help/basic_operation/editor_menu.png)

The menu is divided into two sections:  
the left side contains the editor menu, and the right side shows the list of control layers.

## Menu Functions

- **Control Appearance List**
  - Opens a list of all control appearances in the current layout.  
    You can create or edit appearances from here.
- **Preview Functions**
  - **Preview Control Layout**  
    When enabled, the editor launches a simulation environment where you can test the basic functionality of your control layout.  
  - **Preview Scenario**  
    Used to test how your layout behaves both inside and outside of the game.  
    For more details about game visibility scenes, see: [Game States](/en/docs/control2_help/control_layout_operations#game-states)
  - **Using physical mouse**  
    Simulates the use of a real mouse to test the visibility of certain control layers.  
    For more details about control layout operations, see: [Control Layout Operations](/en/docs/control2_help/control_layout_operations#operation-states)
  - **Using gamepad**  
    Simulates the use of a gamepad to test the visibility of control layers.  
    For more details about control layout operations, see: [Control Layout Operations](/en/docs/control2_help/control_layout_operations#operation-states)
- **Snapping Functions**
  - **Control Snapping**  
    Determines whether dragged controls should snap to the edges of nearby controls.  
  - **Snap to All Control Layers**  
    Allows snapping between controls across different layers, not just within the current one.  
  - **Control Snapping Mode**
    - **Fullscreen Snapping:**  
      Finds the nearest control edge coordinates across the entire screen and snaps to the corresponding X or Y position.  
    - **Local Snapping:**  
      Finds the nearest control within a small surrounding area for snapping.
