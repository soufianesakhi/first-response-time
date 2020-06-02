const spawn = require("child_process").spawn;
const request = require("request");
const path = require("path");

const pingIntervalMs = 100;

const args = process.argv.slice(2);
if (args.length == 0) {
  console.log('The path of the java executable jar must be specified !');
}

const jarPath = args.shift();
const jdkPath = args.shift();
const javaPath = jdkPath ? path.join(jdkPath, "bin/java") : "java";

const proc = spawn(javaPath, ["-jar", jarPath]);

const startTime = new Date().getTime();
const intervalHandle = setInterval(() => {
  request("http://localhost:8080/hello", (error, response, body) => {
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
