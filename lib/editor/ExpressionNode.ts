import { Operator } from "./Operator";
import { Node } from "./Node";
import { RelayNode } from "./RelayNode";
import { ConjunctiveNode } from "./ConjunctiveNode";
import { DisjunctiveNode } from "./DisjunctiveNode";

export interface ExpressionNode extends Node {
  operator: Operator;
  operands: Node[];
  withUpdatedNode(node: RelayNode): Promise<ConjunctiveNode | DisjunctiveNode>;
  withMovedNode(
    node: RelayNode,
    destinationId: string,
  ): Promise<ConjunctiveNode | DisjunctiveNode>;
}
