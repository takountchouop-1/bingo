$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$portInUse = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($portInUse) {
    $portInUse | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object {
        Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 1
}

& "$PSScriptRoot\.venv\Scripts\python.exe" -m uvicorn main:app --reload --port 8000
