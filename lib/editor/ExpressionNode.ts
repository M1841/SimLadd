import { Operator } from "./Operator";
import { Node } from "./Node";

export class ExpressionNode implements Node {
  operator: Operator;
  operands: Node[];

  constructor(operator: Operator, operands: Node[]) {
    this.operator = operator;
    this.operands = operands;
  }

  render(): HTMLDivElement {
    const div = document.createElement("div");
    div.classList.add("expression-node");

    this.operands.forEach((operand) => {
      div.appendChild(operand.render());
    });
    div.classList.add(this.operator);

    return div;
  }
}
