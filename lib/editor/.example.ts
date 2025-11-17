import { ConjunctiveNode } from "./ConjunctiveNode";
import { DisjunctiveNode } from "./DisjunctiveNode";
import { Network } from "./Network";
import { OutputNode } from "./OutputNode";
import { RelayNode } from "./RelayNode";

export function renderExample() {
  const simpleNetwork = new Network(
    "Network 1",
    new ConjunctiveNode([new RelayNode("%I0.0", "START")]),
    new ConjunctiveNode([new OutputNode("%Q0.0", "LED")])
  );
  const conjunctiveInputNetwork = new Network(
    "Network 2",
    new ConjunctiveNode([
      new RelayNode("%I0.0", "START"),
      new RelayNode("%I0.1", "STOP", false),
    ]),
    new ConjunctiveNode([new OutputNode("%Q0.0", "LED")])
  );
  const disjunctiveInputNetwork = new Network(
    "Network 3",
    new DisjunctiveNode([
      new ConjunctiveNode([new RelayNode("%I0.0", "START")]),
      new ConjunctiveNode([new RelayNode("%Q0.0", "LED")]),
    ]),
    new ConjunctiveNode([new OutputNode("%Q0.0", "LED")])
  );
  const nestedInputNetwork = new Network(
    "Network 4",
    new DisjunctiveNode([
      new ConjunctiveNode([
        new RelayNode("%I0.0", "START"),
        new RelayNode("%I0.1", "STOP", false),
      ]),
      new ConjunctiveNode([new RelayNode("%Q0.0", "LED")]),
    ]),
    new ConjunctiveNode([new OutputNode("%Q0.0", "LED")])
  );

  const sample = document.createElement("div");
  sample.style.display = "flex";
  sample.style.flexDirection = "column";
  sample.style.gap = "50px";
  sample.style.padding = "18px";

  [
    simpleNetwork,
    conjunctiveInputNetwork,
    disjunctiveInputNetwork,
    nestedInputNetwork,
  ].forEach((network) => {
    sample.appendChild(network.render());
  });

  document.getElementsByTagName("body")[0].appendChild(sample);
}
