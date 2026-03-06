import { LazyStore } from "@tauri-apps/plugin-store";

import validate from "../../../lib/validate";
import { Console } from "../console/Console";
import { Disjunction } from "./Disjunction";
import { LadderDiagram } from "./LadderDiagram";
import { Operator } from "./Operator";
import { Relay } from "./Relay";
import { getObjectType } from "./utils";

const cache = new LazyStore("cache/cache");

export class Conjunction {
  id: string;
  operator: Operator;
  operands: (Relay | Conjunction | Disjunction)[];

  constructor(id: string, operands: (Relay | Conjunction | Disjunction)[]) {
    this.id = id;
    this.operator = Operator.AND;
    this.operands = operands;
  }

  toObject(): Object {
    return {
      id: this.id,
      operator: this.operator,
      operands: this.operands.map((operand) => operand.toObject()),

      __type: "Conjunction",
    };
  }
  static fromObject(object: Object): Conjunction {
    const { id, operands } = validate(object, "Conjunction", [
      "operator",
      "operands",
      "id",
    ]);

    if (!Array.isArray(operands)) {
      throw new Error(Console.error("Object is not a valid Conjunction"));
    }

    return new Conjunction(
      id,
      operands.map((operand: Object) =>
        getObjectType(operand).fromObject(operand),
      ),
    );
  }

  toDiv(): HTMLDivElement {
    const conjunction = document.createElement("div");
    conjunction.classList.add("conjunction");
    conjunction.id = this.id;

    this.operands.forEach((operand) => {
      conjunction.appendChild(operand.toDiv());
    });

    conjunction.addEventListener("dragenter", async (event) => {
      event.preventDefault();
      conjunction.classList.add("dropzone");
      await cache.set("dropzone", this.id);
    });
    conjunction.addEventListener("dragover", async (event) => {
      event.preventDefault();
      conjunction.classList.add("dropzone");
      await cache.set("dropzone", this.id);
    });
    conjunction.addEventListener("dragleave", async (event) => {
      event.preventDefault();
      conjunction.classList.remove("dropzone");
      await cache.delete("dropzone");
    });
    conjunction.addEventListener("drop", async (event) => {
      event.preventDefault();
      const draggedElement = document.getElementById("dragged")!;
      draggedElement.remove();
      conjunction.appendChild(draggedElement);
      conjunction.classList.remove("dropzone");
      await cache.delete("dropzone");

      const draggedRelay = Relay.fromObject(
        (await cache.get<Object>("dragged-relay"))!,
      );
      this.operands.push(draggedRelay);
      await cache.delete("dragged-relay");

      let program = LadderDiagram.fromObject(
        (await cache.get<Object>("program"))!,
      );
      program = await program.withMovedRelay(draggedRelay, this.id);
      await cache.set("program", program.toObject());
      await cache.save();
    });

    return conjunction;
  }

  async withUpdatedRelay(relay: Relay): Promise<Conjunction> {
    return new Conjunction(
      this.id,
      await Promise.all(
        this.operands.map(async (operand) => {
          if (operand.id === relay.id) {
            if (operand instanceof Relay) {
              return new Relay(
                relay.id,
                relay.address,
                relay.label,
                relay.isOpen,
              );
            } else {
              throw new Error(
                Console.error(
                  "Attempted applying a Relay value to a Disjunction",
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
  async withMovedRelay(
    relay: Relay,
    destinationId: string,
  ): Promise<Conjunction> {
    if (this.id === destinationId) {
      return new Conjunction(this.id, [
        ...this.operands.filter((operand) => operand.id !== relay.id),
        new Relay(relay.id, relay.address, relay.label, relay.isOpen),
      ]);
    }
    return new Conjunction(
      this.id,
      this.operands.filter((operand) => operand.id !== relay.id),
    );
  }
}
