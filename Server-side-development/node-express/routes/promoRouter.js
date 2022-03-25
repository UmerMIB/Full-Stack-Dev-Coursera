const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route("/")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.send('Will send all details of  to you!');
    })
    .post((req, res, next) => {
        res.end('Will add the promo: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .put((req, res, next) => {
        res.end('PUT operation not supported');
    })
    .delete((req, res, next) => {
        res.end('Deleting all promos');
    });

promoRouter.route("/:promoId")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.send('Will send all details of ' + req.params.promoId + ' to you!');
    })
    .post((req, res, next) => {
        res.end('This method is not supported');
    })
    .put((req, res, next) => {
        res.write(` Updating  ${req.params.promoId}  \n`);
        res.end('\n updated ' + req.params.promoId + '  with name  ' + req.body.name + ' and description  ' + req.body.description);
    })
    .delete((req, res, next) => {
        res.end('Deleting all promos');
    });



module.exports = promoRouter;