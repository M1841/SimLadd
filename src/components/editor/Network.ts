import validate from "../../../lib/validate";
import { Conjunction } from "./Conjunction";
import { Relay } from "./Relay";

export class Network {
  id: string;
  name: string;
  input: Conjunction;
  output: Conjunction;

  constructor(
    id: string,
    name: string,
    input: Conjunction,
    outputs: Conjunction,
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
    const { name, input, output, id } = validate(object, "Network", [
      "name",
      "input",
      "output",
      "id",
    ]);

    return new Network(
      id,
      name,
      Conjunction.fromObject(input),
      Conjunction.fromObject(output),
    );
  }

  toDiv(): HTMLDivElement {
    const network = document.createElement("div");
    network.classList.add("network");
    network.id = this.id;

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

    const inputNodes = this.input.toDiv();
    nodes.appendChild(inputNodes);

    const outputNodes = this.output.toDiv();
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

  async withUpdatedRelay(relay: Relay): Promise<Network> {
    const [input, output] = await Promise.all([
      this.input.withUpdatedRelay(relay),
      this.output.withUpdatedRelay(relay),
    ]);
    return new Network(this.id, this.name, input, output);
  }

  async withMovedRelay(relay: Relay, destinationId: string): Promise<Network> {
    const [input, output] = await Promise.all([
      this.input.withMovedRelay(relay, destinationId),
      this.output.withMovedRelay(relay, destinationId),
    ]);
    return new Network(this.id, this.name, input, output);
  }
}
