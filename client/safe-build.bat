@echo off
REM Remove .next/types/**/*.ts from tsconfig.json
powershell -Command "(Get-Content tsconfig.json) | Where-Object { $_ -notmatch '\.next/types/\*\*/\*\.ts' } | Set-Content tsconfig.json"
REM Run the build
npm run build
REM Remove .next/types/**/*.ts again after build
powershell -Command "(Get-Content tsconfig.json) | Where-Object { $_ -notmatch '\.next/types/\*\*/\*\.ts' } | Set-Content tsconfig.json"