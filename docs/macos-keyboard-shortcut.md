# macOS keyboard shortcut for WorldCup Floating Gadget

macOS 不建议普通应用或脚本直接替用户写入系统级键盘快捷键，所以本项目只提供启动脚本：

```bash
/bin/zsh "/完整路径/worldcup-gadget/scripts/start-floating-gadget.sh"
```

你可以用 macOS 自带的 Shortcuts / 快捷指令，或 Automator Quick Action，把这个脚本绑定到 `Control + Option + W`。

## 方式 A：Shortcuts / 快捷指令

1. 打开 macOS 的 Shortcuts / 快捷指令。
2. 新建一个快捷指令，例如命名为 `WorldCup Gadget`。
3. 添加动作：Run Shell Script / 运行 Shell 脚本。
4. 输入你的脚本完整路径，例如：

   ```bash
   /bin/zsh "/Users/vincentz/Documents/worldcup-gadget/scripts/start-floating-gadget.sh"
   ```

5. 在快捷指令详情里设置键盘快捷键：

   ```text
   Control + Option + W
   ```

6. 以后按 `Control + Option + W` 即可启动或唤醒悬浮球。

## 方式 B：Automator Quick Action

1. 打开 Automator。
2. 新建 Quick Action / 快速操作。
3. 添加 Run Shell Script / 运行 Shell 脚本。
4. 输入 `start-floating-gadget.sh` 的完整路径，例如：

   ```bash
   /bin/zsh "/Users/vincentz/Documents/worldcup-gadget/scripts/start-floating-gadget.sh"
   ```

5. 保存 Quick Action。
6. 打开 System Settings > Keyboard > Keyboard Shortcuts。
7. 找到刚创建的 Quick Action，并绑定：

   ```text
   Control + Option + W
   ```

## 两层快捷键的区别

- macOS Shortcuts / Automator 负责“应用未运行时启动 gadget”。
- Electron 内部 `globalShortcut` 负责“应用已经运行时显示 / 唤醒 collapsed 小足球悬浮球”，不会直接展开战报内容。
- Electron 里配置的是 `Control+Alt+W`；在 macOS 键盘上，`Alt` 对应 `Option`，也就是 `Control + Option + W`。

首次运行时，macOS 可能会要求你授权 Shortcuts、Automator 或 Terminal 运行脚本。授权只影响快捷键入口，不会让本项目读取私人文件。
