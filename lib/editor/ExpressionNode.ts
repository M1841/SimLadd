import { Operator } from "./Operator";
import { Node } from "./Node";

export interface ExpressionNode extends Node {
  operator: Operator;
  operands: Node[];
  toObject(): Object;
}
