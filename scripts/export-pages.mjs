import { spawn } from "node:child_process";
import { rename, rm } from "node:fs/promises";

const api = "src/app/api";
const stash = "src/app/_pages_api_stash";

await rm(".next", { recursive: true, force: true });
await rename(api, stash);

async function restore() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      await rename(stash, api);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  const { cp, rm } = await import("node:fs/promises");
  await cp(stash, api, { recursive: true });
  await rm(stash, { recursive: true, force: true });
}

let code = 1;
try {
  const child = spawn("npx", ["next", "build"], {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...process.env, GITHUB_PAGES: "true" },
  });
  code = await new Promise((resolve) => {
    child.on("exit", (exitCode) => resolve(exitCode ?? 1));
  });
} finally {
  await restore();
}

process.exit(code);
