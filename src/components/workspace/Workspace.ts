import { VarType } from "../runtime/VarType";
import { Variable } from "./Variable";

export class Workspace {
  variables: Variable[] = [
    new Variable("%I0.0", "START", VarType.Bit),
    new Variable("%I0.1", "STOP", VarType.Bit),
    new Variable("%Q0.0", "LED", VarType.Bit),
  ];

  static isShown = true;

  static show() {
    const editor = document.getElementById("editor")!;
    const workspace = document.getElementById("workspace")!;
    editor.style.width = "calc(100vw - 18em)";
    workspace.style.width = "18em";
    workspace.style.display = "block";
    this.isShown = true;
  }

  static hide() {
    const editor = document.getElementById("editor")!;
    const workspace = document.getElementById("workspace")!;
    editor.style.width = "100vw";
    workspace.style.width = "0px";
    workspace.style.display = "none";
    this.isShown = false;
  }

  static toggle() {
    if (this.isShown) {
      this.hide();
    } else {
      this.show();
    }
  }

  render() {
    const workspace = document.getElementById("workspace")!;

    const header = document.createElement("div");
    header.classList.add("header");
    workspace.appendChild(header);

    const address = document.createElement("span");
    address.textContent = "Address";
    address.classList.add("address");
    header.appendChild(address);

    const label = document.createElement("span");
    label.textContent = "Label";
    label.classList.add("label");
    header.appendChild(label);

    const type = document.createElement("span");
    type.textContent = "Type";
    type.classList.add("type");
    header.appendChild(type);

    this.variables.forEach((variable) => {
      workspace.appendChild(variable.toDiv());
    });
  }
}
