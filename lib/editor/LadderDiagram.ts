import {
  readTextFile,
  writeTextFile,
  BaseDirectory,
} from "@tauri-apps/plugin-fs";

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

  toObject(): Object {
    return {
      networks: this.networks.map((network) => network.toObject()),

      __type: "LadderDiagram",
    };
  }
  static fromObject(object: Object): LadderDiagram {
    const entries = Object.entries(object);

    const __type = entries.find(([key, _]) => key === "__type")?.[1];
    const networks = entries.find(([key, _]) => key === "networks")?.[1];

    if (
      __type === undefined ||
      __type !== "LadderDiagram" ||
      networks === undefined ||
      networks.map === undefined
    ) {
      throw new Error("Object is not a valid LadderDiagram");
    }

    return new LadderDiagram(
      networks.map((network: Object) => Network.fromObject(network)),
    );
  }

  render(): HTMLDivElement {
    const diagram = document.createElement("div");
    diagram.classList.add("ladder-diagram");

    this.networks.forEach((network) => {
      diagram.appendChild(network.render());
    });

    return diagram;
  }

  static async load(path: string): Promise<LadderDiagram> {
    const content = await readTextFile(path, {
      baseDir: BaseDirectory.AppData,
    });
    const json = JSON.parse(content);
    return LadderDiagram.fromObject(json);
  }

  async save(path: string): Promise<void> {
    await writeTextFile(path, JSON.stringify(this.toObject()), {
      baseDir: BaseDirectory.AppData,
    });
  }

  static example = new LadderDiagram([
    new Network(
      "Network 1",
      new ConjunctiveNode([new RelayNode("%I0.0", "START")]),
      new ConjunctiveNode([new OutputNode("%Q0.0", "LED")]),
    ),
    new Network(
      "Network 2",
      new ConjunctiveNode([
        new RelayNode("%I0.0", "START"),
        new RelayNode("%I0.1", "STOP", false),
      ]),
      new ConjunctiveNode([new OutputNode("%Q0.0", "LED")]),
    ),
    new Network(
      "Network 3",
      new DisjunctiveNode([
        new ConjunctiveNode([new RelayNode("%I0.0", "START")]),
        new ConjunctiveNode([new RelayNode("%Q0.0", "LED")]),
      ]),
      new ConjunctiveNode([new OutputNode("%Q0.0", "LED")]),
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
      new ConjunctiveNode([new OutputNode("%Q0.0", "LED")]),
    ),
  ]);
}
