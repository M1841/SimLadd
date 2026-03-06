import { VarType } from "../runtime/VarType";

export class Variable {
  address: string;
  label: string;
  varType: VarType;

  constructor(address: string, label: string, vartype: VarType) {
    this.address = address;
    this.label = label;
    this.varType = vartype;
  }

  toObject(): Object {
    return {
      address: this.address,
      label: this.label,
      varType: this.varType,

      __type: "Variable",
    };
  }

  toDiv(): HTMLDivElement {
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

    const varType = document.createElement("span");
    varType.textContent = this.varType;
    varType.classList.add("varType");
    varType.addEventListener("mouseenter", () => {
      varType.contentEditable = "true";
    });
    varType.addEventListener("blur", () => {
      varType.contentEditable = "false";
    });
    variable.appendChild(varType);

    return variable;
  }
}
