import { Logs } from "../logs/Logs";
import { RelayNode } from "./RelayNode";

export class OutputNode extends RelayNode {
  toObject(): Object {
    return {
      id: this.id,
      address: this.address,
      label: this.label,
      isOpen: this.isOpen,

      __type: "OutputNode",
    };
  }

  static fromObject(object: Object): OutputNode {
    const entries = Object.entries(object);

    const __type = entries.find(([key, _]) => key === "__type")?.[1];
    const address = entries.find(([key, _]) => key === "address")?.[1];
    const label = entries.find(([key, _]) => key === "label")?.[1];
    const isOpen = entries.find(([key, _]) => key === "isOpen")?.[1];
    const id = entries.find(([key, _]) => key === "id")?.[1];

    if (
      __type === undefined ||
      __type !== "OutputNode" ||
      address === undefined ||
      label === undefined ||
      isOpen === undefined ||
      id === undefined
    ) {
      throw new Error(Logs.error("Object is not a valid OutputNode"));
    }

    return new OutputNode(id, address, label, isOpen);
  }
}
