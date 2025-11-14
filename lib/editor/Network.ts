import { ConjunctiveNode } from "./ConjunctiveNode";
import { Node } from "./Node";
import { OutputNode } from "./OutputNode";

export class Network {
  name: string;
  input: Node;
  outputs: OutputNode[];

  constructor(name: string, input: Node, outputs: OutputNode[]) {
    this.name = name;
    this.input = input;
    this.outputs = outputs;
  }

  render(): HTMLDivElement {
    const network = document.createElement("div");
    network.classList.add("network");

    const networkName = document.createElement("div");
    networkName.textContent = "▼ " + this.name;
    network.appendChild(networkName);

    const nodes = document.createElement("div");
    nodes.classList.add("network-nodes");

    const inputNodes = this.input.render();
    nodes.appendChild(inputNodes);

    const outputNodes = new ConjunctiveNode(this.outputs).render();
    nodes.appendChild(outputNodes);

    network.appendChild(nodes);

    return network;
  }
}
