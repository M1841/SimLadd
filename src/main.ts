import { appDataDir, join } from "@tauri-apps/api/path";
import { LazyStore } from "@tauri-apps/plugin-store";
const state = new LazyStore("data/state.json");

import { Menu } from "../lib/menu/Menu";
import { LadderDiagram } from "../lib/editor/LadderDiagram";
import { Editor } from "../lib/editor/Editor";
import { Workspace } from "../lib/workspace/Workspace";
import { Console } from "../lib/console/Console";

try {
  const program = LadderDiagram.empty();
  const examplePath = await join(await appDataDir(), "example.ladd");
  await Promise.all([
    state.set("program", program.toObject()),
    LadderDiagram.example.save(examplePath, true),
    Menu.render(),
    new Editor(program).render(),
    new Workspace().render(),
  ]);
} catch (error) {
  Console.error(error as string);
}
