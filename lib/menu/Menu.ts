import {
  Menu,
  MenuItem,
  PredefinedMenuItem,
  Submenu,
} from "@tauri-apps/api/menu";
import { appDataDir } from "@tauri-apps/api/path";
import { open, save } from "@tauri-apps/plugin-dialog";
import { exit } from "@tauri-apps/plugin-process";
import { load } from "@tauri-apps/plugin-store";

const state = await load("state.json");

const menu = await Menu.new({
  items: [
    await Submenu.new({
      text: "File",
      items: [
        await MenuItem.new({
          id: "new",
          text: "New Program",
          action: () => {},
        }),
        await MenuItem.new({
          id: "open",
          text: "Open Program",
          action: async () => {
            const path = await open({
              title: "Open Program",
              multiple: false,
              directory: false,
              filters: [
                {
                  name: "SimLadd Program",
                  extensions: ["ladd"],
                },
              ],
              defaultPath: await appDataDir(),
            });
            await state.set("project-path", { value: path });
          },
        }),
        await PredefinedMenuItem.new({
          text: "separator",
          item: "Separator",
        }),
        await MenuItem.new({
          id: "save",
          text: "Save",
          action: () => {},
        }),
        await MenuItem.new({
          id: "save-as",
          text: "Save Program as",
          action: async () => {
            const path = await save({
              title: "Save Program as",
              filters: [
                {
                  name: "SimLadd Program",
                  extensions: ["ladd"],
                },
              ],
              defaultPath: await appDataDir(),
            });
            await state.set("project-path", { value: path });
          },
        }),
        await PredefinedMenuItem.new({
          text: "separator",
          item: "Separator",
        }),
        await MenuItem.new({
          id: "exit",
          text: "Exit",
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
      items: [],
    }),
    await Submenu.new({
      text: "Help",
      items: [],
    }),
  ],
});

export { menu as Menu };
