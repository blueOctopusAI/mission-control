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
  path.resolve(__dirname, "..", "..", "intelligence-hub");

const JOB_SEARCH_PIPELINE_PATH =
  process.env.JOB_SEARCH_PATH
    ? path.join(process.env.JOB_SEARCH_PATH, "Pipeline")
    : path.resolve(__dirname, "..", "..", "2026JobSearch", "Pipeline");

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

// File watchers
const watcherOptions = {
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
};

const watcher = watch(INTELLIGENCE_HUB_PATH, watcherOptions);
const jobWatcher = watch(JOB_SEARCH_PIPELINE_PATH, watcherOptions);

let ready = false;
let jobReady = false;

function handleChange(basePath: string, label: string) {
  return (filePath: string) => {
    if (label === "hub" && !ready) return;
    if (label === "jobs" && !jobReady) return;
    if (!filePath.endsWith(".md")) return;

    const relative = path.relative(basePath, filePath);
    console.log(`Changed [${label}]: ${relative}`);
    broadcast({ type: "file-change", file: relative, source: label, timestamp: Date.now() });
  };
}

function handleAdd(basePath: string, label: string) {
  return (filePath: string) => {
    if (label === "hub" && !ready) return;
    if (label === "jobs" && !jobReady) return;
    if (!filePath.endsWith(".md")) return;

    const relative = path.relative(basePath, filePath);
    console.log(`Added [${label}]: ${relative}`);
    broadcast({ type: "file-change", file: relative, source: label, timestamp: Date.now() });
  };
}

watcher.on("ready", () => {
  ready = true;
  console.log(`Watching: ${INTELLIGENCE_HUB_PATH}`);
});

watcher.on("change", handleChange(INTELLIGENCE_HUB_PATH, "hub"));
watcher.on("add", handleAdd(INTELLIGENCE_HUB_PATH, "hub"));

jobWatcher.on("ready", () => {
  jobReady = true;
  console.log(`Watching: ${JOB_SEARCH_PIPELINE_PATH}`);
  console.log("Waiting for file changes...");
});

jobWatcher.on("change", handleChange(JOB_SEARCH_PIPELINE_PATH, "jobs"));
jobWatcher.on("add", handleAdd(JOB_SEARCH_PIPELINE_PATH, "jobs"));

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down...");
  wss.close();
  watcher.close();
  jobWatcher.close();
  process.exit(0);
});
