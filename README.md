#Secure Reverse Proxy
* Designed a reverse proxy server and implemented methods to ensure packet integrity and authenticity between the user and the application servers.
* Improved the throughput and latency with both heavy and light loads when compared to a server with no reverse proxy.
* Tech Stack - Node.js


To run the node.js file, use the command

> node _filename_

Files:

* newproxy.js - Session Management System with Reverse Proxy

* noproxy.js - Session Management System without Reverse Proxy

* heavyproxy.js - Application to handle heavy requests with Reverse Proxy

* heavynoproxy.js - Application to handle heavy requests without Reverse Proxy

* icd.js - Code to calculate ICD for a given string


###To run benchmark tests using ApacheBench

> ab -r -n 10000 -c 1 100 -H "RPCookie=1255259ddc993279dc81c573242174344abd54a1b14bc2" http://127.0.0.1:5050/

> ab -r -n 100000 -c 1000 -H "ServerCookie=9cd5f6c941b1" http://127.0.0.1:4000/
