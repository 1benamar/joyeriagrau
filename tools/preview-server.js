// Servidor estático para revisar la web en local: node tools/preview-server.js [carpeta] [puerto]
// No ejecuta PHP: los formularios mostrarán su mensaje de error al no poder enviar.
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(process.argv[2] || path.join(__dirname, ".."));
const port = +process.argv[3] || 8765;
const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".pdf": "application/pdf",
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath.endsWith("/")) urlPath += "index.html";
  const file = path.join(root, urlPath);
  if (!file.startsWith(root) || path.extname(file) === ".php") return notFound(res);
  fs.readFile(file, (err, data) => {
    if (err) return notFound(res);
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-cache" });
    res.end(data);
  });
}).listen(port, () => console.log(`Web en http://localhost:${port}`));

function notFound(res) {
  fs.readFile(path.join(root, "404.html"), (err, data) => {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(err ? "404" : data);
  });
}
