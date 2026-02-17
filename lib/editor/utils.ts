import { ConjunctiveNode } from "./ConjunctiveNode";
import { DisjunctiveNode } from "./DisjunctiveNode";
import { OutputNode } from "./OutputNode";
import { RelayNode } from "./RelayNode";

export function getExpressionType(object: Object) {
  const __type = Object.entries(object).find(
    ([key, _]) => key === "__type",
  )?.[1];
  switch (__type) {
    case "ConjunctiveNode":
      return ConjunctiveNode;
    case "DisjunctiveNode":
      return DisjunctiveNode;
    default:
      throw new Error("Expression has invalid type");
  }
}

export function getObjectType(object: Object) {
  const __type = Object.entries(object).find(
    ([key, _]) => key === "__type",
  )?.[1];
  switch (__type) {
    case "ConjunctiveNode":
      return ConjunctiveNode;
    case "DisjunctiveNode":
      return DisjunctiveNode;
    case "RelayNode":
      return RelayNode;
    case "OutputNode":
      return OutputNode;
    default:
      throw new Error("Node has unrecognized type");
  }
}
