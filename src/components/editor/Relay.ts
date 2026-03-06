import { LazyStore } from "@tauri-apps/plugin-store";
import { v4 as uuid } from "uuid";

import validate from "../../../lib/validate";
import { LadderDiagram } from "./LadderDiagram";

const cache = new LazyStore("cache/cache");

export class Relay {
  id: string;
  address: string;
  label: string;
  isOpen: boolean;
  isOutput: boolean;

  constructor(
    id: string,
    address: string,
    label: string,
    isOpen: boolean = true,
    isOutput: boolean = false,
  ) {
    this.id = id;
    this.address = address;
    this.label = label;
    this.isOpen = isOpen;
    this.isOutput = isOutput;
  }

  toObject(): Object {
    return {
      id: this.id,
      address: this.address,
      label: this.label,
      isOpen: this.isOpen,
      isOutput: this.isOutput,

      __type: "Relay",
    };
  }
  static fromObject(object: Object): Relay {
    const { id, address, label, isOpen, isOutput } = validate(object, "Relay", [
      "address",
      "label",
      "isOpen",
      "isOutput",
      "id",
    ]);

    return new Relay(id, address, label, isOpen, isOutput);
  }

  toDiv(): HTMLDivElement {
    const relay = document.createElement("div");
    relay.classList.add("relay");
    relay.id = this.id;

    const address = document.createElement("span");
    address.classList.add("relay-address");
    address.textContent = this.address;
    address.addEventListener("mouseenter", () => {
      address.contentEditable = "true";
    });
    address.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        address.blur();
      }
    });
    address.addEventListener("blur", async () => {
      address.contentEditable = "false";
      if (this.address === address.textContent) {
        return;
      }
      this.address = address.textContent ?? "";

      let program = LadderDiagram.fromObject(
        (await cache.get<Object>("program"))!,
      );
      program = await program.withUpdatedRelay({ ...this });
      await cache.set("program", program.toObject());
    });
    relay.appendChild(address);

    const icon = document.createElement("div");
    icon.classList.add("relay-icon");
    if (this.isOutput) {
      icon.textContent = `(${this.isOpen ? " " : "/"})`;
    } else {
      icon.textContent = `]${this.isOpen ? " " : "/"}[`;
    }
    icon.addEventListener("click", async () => {
      this.isOpen = !this.isOpen;
      if (this.isOutput) {
        icon.textContent = `(${this.isOpen ? " " : "/"})`;
      } else {
        icon.textContent = `]${this.isOpen ? " " : "/"}[`;
      }

      let program = LadderDiagram.fromObject(
        (await cache.get<Object>("program"))!,
      );
      program = await program.withUpdatedRelay({ ...this });
      await cache.set("program", program.toObject());
    });
    relay.appendChild(icon);

    const label = document.createElement("span");
    label.classList.add("relay-label");
    label.textContent = `"${this.label}"`;
    relay.appendChild(label);

    relay.draggable = true;
    relay.addEventListener("dragstart", async (event) => {
      relay.id = "dragged";
      event.dataTransfer!.setData("relay", "");
      await cache.set("dragged-relay", {
        id: this.id ?? uuid(),
        ...this.toObject(),
      });
    });
    relay.addEventListener("drag", (event) => {
      event.preventDefault();
    });
    relay.addEventListener("dragend", () => {
      relay.removeAttribute("id");
    });

    const leftDropzone = document.createElement("div");
    leftDropzone.classList.add("left-dropzone");
    leftDropzone.textContent = "+";
    leftDropzone.id = uuid();
    relay.appendChild(leftDropzone);

    const rightDropzone = document.createElement("div");
    rightDropzone.classList.add("right-dropzone");
    rightDropzone.textContent = "+";
    rightDropzone.id = uuid();
    relay.appendChild(rightDropzone);

    return relay;
  }
}
