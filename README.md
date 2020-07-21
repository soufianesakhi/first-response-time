# Introduction
The `first-response-time.js` script can be used to collect the first response time also known as the time to first request.

The script runs an executable or a java jar package and makes requests to a specific URL in 100 ms intervals until it receives the 200 HTTP status code with a response body.

# Installation
1. Install Node.js with npm
1. Run `npm i` from this project's directory

# Usage


```java
node first-response-time.js <EXECUTABLE_PATH> <URL> <JDK_PATH>
```

`<EXECUTABLE_PATH>` executable or Jar file.

`<URL>` request url.

`<JDK_PATH>` mandatory in the case of a Jar executable.