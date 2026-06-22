from http.server import BaseHTTPRequestHandler
import json


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length)) if length else {}
        username = body.get("username", "")
        password = body.get("password", "")

        if username and password:
            result = {"success": True, "message": "Welcome"}
        else:
            result = {"success": False, "message": "Username and password are required."}

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(result).encode())
