import { ConjunctiveNode } from "./ConjunctiveNode";
import { Node } from "./Node";
import { OutputNode } from "./OutputNode";

export class Network {
  input: Node;
  outputs: OutputNode[];

  constructor(input: Node, outputs: OutputNode[]) {
    this.input = input;
    this.outputs = outputs;
  }

  render(): HTMLDivElement {
    const network = document.createElement("div");
    network.classList.add("network");

    const inputNodes = this.input.render();
    network.appendChild(inputNodes);

    const outputNodes = new ConjunctiveNode(this.outputs).render();
    network.appendChild(outputNodes);

    return network;
  }
}
