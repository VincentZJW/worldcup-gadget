# worldcup-gadget

`worldcup-gadget` 是一个纯 HTML / CSS / JavaScript 编写的 macOS 本地 Dashboard Gadget。它读取 `data/latest.json`，以约 `620 × 720` 的深色小窗口展示 2026 世界杯上一天战况，并可由 `launchd` 在每天早上 10:00 自动打开。

当前版本只使用本地 demo 数据，不联网、不调用 API，也不依赖前端框架或构建工具。

## 文件结构

```text
worldcup-gadget/
├── index.html
├── style.css
├── app.js
├── data/
│   └── latest.json
├── scripts/
│   ├── update_data.sh
│   ├── open_dashboard.sh
│   ├── install_launchagent.sh
│   ├── uninstall_launchagent.sh
│   ├── start-floating-gadget.sh
│   ├── stop-floating-gadget.sh
│   ├── start-floating-gadget.ps1
│   ├── start-floating-gadget.bat
│   └── install-windows-hotkey.ps1
├── docs/
│   └── macos-keyboard-shortcut.md
├── floating-gadget/
│   ├── main.js
│   ├── preload.js
│   └── src/
└── launchd/
    └── com.vincent.worldcupdashboard.plist.template
```

## 手动打开 Dashboard

首次使用时确保脚本可执行，然后打开：

```bash
chmod +x scripts/*.sh
./scripts/open_dashboard.sh
```

`open_dashboard.sh` 会先检查 `data/latest.json`。文件存在时绝不会覆盖；文件缺失时才创建 demo JSON。随后在 `127.0.0.1:8787` 启动仅本机可访问的 Python HTTP server，优先用 Google Chrome app mode 打开，未安装 Chrome 时回退到 Safari，并尝试将窗口放在屏幕右上角。

首次调整窗口时，macOS 可能询问是否允许终端或脚本控制 Finder、Chrome / Safari。拒绝只会跳过自动调整窗口，不影响页面打开。

## 跨平台启动足球悬浮球

`floating-gadget` 是 Electron 桌面悬浮球版本。它读取同一个 `data/latest.json`，启动后不需要 Terminal / PowerShell 持续打开。

首次使用前需要安装 Electron 依赖：

```bash
cd floating-gadget
npm install
```

### macOS 启动

```bash
./scripts/start-floating-gadget.sh
```

如果需要从脚本停止 macOS 悬浮球：

```bash
./scripts/stop-floating-gadget.sh
```

如需系统级快捷键启动未运行的 gadget，请使用 macOS Shortcuts / 快捷指令绑定 `Control + Option + W`。详细步骤见：

```text
docs/macos-keyboard-shortcut.md
```

### Windows 启动

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-floating-gadget.ps1
```

也可以双击：

```text
scripts\start-floating-gadget.bat
```

### Windows 创建桌面快捷键

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-windows-hotkey.ps1
```

脚本会在用户 Desktop 创建 `WorldCup Gadget.lnk`，并设置快捷键：

```text
Ctrl + Alt + W
```

Windows 的 `.lnk` 热键通常要求快捷方式位于 Desktop 或 Start Menu 中。

### 已运行时的 Electron 内部快捷键

当 `floating-gadget` 已经运行时，Electron 内部注册了：

```text
Control + Alt + W
```

它只会显示 / 唤醒 collapsed 小足球悬浮球；如果当前是展开面板，也会先收回成小足球。它不会直接打开战报内容。注意：

- 系统级快捷键负责“启动未运行的 gadget”。
- Electron `globalShortcut` 负责“显示已经运行的 collapsed 小足球悬浮球”。
- 两者不是同一个层级。

如果 gadget 已经运行，再次执行启动脚本不会产生多个悬浮球；Electron 的 single instance lock 会唤醒已有窗口，并显示 collapsed 小足球。

## 安装每天早上 10 点自动打开

```bash
./scripts/install_launchagent.sh
```

脚本会由模板生成：

```text
~/Library/LaunchAgents/com.vincent.worldcupdashboard.plist
```

并通过 `launchctl bootstrap` 与 `launchctl enable` 加载任务。`launchd` 使用 Mac 的系统本地时区；请将系统时区设为 `Asia/Shanghai`，即可对应北京时间 10:00。

## 测试定时任务

安装后可立即触发：

```bash
launchctl kickstart -k gui/$(id -u)/com.vincent.worldcupdashboard
```

查看状态：

```bash
launchctl print gui/$(id -u)/com.vincent.worldcupdashboard
```

排查日志：

```bash
tail -n 50 /tmp/worldcupdashboard.out.log
tail -n 50 /tmp/worldcupdashboard.err.log
```

## 卸载

```bash
./scripts/uninstall_launchagent.sh
```

脚本会尝试卸载任务并删除对应 plist；任务不存在时会友好提示，不会把它当作致命错误。

## 接入 OpenClaw

后续 OpenClaw 建议每天早上 09:55 完整写入：

```text
data/latest.json
```

建议先写入同目录临时文件，再原子替换 `latest.json`，避免 Dashboard 读取到未写完的数据。Dashboard 会通过本机 HTTP server 直接读取该 JSON；OpenClaw 不需要管理其他文件。

## latest.json 数据结构

- `updated_at`：北京时间更新时间文本。
- `date_range`：战况所属日期。
- `summary`：昨日概览。
- `matches[]`：比赛数组，包含 `group`、`status`、可选 `venue`、`team_a`、`team_b` 和可选 `highlights`。
- `team_a` / `team_b`：包含 `name`、`flag`、`score`、`scorers[]`。
- `scorers[]`：包含 `player`、`minute`、`type`；`type` 支持 `goal`、`penalty`、`own_goal`。
- `today_fixtures[]`：包含 `time_bj`、双方球队对象和 `group`。
- `standings_changes[]`：积分或出线形势变化文本。
- `news[]`：包含 `title`、`source`、`url`。

前端会容忍可选字段缺失，并使用 `textContent` 安全插入动态文本，不直接把 JSON 内容作为 HTML 注入。

## 安全说明

- 不读取任何私人文件。
- 不联网请求世界杯数据。
- 不调用付费 API。
- 除运行安装脚本时写入 `~/Library/LaunchAgents` 外，不修改项目目录之外的文件。
- 新闻 demo 链接只有在用户主动点击后才会由浏览器打开。
