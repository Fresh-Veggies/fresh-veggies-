#!/usr/bin/env python3
import http.server
import socketserver
import os
import json
from urllib.parse import urlparse, parse_qs

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {
                "message": "🥬 Fresh Veggies API - Ultra Simple Version",
                "status": "running",
                "version": "0.1.0",
                "environment": os.getenv("ENVIRONMENT", "production"),
                "port": os.getenv("PORT", "8000"),
                "path": self.path
            }
            self.wfile.write(json.dumps(response, indent=2).encode())
            
        elif parsed_path.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {
                "status": "healthy",
                "message": "Simple server is running"
            }
            self.wfile.write(json.dumps(response, indent=2).encode())
            
        elif parsed_path.path == '/test':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {
                "message": "Test endpoint working",
                "headers": dict(self.headers),
                "method": self.command,
                "path": self.path
            }
            self.wfile.write(json.dumps(response, indent=2).encode())
            
        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {
                "error": "Not found",
                "path": self.path,
                "available_endpoints": ["/", "/health", "/test"]
            }
            self.wfile.write(json.dumps(response, indent=2).encode())

def run_server():
    port = int(os.getenv("PORT", 8000))
    host = "0.0.0.0"
    
    print(f"🚀 Starting Simple HTTP Server...")
    print(f"📍 Host: {host}")
    print(f"🔌 Port: {port}")
    print(f"🌍 Environment: {os.getenv('ENVIRONMENT', 'production')}")
    
    with socketserver.TCPServer((host, port), CustomHandler) as httpd:
        print(f"✅ Server running at http://{host}:{port}")
        print("📋 Available endpoints:")
        print("   / - Root endpoint")
        print("   /health - Health check")
        print("   /test - Test endpoint")
        print("🔄 Server starting...")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server() 