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

`npm install` 会从 npm 下载 Electron 包，并通过项目内 `.npmrc` 使用 `https://npmmirror.com/mirrors/electron/` 补下载 Electron binary。应用运行时只有 Electron 主进程会按设置访问远程 JSON feed 更新比赛数据；renderer 前端不直接联网。

如果你之前已经装过 npm 包，但缺少 `node_modules/electron/path.txt`，可以单独补装 binary：

```bash
npm run electron:install
```

## macOS 打包

生成本地 `.app`：

```bash
npm run package:mac
```

生成可分发的 DMG：

```bash
npm run dist:mac
```

产物会写入：

```text
release/mac-arm64/WorldCup Gadget.app
release/WorldCup Gadget-1.0.0-arm64.dmg
```

当前 DMG 是本地未签名构建：它会包含 `WorldCup Gadget.app` 和 `/Applications` 快捷方式，适合内部测试。下一步产品化需要接入 Apple Developer ID 签名和 notarization，才能降低 Gatekeeper 安装拦截。

打包版会把项目根目录的 `data/latest.json` 复制进 app resources 作为首次启动 seed data。运行时会优先读取用户数据目录中的缓存，并由主进程后台自动更新该缓存。

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

macOS Shortcuts / 快捷指令中已验证可用的命令：

```bash
/bin/zsh /Users/vincentz/Documents/worldcup-gadget/scripts/start-floating-gadget.sh
```

建议绑定快捷键：

```text
Control + Option + W
```

这个快捷键只负责启动 / 唤醒 collapsed 小足球悬浮球，不会直接展开战报面板。要查看战报，请手动点击小足球。

macOS 如需从脚本停止：

```bash
./scripts/stop-floating-gadget.sh
```

Windows：

Windows 方案目前还没有实机验证，下面命令保留为待测试方案：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-floating-gadget.ps1
```

如果启动时提示 `Electron 没有安装完整`，说明 npm 包已经在 `node_modules` 里，但 Electron 桌面运行时 binary 没有下载成功。请先重新运行：

```bash
npm install
```

如果仍然卡在 Electron binary download，需要先解决本机网络或 npm 下载环境；应用代码只使用项目级镜像配置，不会修改系统代理或全局 npm 配置。

启动后：

- 首次启动会自动展开一个简短引导，点击“知道了”后会收回小足球，之后不会重复弹出；
- 点击足球悬浮球展开战报；
- 按 `Control + Alt + W` 可以显示 / 唤醒已经运行的 collapsed 小足球悬浮球；macOS 键盘上是 `Control + Option + W`；
- 长按足球悬浮球约 0.4 秒后拖动，可移动悬浮球；
- 拖动面板标题区域可移动面板；
- 点击“查看更多”展开全部比赛；
- 点击“只看最新”回到最新一场比赛；
- 点击“刷新”会先尝试从远程 JSON feed 更新数据，再重新读取本地缓存，成功或回退都会短暂显示提示；
- app 会自动从远程 JSON feed 更新战报；也可以在设置页点击“立即更新”手动触发远程更新；
- 本地缓存 `latest.json` 变化后，应用会自动重新读取并刷新战报；
- 面板会显示本地数据状态，包括更新时间、是否可能过期、文件缺失或 JSON 格式异常；
- 点击“设置”可切换语言、开启或关闭数据自动更新、立即更新数据、开启或关闭每日自动展示、调整展示时间、开启或关闭登录后自动启动、重新显示首次使用引导、重置窗口位置、重新读取数据、复制诊断信息或退出应用；
- 点击“收起”回到悬浮球；
- 点击“退出”可真正退出应用。

## Language Switch

English:
The floating gadget supports English and Chinese UI. Use the language switcher in the top-right corner. The selected language is saved locally.

The gadget supports bilingual report data. If `latest.json` contains fields such as `summary_en`, `summary_zh`, `highlights_en`, `highlights_zh`, `name_en`, and `name_zh`, the report content will switch together with the UI language without reloading the JSON file. If bilingual fields are missing, the app falls back to the original fields.

中文：
悬浮球支持中英文界面。可以通过右上角语言切换按钮切换语言。语言选择会保存在本地。

悬浮球支持双语战报数据。如果 `latest.json` 中包含 `summary_en`、`summary_zh`、`highlights_en`、`highlights_zh`、`name_en`、`name_zh` 等字段，战报正文会跟随 UI 语言一起切换，不需要重新读取 JSON 文件。如果缺少双语字段，则自动回退到原始字段。

- 当前版本会切换固定 UI 文案，例如标题、按钮、状态提示等，并重新渲染已读取的战报正文。
- 如果 `latest.json` 提供 `summary_en`、`summary_zh`、`highlights_en`、`highlights_zh`、`standings_changes_en`、`standings_changes_zh`、`title_en`、`title_zh`、`name_en`、`name_zh`、`venue_en`、`venue_zh` 等字段，战报正文也会跟随语言切换。
- 如果没有对应语言字段，界面会 fallback 到原始字段，例如 `summary`、`highlights`、`standings_changes`、`title`、`name`、`venue`。

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

Windows 可以从项目根目录运行下面命令创建桌面快捷方式；目前未实机验证，待 Windows 环境测试后再确认：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-windows-hotkey.ps1
```

它会在 Desktop 创建 `WorldCup Gadget.lnk`，并设置 `Ctrl + Alt + W`。Windows 的 `.lnk` 热键通常要求快捷方式位于 Desktop 或 Start Menu 中。

## 数据来源

应用运行时读取用户数据目录中的缓存：

```text
<userData>/data/latest.json
```

首次启动如果缓存不存在，会从打包资源或开发目录中的 `../data/latest.json` 复制一份 seed data。随后主进程会按设置从远程 JSON feed 自动更新缓存。当前默认 feed 是：

```text
https://raw.githubusercontent.com/VincentZJW/worldcup-gadget/master/data/latest.json
```

如果 GitHub raw feed 临时失败，主进程会依次回退到 `cdn.jsdelivr.net` 和 `fastly.jsdelivr.net` 备用 feed。请求会附带 cache-busting 参数，避免继续读取旧 CDN 缓存。

主进程使用固定路径读取和写入缓存，不接受 renderer 提供的任意文件路径。renderer 不启用 Node integration，不直接联网，并通过安全的 preload IPC 读取本地缓存。

如果比赛包含 `finished_at_bj`，应用会按该字段排序并展示最新结束的一场；如果没有该字段，则展示 `matches` 数组中的最后一场。

## 刷新数据

正常使用时不需要手动修改数据文件。应用启动后会自动更新一次，并按约 5 分钟间隔继续更新；每日自动展示前也会先尝试更新一次。更新失败时会继续使用上一次本地缓存。

顶部“刷新”按钮适合普通用户：它会先触发远程更新，再读取本地缓存并刷新 UI。设置页里有两个更细的数据动作：

- “立即更新”：主进程立刻访问远程 JSON feed，校验成功后写入本地缓存。
- “重新读取”：不联网，只重新读取当前本地缓存并刷新 UI。

远程 JSON feed 由项目根目录的 GitHub Action 自动生成：

- `.github/workflows/update-worldcup-feed.yml` 每 5 分钟运行一次，也支持手动触发；
- `scripts/generate_worldcup_feed.mjs` 请求 FIFA 官方 FDH API，读取比赛状态、比分、timeline、进球球员和进球时间；
- workflow 只提交 `data/latest.json`，不会提交本地 roadmap 或其他开发笔记；
- workflow 提交 feed 变化后会清理 jsDelivr feed URL 的缓存；gadget 默认读取 GitHub raw feed 来降低 CDN 旧缓存风险；
- 生成失败时不会覆盖旧 feed，gadget 会继续使用上一次缓存。

## 当前版本边界

- renderer 前端不直接请求任何比赛或新闻数据；
- 主进程会按设置请求远程 JSON feed；
- 不读取私人文件；
- 不安装 LaunchAgent；
- 默认不修改 macOS 系统设置，只有用户开启“登录后自动启动”时才写入系统登录项；
- 不修改 Windows 注册表；
- 不要求管理员权限；

后续可以继续增加：

- 替换为正式后端或 Worker feed；
- 签名和 notarization；
- 发布前 QA 矩阵。

如果 Electron 依赖尚未安装，需先完成 `npm install`。若遇到 Electron binary download 失败，请先解决本机网络或 npm 下载环境；本项目只配置项目级镜像，不会修改系统代理或全局 npm 配置。
