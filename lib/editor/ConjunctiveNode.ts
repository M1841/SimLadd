import { DisjunctiveNode } from "./DisjunctiveNode";
import { ExpressionNode } from "./ExpressionNode";
import { Node } from "./Node";
import { Operator } from "./Operator";

export class ConjunctiveNode implements ExpressionNode {
  operator: Operator;
  operands: Node[];

  constructor(operands: Node[]) {
    if (operands.filter((o) => o instanceof DisjunctiveNode).length > 1) {
      throw new Error(
        "A conjunctive node cannot contain multiple disjunctive nodes"
      );
    }
    this.operator = Operator.OR;
    this.operands = operands;
  }

  render(): HTMLDivElement {
    const div = document.createElement("div");
    div.classList.add("conjunctive-node");

    this.operands.forEach((operand) => {
      div.appendChild(operand.render());
    });

    return div;
  }
}
