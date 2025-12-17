#!/usr/bin/env node

import { exec } from "node:child_process";

import https from "node:https";
import http from "node:http";

import treeKill from "tree-kill";

let pingIntervalMs = 100;

const args = process.argv.slice(2);
if (args.length == 0) {
  console.log('Usage: first-response-time "<COMMAND>" <URL>');
  console.log("   (optional) --ping <INTERVAL_MS> (default: 100 milliseconds)");
  process.exit(-1);
}

const command = args.shift();
const requestUrl = args.shift();

const ping = args.shift();
if (ping === "--ping") {
  const interval = args.shift();
  if (interval) {
    const parsedInterval = parseInt(interval, 10);
    if (!isNaN(parsedInterval) && parsedInterval > 0) {
      pingIntervalMs = parsedInterval;
    }
  }
}

const startTime = new Date().getTime();
let firstResponseTime;

const proc = exec(command, { timeout: 60000 }, (error) => {
  if (error && !firstResponseTime) {
    console.error("Error: " + error.message);
    pidKill(proc.pid).finally(() => process.exit(-1));
  }
});

(async () => {
  let error = false;
  while (true) {
    try {
      await sleep(pingIntervalMs);
      const { res } = await get(requestUrl);
      if (res.statusCode != 200) {
        console.log("Received status code: " + res.statusCode);
        error = true;
      }
      break;
    } catch (err) {
      if (err?.code !== "ECONNREFUSED") {
        error = true;
        console.error(err);
      }
    }
  }
  firstResponseTime = new Date().getTime() - startTime;
  console.log(`Received response in ${firstResponseTime} milliseconds`);
  await pidKill(proc.pid, false);
  process.exit(error ? -1 : 0);
})();

async function pidKill(pid, ignoreError = true) {
  return new Promise((resolve) => {
    try {
      if (pid == null) {
        resolve();
        return;
      }
      treeKill(pid, (err) => {
        if (err && !ignoreError) {
          console.error(err.message ?? err);
        }
        resolve();
      });
    } catch (err) {
      if (!ignoreError) {
        console.error(err.message ?? err);
      }
      resolve();
    }
  });
}

async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

/**
 * @param {string} url
 * @returns {Promise<{res: import("node:http").IncomingMessage}>}
 */
async function get(url) {
  return new Promise((resolve, reject) => {
    const req = (url.startsWith("http:") ? http.request : https.request)(
      url,
      {
        method: "GET",
      },
      (res) => {
        resolve({ res });
      }
    );
    req.on("error", reject);
    req.end();
  });
}
