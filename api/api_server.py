#!/usr/bin/env python3
import http.server
import socketserver
import os
import json
import urllib.parse
from datetime import datetime

class APIHandler(http.server.BaseHTTPRequestHandler):
    def _send_json_response(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_OPTIONS(self):
        # Handle CORS preflight
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        if path == '/health':
            self._send_json_response({
                "status": "healthy", 
                "port": os.getenv("PORT", "8000"),
                "timestamp": datetime.now().isoformat()
            })
        
        elif path == '/':
            self._send_json_response({
                "message": "Fresh Veggies API",
                "version": "1.0.0",
                "docs": "/docs",
                "api_endpoints": "/api/",
                "health": "/health"
            })
        
        elif path == '/api/status':
            self._send_json_response({
                "api": "Fresh Veggies Backend",
                "status": "operational",
                "environment": "production",
                "timestamp": datetime.now().isoformat()
            })
        
        elif path.startswith('/api/'):
            # Handle API routes
            self._send_json_response({
                "message": "API endpoint",
                "path": path,
                "method": "GET",
                "note": "Full API functionality coming soon"
            })
        
        else:
            self._send_json_response({"error": "Not found", "path": path}, 404)

    def do_POST(self):
        # Handle POST requests
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else ''
        
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        if path.startswith('/api/'):
            self._send_json_response({
                "message": "API POST endpoint", 
                "path": path,
                "received_data": post_data[:100] + "..." if len(post_data) > 100 else post_data
            })
        else:
            self._send_json_response({"error": "Not found", "path": path}, 404)

    def log_message(self, format, *args):
        # Custom logging
        print(f"[{datetime.now().isoformat()}] {format % args}")

if __name__ == "__main__":
    PORT = int(os.getenv("PORT", 8000))
    print(f"🚀 Starting Fresh Veggies API server on port {PORT}")
    print(f"🌐 Health check: http://localhost:{PORT}/health")
    print(f"📖 API status: http://localhost:{PORT}/api/status")
    
    try:
        with socketserver.TCPServer(("0.0.0.0", PORT), APIHandler) as httpd:
            print(f"✅ Server running on 0.0.0.0:{PORT}")
            httpd.serve_forever()
    except Exception as e:
        print(f"❌ Server failed to start: {e}")
        raise 