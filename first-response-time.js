#!/usr/bin/env node

const exec = require("child_process").exec;
const request = require("request");

const pingIntervalMs = 100;

const args = process.argv.slice(2);
if (args.length == 0) {
  console.log('Usage: first-response-time "<COMMAND>" <URL>');
  process.exit(-1);
}

const command = args.shift();
const requestUrl = args.shift();

const proc = exec(command, { timeout: 60000 }, (error) => {
  if (error) {
    console.error(error);
    proc.kill();
    process.exit(-1);
  }
});

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
