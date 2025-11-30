# Production Cleanup and Build Script

Write-Host "🧹 Cleaning Vistone Project for Production..." -ForegroundColor Cyan

# 1. Remove node_modules cache
Write-Host "`n📦 Cleaning node_modules cache..." -ForegroundColor Yellow
if (Test-Path "node_modules\.cache") {
    Remove-Item -Path "node_modules\.cache" -Recurse -Force
    Write-Host "✅ Cache cleaned" -ForegroundColor Green
}

# 2. Clean dist folder
Write-Host "`n🗑️  Removing old build..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force
    Write-Host "✅ Old build removed" -ForegroundColor Green
}

# 3. Remove log files
Write-Host "`n📝 Removing log files..." -ForegroundColor Yellow
Get-ChildItem -Path . -Recurse -Include "*.log" -ErrorAction SilentlyContinue | Remove-Item -Force
Write-Host "✅ Log files removed" -ForegroundColor Green

# 4. Remove temporary files
Write-Host "`n🗂️  Removing temporary files..." -ForegroundColor Yellow
Get-ChildItem -Path . -Recurse -Include "*.tmp","*.temp",".DS_Store","Thumbs.db" -ErrorAction SilentlyContinue | Remove-Item -Force
Write-Host "✅ Temporary files removed" -ForegroundColor Green

# 5. Clean Vite cache
Write-Host "`n⚡ Cleaning Vite cache..." -ForegroundColor Yellow
if (Test-Path ".vite") {
    Remove-Item -Path ".vite" -Recurse -Force
}
if (Test-Path "node_modules\.vite") {
    Remove-Item -Path "node_modules\.vite" -Recurse -Force
}
Write-Host "✅ Vite cache cleaned" -ForegroundColor Green

Write-Host "`n✨ Project cleaned successfully!" -ForegroundColor Green
Write-Host "`n📦 Run 'npm run build' to create production build" -ForegroundColor Cyan
