import { Variable } from "./Variable";
import { Type } from "../runtime/Type";

export class Workspace {
  variables: Variable[] = [
    new Variable("%I0.0", "START", Type.Bit),
    new Variable("%I0.1", "STOP", Type.Bit),
    new Variable("%Q0.0", "LED", Type.Bit),
  ];

  render(): HTMLDivElement {
    const workspace = document.createElement("table");
    workspace.classList.add("workspace");

    const header = document.createElement("tr");
    workspace.appendChild(header);

    const address = document.createElement("th");
    address.textContent = "Address";
    header.appendChild(address);

    const label = document.createElement("th");
    label.textContent = "Label";
    header.appendChild(label);

    const type = document.createElement("th");
    type.textContent = "Type";
    header.appendChild(type);

    this.variables.forEach((variable) => {
      workspace.appendChild(variable.render());
    });

    return workspace;
  }
}
