var mongoose    = require('mongoose');
var log         = require('./log')(module);
var config      = require('./config');

mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('DB Connection Error: ', err.message);
});

db.once('open', function callback() {
    log.info("Connected to MongoDB");
});

var Schema = mongoose.Schema;

var Todo = new Schema({
    name: { type: String, required: true },
    status: { type: Boolean, required: true },
    priority: { type: Number, default: 0 }
});

var TodoModel = mongoose.model('Todo', Todo);

module.exports.TodoModel = TodoModel;