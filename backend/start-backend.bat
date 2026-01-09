@echo off
REM Start Doctor AI Backend
REM This script will start the backend using Spring Boot

cd /d "E:\PROJECTS\Doctor AI\doctor-ai\backend"

REM Check if mvn is available
where mvn >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Maven (mvn) not found in PATH
    echo Please install Maven or add it to PATH
    echo You can download Maven from: https://maven.apache.org/download.cgi
    pause
    exit /b 1
)

REM Run with local profile
echo Starting Doctor AI Backend...
echo Profile: local
echo Port: 8080
echo.

call mvn clean spring-boot:run -Dspring-boot.run.profiles=local

pause
