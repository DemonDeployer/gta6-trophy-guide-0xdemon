// Leonida Legend local server: serves this entry's app/ folder over plain
// localhost so the guide can be tried without any build step.
//
//   node serve.ts            -> app/ on port 8080
//   node serve.ts 9000       -> app/ on port 9000
//
// Node standard library only. It answers GET and HEAD, sends the content
// type a browser needs for each file, and refuses any path that escapes
// app/. It is a development convenience, not a server for the internet.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = resolve(fileURLToPath(new URL('./app', import.meta.url)));
const portArg = Number(process.argv[2]);
const port = Number.isInteger(portArg) && portArg > 0 && portArg < 65536 ? portArg : 8080;

const types = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.svg', 'image/svg+xml'],
  ['.ico', 'image/x-icon'],
]);

function safePath(rawPath) {
  let path = rawPath.split('?')[0].split('#')[0];
  try {
    path = decodeURIComponent(path);
  } catch {
    return null;
  }
  if (path.endsWith('/')) path += 'index.html';
  const file = resolve(join(appRoot, path));
  if (file !== appRoot && !file.startsWith(appRoot + sep)) return null;
  return file;
}

const server = createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'content-type': 'text/plain' }).end('method not allowed');
    return;
  }
  const file = safePath(req.url ?? '/');
  if (!file) {
    res.writeHead(403, { 'content-type': 'text/plain' }).end('forbidden');
    return;
  }
  let info;
  try {
    info = await stat(file);
    if (!info.isFile()) throw new Error('not a file');
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' }).end('not found');
    return;
  }
  const body = req.method === 'HEAD' ? null : await readFile(file);
  res.writeHead(200, {
    'content-type': types.get(extname(file).toLowerCase()) ?? 'application/octet-stream',
    'content-length': info.size,
    'cache-control': 'no-store',
  });
  res.end(body);
});

server.listen(port, '127.0.0.1', () => {
  console.log('Leonida Legend app/ is on port ' + port);
});
