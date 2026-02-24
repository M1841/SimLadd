import { Operator } from "./Operator";
import { Node } from "./Node";
import { RelayNode } from "./RelayNode";
import { ConjunctiveNode } from "./ConjunctiveNode";
import { DisjunctiveNode } from "./DisjunctiveNode";

export interface ExpressionNode extends Node {
  operator: Operator;
  operands: Node[];
  withNode(id: string, value: RelayNode): ConjunctiveNode | DisjunctiveNode;
}
