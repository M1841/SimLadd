import { Menu, MenuItem, Submenu } from "@tauri-apps/api/menu";
import { appDataDir } from "@tauri-apps/api/path";
import { open, save } from "@tauri-apps/plugin-dialog";

const fileSubmenu = await Submenu.new({
  text: "File",
  items: [
    await MenuItem.new({
      id: "new",
      text: "New",
      action: () => {},
    }),
    await MenuItem.new({
      id: "open",
      text: "Open",
      action: async () => {
        const path = await open({
          title: "Open a project",
          multiple: false,
          directory: false,
          filters: [
            {
              name: "JSON",
              extensions: ["json"],
            },
          ],
          defaultPath: await appDataDir(),
        });
        console.log(path);
      },
    }),
    await MenuItem.new({
      id: "save",
      text: "Save",
      action: async () => {
        const path = await save({
          title: "Save project",
          filters: [
            {
              name: "JSON",
              extensions: ["json"],
            },
          ],
          defaultPath: await appDataDir(),
        });
        console.log(path);
      },
    }),
  ],
});

const menu = await Menu.new({
  items: [fileSubmenu],
});

export { menu as Menu };
