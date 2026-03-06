import { readFile, writeFile } from "@tauri-apps/plugin-fs";
import { LazyStore } from "@tauri-apps/plugin-store";
import { v4 as uuid } from "uuid";

import { appDataDir, join } from "@tauri-apps/api/path";
import validate from "../../../lib/validate";
import { Console } from "../console/Console";
import { Conjunction } from "./Conjunction";
import { Disjunction } from "./Disjunction";
import { Network } from "./Network";
import { Relay } from "./Relay";

const cache = new LazyStore("cache/cache");

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
    const { networks } = validate(object, "LadderDiagram", ["networks"]);

    if (!Array.isArray(networks)) {
      throw new Error(Console.error("Object is not a valid LadderDiagram"));
    }

    return new LadderDiagram(
      networks.map((network: Object) => Network.fromObject(network)),
    );
  }

  async render() {
    const diagram = document.getElementById("ladder-diagram")!;
    [...diagram.children].forEach((child) => diagram.removeChild(child));
    this.networks.forEach((network) => diagram.appendChild(network.toDiv()));
  }

  async withUpdatedRelay(relay: Relay): Promise<LadderDiagram> {
    await cache.set("isSaved", false);
    return new LadderDiagram(
      await Promise.all(
        this.networks.map((network) => network.withUpdatedRelay(relay)),
      ),
    );
  }
  async withMovedRelay(
    relay: Relay,
    destinationId: string,
  ): Promise<LadderDiagram> {
    await cache.set("isSaved", false);
    return new LadderDiagram(
      await Promise.all(
        this.networks.map((network) =>
          network.withMovedRelay(relay, destinationId),
        ),
      ),
    );
  }

  static async load(path: string): Promise<LadderDiagram> {
    Console.info(`opening program from ${path}`);
    const decoder = new TextDecoder();
    const [bytes, _] = await Promise.all([
      readFile(path),
      cache.set("isSaved", true),
    ]);
    const content = decoder.decode(bytes);
    const json = JSON.parse(content);
    return LadderDiagram.fromObject(json);
  }
  async save(path: string, quiet: boolean = false): Promise<void> {
    if (path == (await join(await appDataDir(), "template", "example.ladd"))) {
      Console.error(
        "cannot overwrite the builtin example program, save under a different name or path",
      );
      return;
    }
    const encoder = new TextEncoder();
    const json = JSON.stringify(this.toObject());
    const bytes = encoder.encode(json);
    await Promise.all([writeFile(path, bytes), cache.set("isSaved", true)]);
    if (!quiet) {
      Console.info(`saving program at ${path}`);
    }
  }

  static async empty(): Promise<LadderDiagram> {
    Console.info("initializing program");
    await cache.delete("program-path");
    return new LadderDiagram([
      new Network(
        uuid(),
        "Network 1",
        new Conjunction(uuid(), []),
        new Conjunction(uuid(), []),
      ),
    ]);
  }
  static example = new LadderDiagram([
    new Network(
      uuid(),
      "Network 1",
      new Conjunction(uuid(), [new Relay(uuid(), "%I0.0", "START")]),
      new Conjunction(uuid(), [new Relay(uuid(), "%Q0.0", "LED", true, true)]),
    ),
    new Network(
      uuid(),
      "Network 2",
      new Conjunction(uuid(), [
        new Relay(uuid(), "%I0.0", "START"),
        new Relay(uuid(), "%I0.1", "STOP", false),
      ]),
      new Conjunction(uuid(), [new Relay(uuid(), "%Q0.0", "LED", true, true)]),
    ),
    new Network(
      uuid(),
      "Network 3",
      new Conjunction(uuid(), [
        new Disjunction(uuid(), [
          new Conjunction(uuid(), [new Relay(uuid(), "%I0.0", "START")]),
          new Conjunction(uuid(), [new Relay(uuid(), "%Q0.0", "LED")]),
        ]),
      ]),
      new Conjunction(uuid(), [new Relay(uuid(), "%Q0.0", "LED", true, true)]),
    ),
    new Network(
      uuid(),
      "Network 4",
      new Conjunction(uuid(), [
        new Disjunction(uuid(), [
          new Conjunction(uuid(), [
            new Relay(uuid(), "%I0.0", "START"),
            new Relay(uuid(), "%I0.1", "STOP", false),
          ]),
          new Conjunction(uuid(), [new Relay(uuid(), "%Q0.0", "LED")]),
        ]),
      ]),
      new Conjunction(uuid(), [new Relay(uuid(), "%Q0.0", "LED", true, true)]),
    ),
  ]);
}
