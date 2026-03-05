import { LazyStore } from "@tauri-apps/plugin-store";
const state = new LazyStore("data/state.json");

import { Menu } from "./components/menu/Menu";
import { LadderDiagram } from "./components/editor/LadderDiagram";
import { Editor } from "./components/editor/Editor";
import { Workspace } from "./components/workspace/Workspace";
import { Console } from "./components/console/Console";

try {
  const program = await LadderDiagram.empty();
  await Promise.all([
    state.set("program", program.toObject()),
    Menu.render(),
    new Editor(program).render(),
    new Workspace().render(),
  ]);
} catch (error) {
  Console.error(error as string);
}
