const createError = require('http-errors'),
    express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    mongoose = require('mongoose'),

    indexRouter = require('./routes/index'),
    usersRouter = require('./routes/users'),
    dishRouter = require('./routes/dishRouter'),
    promoRouter = require('./routes/promoRouter'),
    leaderRouter = require('./routes/leaderRouter'),
    url = 'mongodb://localhost:27017/conFusion',
    Dishes = require('./models/dishes');
app = express();


mongoose.connect(url, { useNewUrlParser: true })
    .then((db) => {
        console.log(`Server correctly connected `);
    }, (err) => {
        console.log('Error occured while connecting ', err)
    })
    // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;