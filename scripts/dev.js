#!/usr/bin/env node

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");
const { syncPackageToApp } = require("./sync");

function cmd(label, command) {
  let process = null;
  let spawn = Promise.resolve();
  let kill = Promise.resolve();

  return {
    command,
    name: label,
    async isRunning() {
      await Promise.race([spawn, kill]);
      return process ? !process.killed : false;
    },
    start() {
      process = childProcess.spawn(command, {
        shell: true,
        stdio: "inherit",
      });
      process.on("data", (data) => {
        console.log(
          `[${label}]`,
          data.toString().replace(/\x1b\[[0-9;]*m/g, "")
        );
      });
      kill = kill.then(() => {
        return new Promise((resolve) => {
          process.on("exit", () => {
            resolve();
          });
        });
      });
      spawn = new Promise((resolve) => {
        process.on("spawn", () => {
          console.log(`[${label}]`, "Started");
          resolve();
        });
      });

      return spawn;
    },
    stop() {
      if (process) {
        kill.then(() => {
          process = null;
          kill = Promise.resolve();
          spawn = Promise.resolve();
        });
        process.kill("SIGINT");
      }
      return kill;
    },
  };
}

async function run(f) {
  try {
    await fs.promises.stat(f);
  } catch (e) {
    await fs.promises.mkdir(f, { recursive: true });
  }

  const package = cmd("tacto", "npm run dev -w packages/tacto");
  const app = cmd("demo", "npm run dev -w apps/demo");

  fs.watch(f, { encoding: "utf8", recursive: true }, async (_, filename) => {
    if (filename !== "index.d.ts") {
      return;
    }

    try {
      await fs.promises.stat(path.join(f, filename));
    } catch (e) {
      return;
    }

    if (await app.isRunning()) {
      await app.stop();
    }

    await syncPackageToApp();
    await app.start();
  });

  await package.start();
}

run(path.resolve("packages", "tacto", "dist"));
