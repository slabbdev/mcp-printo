// Serveur de test local : embarque le Worker et le expose en HTTP réel.
// Usage : node tools/local-server.mjs [port]   puis   bash tools/selftest-curl.sh http://127.0.0.1:<port>/mcp
import { createServer } from 'node:http';
import worker from '../worker/worker.js';

const port = Number(process.argv[2] || 8771);
createServer(async (req, res) => {
  const body = await new Promise((resolve) => {
    let b = '';
    req.on('data', (c) => (b += c));
    req.on('end', () => resolve(b));
  });
  const url = new URL(req.url, `http://127.0.0.1:${port}`);
  const request = new Request(url, {
    method: req.method,
    headers: req.headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : body,
  });
  const out = await worker.fetch(request);
  res.writeHead(out.status, Object.fromEntries(out.headers));
  const buf = Buffer.from(await out.arrayBuffer());
  res.end(buf);
}).listen(port, () => console.log(`worker local sur http://127.0.0.1:${port}/mcp`));
