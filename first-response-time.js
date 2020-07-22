#!/usr/bin/env node

const spawn = require("child_process").spawn;
const request = require("request");
const path = require("path");

const pingIntervalMs = 100;

const args = process.argv.slice(2);
if (args.length == 0) {
  console.log('Usage: first-response-time <EXECUTABLE_PATH> <URL> [<JDK_PATH>]');
  process.exit(-1);
}

const execPath = args.shift();
const requestUrl = args.shift();
const jdkPath = args.shift();
const javaPath = jdkPath ? path.join(jdkPath, "bin/java") : null;

const proc = javaPath ? spawn(javaPath, ["-jar", execPath]) : spawn(execPath);

const startTime = new Date().getTime();
const intervalHandle = setInterval(() => {
  request(requestUrl, (error, response, body) => {
    if (!error && response && response.statusCode === 200 && body) {
      const time = new Date().getTime() - startTime;
      console.log(time + " ms");
      clearInterval(intervalHandle);
      proc.kill();
      process.exit(0);
    } else {
      if (!error || error.code !== "ECONNREFUSED") {
        console.log(error ? console.log(JSON.stringify(error)) : "Received HTTP status code: " + response.statusCode);
        proc.kill();
        process.exit(-1);
      }
    }
  }
  );
}, pingIntervalMs);
