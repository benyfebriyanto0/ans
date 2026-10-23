# Memindahkan file GitHub Actions dari ops\github-workflows ke .github\workflows
# Jalankan dari folder project:
#   powershell -ExecutionPolicy Bypass -File .\pindah-workflow.ps1

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

$src = Join-Path $PSScriptRoot "ops\github-workflows"
$dst = Join-Path $PSScriptRoot ".github\workflows"

if (-not (Test-Path $src)) {
    Write-Host "Folder ops\github-workflows tidak ditemukan (mungkin sudah dipindahkan)." -ForegroundColor Yellow
} else {
    New-Item -ItemType Directory -Force -Path $dst | Out-Null
    Move-Item -Path (Join-Path $src "*.yml") -Destination $dst -Force
    Remove-Item -Recurse -Force (Join-Path $PSScriptRoot "ops")
    Write-Host "OK: workflow dipindahkan ke .github\workflows" -ForegroundColor Green
    Get-ChildItem $dst | ForEach-Object { Write-Host "  - $($_.Name)" }
}

# Peringatan bila .env tidak dikecualikan
if ((Test-Path ".env") -and -not (Select-String -Path ".gitignore" -Pattern "^\.env\*" -Quiet)) {
    Write-Host "PERINGATAN: .env belum ada di .gitignore!" -ForegroundColor Red
}

# Hapus script ini sendiri agar tidak ikut ter-commit
Remove-Item -Force $PSCommandPath
Write-Host "Selesai. Lanjut ke langkah git init / push." -ForegroundColor Cyan
