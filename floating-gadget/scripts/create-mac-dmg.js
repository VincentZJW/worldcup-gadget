"use strict";

const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const projectDir = path.resolve(__dirname, "..");
const releaseDir = path.join(projectDir, "release");
const packageJson = require(path.join(projectDir, "package.json"));
const productName = packageJson.build?.productName || "WorldCup Gadget";
const version = packageJson.version || "0.0.0";
const appName = `${productName}.app`;

function findPackagedApp() {
  if (!fs.existsSync(releaseDir)) return null;

  const candidates = fs
    .readdirSync(releaseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("mac"))
    .map((entry) => path.join(releaseDir, entry.name, appName))
    .filter((candidate) => fs.existsSync(candidate));

  return candidates[0] || null;
}

function removeIfExists(target) {
  fs.rmSync(target, { force: true, recursive: true });
}

const packagedApp = findPackagedApp();
if (!packagedApp) {
  console.error(`Packaged app not found. Run "npm run package:mac" before creating a DMG.`);
  process.exit(1);
}

const arch = process.arch === "arm64" ? "arm64" : "x64";
const dmgRoot = path.join(releaseDir, "dmg-root");
const dmgPath = path.join(releaseDir, `${productName}-${version}-${arch}.dmg`);
const dmgAppPath = path.join(dmgRoot, appName);
const applicationsLink = path.join(dmgRoot, "Applications");

removeIfExists(dmgRoot);
removeIfExists(dmgPath);
fs.mkdirSync(dmgRoot, { recursive: true });
fs.cpSync(packagedApp, dmgAppPath, { recursive: true });
fs.symlinkSync("/Applications", applicationsLink);

execFileSync(
  "/usr/bin/hdiutil",
  [
    "create",
    "-volname",
    productName,
    "-srcfolder",
    dmgRoot,
    "-ov",
    "-format",
    "UDRO",
    dmgPath
  ],
  { stdio: "inherit" }
);

removeIfExists(dmgRoot);
console.log(`Created ${dmgPath}`);
