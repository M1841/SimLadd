import { Variable } from "./Variable";
import { Type } from "../runtime/Type";

export class Workspace {
  variables: Variable[] = [
    new Variable("%I0.0", "START", Type.Bit),
    new Variable("%I0.1", "STOP", Type.Bit),
    new Variable("%Q0.0", "LED", Type.Bit),
  ];

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
      workspace.appendChild(variable.render());
    });
  }
}
