const http=require("http"),fs=require("fs"),path=require("path");
const root=process.argv[2],port=+process.argv[3]||8765;
const types={".html":"text/html; charset=utf-8",".css":"text/css",".js":"text/javascript",".svg":"image/svg+xml",".jpg":"image/jpeg",".png":"image/png"};
http.createServer((q,s)=>{let p=decodeURIComponent(q.url.split("?")[0]);if(p.endsWith("/"))p+="index.html";const f=path.join(root,p);
fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);return s.end("404")}s.writeHead(200,{"Content-Type":types[path.extname(f)]||"application/octet-stream","Cache-Control":"no-cache"});s.end(d)})}).listen(port,()=>console.log("serving on "+port));
