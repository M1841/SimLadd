import { ConjunctiveNode } from "./ConjunctiveNode";
import { ExpressionNode } from "./ExpressionNode";
import { Operator } from "./Operator";
import { getObjectType } from "./utils";

export class DisjunctiveNode implements ExpressionNode {
  operator: Operator;
  operands: ConjunctiveNode[];

  constructor(operands: ConjunctiveNode[]) {
    this.operator = Operator.OR;
    this.operands = operands;
  }

  toObject(): Object {
    return {
      operator: this.operator,
      operands: this.operands.map((operand) => operand.toObject()),

      __type: "DisjunctiveNode",
    };
  }

  static fromObject(object: Object): DisjunctiveNode {
    const entries = Object.entries(object);

    const __type = entries.find(([key, _]) => key === "__type")?.[1];
    const operator = entries.find(([key, _]) => key === "operator")?.[1];
    const operands = entries.find(([key, _]) => key === "operands")?.[1];

    if (
      __type === undefined ||
      __type !== "DisjunctiveNode" ||
      operator === undefined ||
      operands === undefined ||
      operands.map === undefined
    ) {
      throw new Error("Object is not a valid DisjunctiveNode");
    }

    return new DisjunctiveNode(
      operands.map((operand: Object) =>
        getObjectType(operand).fromObject(operand),
      ),
    );
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
