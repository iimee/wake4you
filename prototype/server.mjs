import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const port=Number(process.env.PORT||4174);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.mp4':'video/mp4','.svg':'image/svg+xml','.ttf':'font/ttf','.md':'text/plain; charset=utf-8'};
types['.xml']='application/xml';
types['.txt']='text/plain; charset=utf-8';
types['.gif']='image/gif';
types['.pdf']='application/pdf';
types['.docx']='application/vnd.openxmlformats-officedocument.wordprocessingml.document';
http.createServer((req,res)=>{
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end('Bad request');}
  const pages=['/','/place','/events','/kitchen','/water','/visit'];
  const pagePath=pathname.replace(/\/$/,'')||'/';
  const documents = new Map([
    ['/tz', 'assets/wake4you-tz.html'],
    ['/tz/pravki', 'assets/wake4you-edits.html']
  ]);
  const relative=documents.get(pagePath) ?? (pages.includes(pagePath)?'index.html':pathname.replace(/^\/+/, ''));
  const file=path.resolve(root,relative);
  const allowed=['sitemap.xml','robots.txt','index.html','content.js','cinema.css','cinema.js','poster.css','chapters.js','chapters.css'].includes(relative)||relative.startsWith('assets/')||relative.startsWith('docs/');
  if(!allowed||!file.startsWith(root+path.sep)){res.writeHead(404);return res.end('Not found');}
  fs.stat(file,(err,stat)=>{
    if(err||!stat.isFile()){res.writeHead(404);return res.end('Not found');}
    const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache','Accept-Ranges':'bytes'};
    const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    let start=0,end=stat.size-1,status=200;
    if(range){start=Number(range[1]);end=range[2]?Math.min(Number(range[2]),end):end;if(start>end||start>=stat.size){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});return res.end();}status=206;headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;}
    headers['Content-Length']=end-start+1;res.writeHead(status,headers);
    if(req.method==='HEAD')return res.end();
    const stream=fs.createReadStream(file,{start,end});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
  });
}).listen(port,'127.0.0.1',()=>console.log(`Wake4You → http://127.0.0.1:${port}`));

