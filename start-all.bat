@echo off
echo Starting all services...
echo.
echo Make sure you have:
echo 1. Java 17+ installed
echo 2. Python 3.8+ installed
echo 3. Node.js 16+ installed
echo 4. OPENAI_API_KEY environment variable set
echo.
pause

start "Spring AI Server" cmd /k start-spring-server.bat
timeout /t 5 /nobreak >nul

start "Python Preprocessor" cmd /k start-python-server.bat
timeout /t 5 /nobreak >nul

start "React Frontend" cmd /k start-frontend.bat

echo.
echo All services are starting...
echo Spring AI Server: http://localhost:8080
echo Python Server: http://localhost:5000
echo React Frontend: http://localhost:3000
pause
