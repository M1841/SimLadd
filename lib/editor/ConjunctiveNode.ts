import { LazyStore } from "@tauri-apps/plugin-store";
const store = new LazyStore("state.json");

import { DisjunctiveNode } from "./DisjunctiveNode";
import { ExpressionNode } from "./ExpressionNode";
import { RelayNode } from "./RelayNode";
import { Operator } from "./Operator";
import { getObjectType } from "./utils";

export class ConjunctiveNode implements ExpressionNode {
  id: string;
  operator: Operator;
  operands: (RelayNode | ExpressionNode)[];

  constructor(id: string, operands: (RelayNode | ExpressionNode)[]) {
    if (operands.filter((o) => o instanceof DisjunctiveNode).length > 1) {
      throw new Error(
        "A ConjunctiveNode containing multiple DisjunctiveNodes is currently not supported",
      );
    }
    this.id = id;
    this.operator = Operator.AND;
    this.operands = operands;
  }

  toObject(): Object {
    return {
      id: this.id,
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
    const id = entries.find(([key, _]) => key === "id")?.[1];

    if (
      __type === undefined ||
      __type !== "ConjunctiveNode" ||
      operator === undefined ||
      operands === undefined ||
      operands.map === undefined ||
      id === undefined
    ) {
      throw new Error("Object is not a valid ConjunctiveNode");
    }

    return new ConjunctiveNode(
      id,
      operands.map((operand: Object) =>
        getObjectType(operand).fromObject(operand),
      ),
    );
  }

  render(): HTMLDivElement {
    const node = document.createElement("div");
    node.classList.add("conjunctive-node");

    this.operands.forEach((operand) => {
      node.appendChild(operand.render());
    });

    node.addEventListener("dragenter", (event) => {
      event.preventDefault();
    });
    node.addEventListener("dragover", (event) => {
      event.preventDefault();
    });
    node.addEventListener("dragleave", (event) => {
      event.preventDefault();
    });
    node.addEventListener("drop", async (event) => {
      event.preventDefault();
      const draggedElement = document.getElementById("dragged")!;
      draggedElement.remove();
      node.appendChild(draggedElement);

      await store.set("destination-id", this.id);
      await store.save();
      const draggedNode = RelayNode.fromObject(
        (await store.get<Object>("dragged"))!,
      );
      this.operands.push(draggedNode);
    });

    return node;
  }

  withNode(id: string, value: RelayNode): ConjunctiveNode {
    return new ConjunctiveNode(
      this.id,
      this.operands.map((operand) => {
        if (operand.id === id) {
          if (operand instanceof RelayNode) {
            return new RelayNode(
              operand.id,
              value.address,
              value.label,
              value.isOpen,
            );
          } else {
            throw new Error(
              "Attempted applying a RelayNode value to a DisjunctiveNode",
            );
          }
        } else {
          return operand;
        }
      }),
    );
  }
}
