import {
  MenuItem,
  PredefinedMenuItem,
  Submenu,
  Menu as TauriMenu,
} from "@tauri-apps/api/menu";
import { exit } from "@tauri-apps/plugin-process";
import { LazyStore } from "@tauri-apps/plugin-store";

import { Console } from "../console/Console";
import { Workspace } from "../workspace/Workspace";
import { init, open, save, saveAs } from "../../../lib/program";

const cache = new LazyStore("cache/cache");

export class Menu {
  static async render() {
    const menu = await TauriMenu.new({
      items: [
        await Submenu.new({
          text: "File",
          items: [
            await MenuItem.new({
              id: "new",
              text: "New Program\t\tCtrl+N",
              action: init,
            }),
            await MenuItem.new({
              id: "open",
              text: "Open Program\t\tCtrl+O",
              action: open,
            }),
            await PredefinedMenuItem.new({
              text: "separator",
              item: "Separator",
            }),
            await MenuItem.new({
              id: "save",
              text: "Save\t\tCtrl+S",
              action: save,
            }),
            await MenuItem.new({
              id: "save-as",
              text: "Save Program as\t\tCtrl+Shift+S",
              action: saveAs,
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
              text: "Exit\t\tAlt+F4",
              action: async () => {
                await exit(0);
              },
            }),
          ],
        }),
        await Submenu.new({
          text: "Edit",
          items: [
            await MenuItem.new({
              id: "clear_cache",
              text: "Clear Cache",
              action: async () => {
                await cache.reset();
                Console.info("clearing application cache");
              },
            }),
          ],
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
              saveAs();
              break;
          }
        } else {
          switch (event.key.toUpperCase()) {
            case "N":
              init();
              break;
            case "O":
              open();
              break;
            case "S":
              if (!(await cache.get("program-path"))) {
                saveAs();
              } else {
                save();
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
