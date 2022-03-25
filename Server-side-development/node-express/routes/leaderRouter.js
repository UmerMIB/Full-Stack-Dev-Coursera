const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route("/")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.send('Will send all details of  to you!');
    })
    .post((req, res, next) => {
        res.end('Will add the leaders: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .put((req, res, next) => {
        res.end('PUT operation not supported');
    })
    .delete((req, res, next) => {
        res.end('Deleting all leaders');
    });

leaderRouter.route("/:leaderId")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.send('Will send all details of ' + req.params.leaderId + ' to you!');
    })
    .post((req, res, next) => {
        res.end('This method is not supported');
    })
    .put((req, res, next) => {
        res.write(` Updating  ${req.params.leaderId}  \n`);
        res.end('\n updated ' + req.params.leaderId + '  with name  ' + req.body.name + ' and description  ' + req.body.description);
    })
    .delete((req, res, next) => {
        res.end('Deleting all leaderId');
    });



module.exports = leaderRouter;