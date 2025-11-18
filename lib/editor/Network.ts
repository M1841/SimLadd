import { ConjunctiveNode } from "./ConjunctiveNode";
import { ExpressionNode } from "./ExpressionNode";

export class Network {
  name: string;
  input: ExpressionNode;
  outputs: ConjunctiveNode;

  constructor(name: string, input: ExpressionNode, outputs: ConjunctiveNode) {
    this.name = name;
    this.input = input;
    this.outputs = outputs;
  }

  render(): HTMLDivElement {
    const network = document.createElement("div");
    network.classList.add("network");

    const header = document.createElement("div");
    header.classList.add("network-header");

    const collapseButton = document.createElement("div");
    collapseButton.classList.add("network-collapse-button");
    collapseButton.textContent = "▾";
    header.appendChild(collapseButton);

    const name = document.createElement("div");
    name.textContent = this.name;
    header.appendChild(name);

    network.appendChild(header);

    const nodes = document.createElement("div");
    nodes.classList.add("network-nodes");

    const inputNodes = this.input.render();
    nodes.appendChild(inputNodes);

    const outputNodes = this.outputs.render();
    nodes.appendChild(outputNodes);

    header.addEventListener("click", () => {
      if (nodes.classList.contains("collapsed")) {
        nodes.classList.remove("collapsed");
        collapseButton.textContent = "▾";
      } else {
        nodes.classList.add("collapsed");
        collapseButton.textContent = "▴";
      }
    });

    network.appendChild(nodes);

    return network;
  }
}
