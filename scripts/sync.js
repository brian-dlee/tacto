const fs = require("fs");
const path = require("path");
const glob = require("glob");

const cache = {};

async function extractFilesFromPackageJson(project) {
  const packageJsonPath = path.join(project, "package.json");
  const data = await fs.promises.readFile(packageJsonPath, "utf8");
  const packageJson = JSON.parse(data);

  return glob(packageJson.files, { cwd: project });
}

function createDirectories(files, base) {
  const sorted = files
    .map((f) => ({ f: path.join(base, f), n: f.split("/").length - 1 }))
    .sort((a, b) => {
      return b.n - a.n;
    });

  let depth = -1;
  const mkdirs = [];
  for (const file of sorted) {
    if (file.n < depth) {
      break;
    }

    depth = file.n;
    mkdirs.push(fs.promises.mkdir(path.dirname(file.f), { recursive: true }));
  }

  return Promise.all(mkdirs);
}

async function syncPackageToApp() {
  const package = path.resolve("packages", "tacto");
  const app = path.resolve("apps", "demo");
  const destination = path.join(app, "node_modules", "tacto");

  if (!cache.files) {
    cache.files = await extractFilesFromPackageJson(package);
    cache.files.push("package.json");
    await createDirectories(cache.files, destination);
  }

  await Promise.all(
    cache.files.map((f) => {
      return fs.promises.copyFile(
        path.resolve(package, f),
        path.resolve(destination, f)
      );
    })
  );
}

module.exports = {
  syncPackageToApp,
};
