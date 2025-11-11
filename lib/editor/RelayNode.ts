import { Node } from "./Node";
import { OutputNode } from "./OutputNode";

export class RelayNode implements Node {
  address: string;
  label: string;
  isOpen: boolean;

  constructor(address: string, label: string, isOpen: boolean = true) {
    this.address = address;
    this.label = label;
    this.isOpen = isOpen;
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
    address.addEventListener("blur", () => {
      this.address = address.textContent;
      console.log(this);
    });
    node.appendChild(address);

    const icon = document.createElement("div");
    icon.classList.add("node-icon");
    if (this instanceof OutputNode) {
      icon.textContent = `——(${this.isOpen ? " " : "/"})——`;
    } else {
      icon.textContent = `——]${this.isOpen ? " " : "/"}[——`;
    }
    node.appendChild(icon);

    const label = document.createElement("span");
    label.classList.add("node-label");
    label.textContent = `"${this.label}"`;
    node.appendChild(label);

    return node;
  }
}
