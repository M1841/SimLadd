import { v4 as uuid } from "uuid";

import { ConjunctiveNode } from "./ConjunctiveNode";
import { ExpressionNode } from "./ExpressionNode";
import { Operator } from "./Operator";
import { getObjectType } from "./utils";
import { RelayNode } from "./RelayNode";
import { Logs } from "../logs/Logs";

export class DisjunctiveNode implements ExpressionNode {
  id: string;
  operator: Operator;
  operands: ConjunctiveNode[];

  constructor(id: string, operands: ConjunctiveNode[]) {
    this.id = id;
    this.operator = Operator.OR;
    this.operands = operands;
  }

  toObject(): Object {
    return {
      id: this.id,
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
    const id = entries.find(([key, _]) => key === "id")?.[1];

    if (
      __type === undefined ||
      __type !== "DisjunctiveNode" ||
      operator === undefined ||
      operands === undefined ||
      operands.map === undefined ||
      id === undefined
    ) {
      throw new Error(Logs.error("Object is not a valid DisjunctiveNode"));
    }

    return new DisjunctiveNode(
      id,
      operands.map((operand: Object) =>
        getObjectType(operand).fromObject(operand),
      ),
    );
  }

  toDiv(): HTMLDivElement {
    const node = document.createElement("div");
    node.classList.add("disjunctive-node");
    node.id = this.id;

    this.operands.forEach((operand) => {
      if (operand instanceof ConjunctiveNode) {
        node.appendChild(operand.toDiv());
      } else {
        node.appendChild(new ConjunctiveNode(uuid(), [operand]).toDiv());
      }
    });
    node.classList.add(this.operator);

    return node;
  }

  async withUpdatedNode(node: RelayNode): Promise<DisjunctiveNode> {
    return new DisjunctiveNode(
      this.id,
      await Promise.all(
        this.operands.map((operand) => operand.withUpdatedNode(node)),
      ),
    );
  }

  async withMovedNode(
    node: RelayNode,
    destinationId: string,
  ): Promise<DisjunctiveNode> {
    return new DisjunctiveNode(
      this.id,
      await Promise.all(
        this.operands.map((operand) =>
          operand.withMovedNode(node, destinationId),
        ),
      ),
    );
  }
}
