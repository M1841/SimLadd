import { LazyStore } from "@tauri-apps/plugin-store";
const state = new LazyStore("state.json");

import { Menu } from "../lib/menu/Menu";
import { LadderDiagram } from "../lib/editor/LadderDiagram";
import { Editor } from "../lib/editor/Editor";
// import { Workspace } from "../lib/workspace/Workspace";

try {
  const program = LadderDiagram.empty;
  await state.set("program", program.toObject());

  await LadderDiagram.example.save(
    "C:\\Users\\mihai.muresan\\AppData\\Roaming\\com.simladd.app\\example.ladd",
  );

  await Menu.render();

  const editor = new Editor(program);
  await editor.render();
} catch (error) {
  alert(error);
}
