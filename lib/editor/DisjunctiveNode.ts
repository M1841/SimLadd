import { ExpressionNode } from "./ExpressionNode";
import { Node } from "./Node";
import { Operator } from "./Operator";

export class DisjunctiveNode extends ExpressionNode {
  constructor(operands: Node[]) {
    super(Operator.OR, operands);
  }
}
