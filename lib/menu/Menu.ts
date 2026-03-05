import {
  Menu as TauriMenu,
  MenuItem,
  PredefinedMenuItem,
  Submenu,
} from "@tauri-apps/api/menu";
import { appDataDir } from "@tauri-apps/api/path";
import { open, save } from "@tauri-apps/plugin-dialog";
import { exit } from "@tauri-apps/plugin-process";
import { LazyStore } from "@tauri-apps/plugin-store";
import { LadderDiagram } from "../editor/LadderDiagram";
import { Console } from "../console/Console";
const state = new LazyStore("data/state.json");

export class Menu {
  static async render() {
    const menu = await TauriMenu.new({
      items: [
        await Submenu.new({
          text: "File",
          items: [
            await MenuItem.new({
              id: "new",
              text: "New Program",
              action: async () => {
                const program = LadderDiagram.empty();
                await Promise.all([
                  state.set("program", program.toObject()),
                  state.delete("program-path"),
                  program.render(),
                ]);
                await state.save();
              },
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
                try {
                  const program = await LadderDiagram.load(path!);
                  await Promise.all([
                    state.set("program", program.toObject()),
                    state.set("program-path", path),
                    program.render(),
                  ]);
                  await state.save();
                } catch (error) {
                  Console.error("Invalid ladder program");
                }
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
                  defaultPath:
                    (await state.get<string>("program-path")) ??
                    (await appDataDir()),
                });
                const program = LadderDiagram.fromObject(
                  (await state.get<Object>("program"))!,
                );
                await Promise.all([
                  state.set("program-path", path),
                  program.save(path!),
                ]);
              },
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

    await menu.setAsAppMenu();
  }
}
