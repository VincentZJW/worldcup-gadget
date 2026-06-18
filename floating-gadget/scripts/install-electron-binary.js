"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const electronDir = path.join(__dirname, "..", "node_modules", "electron");
const installScript = path.join(electronDir, "install.js");
const pathFile = path.join(electronDir, "path.txt");
const mirror = process.env.ELECTRON_MIRROR || "https://npmmirror.com/mirrors/electron/";
const expectedDarwinPath = "Electron.app/Contents/MacOS/Electron";

function log(message) {
  console.log(`[electron-binary] ${message}`);
}

function fail(message) {
  console.error("");
  console.error(`[electron-binary] ${message}`);
  console.error("");
  console.error("可尝试手动执行：");
  console.error("  npm run electron:install");
  console.error("");
  console.error("如果仍然失败，说明 Electron binary 下载网络仍不可用。");
  console.error("当前脚本只设置项目级镜像，不会修改系统代理或全局 npm 配置。");
  process.exit(1);
}

if (!fs.existsSync(electronDir)) {
  log("node_modules/electron 尚不存在，跳过 binary 安装；请先运行 npm install。");
  process.exit(0);
}

function repairPathFileIfNeeded() {
  if (!fs.existsSync(pathFile)) return false;

  const currentPath = fs.readFileSync(pathFile, "utf8").trim();
  if (process.platform === "darwin" && currentPath === `dist/${expectedDarwinPath}`) {
    fs.writeFileSync(pathFile, expectedDarwinPath);
    log(`已修正 path.txt：${currentPath} -> ${expectedDarwinPath}`);
    return true;
  }

  return false;
}

function hasValidElectronBinary() {
  if (!fs.existsSync(pathFile)) return false;

  repairPathFileIfNeeded();
  const executablePath = fs.readFileSync(pathFile, "utf8").trim();
  return Boolean(executablePath) && fs.existsSync(path.join(electronDir, "dist", executablePath));
}

if (hasValidElectronBinary()) {
  log("Electron binary 已存在，跳过下载。");
  process.exit(0);
}

if (!fs.existsSync(installScript)) {
  fail(`找不到 Electron install.js：${installScript}`);
}

log(`path.txt 不存在，开始从镜像补装 Electron binary：${mirror}`);

const result = spawnSync(process.execPath, [installScript], {
  cwd: path.join(__dirname, ".."),
  stdio: "inherit",
  env: {
    ...process.env,
    ELECTRON_MIRROR: mirror,
    npm_config_electron_mirror: mirror
  }
});

if (result.status !== 0) {
  fail(`Electron binary 安装失败，退出码：${result.status ?? "unknown"}`);
}

if (!fs.existsSync(pathFile)) {
  fail("Electron install.js 执行结束，但仍未生成 node_modules/electron/path.txt。");
}

log("Electron binary 安装完成。");
