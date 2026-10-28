import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { createApiApp } from '../../api';

// Runs the app's existing API routes inside a Netlify Function.
// The Express app listens on a private local port and each request is passed through to it.
let baseUrl: Promise<string> | null = null;

function start(): Promise<string> {
  if (!baseUrl) {
    baseUrl = new Promise((resolve) => {
      const server = http.createServer(createApiApp());
      server.listen(0, '127.0.0.1', () => {
        const { port } = server.address() as AddressInfo;
        resolve(`http://127.0.0.1:${port}`);
      });
    });
  }
  return baseUrl;
}

export default async (req: Request) => {
  const base = await start();
  const url = new URL(req.url);
  const headers = new Headers(req.headers);
  headers.delete('host');
  const res = await fetch(base + url.pathname + url.search, {
    method: req.method,
    headers,
    body: req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.arrayBuffer(),
  });
  return new Response(res.body, { status: res.status, headers: res.headers });
};

export const config = { path: '/api/*' };
