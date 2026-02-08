#!/usr/bin/env npx tsx

/**
 * File Watcher + WebSocket Server
 *
 * Watches the intelligence-hub directory for markdown file changes
 * and broadcasts to all connected dashboard clients via WebSocket.
 *
 * Run: npx tsx scripts/watch.ts
 */

import { watch } from "chokidar";
import { WebSocketServer } from "ws";
import path from "path";

const INTELLIGENCE_HUB_PATH =
  process.env.INTELLIGENCE_HUB_PATH ||
  path.resolve("/Users/jashanno/Developer/projects/intelligence-hub");

const WS_PORT = 3001;

// WebSocket server
const wss = new WebSocketServer({ port: WS_PORT });
console.log(`WebSocket server running on ws://localhost:${WS_PORT}`);

let clientCount = 0;
wss.on("connection", (ws) => {
  clientCount++;
  console.log(`Client connected (${clientCount} total)`);

  ws.on("close", () => {
    clientCount--;
    console.log(`Client disconnected (${clientCount} remaining)`);
  });
});

function broadcast(data: object) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

// File watcher
const watcher = watch(INTELLIGENCE_HUB_PATH, {
  ignored: [
    /(^|[\/\\])\../, // dotfiles
    /node_modules/,
    /\.git/,
  ],
  persistent: true,
  awaitWriteFinish: {
    stabilityThreshold: 500,
    pollInterval: 100,
  },
});

let ready = false;

watcher.on("ready", () => {
  ready = true;
  console.log(`Watching: ${INTELLIGENCE_HUB_PATH}`);
  console.log("Waiting for file changes...");
});

watcher.on("change", (filePath) => {
  if (!ready) return;
  if (!filePath.endsWith(".md")) return;

  const relative = path.relative(INTELLIGENCE_HUB_PATH, filePath);
  console.log(`Changed: ${relative}`);
  broadcast({ type: "file-change", file: relative, timestamp: Date.now() });
});

watcher.on("add", (filePath) => {
  if (!ready) return;
  if (!filePath.endsWith(".md")) return;

  const relative = path.relative(INTELLIGENCE_HUB_PATH, filePath);
  console.log(`Added: ${relative}`);
  broadcast({ type: "file-change", file: relative, timestamp: Date.now() });
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down...");
  wss.close();
  watcher.close();
  process.exit(0);
});
