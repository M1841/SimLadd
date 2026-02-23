import { Menu } from "../lib/menu/Menu";
import { Editor } from "../lib/editor/Editor";
import { Workspace } from "../lib/workspace/Workspace";
import { LadderDiagram } from "../lib/editor/LadderDiagram";

try {
  const body = document.getElementsByTagName("body")[0];

  const example = await LadderDiagram.load("example.ladd");
  await example.save("example.ladd");

  await Menu.setAsAppMenu();
  const editor = new Editor(example);
  const workspace = new Workspace();
  body.appendChild(editor.render());
  // body.appendChild(workspace.render());
} catch (error) {
  alert(error);
}
