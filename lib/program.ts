import { appDataDir } from "@tauri-apps/api/path";
import {
  open as openDialog,
  save as saveDialog,
} from "@tauri-apps/plugin-dialog";
import { LazyStore } from "@tauri-apps/plugin-store";

import { Console } from "../src/components/console/Console";
import { LadderDiagram } from "../src/components/editor/LadderDiagram";

const cache = new LazyStore("cache/cache");

async function init() {
  const program = await LadderDiagram.empty();
  await Promise.all([
    cache.set("program", program.toObject()),
    cache.delete("program-path"),
    program.render(),
  ]);
}

async function open() {
  const path = await openDialog({
    title: "Open Program",
    multiple: false,
    directory: false,
    filters: [
      {
        name: "SimLadd Program",
        extensions: ["ladd"],
      },
    ],
    defaultPath: await appDataDir(),
  });
  if (!path) {
    return;
  }
  try {
    const program = await LadderDiagram.load(path!);
    await Promise.all([
      cache.set("program", program.toObject()),
      cache.set("program-path", path),
      program.render(),
    ]);
    await cache.save();
  } catch (error) {
    Console.error("program file appears to be malformed or corrupted");
  }
}

async function save() {
  const [cachedProgram, path] = await Promise.all([
    cache.get<Object>("program"),
    cache.get<string>("program-path"),
  ]);
  const program = LadderDiagram.fromObject(cachedProgram!);
  await Promise.all([cache.set("program-path", path), program.save(path!)]);
}

async function saveAs() {
  const path = await saveDialog({
    title: "Save Program as",
    filters: [
      {
        name: "SimLadd Program",
        extensions: ["ladd"],
      },
    ],
    defaultPath:
      (await cache.get<string>("program-path")) ?? (await appDataDir()),
  });
  const program = LadderDiagram.fromObject(
    (await cache.get<Object>("program"))!,
  );
  await Promise.all([cache.set("program-path", path), program.save(path!)]);
}

export { init, open, save, saveAs };
