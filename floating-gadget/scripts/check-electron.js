"use strict";

const fs = require("node:fs");
const path = require("node:path");

const electronDir = path.join(__dirname, "..", "node_modules", "electron");
const pathFile = path.join(electronDir, "path.txt");
const overrideDistPath = process.env.ELECTRON_OVERRIDE_DIST_PATH;
const expectedDarwinPath = "Electron.app/Contents/MacOS/Electron";

function fail(message) {
  console.error("");
  console.error("Electron 没有安装完整，悬浮球应用还不能启动。");
  console.error(message);
  console.error("");
  console.error("请先在 floating-gadget 目录下完成 Electron binary 下载：");
  console.error("  npm install");
  console.error("");
  console.error("如果 npm install 仍然卡在 Electron binary download，请先解决本机网络 / npm 下载环境；");
  console.error("代码本身不会联网获取比赛数据，也不会自动修改镜像或系统代理。");
  process.exit(1);
}

if (!fs.existsSync(electronDir)) {
  fail("缺少 node_modules/electron。");
}

if (overrideDistPath) {
  const overrideExecutable = path.join(overrideDistPath, process.platform === "win32" ? "electron.exe" : "electron");
  if (!fs.existsSync(overrideExecutable)) {
    fail(`ELECTRON_OVERRIDE_DIST_PATH 已设置，但找不到可执行文件：${overrideExecutable}`);
  }
  process.exit(0);
}

if (!fs.existsSync(pathFile)) {
  fail("缺少 node_modules/electron/path.txt，说明 Electron binary 尚未下载成功。");
}

const executablePath = fs.readFileSync(pathFile, "utf8").trim();
let normalizedExecutablePath = executablePath;

if (process.platform === "darwin" && executablePath === `dist/${expectedDarwinPath}`) {
  normalizedExecutablePath = expectedDarwinPath;
  fs.writeFileSync(pathFile, normalizedExecutablePath);
}

const fullPath = path.join(electronDir, "dist", normalizedExecutablePath);

if (!normalizedExecutablePath || !fs.existsSync(fullPath)) {
  fail(`Electron 可执行文件不存在：${fullPath}`);
}
