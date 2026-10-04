"""Static file server for local preview that tells browsers not to cache files,
so CSS/JS edits always show up on refresh."""
import http.server
import socketserver


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, must-revalidate')
        super().end_headers()


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('0.0.0.0', 5000), NoCacheHandler) as httpd:
    httpd.serve_forever()
