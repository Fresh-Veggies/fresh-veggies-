#!/usr/bin/env python3
import http.server
import socketserver
import os
import json
from urllib.parse import urlparse

class HealthHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {"status": "healthy", "port": os.getenv("PORT", "8000")}
            self.wfile.write(json.dumps(response).encode())
        elif parsed_path.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {"message": "Hello World!", "port": os.getenv("PORT", "8000")}
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == "__main__":
    PORT = int(os.getenv("PORT", 8000))
    print(f"🚀 Starting server on port {PORT}")
    print(f"🌐 Health check: http://localhost:{PORT}/health")
    
    with socketserver.TCPServer(("0.0.0.0", PORT), HealthHandler) as httpd:
        print(f"✅ Server running on 0.0.0.0:{PORT}")
        httpd.serve_forever() 