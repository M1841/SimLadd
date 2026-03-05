import {
  Menu as TauriMenu,
  MenuItem,
  PredefinedMenuItem,
  Submenu,
} from "@tauri-apps/api/menu";
import { exit } from "@tauri-apps/plugin-process";
import { LazyStore } from "@tauri-apps/plugin-store";
const state = new LazyStore("data/state.json");

import { Console } from "../console/Console";
import { Workspace } from "../workspace/Workspace";
import * as Program from "./Program";

export class Menu {
  static async render() {
    const menu = await TauriMenu.new({
      items: [
        await Submenu.new({
          text: "File",
          items: [
            await MenuItem.new({
              id: "new",
              text: "New Program\tCtrl+N",
              action: Program.init,
            }),
            await MenuItem.new({
              id: "open",
              text: "Open Program\tCtrl+O",
              action: Program.open,
            }),
            await PredefinedMenuItem.new({
              text: "separator",
              item: "Separator",
            }),
            await MenuItem.new({
              id: "save",
              text: "Save\tCtrl+S",
              action: Program.save,
            }),
            await MenuItem.new({
              id: "save-as",
              text: "Save Program as\tCtrl+Shift+S",
              action: Program.saveAs,
            }),
            await PredefinedMenuItem.new({
              text: "separator",
              item: "Separator",
            }),
            await Submenu.new({
              id: "workspace",
              text: "Workspace",
              items: [
                await MenuItem.new({
                  id: "load-workspace",
                  text: "Load",
                  action: () => {},
                }),
                await PredefinedMenuItem.new({
                  text: "separator",
                  item: "Separator",
                }),
                await MenuItem.new({
                  id: "save-workspace",
                  text: "Save",
                  action: () => {},
                }),
                await MenuItem.new({
                  id: "save-workspace-as",
                  text: "Save as",
                  action: () => {},
                }),
                await PredefinedMenuItem.new({
                  text: "separator",
                  item: "Separator",
                }),
                await MenuItem.new({
                  id: "clear-workspace",
                  text: "Clear",
                  action: () => {},
                }),
              ],
            }),
            await PredefinedMenuItem.new({
              text: "separator",
              item: "Separator",
            }),
            await MenuItem.new({
              id: "exit",
              text: "Exit\tAlt+F4",
              action: async () => {
                await exit(0);
              },
            }),
          ],
        }),
        await Submenu.new({
          text: "Edit",
          items: [],
        }),
        await Submenu.new({
          text: "View",
          items: [
            await MenuItem.new({
              id: "toggle-workspace",
              text: "Toggle Workspace\tCtrl+B",
              action: () => Workspace.toggle(),
            }),
            await MenuItem.new({
              id: "toggle-console",
              text: "Toggle Console\tCtrl+J",
              action: () => Console.toggle(),
            }),
          ],
        }),
        await Submenu.new({
          text: "Help",
          items: [],
        }),
      ],
    });

    await menu.setAsAppMenu();

    window.addEventListener("keydown", async (event) => {
      if (event.getModifierState("Control")) {
        if (event.getModifierState("Shift")) {
          switch (event.key.toUpperCase()) {
            case "S":
              Program.saveAs();
              break;
          }
        } else {
          switch (event.key.toUpperCase()) {
            case "N":
              Program.init();
              break;
            case "O":
              Program.open();
              break;
            case "S":
              if (!(await state.get("program-path"))) {
                Program.saveAs();
              } else {
                Program.save();
              }
              break;
            case "B":
              Workspace.toggle();
              break;
            case "J":
              Console.toggle();
              break;
          }
        }
      }
    });
  }
}
