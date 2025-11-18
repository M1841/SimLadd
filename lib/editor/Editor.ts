import { LadderDiagram } from "./LadderDiagram";

export class Editor {
  diagram: LadderDiagram;

  constructor(diagram: LadderDiagram) {
    this.diagram = diagram;
  }

  render(): HTMLDivElement {
    const editor = document.createElement("div");
    editor.classList.add("editor");

    editor.appendChild(this.diagram.render());

    return editor;
  }
}
