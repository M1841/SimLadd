import { Console } from "../src/components/console/Console";
import { Conjunction } from "../src/components/editor/nodes/Conjunction";
import { Disjunction } from "../src/components/editor/nodes/Disjunction";
import { Relay } from "../src/components/editor/nodes/Relay";

export function getType(object: Object) {
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
