$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectDir = (Resolve-Path (Join-Path $ScriptDir "..")).Path
$GadgetDir = Join-Path $ProjectDir "floating-gadget"
$ElectronCmd = Join-Path $GadgetDir "node_modules\.bin\electron.cmd"
$PidFile = Join-Path $env:TEMP "worldcup-floating-gadget.pid"

if (-not (Test-Path $ElectronCmd)) {
  Write-Host "Electron is not installed for floating-gadget."
  Write-Host "Please run:"
  Write-Host "  cd floating-gadget"
  Write-Host "  npm install"
  exit 1
}

$IsRunning = $false
if (Test-Path $PidFile) {
  $ExistingPidLine = Get-Content $PidFile -ErrorAction SilentlyContinue | Select-Object -First 1
  $ExistingPid = ""
  if ($null -ne $ExistingPidLine) {
    $ExistingPid = $ExistingPidLine.Trim()
  }
  if ($ExistingPid -match '^\d+$') {
    $ExistingProcess = Get-Process -Id ([int]$ExistingPid) -ErrorAction SilentlyContinue
    if ($null -ne $ExistingProcess) {
      $IsRunning = $true
    }
  }
}

$Process = Start-Process `
  -FilePath $ElectronCmd `
  -ArgumentList @(".", "--show-ball") `
  -WorkingDirectory $GadgetDir `
  -WindowStyle Hidden `
  -PassThru

if (-not $IsRunning) {
  Set-Content -Path $PidFile -Value $Process.Id -Encoding ASCII
  Write-Host "WorldCup Floating Gadget started. PID: $($Process.Id)"
} else {
  Write-Host "WorldCup Floating Gadget is already running. Sent wake request via Electron single-instance lock."
}
