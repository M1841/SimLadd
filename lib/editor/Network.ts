import { ConjunctiveNode } from "./ConjunctiveNode";
import { ExpressionNode } from "./ExpressionNode";
import { getExpressionType } from "./utils";
import { RelayNode } from "./RelayNode";

export class Network {
  id: string;
  name: string;
  input: ExpressionNode;
  output: ConjunctiveNode;

  constructor(
    id: string,
    name: string,
    input: ExpressionNode,
    outputs: ConjunctiveNode,
  ) {
    this.id = id;
    this.name = name;
    this.input = input;
    this.output = outputs;
  }

  toObject(): Object {
    return {
      id: this.id,
      name: this.name,
      input: this.input.toObject(),
      output: this.output.toObject(),

      __type: "Network",
    };
  }
  static fromObject(object: Object): Network {
    const entries = Object.entries(object);

    const __type = entries.find(([key, _]) => key === "__type")?.[1];
    const name = entries.find(([key, _]) => key === "name")?.[1];
    const input = entries.find(([key, _]) => key === "input")?.[1];
    const output = entries.find(([key, _]) => key === "output")?.[1];
    const id = entries.find(([key, _]) => key === "id")?.[1];

    if (
      __type === undefined ||
      __type !== "Network" ||
      name === undefined ||
      input === undefined ||
      output === undefined ||
      id === undefined
    ) {
      throw new Error("Object is not a valid Network");
    }

    const inputType = getExpressionType(input);

    return new Network(
      id,
      name,
      inputType.fromObject(input),
      ConjunctiveNode.fromObject(output),
    );
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

    const outputNodes = this.output.render();
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

  withNode(id: string, value: RelayNode): Network {
    return new Network(
      this.id,
      this.name,
      this.input.withNode(id, value),
      this.output.withNode(id, value),
    );
  }
}
