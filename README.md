# server-utils
A collection of utility scripts I wrote to help manage my home servers.

To begin running the utilities, run
```
docker-compose up
```

## IP Address Tracking
My home has a dynamic IP address, which causes issues when it changes. This script periodically checks the server's external IP, uploads it to a database, then sends me an email if it detects it has changed.
