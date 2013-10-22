# Node.js + MongoDB: RESTful API for TODO list app

This is a Node.js HTTP server providing RESTful API to manage TODO's stored in MongoDB.
It is based on Express.js framework (inspired by Sinatra on Ruby), Mongoose - a MongoDB
adapter, nconf for configuration and Winston for logging.
It is influenced by systems like Ruby's Event Machine or Python's Twisted.

## Installation

To install the application you need to make sure you have Node.js and Node Package Manager (NPM) installed.

1. Open these links and follow the installation instructions depending on your system: http://nodejs.org/, https://npmjs.org/

2. Run `git clone https://github.com/lyushenko/node-mongodb-api.git` and `cd node-mongodb-api`

3. Run `npm install` to install required node modules and it's dependencies

4. Run `node server.js` to run the http server

If the server has started without errors, you can open http://localhost:1337/ in your browser to check if it's running.

## RESTful API example calls

I use [httpie](https://github.com/jkbr/httpie) CLI for testing my API's. It provides a simple http command that allows for sending
arbitrary HTTP requests using a simple and natural syntax, and displays colorized responses. HTTPie can be used for testing, debugging,
and generally interacting with HTTP servers. But you can use [curl](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man1/curl.1.html) as well.

There are few examples of API calls:

Creation of TODO items:
```bash
$http POST http://localhost:1337/api/todos name='Foo' status=false priority=1
$http POST http://localhost:1337/api/todos name='Bar' status=false priority=2
```

Get TODO's listing:
```bash
$http GET http://localhost:1337/api/todos
```

Show single item:
```bash
$http http://localhost:1337/api/todos/52667889afc96a3034000001
```

Update TODO item:
```bash
$http PUT http://localhost:1337/api/todos/52667889afc96a3034000001 name='Foo' status=true priority=0
```

Delete TODO item:
```bash
$http DELETE http://localhost:1337/api/todos/52667889afc96a3034000001
```