@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
powershell.exe -ExecutionPolicy Bypass -File "%SCRIPT_DIR%start-floating-gadget.ps1"

endlocal
