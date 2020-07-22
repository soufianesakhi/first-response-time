# Introduction
The `first-response-time.js` script can be used to collect the first response time also known as the time to first request.

The script executes a command and makes requests to a specific URL in 100 ms intervals until it receives the 200 HTTP status code with a response body.

The script finally prints out the duration between the command execution and the time it received the 200 status.

# Installation
1. Install Node.js with npm
1. Run `npm i -g first-response-time`

# Usage

```java
first-response-time "<COMMAND>" <URL>
```

`<COMMAND>` a correctly escaped system command.
`<URL>` request url.
