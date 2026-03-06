import { v4 as uuid } from "uuid";

import validate from "../../../lib/validate";
import { Console } from "../console/Console";
import { Conjunction } from "./Conjunction";
import { Operator } from "./Operator";
import { Relay } from "./Relay";

export class Disjunction {
  id: string;
  operator: Operator;
  operands: Conjunction[];

  constructor(id: string, operands: Conjunction[]) {
    this.id = id;
    this.operator = Operator.OR;
    this.operands = operands;
  }

  toObject(): Object {
    return {
      id: this.id,
      operator: this.operator,
      operands: this.operands.map((operand) => operand.toObject()),

      __type: "Disjunction",
    };
  }
  static fromObject(object: Object): Disjunction {
    const { id, operands } = validate(object, "Disjunction", [
      "operator",
      "operands",
      "id",
    ]);
    if (!Array.isArray(operands)) {
      throw new Error(Console.error("Object is not a valid Disjunction"));
    }

    return new Disjunction(
      id,
      operands.map((operand: Object) => Conjunction.fromObject(operand)),
    );
  }

  toDiv(): HTMLDivElement {
    const disjunction = document.createElement("div");
    disjunction.classList.add("disjunction");
    disjunction.id = this.id;

    this.operands.forEach((operand) => {
      if (operand instanceof Conjunction) {
        disjunction.appendChild(operand.toDiv());
      } else {
        disjunction.appendChild(new Conjunction(uuid(), [operand]).toDiv());
      }
    });
    disjunction.classList.add(this.operator);

    return disjunction;
  }

  async withUpdatedRelay(relay: Relay): Promise<Disjunction> {
    return new Disjunction(
      this.id,
      await Promise.all(
        this.operands.map((operand) => operand.withUpdatedRelay(relay)),
      ),
    );
  }
  async withMovedRelay(
    relay: Relay,
    destinationId: string,
  ): Promise<Disjunction> {
    return new Disjunction(
      this.id,
      await Promise.all(
        this.operands.map((operand) =>
          operand.withMovedRelay(relay, destinationId),
        ),
      ),
    );
  }
}
