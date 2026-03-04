import { LazyStore } from "@tauri-apps/plugin-store";
const state = new LazyStore("data/state.json");

import { LadderDiagram } from "./LadderDiagram";
import { DisjunctiveNode } from "./DisjunctiveNode";
import { ExpressionNode } from "./ExpressionNode";
import { RelayNode } from "./RelayNode";
import { Operator } from "./Operator";
import { getObjectType } from "./utils";
import { Logs } from "../logs/Logs";

export class ConjunctiveNode implements ExpressionNode {
  id: string;
  operator: Operator;
  operands: (RelayNode | ExpressionNode)[];

  constructor(id: string, operands: (RelayNode | ExpressionNode)[]) {
    if (operands.filter((o) => o instanceof DisjunctiveNode).length > 1) {
      throw new Error(
        Logs.error(
          "A ConjunctiveNode containing multiple DisjunctiveNodes is currently not supported",
        ),
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
      throw new Error(Logs.error("Object is not a valid ConjunctiveNode"));
    }

    return new ConjunctiveNode(
      id,
      operands.map((operand: Object) =>
        getObjectType(operand).fromObject(operand),
      ),
    );
  }

  toDiv(): HTMLDivElement {
    const node = document.createElement("div");
    node.classList.add("conjunctive-node");
    node.id = this.id;

    this.operands.forEach((operand) => {
      node.appendChild(operand.toDiv());
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

      const draggedNode = RelayNode.fromObject(
        (await state.get<Object>("drag.node"))!,
      );
      this.operands.push(draggedNode);
      await state.delete("drag.node");

      let program = LadderDiagram.fromObject(
        (await state.get<Object>("program"))!,
      );
      program = await program.withMovedNode(draggedNode, this.id);
      await state.set("program", program.toObject());
      await state.save();
    });

    return node;
  }

  async withUpdatedNode(node: RelayNode): Promise<ConjunctiveNode> {
    return new ConjunctiveNode(
      this.id,
      await Promise.all(
        this.operands.map(async (operand) => {
          if (operand.id === node.id) {
            if (operand instanceof RelayNode) {
              return new RelayNode(
                node.id,
                node.address,
                node.label,
                node.isOpen,
              );
            } else {
              throw new Error(
                Logs.error(
                  "Attempted applying a RelayNode value to a DisjunctiveNode",
                ),
              );
            }
          } else {
            return operand;
          }
        }),
      ),
    );
  }

  async withMovedNode(
    node: RelayNode,
    destinationId: string,
  ): Promise<ConjunctiveNode> {
    if (this.id === destinationId) {
      return new ConjunctiveNode(this.id, [
        ...this.operands,
        new RelayNode(node.id, node.address, node.label, node.isOpen),
      ]);
    }
    return new ConjunctiveNode(
      this.id,
      this.operands.filter((operand) => operand.id !== node.id),
    );
  }
}
