import { LazyStore } from "@tauri-apps/plugin-store";

import { Console } from "./components/console/Console";
import { Editor } from "./components/editor/Editor";
import { LadderDiagram } from "./components/editor/LadderDiagram";
import { Menu } from "./components/menu/Menu";
import { Workspace } from "./components/workspace/Workspace";

const cache = new LazyStore("cache/cache");

try {
  const cachedProgram = await cache.get<Object>("program");
  const program = cachedProgram
    ? (() => {
        Console.info("opening program from application cache");
        return LadderDiagram.fromObject(cachedProgram);
      })()
    : await (async () => {
        const empty = await LadderDiagram.empty();
        await cache.set("program", empty.toObject());
        return empty;
      })();

  await Promise.all([
    Menu.render(),
    new Editor(program).render(),
    new Workspace().render(),
  ]);
} catch (error) {
  Console.error(error as string);
}
