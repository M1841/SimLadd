import { LazyStore } from "@tauri-apps/plugin-store";
const store = new LazyStore("state.json");

import { Node } from "./Node";
import { LadderDiagram } from "./LadderDiagram";
import { OutputNode } from "./OutputNode";

export class RelayNode implements Node {
  id: string;
  address: string;
  label: string;
  isOpen: boolean;

  constructor(
    id: string,
    address: string,
    label: string,
    isOpen: boolean = true,
  ) {
    this.id = id;
    this.address = address;
    this.label = label;
    this.isOpen = isOpen;
  }

  toObject(): Object {
    return {
      id: this.id,
      address: this.address,
      label: this.label,
      isOpen: this.isOpen,

      __type: "RelayNode",
    };
  }

  static fromObject(object: Object): RelayNode {
    const entries = Object.entries(object);

    const __type = entries.find(([key, _]) => key === "__type")?.[1];
    const address = entries.find(([key, _]) => key === "address")?.[1];
    const label = entries.find(([key, _]) => key === "label")?.[1];
    const isOpen = entries.find(([key, _]) => key === "isOpen")?.[1];
    const id = entries.find(([key, _]) => key === "id")?.[1];

    if (
      __type === undefined ||
      __type !== "RelayNode" ||
      address === undefined ||
      label === undefined ||
      isOpen === undefined ||
      id === undefined
    ) {
      throw new Error("Object is not a valid RelayNode");
    }

    return new RelayNode(id, address, label, isOpen);
  }

  render(): HTMLDivElement {
    const node = document.createElement("div");
    node.classList.add("relay-node");

    const address = document.createElement("span");
    address.classList.add("node-address");
    address.textContent = this.address;
    address.contentEditable = "true";
    address.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        address.blur();
      }
    });
    address.addEventListener("blur", async () => {
      if (this.address === address.textContent) {
        return;
      }
      let program = LadderDiagram.fromObject(
        (await store.get<Object>("program"))!,
      );
      program = program.withNode(this.id, {
        ...this,
        address: address.textContent ?? "",
      });
      await store.set("program", program.toObject());
      await store.save();
      this.address = address.textContent ?? "";
    });
    node.appendChild(address);

    const icon = document.createElement("div");
    icon.classList.add("node-icon");
    if (this instanceof OutputNode) {
      icon.textContent = `(${this.isOpen ? " " : "/"})`;
    } else {
      icon.textContent = `]${this.isOpen ? " " : "/"}[`;
    }
    icon.addEventListener("click", async () => {
      let program = LadderDiagram.fromObject(
        (await store.get<Object>("program"))!,
      );
      program = program.withNode(this.id, {
        ...this,
        isOpen: !this.isOpen,
      });
      await store.set("program", program.toObject());
      await store.save();
      this.isOpen = !this.isOpen;
      if (this instanceof OutputNode) {
        icon.textContent = `(${this.isOpen ? " " : "/"})`;
      } else {
        icon.textContent = `]${this.isOpen ? " " : "/"}[`;
      }
    });
    node.appendChild(icon);

    const label = document.createElement("span");
    label.classList.add("node-label");
    label.textContent = `"${this.label}"`;
    node.appendChild(label);

    node.draggable = true;
    node.addEventListener("dragstart", async (event) => {
      node.id = "dragged";
      event.dataTransfer!.setData("relay-node", "");
      await store.set("dragged", { id: this.id, ...this.toObject() });
      await store.save();
    });
    node.addEventListener("drag", (event) => {
      event.preventDefault();
    });
    node.addEventListener("dragend", () => {
      node.removeAttribute("id");
    });

    return node;
  }
}
