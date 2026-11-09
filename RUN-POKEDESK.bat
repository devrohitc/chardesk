@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>&1
if %errorlevel%==0 (
  start "Pokedesk Local Server" /D "%~dp0" cmd /k "py -m http.server 8000"
) else (
  start "Pokedesk Local Server" /D "%~dp0" cmd /k "python -m http.server 8000"
)
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8000/pokedesk-local.html"
endlocal
