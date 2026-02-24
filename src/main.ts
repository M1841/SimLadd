import { LazyStore } from "@tauri-apps/plugin-store";
const store = new LazyStore("state.json");

import { Menu } from "../lib/menu/Menu";
import { LadderDiagram } from "../lib/editor/LadderDiagram";
import { Editor } from "../lib/editor/Editor";
// import { Workspace } from "../lib/workspace/Workspace";

try {
  const body = document.getElementsByTagName("body")[0];

  const example = LadderDiagram.example;
  // const example = await LadderDiagram.load("example.ladd");
  await store.set("program", example.toObject());
  await example.save("example.ladd");

  await Menu.setAsAppMenu();
  const editor = new Editor(example);
  // const workspace = new Workspace();
  body.appendChild(editor.render());
  // body.appendChild(workspace.render());
} catch (error) {
  alert(error);
}
