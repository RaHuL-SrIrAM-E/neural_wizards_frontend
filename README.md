# Modern Document Chat Interface

A premium AI-powered document chat application with glassmorphism design and smooth animations.

## Features

- **Document Upload**: Drag-and-drop support for PDF and DOCX files
- **AI Chat Interface**: ChatGPT-style conversation with your documents
- **Modern Design**: Dark theme with glassmorphism effects and animations
- **Real-time Features**: Typing indicators, auto-scroll, and live connection status
- **Responsive**: Works seamlessly on desktop and mobile devices

## Setup Instructions

### Frontend (React + Vite)
The frontend is already configured and ready to run.

### Backend (Flask)
You need to set up a Flask backend server to handle document uploads and chat queries.

Create a simple Flask server with these endpoints:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    # Save file and process it here
    # For now, just return success
    return jsonify({
        "success": True,
        "message": "File uploaded successfully",
        "filename": file.filename
    }), 200

@app.route('/query', methods=['POST'])
def query_documents():
    data = request.get_json()
    query = data.get('query', '')
    
    # Process the query against uploaded documents here
    # For now, return a simple response
    response = f"I received your query: '{query}'. This is where I would analyze your documents and provide insights."
    
    return jsonify({
        "response": response
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
```

### Running the Application

1. **Start the Flask backend**:
   ```bash
   pip install flask flask-cors
   python app.py
   ```

2. **Expose via ngrok** (if using the current configuration):
   ```bash
   ngrok http 5000
   ```
   Update the frontend URLs to match your ngrok tunnel URL.

3. **Start the React frontend**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open your browser to the Vite dev server URL (usually http://localhost:5173)

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /upload` - Upload documents (expects FormData with 'file' field)
- `POST /query` - Send chat queries (expects JSON with 'query' field)

## File Support

- **PDF files** (.pdf)
- **Word documents** (.docx, .doc)
- **File size limit**: 10MB per file

## Error Handling

The application includes comprehensive error handling for:
- Network connectivity issues
- File upload failures
- Invalid file types or sizes
- Backend server unavailability
- Request timeouts (30 seconds)

## Connection Status

The interface includes a real-time connection status indicator that:
- Checks backend connectivity every 30 seconds
- Shows visual feedback for connection state
- Provides retry functionality when disconnected
- Disables upload/chat when backend is unavailable