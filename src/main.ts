import { Editor } from "../lib/editor/Editor";
import { Menu } from "../lib/menu/Menu";
import { LadderDiagram } from "../lib/editor/LadderDiagram";

try {
  const body = document.getElementsByTagName("body")[0];

  const example = await LadderDiagram.load("ladder_example.json");
  await example.save("ladder_example.json");

  const editor = new Editor(example);
  await Menu.setAsAppMenu();
  body.appendChild(editor.render());
} catch (error) {
  alert(error);
}
