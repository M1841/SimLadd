import { LadderDiagram } from "./LadderDiagram";

export class Editor {
  diagram: LadderDiagram;

  constructor(diagram: LadderDiagram) {
    this.diagram = diagram;
  }

  async render() {
    await this.diagram.render();
  }
}
