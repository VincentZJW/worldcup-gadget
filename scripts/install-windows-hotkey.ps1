$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectDir = (Resolve-Path (Join-Path $ScriptDir "..")).Path
$StartScript = Join-Path $ScriptDir "start-floating-gadget.ps1"
$Desktop = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $Desktop "WorldCup Gadget.lnk"

if (-not (Test-Path $StartScript)) {
  throw "Missing start script: $StartScript"
}

$Shell = New-Object -ComObject WScript.Shell
$Shortcut = $Shell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "powershell.exe"
$Shortcut.Arguments = "-ExecutionPolicy Bypass -File `"$StartScript`""
$Shortcut.WorkingDirectory = $ProjectDir
$Shortcut.Hotkey = "CTRL+ALT+W"
$Shortcut.WindowStyle = 7
$Shortcut.Description = "Launch or wake WorldCup Floating Gadget"
$Shortcut.Save()

Write-Host "Windows shortcut created. Press Ctrl+Alt+W to launch WorldCup Gadget."
