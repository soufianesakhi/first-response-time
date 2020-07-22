# Introduction
The `first-response-time.js` script can be used to collect the first response time also known as the time to first request.

The script runs an executable or a java jar package and makes requests to a specific URL in 100 ms intervals until it receives the 200 HTTP status code with a response body.

# Installation
1. Install Node.js with npm
1. Run `npm i -g first-response-time`

# Usage

```java
first-response-time <EXECUTABLE_PATH> <URL> <JDK_PATH>
```

`<EXECUTABLE_PATH>` executable or Jar file.

`<URL>` request url.

`<JDK_PATH>` must be specified if and only if the executable is a Jar.