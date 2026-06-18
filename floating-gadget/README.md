# World Cup Floating Gadget

这是 `worldcup-gadget` 的 Electron 世界杯桌面足球悬浮球，支持 macOS 和 Windows，不会替换或影响原有 Dashboard。

应用启动后会在屏幕右侧偏上显示一个约 56px 的足球样式悬浮球。点击球体后展开深色半透明战报面板，默认展示最新结束的一场比赛；点击“查看更多”可查看 `latest.json` 中的全部比赛。

展开面板使用本地图片背景 `src/assets/stadium-bg.png`：柔和的球场看台、草坪、天空氛围，并叠加深色遮罩和轻微光效，保证战报文字可读；不请求外部资源。

## 安装依赖

进入本目录后安装 Electron：

```bash
cd floating-gadget
npm install
```

`npm install` 会从 npm 下载 Electron 包，并通过项目内 `.npmrc` 使用 `https://npmmirror.com/mirrors/electron/` 补下载 Electron binary。项目本身运行时不会联网。

如果你之前已经装过 npm 包，但缺少 `node_modules/electron/path.txt`，可以单独补装 binary：

```bash
npm run electron:install
```

## 启动

开发方式启动：

```bash
npm start
```

如果你希望启动后不依赖 Terminal / PowerShell 窗口，请从项目根目录使用 detached 启动脚本。

macOS：

```bash
./scripts/start-floating-gadget.sh
```

macOS 如需从脚本停止：

```bash
./scripts/stop-floating-gadget.sh
```

Windows：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-floating-gadget.ps1
```

如果启动时提示 `Electron 没有安装完整`，说明 npm 包已经在 `node_modules` 里，但 Electron 桌面运行时 binary 没有下载成功。请先重新运行：

```bash
npm install
```

如果仍然卡在 Electron binary download，需要先解决本机网络或 npm 下载环境；应用代码只使用项目级镜像配置，不会修改系统代理或全局 npm 配置。

启动后：

- 点击足球悬浮球展开战报；
- 按 `Control + Alt + W` 可以显示 / 唤醒已经运行的 collapsed 小足球悬浮球；macOS 键盘上是 `Control + Option + W`；
- 长按足球悬浮球约 0.4 秒后拖动，可移动悬浮球；
- 右键足球悬浮球会弹出操作对话框，可选择“退出悬浮球”或“查看网页（预留）”；
- 拖动面板标题区域可移动面板；
- 点击“查看更多”展开全部比赛；
- 点击“只看最新”回到最新一场比赛；
- 点击“刷新”重新读取 `latest.json`，成功后会短暂显示提示；
- 点击“收起”回到悬浮球；
- 点击“退出”或右键选择“退出悬浮球”可真正退出应用。

## 快捷键与单实例

应用内部注册了 Electron `globalShortcut`：

```text
Control + Alt + W
```

当 gadget 已经运行时：

- 如果窗口隐藏或最小化，会显示并聚焦；
- 如果当前是 expanded 面板，会收起成 collapsed 小足球；
- 如果当前已经是 collapsed 小足球，会保持 collapsed 状态；
- 不会直接展开战报内容，用户需要手动点击小足球才会展开。

应用也启用了 Electron single instance lock。再次执行启动脚本时，不会创建多个悬浮球，而是唤醒已有实例。

系统级快捷键和 Electron 内部快捷键是两层：

- 系统级快捷键负责“启动未运行的 gadget”。
- Electron `globalShortcut` 负责“显示已经运行的 collapsed 小足球悬浮球”。

macOS 系统级快捷键请参考：

```text
../docs/macos-keyboard-shortcut.md
```

Windows 可以从项目根目录运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-windows-hotkey.ps1
```

它会在 Desktop 创建 `WorldCup Gadget.lnk`，并设置 `Ctrl + Alt + W`。Windows 的 `.lnk` 热键通常要求快捷方式位于 Desktop 或 Start Menu 中。

## 数据来源

应用只读取当前项目中的：

```text
../data/latest.json
```

主进程使用固定绝对路径读取该文件，不接受 renderer 提供的任意文件路径。renderer 不启用 Node integration，并通过安全的 preload API 请求数据。

如果比赛包含 `finished_at_bj`，应用会按该字段排序并展示最新结束的一场；如果没有该字段，则展示 `matches` 数组中的最后一场。

## 刷新数据

修改项目根目录的 `data/latest.json` 后，展开悬浮球并点击“刷新”，界面会重新读取并渲染最新数据，不需要重启应用。

## 当前版本边界

- 不联网请求任何比赛或新闻数据；
- 不自动更新比赛数据；
- 不调用 API；
- 不读取私人文件；
- 不安装 LaunchAgent；
- 不修改 macOS 系统设置；
- 不修改 Windows 注册表；
- 不要求管理员权限；
- 不包含开机自启；
- “查看网页”按钮当前只是预留接口，不会打开外部网页，也不会联网。

后续可以继续增加：

- macOS 开机自启；
- 每天 10 点自动弹出；
- 由 OpenClaw 自动更新 `data/latest.json`。

如果 Electron 依赖尚未安装，需先完成 `npm install`。若遇到 Electron binary download 失败，请先解决本机网络或 npm 下载环境；本项目只配置项目级镜像，不会修改系统代理或全局 npm 配置。
