import { Console } from "../console/Console";
import { Conjunction } from "./Conjunction";
import { Disjunction } from "./Disjunction";
import { Relay } from "./Relay";

export function getExpressionType(object: Object) {
  const __type = Object.entries(object).find(
    ([key, _]) => key === "__type",
  )?.[1];
  switch (__type) {
    case "Conjunction":
      return Conjunction;
    case "Disjunction":
      return Disjunction;
    default:
      throw new Error(Console.error("Expression has invalid type"));
  }
}

export function getObjectType(object: Object) {
  const __type = Object.entries(object).find(
    ([key, _]) => key === "__type",
  )?.[1];
  switch (__type) {
    case "Conjunction":
      return Conjunction;
    case "Disjunction":
      return Disjunction;
    case "Relay":
      return Relay;
    default:
      throw new Error(Console.error("Node has unrecognized type"));
  }
}
