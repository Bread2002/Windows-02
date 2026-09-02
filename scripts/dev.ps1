# Copyright (c) 2026, Rye Stahle-Smith; All rights reserved.
# Personal Website
# Last Updated: June 2nd, 2026
# Description: PowerShell script to start the Vercel development server.
#              Vercel serves the Vite frontend and Python API functions together.

# Determine project root
$root = Split-Path -Parent $PSScriptRoot

# Start the frontend and API functions through Vercel from the project root.
$vercelCmd = @"
Set-Location '$root'
npx vercel dev
"@

Write-Host "Starting Vercel development server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", $vercelCmd

# Display instructions to the user
Write-Host ""
Write-Host "Vercel development server is starting at http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Close the new terminal window to stop the server..." -ForegroundColor Gray
