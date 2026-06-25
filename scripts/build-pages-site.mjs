import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const docsDir = path.join(rootDir, "docs");
const publicDir = path.join(rootDir, "public");
const outputDir = path.join(rootDir, ".pages-dist");
const requiredDataFiles = [
  "worldcup-live.json",
  "worldcup-standings.json",
  "worldcup-schedule.json",
  "worldcup-bracket.json",
  "worldcup-scorers.json"
];

function fail(message) {
  console.error(`[pages-build] ${message}`);
  process.exit(1);
}

function copyDirectory(source, target) {
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(target, { recursive: true });

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

if (!fs.existsSync(path.join(docsDir, "index.html"))) {
  fail("docs/index.html is missing.");
}

for (const fileName of requiredDataFiles) {
  const filePath = path.join(publicDir, "data", fileName);
  if (!fs.existsSync(filePath)) {
    fail(`public/data/${fileName} is missing. Run npm run fetch:worldcup first.`);
  }

  try {
    JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`public/data/${fileName} is invalid JSON: ${error.message}`);
  }
}

fs.rmSync(outputDir, { recursive: true, force: true });
copyDirectory(docsDir, outputDir);
copyDirectory(publicDir, outputDir);
fs.writeFileSync(path.join(outputDir, ".nojekyll"), "");

console.log(`[pages-build] Built ${path.relative(rootDir, outputDir)}`);
