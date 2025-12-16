#!/usr/bin/env node

import { exec } from "node:child_process";

import request from "request-compose";
import kill from "tree-kill";

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

const proc = exec(command, { timeout: 60000 }, (error) => {
  if (error) {
    console.error("Error: " + error.message);
    kill(proc.pid);
    process.exit(-1);
  }
});

const startTime = new Date().getTime();
const intervalHandle = setInterval(async () => {
  let error = false;
  let responseReceived = false;
  try {
    const { res } = await request.client({
      url: requestUrl,
    });
    responseReceived = true;
    if (res.statusCode != 200) {
      console.log("Received status code: " + res.statusCode);
      error = true;
    }
  } catch (err) {
    if (err?.code !== "ECONNREFUSED") {
      error = true;
      responseReceived = true;
      console.error("Error: " + err.message);
    }
  } finally {
    if (!responseReceived) {
      return;
    }
    const time = new Date().getTime() - startTime;
    console.log(`Received response in ${time} milliseconds`);
    clearInterval(intervalHandle);
    kill(proc.pid);
    process.exit(error ? -1 : 0);
  }
}, pingIntervalMs);
