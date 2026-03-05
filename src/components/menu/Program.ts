import { appDataDir } from "@tauri-apps/api/path";
import {
  open as openDialog,
  save as saveDialog,
} from "@tauri-apps/plugin-dialog";
import { LazyStore } from "@tauri-apps/plugin-store";
const state = new LazyStore("data/state.json");

import { LadderDiagram } from "../editor/LadderDiagram";
import { Console } from "../console/Console";

async function init() {
  const program = await LadderDiagram.empty();
  await Promise.all([
    state.set("program", program.toObject()),
    state.delete("program-path"),
    program.render(),
  ]);
  await state.save();
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
      state.set("program", program.toObject()),
      state.set("program-path", path),
      program.render(),
    ]);
    await state.save();
  } catch (error) {
    Console.error("program file appears to be malformed or corrupted");
  }
}

async function save() {
  const path = await state.get<string>("program-path");
  const program = LadderDiagram.fromObject(
    (await state.get<Object>("program"))!,
  );
  await Promise.all([state.set("program-path", path), program.save(path!)]);
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
      (await state.get<string>("program-path")) ?? (await appDataDir()),
  });
  const program = LadderDiagram.fromObject(
    (await state.get<Object>("program"))!,
  );
  await Promise.all([state.set("program-path", path), program.save(path!)]);
}

export { init, open, save, saveAs };
