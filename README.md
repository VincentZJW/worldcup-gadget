[English](#english) | [中文](#中文)

# English

## WorldCup Floating Gadget

A lightweight desktop floating gadget for viewing the latest 2026 FIFA World Cup match brief.

This project contains two local views:

- An Electron floating soccer-ball gadget in `floating-gadget/`.
- A classic local HTML dashboard at the project root.

Both views read local match data from `data/latest.json`.

## Features

- Floating soccer-ball desktop widget.
- Click to expand the latest match report.
- “View More” to see all matches from the latest report.
- Reads local JSON data from `data/latest.json`.
- macOS shortcut support through Shortcuts / Automator.
- Windows shortcut scripts are included; the Windows flow has not yet been verified on a Windows machine.
- Detached launch, so the gadget keeps running after Terminal closes.
- Manual quit from the floating panel.
- Electron single-instance behavior: launching again wakes the existing gadget instead of creating duplicate floating balls.

## Project Structure

- `data/latest.json`  
  Local match report data used by both the floating gadget and the classic dashboard.

- `floating-gadget/`  
  Electron app for the desktop floating soccer-ball gadget. It contains `main.js`, `preload.js`, UI files under `src/`, and its own `package.json`.

- `scripts/`  
  Local helper scripts, including:

  - `start-floating-gadget.sh`
  - `stop-floating-gadget.sh`
  - `start-floating-gadget.ps1`
  - `start-floating-gadget.bat`
  - `install-windows-hotkey.ps1`
  - classic dashboard / launchd scripts such as `open_dashboard.sh` and `install_launchagent.sh`

- `docs/`  
  Extra documentation, including macOS keyboard shortcut setup.

- `index.html`, `style.css`, `app.js`  
  Classic local dashboard view.

## Installation

Install the Electron dependency for the floating gadget:

```bash
cd worldcup-gadget/floating-gadget
npm install
```

If the project is located at the current default path:

```bash
cd /Users/vincentz/Documents/worldcup-gadget/floating-gadget
npm install
```

## Start the Gadget Manually

From the project root:

```bash
cd /Users/vincentz/Documents/worldcup-gadget
./scripts/start-floating-gadget.sh
```

The script launches Electron in detached mode, so the gadget can keep running after Terminal closes. It does not use `npm start`.

## Stop the Gadget

From the project root:

```bash
cd /Users/vincentz/Documents/worldcup-gadget
./scripts/stop-floating-gadget.sh
```

You can also quit from the floating panel by clicking “Quit”, or by right-clicking the soccer ball and choosing “Quit Floating Gadget”.

## macOS Keyboard Shortcut

Use macOS Shortcuts / 快捷指令 to create a system-level shortcut that starts or wakes the gadget.

1. Open the Shortcuts app.
2. Create a new shortcut, for example `WorldCup Gadget`.
3. Add “Run Shell Script”.
4. Use:

```bash
export PATH="/Users/vincentz/.hermes/node/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

/bin/zsh /Users/vincentz/Documents/worldcup-gadget/scripts/start-floating-gadget.sh
```

5. Bind a shortcut such as `Control + Option + W`.

Expected behavior:

- If the gadget is not running, the shortcut starts it and shows the collapsed soccer ball.
- If the gadget is already running, the shortcut wakes the existing collapsed soccer ball.
- If the report panel is expanded, the shortcut collapses it back to the soccer ball.
- The shortcut does not directly open the match report; click the soccer ball to expand the panel.

More details:

```text
docs/macos-keyboard-shortcut.md
```

## Windows Keyboard Shortcut

Windows helper scripts are included, but this flow has not yet been verified on a Windows machine.

If available, run the PowerShell installer script from the project root:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-windows-hotkey.ps1
```

The intended default shortcut is:

```text
Ctrl + Alt + W
```

You can also try launching manually:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-floating-gadget.ps1
```

Or use the batch fallback if available:

```text
scripts\start-floating-gadget.bat
```

## Optional Classic Local Dashboard

The project root also includes a classic local HTML dashboard.

To open it manually on macOS:

```bash
cd /Users/vincentz/Documents/worldcup-gadget
chmod +x scripts/*.sh
./scripts/open_dashboard.sh
```

`open_dashboard.sh` checks `data/latest.json`, starts a local-only server at `127.0.0.1:8787`, then opens the dashboard in Chrome app mode when available, or Safari as a fallback.

To install the optional macOS `launchd` task that opens the classic dashboard every day at 10:00 local system time:

```bash
cd /Users/vincentz/Documents/worldcup-gadget
./scripts/install_launchagent.sh
```

To uninstall it:

```bash
cd /Users/vincentz/Documents/worldcup-gadget
./scripts/uninstall_launchagent.sh
```

## Updating Match Data

The gadget reads:

```text
data/latest.json
```

The file must be valid JSON. Codex or OpenClaw can generate the report and write to this file.

Recommended safe write flow:

1. Write the new report to `data/latest.tmp.json`.
2. Validate it with `python3 -m json.tool` or `JSON.parse`.
3. Replace `data/latest.json` only after validation succeeds.
4. If validation fails, keep the old `data/latest.json`.

Codex / OpenClaw can run a daily local update, for example around Beijing time `09:55`, so the gadget has fresh data before the morning dashboard is opened. The data updater should not modify code files, commit to Git, or push to GitHub.

## latest.json Format

Main fields:

- `updated_at`  
  Human-readable Beijing-time update string.

- `date_range`  
  Date covered by the report.

- `summary`  
  One-sentence summary of the latest World Cup action.

- `matches`  
  Finished match cards. Each match can include `group`, `status`, `venue`, `finished_at_bj`, `team_a`, `team_b`, and `highlights`.

- `standings_changes`  
  Group standings or qualification situation changes.

- `today_fixtures`  
  Upcoming fixtures, with Beijing time, teams, flags, and group.

- `news`  
  Important links with `title`, `source`, and `url`.

The frontend inserts dynamic data safely with `textContent` and tolerates missing optional fields where possible.

## Troubleshooting

If the macOS shortcut does not work:

- Check that Node.js is reachable from Shortcuts.
- The project script already prepends this PATH:

```bash
/Users/vincentz/.hermes/node/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

- Check the gadget log:

```bash
tail -n 80 /tmp/worldcup-floating-gadget.log
```

If Electron does not start:

- Make sure dependencies are installed:

```bash
cd /Users/vincentz/Documents/worldcup-gadget/floating-gadget
npm install
```

- Check whether Electron exists:

```bash
ls -l /Users/vincentz/Documents/worldcup-gadget/floating-gadget/node_modules/.bin/electron
```

If the classic dashboard launchd task is used on macOS, its logs are separate:

```bash
tail -n 50 /tmp/worldcupdashboard.out.log
tail -n 50 /tmp/worldcupdashboard.err.log
```

## Safety Notes

- No private files are read by the gadget.
- No API keys are required for the gadget itself.
- `node_modules` should not be committed.
- `latest.json` is local data.
- The gadget itself does not need paid APIs.
- News links open only when the user clicks them.
- The Windows shortcut scripts do not require administrator privileges and do not modify the Windows registry.

---

# 中文

## 世界杯桌面悬浮球

`worldcup-gadget` 是一个轻量级本地桌面工具，用来查看最新的 2026 FIFA 世界杯战报。

当前项目包含两个本地展示方式：

- `floating-gadget/` 中的 Electron 足球悬浮球。
- 项目根目录下的经典 HTML Dashboard。

两者都读取本地数据文件：

```text
data/latest.json
```

## 功能特点

- 桌面足球样式悬浮球。
- 点击小足球展开最新比赛战报。
- 点击“查看更多”查看当前战报里的全部比赛。
- 从本地 `data/latest.json` 读取数据。
- 支持 macOS Shortcuts / 快捷指令启动和唤醒。
- 已包含 Windows 快捷键脚本；Windows 流程目前还没有在 Windows 机器上实测。
- detached 启动，Terminal 关闭后悬浮球仍可继续运行。
- 可以在面板中手动退出。
- Electron 单实例运行：重复启动不会创建多个悬浮球，而是唤醒已有窗口。

## 项目结构

- `data/latest.json`  
  本地战报数据，悬浮球和经典 Dashboard 都读取这个文件。

- `floating-gadget/`  
  Electron 桌面悬浮球应用，包含 `main.js`、`preload.js`、`src/` UI 文件和独立的 `package.json`。

- `scripts/`  
  本地辅助脚本，包括：

  - `start-floating-gadget.sh`
  - `stop-floating-gadget.sh`
  - `start-floating-gadget.ps1`
  - `start-floating-gadget.bat`
  - `install-windows-hotkey.ps1`
  - 经典 Dashboard / launchd 相关脚本，例如 `open_dashboard.sh` 和 `install_launchagent.sh`

- `docs/`  
  补充文档，例如 macOS 快捷键设置说明。

- `index.html`、`style.css`、`app.js`  
  经典本地 Dashboard 页面。

## 安装依赖

进入 Electron 悬浮球目录安装依赖：

```bash
cd worldcup-gadget/floating-gadget
npm install
```

如果项目位于当前默认路径：

```bash
cd /Users/vincentz/Documents/worldcup-gadget/floating-gadget
npm install
```

## 手动启动悬浮球

在项目根目录运行：

```bash
cd /Users/vincentz/Documents/worldcup-gadget
./scripts/start-floating-gadget.sh
```

这个脚本会以 detached 方式启动 Electron，因此 Terminal 关闭后悬浮球仍可继续运行。它不会使用 `npm start`。

## 停止悬浮球

在项目根目录运行：

```bash
cd /Users/vincentz/Documents/worldcup-gadget
./scripts/stop-floating-gadget.sh
```

也可以在展开面板里点击“退出”，或者右键小足球后选择“退出悬浮球”。

## macOS 快捷键设置

使用 macOS Shortcuts / 快捷指令创建一个系统级快捷键，用来启动或唤醒悬浮球。

1. 打开「快捷指令」应用。
2. 新建快捷指令，例如命名为 `WorldCup Gadget`。
3. 添加「运行 Shell 脚本」动作。
4. 填入：

```bash
export PATH="/Users/vincentz/.hermes/node/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

/bin/zsh /Users/vincentz/Documents/worldcup-gadget/scripts/start-floating-gadget.sh
```

5. 绑定一个快捷键，例如 `Control + Option + W`。

预期效果：

- 如果悬浮球未运行，快捷键会启动它并显示 collapsed 小足球。
- 如果悬浮球已经运行，快捷键会唤醒已有的小足球。
- 如果战报面板已经展开，快捷键会先把它收回成小足球。
- 快捷键不会直接打开战报内容；需要手动点击小足球才会展开面板。

更多说明见：

```text
docs/macos-keyboard-shortcut.md
```

## Windows 快捷键设置

项目已包含 Windows 辅助脚本，但目前还没有在 Windows 机器上实测。

如果脚本可用，可以在项目根目录运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-windows-hotkey.ps1
```

默认计划绑定的快捷键是：

```text
Ctrl + Alt + W
```

也可以尝试手动启动：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-floating-gadget.ps1
```

如果已生成批处理入口，也可以使用：

```text
scripts\start-floating-gadget.bat
```

## 可选：经典本地 Dashboard

项目根目录还包含一个经典 HTML Dashboard。

在 macOS 上手动打开：

```bash
cd /Users/vincentz/Documents/worldcup-gadget
chmod +x scripts/*.sh
./scripts/open_dashboard.sh
```

`open_dashboard.sh` 会检查 `data/latest.json`，在 `127.0.0.1:8787` 启动仅本机可访问的服务，然后优先用 Chrome app mode 打开，未安装 Chrome 时回退到 Safari。

如果需要安装可选的 macOS `launchd` 定时任务，让经典 Dashboard 每天系统本地时间 10:00 自动打开：

```bash
cd /Users/vincentz/Documents/worldcup-gadget
./scripts/install_launchagent.sh
```

卸载：

```bash
cd /Users/vincentz/Documents/worldcup-gadget
./scripts/uninstall_launchagent.sh
```

## 更新战报数据

悬浮球读取：

```text
data/latest.json
```

这个文件必须是合法 JSON。Codex 或 OpenClaw 可以生成战报并写入这个文件。

推荐的安全写入流程：

1. 先写入 `data/latest.tmp.json`。
2. 使用 `python3 -m json.tool` 或 `JSON.parse` 验证 JSON。
3. 验证成功后，再替换 `data/latest.json`。
4. 如果验证失败，保留旧的 `data/latest.json`。

Codex / OpenClaw 可以每天在北京时间 `09:55` 左右执行本地数据更新，这样早上的 dashboard 或悬浮球可以读取到最新战报。数据更新任务不应该修改代码文件，不应该 git commit，也不应该 push 到 GitHub。

## latest.json 数据格式

主要字段：

- `updated_at`  
  北京时间更新时间文本。

- `date_range`  
  当前战报覆盖的日期。

- `summary`  
  一句话概括最新世界杯战况。

- `matches`  
  已结束比赛列表。每场比赛可以包含 `group`、`status`、`venue`、`finished_at_bj`、`team_a`、`team_b` 和 `highlights`。

- `standings_changes`  
  小组积分或出线形势变化。

- `today_fixtures`  
  接下来的比赛安排，包含北京时间、球队、国旗和小组。

- `news`  
  重点新闻链接，包含 `title`、`source` 和 `url`。

前端会用 `textContent` 安全插入动态文本，并尽量兼容可选字段缺失的情况。

## 故障排查

如果 macOS 快捷键无法启动：

- 检查 Shortcuts 环境里是否能找到 Node.js。
- 当前启动脚本已经在开头加入以下 PATH：

```bash
/Users/vincentz/.hermes/node/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

- 查看悬浮球日志：

```bash
tail -n 80 /tmp/worldcup-floating-gadget.log
```

如果 Electron 无法启动：

- 确认依赖已经安装：

```bash
cd /Users/vincentz/Documents/worldcup-gadget/floating-gadget
npm install
```

- 检查 Electron binary 是否存在：

```bash
ls -l /Users/vincentz/Documents/worldcup-gadget/floating-gadget/node_modules/.bin/electron
```

如果使用经典 Dashboard 的 macOS launchd 定时任务，它的日志是另一组：

```bash
tail -n 50 /tmp/worldcupdashboard.out.log
tail -n 50 /tmp/worldcupdashboard.err.log
```

## 安全说明

- 悬浮球不会读取私人文件。
- 悬浮球本身不需要 API key。
- `node_modules` 不应该提交到 Git。
- `latest.json` 是本地数据文件。
- 悬浮球本身不依赖付费 API。
- 新闻链接只有在用户主动点击时才会打开。
- Windows 快捷键脚本不需要管理员权限，也不会修改 Windows 注册表。
