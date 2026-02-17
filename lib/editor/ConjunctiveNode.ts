import { DisjunctiveNode } from "./DisjunctiveNode";
import { ExpressionNode } from "./ExpressionNode";
import { Node } from "./Node";
import { Operator } from "./Operator";
import { getObjectType } from "./utils";

export class ConjunctiveNode implements ExpressionNode {
  operator: Operator;
  operands: Node[];

  constructor(operands: Node[]) {
    if (operands.filter((o) => o instanceof DisjunctiveNode).length > 1) {
      throw new Error(
        "A conjunctive node cannot contain multiple disjunctive nodes",
      );
    }
    this.operator = Operator.AND;
    this.operands = operands;
  }

  toObject(): Object {
    return {
      operator: this.operator,
      operands: this.operands.map((operand) => operand.toObject()),

      __type: "ConjunctiveNode",
    };
  }

  static fromObject(object: Object): ConjunctiveNode {
    const entries = Object.entries(object);

    const __type = entries.find(([key, _]) => key === "__type")?.[1];
    const operator = entries.find(([key, _]) => key === "operator")?.[1];
    const operands = entries.find(([key, _]) => key === "operands")?.[1];

    if (
      __type === undefined ||
      __type !== "ConjunctiveNode" ||
      operator === undefined ||
      operands === undefined ||
      operands.map === undefined
    ) {
      throw new Error("Object is not a valid ConjunctiveNode");
    }

    return new ConjunctiveNode(
      operands.map((operand: Object) =>
        getObjectType(operand).fromObject(operand),
      ),
    );
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
