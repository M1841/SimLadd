import { ExpressionNode } from "./ExpressionNode";

export class Network {
  name: string;
  input: ExpressionNode;
  outputs: ExpressionNode;

  constructor(name: string, input: ExpressionNode, outputs: ExpressionNode) {
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

    const outputNodes = this.outputs.render();
    nodes.appendChild(outputNodes);

    network.appendChild(nodes);

    return network;
  }
}
