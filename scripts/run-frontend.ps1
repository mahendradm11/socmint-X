Set-Location "$PSScriptRoot\..\frontend\investigator-portal"
if (-not (Test-Path node_modules)) { npm install }
npm run dev
