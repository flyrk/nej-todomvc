import express from'express';
import path from'path';
import pkg from './package';
import favicon from'serve-favicon';
import logger from'morgan';
import cookieParser from'cookie-parser';
import bodyParser from'body-parser';
import mongoose from'mongoose';

import all from'./routes/all';
import active from'./routes/active';
import completed from'./routes/completed';

const app = express();
const dbUrl = 'mongodb://localhost:27017/nej-todo';

mongoose.connect(dbUrl);
mongoose.connection.on('error', function () {
  console.info('Error: Could not connect to MongoDB, Did you forget to run `Mongod`?');
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/all', all);
app.use('/api/active', active);
app.use('/api/completed', completed);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ 'error': 'error' });
});

app.listen(8080, () => {
  console.log(`${pkg.name} listening on port 8080`);
});
