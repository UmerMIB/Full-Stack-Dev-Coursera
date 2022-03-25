const express = require('express'),
    http = require('http'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    hostname = 'localhost',
    app = express(),
    port = 3000;


const dishRouter = require('./routes/dishRouter'),
    promoRouter = require('./routes/promoRouter'),
    leaderRouter = require('./routes/leaderRouter');


app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

app.use((req, res, next) => {
    console.log(req.headers);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>');

});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});