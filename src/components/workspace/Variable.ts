import { Type } from "../runtime/Type";

export class Variable {
  address: string;
  label: string;
  type: Type;

  constructor(address: string, label: string, type: Type) {
    this.address = address;
    this.label = label;
    this.type = type;
  }

  render(): HTMLDivElement {
    const variable = document.createElement("div");
    variable.classList.add("variable");

    const address = document.createElement("span");
    address.textContent = this.address;
    address.classList.add("address");
    address.addEventListener("mouseenter", () => {
      address.contentEditable = "true";
    });
    address.addEventListener("blur", () => {
      address.contentEditable = "false";
    });
    variable.appendChild(address);

    const label = document.createElement("span");
    label.textContent = this.label;
    label.classList.add("label");
    label.addEventListener("mouseenter", () => {
      label.contentEditable = "true";
    });
    label.addEventListener("blur", () => {
      label.contentEditable = "false";
    });
    variable.appendChild(label);

    const type = document.createElement("span");
    type.textContent = this.type;
    type.classList.add("type");
    type.addEventListener("mouseenter", () => {
      type.contentEditable = "true";
    });
    type.addEventListener("blur", () => {
      type.contentEditable = "false";
    });
    variable.appendChild(type);

    return variable;
  }
}
