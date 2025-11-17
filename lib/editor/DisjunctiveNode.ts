import { ConjunctiveNode } from "./ConjunctiveNode";
import { ExpressionNode } from "./ExpressionNode";
import { Operator } from "./Operator";

export class DisjunctiveNode implements ExpressionNode {
  operator: Operator;
  operands: ConjunctiveNode[];

  constructor(operands: ConjunctiveNode[]) {
    this.operator = Operator.OR;
    this.operands = operands;
  }

  render(): HTMLDivElement {
    const div = document.createElement("div");
    div.classList.add("disjunctive-node");

    this.operands.forEach((operand) => {
      if (operand instanceof ConjunctiveNode) {
        div.appendChild(operand.render());
      } else {
        div.appendChild(new ConjunctiveNode([operand]).render());
      }
    });
    div.classList.add(this.operator);

    return div;
  }
}
