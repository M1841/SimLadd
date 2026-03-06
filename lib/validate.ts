import { Console } from "../src/components/console/Console";

export default function (object: Object, __type: string, fields: string[]) {
  const entries = Object.entries(object);

  const found__type = entries.find(([key, _]) => key === "__type")?.[1];
  if (found__type !== __type) {
    console.log(object);
    throw new Error(Console.error(`Object is not a valid ${__type}`));
  }

  const foundFields = fields.map((field) =>
    entries.find(([key, _]) => key === field),
  );
  if (foundFields.some((field) => field === undefined)) {
    throw new Error(Console.error(`Object is not a valid ${__type}`));
  }

  return Object.assign(
    {},
    ...foundFields.map((f) => {
      return {
        [f![0]]: f![1],
      };
    }),
  );
}
