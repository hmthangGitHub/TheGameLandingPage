@echo off
:: --- CONFIGURATION ---
:: Update this path to your specific Cocos Creator 3.8.4 location
set COCOS_PATH=""C:\ProgramData\cocos\editors\Creator\3.8.4\CocosCreator.exe""
set PROJECT_PATH="%cd%"
set BUILD_CONFIG="%cd%\build_config_web.json"

echo Starting Cocos Creator Build for Web Mobile...

:: --- EXECUTION ---
%COCOS_PATH% --project %PROJECT_PATH% --build "configPath=%BUILD_CONFIG%"

if %ERRORLEVEL% EQU 0 (
    echo Build Successful!
) else (
    echo Build Failed with error code %ERRORLEVEL%
    exit /b %ERRORLEVEL%
)

pause