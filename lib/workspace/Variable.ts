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
    const variable = document.createElement("tr");
    variable.classList.add("variable");

    const address = document.createElement("td");
    address.textContent = this.address;
    variable.appendChild(address);

    const label = document.createElement("td");
    label.textContent = this.label;
    variable.appendChild(label);

    const type = document.createElement("td");
    type.textContent = this.type;
    variable.appendChild(type);

    return variable;
  }
}
