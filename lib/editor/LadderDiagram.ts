import { ConjunctiveNode } from "./ConjunctiveNode";
import { DisjunctiveNode } from "./DisjunctiveNode";
import { Network } from "./Network";
import { OutputNode } from "./OutputNode";
import { RelayNode } from "./RelayNode";

export class LadderDiagram {
  networks: Network[];

  constructor(networks: Network[]) {
    this.networks = networks;
  }

  render(): HTMLDivElement {
    const diagram = document.createElement("div");
    diagram.classList.add("ladder-diagram");

    this.networks.forEach((network) => {
      diagram.appendChild(network.render());
    });

    return diagram;
  }

  static example = new LadderDiagram([
    new Network(
      "Network 1",
      new ConjunctiveNode([new RelayNode("%I0.0", "START")]),
      new ConjunctiveNode([new OutputNode("%Q0.0", "LED")])
    ),
    new Network(
      "Network 2",
      new ConjunctiveNode([
        new RelayNode("%I0.0", "START"),
        new RelayNode("%I0.1", "STOP", false),
      ]),
      new ConjunctiveNode([new OutputNode("%Q0.0", "LED")])
    ),
    new Network(
      "Network 3",
      new DisjunctiveNode([
        new ConjunctiveNode([new RelayNode("%I0.0", "START")]),
        new ConjunctiveNode([new RelayNode("%Q0.0", "LED")]),
      ]),
      new ConjunctiveNode([new OutputNode("%Q0.0", "LED")])
    ),
    new Network(
      "Network 4",
      new DisjunctiveNode([
        new ConjunctiveNode([
          new RelayNode("%I0.0", "START"),
          new RelayNode("%I0.1", "STOP", false),
        ]),
        new ConjunctiveNode([new RelayNode("%Q0.0", "LED")]),
      ]),
      new ConjunctiveNode([new OutputNode("%Q0.0", "LED")])
    ),
  ]);
}
