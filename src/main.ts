import { Editor } from "../lib/editor/Editor";
import { LadderDiagram } from "../lib/editor/LadderDiagram";

try {
  const body = document.getElementsByTagName("body")[0];

  const editor = new Editor(LadderDiagram.example);
  body.appendChild(editor.render());
} catch (error) {
  alert(error);
}
