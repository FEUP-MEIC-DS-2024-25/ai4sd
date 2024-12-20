var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');  // Import CORS middleware


var requestsRouter = require('./routes/requests');  // Separate route for fetching requests
var queryRouter = require('./routes/query');  // Route for user queries

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// Enable CORS to allow requests from the frontend (VSCode extension or other origins)
app.use(cors());

// Middleware to log requests
app.use(logger('dev'));
// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define API paths
app.use('/requests', requestsRouter);  // Add the route to get recent requests
app.use('/query', queryRouter);  // Add your query route for user interaction

// Catch 404 errors and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// General error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Send the error as a JSON response
  res.status(err.status || 500).json({
    message: res.locals.message,
    error: res.locals.error
  });

  console.error(err);  // Log the error in the console
});

module.exports = app;
