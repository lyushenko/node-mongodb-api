// modules
var express   = require('express');
var path      = require('path');
var log       = require('./libs/log')(module);
var config    = require('./libs/config');
var TodoModel = require('./libs/mongoose').TodoModel;


// create new Express.js app
var app = express();

// use default favicon
app.use(express.favicon());
// use debug console to dump all requests
app.use(express.logger('dev'));
// JSON parser
app.use(express.bodyParser());
// enable support of PUT and DELETE methods
app.use(express.methodOverride());
// use router
app.use(app.router);
// return static content (public/index.html)
app.use(express.static(path.join(__dirname, "public")));

// Errors handling
app.use(function(req, res, next){
    res.status(404);
    log.debug('Not found URL: %s', req.url);
    res.send({ error: 'Not found' });
    return;
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('Internal server error (%d): %s', res.statusCode, err.message);
    res.send({ error: err.message });
    return;
});

// API index route
app.get('/api', function(req, res){
  res.send('API is running');
});

// RESTful API
app.get('/api/todos', function(req, res) {
    return TodoModel.find(function (err, todos) {
        if (!err) {
            return res.send(todos);
        } else {
            res.statusCode = 500;
            log.error('Internal Server Error (%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server Error' });
        }
    });
});

app.post('/api/todos', function(req, res) {
    var todo = new TodoModel({
        name: req.body.name,
        status: false
    });

    todo.save(function (err) {
        if (!err) {
            log.info("Todo item created");
            return res.send({ status: 'OK', todo: todo });
        } else {
            console.log(err);
            res.statusCode = 500;
            res.send({ error: 'Server error' });
            log.error('Internal Server Error (%d): %s', res.statusCode, err.message);
        }
    });
});

app.get('/api/todos/:id', function(req, res) {
    return TodoModel.findById(req.params.id, function (err, todo) {
        if(!todo) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        if (!err) {
            return res.send({ status: 'OK', todo: todo });
        } else {
            res.statusCode = 500;
            log.error('Internal Server Error (%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

app.put('/api/todos/:id', function (req, res){
    return TodoModel.findById(req.params.id, function (err, todo) {
        if(!todo) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        todo.name = req.body.name;
        todo.status = req.body.status;
        todo.priority = req.body.priority;
        
        return todo.save(function (err) {
            if (!err) {
                log.info("Todo item updated");
                return res.send({ status: 'OK', todo: todo });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
                log.error('Internal Server Error (%d): %s', res.statusCode, err.message);
            }
        });
    });
});

app.delete('/api/todos/:id', function (req, res){
    return TodoModel.findById(req.params.id, function (err, todo) {
        if(!todo) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return todo.remove(function (err) {
            if (!err) {
                log.info("Todo item deleted");
                return res.send({ status: 'OK' });
            } else {
                res.statusCode = 500;
                log.error('Internal Server Error (%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error' });
            }
        });
    });
});

// Express.js server listening on port
app.listen(config.get('port'), function(){
  log.info('Express server listening on port ' + config.get('port'));
});