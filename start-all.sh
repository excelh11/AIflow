#!/bin/bash
echo "Starting all services..."
echo ""
echo "Make sure you have:"
echo "1. Java 21 installed"
echo "2. Python 3.8+ installed"
echo "3. Node.js 16+ installed"
echo "4. OpenAI API Key configured in application.yml"
echo ""
read -p "Press Enter to continue..."

# Spring AI Server
echo "Starting Spring AI Server..."
cd spring-ai-server
if [ ! -f "gradlew.bat" ] && [ ! -f "gradlew" ]; then
    echo "Gradle wrapper not found. Initializing..."
    gradle wrapper --gradle-version 8.5
fi
if [ -f "gradlew" ]; then
    ./gradlew bootRun &
else
    gradlew.bat bootRun &
fi
SPRING_PID=$!
cd ..

sleep 5

# Python Preprocessor Server
echo "Starting Python Preprocessor Server..."
cd python-preprocessor
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi
source venv/Scripts/activate
pip install -r requirements.txt > /dev/null 2>&1
python app.py &
PYTHON_PID=$!
cd ..

sleep 5

# React Frontend
echo "Starting React Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "All services are starting..."
echo "Spring AI Server: http://localhost:8080"
echo "Python Server: http://localhost:5000"
echo "React Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"
echo "PIDs: Spring=$SPRING_PID, Python=$PYTHON_PID, Frontend=$FRONTEND_PID"

# Wait for user to stop
wait
