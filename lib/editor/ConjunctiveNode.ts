import { ExpressionNode } from "./ExpressionNode";
import { Node } from "./Node";
import { Operator } from "./Operator";

export class ConjunctiveNode extends ExpressionNode {
  constructor(operands: Node[]) {
    super(Operator.AND, operands);
  }
}
