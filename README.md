# Introduction
The `first-response-time.js` script can be used to collect the first response time also known as the time to first request.

The script runs a java jar package and makes requests to the `http://localhost:8080/hello` endpoint in 100 ms intervals until it receives the 200 HTTP status code with a response body.

# Installation
1. Install Node.js with npm
1. Run `npm i` from this project's directory

# Usage


```java
node first-response-time.js <JAR_PATH> <JDK_PATH>
```

The `<JDK_PATH>` is optionnal, the java included in the `PATH` env variable will be used f not present.