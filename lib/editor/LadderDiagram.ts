import { writeFile, readFile } from "@tauri-apps/plugin-fs";
import { v4 as uuid } from "uuid";

import { Network } from "./Network";
import { ConjunctiveNode } from "./ConjunctiveNode";
import { DisjunctiveNode } from "./DisjunctiveNode";
import { OutputNode } from "./OutputNode";
import { RelayNode } from "./RelayNode";
import { Logs } from "../logs/Logs";

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
      throw new Error(Logs.error("Object is not a valid LadderDiagram"));
    }

    return new LadderDiagram(
      networks.map((network: Object) => Network.fromObject(network)),
    );
  }

  async render() {
    const diagram = document.getElementById("ladder-diagram")!;
    await Promise.all(
      [...diagram.children].map((child) => diagram.removeChild(child)),
    );

    await Promise.all(
      this.networks.map((network) => diagram.appendChild(network.render())),
    );
  }

  async withUpdatedNode(node: RelayNode): Promise<LadderDiagram> {
    return new LadderDiagram(
      await Promise.all(
        this.networks.map((network) => network.withUpdatedNode(node)),
      ),
    );
  }

  async withMovedNode(
    node: RelayNode,
    destinationId: string,
  ): Promise<LadderDiagram> {
    return new LadderDiagram(
      await Promise.all(
        this.networks.map((network) =>
          network.withMovedNode(node, destinationId),
        ),
      ),
    );
  }

  static async load(path: string): Promise<LadderDiagram> {
    const decoder = new TextDecoder();
    const bytes = await readFile(path);
    const content = decoder.decode(bytes);
    const json = JSON.parse(content);
    Logs.info(`Loading program from ${path}`);
    return LadderDiagram.fromObject(json);
  }
  async save(path: string, quiet: boolean = false): Promise<void> {
    const encoder = new TextEncoder();
    const json = JSON.stringify(this.toObject());
    const bytes = encoder.encode(json);
    await writeFile(path, bytes);
    if (!quiet) {
      Logs.info(`Saving program at ${path}`);
    }
  }

  static empty(): LadderDiagram {
    Logs.info("Loading empty LadderDiagram");
    return new LadderDiagram([
      new Network(
        uuid(),
        "Network 1",
        new ConjunctiveNode(uuid(), []),
        new ConjunctiveNode(uuid(), []),
      ),
    ]);
  }
  static example = new LadderDiagram([
    new Network(
      uuid(),
      "Network 1",
      new ConjunctiveNode(uuid(), [new RelayNode(uuid(), "%I0.0", "START")]),
      new ConjunctiveNode(uuid(), [new OutputNode(uuid(), "%Q0.0", "LED")]),
    ),
    new Network(
      uuid(),
      "Network 2",
      new ConjunctiveNode(uuid(), [
        new RelayNode(uuid(), "%I0.0", "START"),
        new RelayNode(uuid(), "%I0.1", "STOP", false),
      ]),
      new ConjunctiveNode(uuid(), [new OutputNode(uuid(), "%Q0.0", "LED")]),
    ),
    new Network(
      uuid(),
      "Network 3",
      new DisjunctiveNode(uuid(), [
        new ConjunctiveNode(uuid(), [new RelayNode(uuid(), "%I0.0", "START")]),
        new ConjunctiveNode(uuid(), [new RelayNode(uuid(), "%Q0.0", "LED")]),
      ]),
      new ConjunctiveNode(uuid(), [new OutputNode(uuid(), "%Q0.0", "LED")]),
    ),
    new Network(
      uuid(),
      "Network 4",
      new DisjunctiveNode(uuid(), [
        new ConjunctiveNode(uuid(), [
          new RelayNode(uuid(), "%I0.0", "START"),
          new RelayNode(uuid(), "%I0.1", "STOP", false),
        ]),
        new ConjunctiveNode(uuid(), [new RelayNode(uuid(), "%Q0.0", "LED")]),
      ]),
      new ConjunctiveNode(uuid(), [new OutputNode(uuid(), "%Q0.0", "LED")]),
    ),
  ]);
}
