const express = require("express"),
  bodyParser = require("body-parser"),
  dishRouter = express.Router(),
  Dishes = require("../models/dishes");

dishRouter.use(bodyParser.json());

dishRouter
  .route("/")
  // .all((req, res, next) => {
  //     res.statusCode = 200;
  //     res.setHeader('Content-Type', 'text/plain');
  //     next();
  // })
  .get((req, res, next) => {
    // res.end('Will send all the dishes to you!');
    Dishes.find({}).then(
      (dish) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
      },
      (err) => next(err)
    );
  })
  .post((req, res, next) => {
    // res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
    Dishes.create(req.body).then(
      (dish) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
      },
      (err) => next(err)
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes");
  })
  .delete((req, res, next) => {
    // res.end('Deleting all dishes');
    Dishes.remove({}).then(
      (dish) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
      },
      (err) => next(err)
    );
  });

dishRouter
  .route("/:dishId")
  .get((req, res, next) => {
    // res.send('Will send all details of ' + req.params.dishId + ' to you!');
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("This method is not supported");
  })
  .put((req, res, next) => {
    // res.write(` Updating ${req.params.dishId} \n`);
    // res.end('\n updated ' + req.params.dishId + ' with name ' + req.body.name + ' and description ' + req.body.description);
    Dishes.findByIdAndUpdate(
      req.params.dishId,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    ).then(
      (dish) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
      },
      (err) => next(err)
    );
  })
  .delete((req, res, next) => {
    // res.end('Deleting all dishes');
    Dishes.findByIdAndRemove(req.params.body).then(
      (dish) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
      },
      (err) => next(err)
    );
  });

dishRouter
  .route("/:dishId/comments")

  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comment);
          } else {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.statusCode = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null) {
            dish.comment.push(req.body);
            dish.save().then(() => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(dish);
            });
          } else {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.statusCode = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.send(`Put operation is not supported on /dishes/ `);
    res.statusCode = 404;
  })
  .delete((req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId).then(
      (dish) => {
        if (dish !== null) {
          for (var i = dish.comment.length - 1; i >= 0; i--) {
            dish.comment.id(dish.comment[i]._id).remove();
          }
          dish.save().then((dishes) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dishes);
          });
        } else {
          err = new Error("Dish " + req.params.dishId + " not found");
          err.statusCode = 404;
          return next(err);
        }
      },
      (err) => next(err)
    );
  });

dishRouter
  .route("/:dishId/comments/:commentsId")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish && dish.comment.id(req.params.commentsId)) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comment.id(req.params.commentsId));
          } else if (dish == null) {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.statusCode = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentsId + " not found");
            err.statusCode = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.send("This method is not supported");
  })
  .put((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null && dish.comment.id(req.params.commentsId) != null) {
            if (req.body.rating) {
              dish.comment.id(req.params.commentsId).rating = req.body.rating;
            }
            if (req.body.comment) {
              dish.comment.id(req.params.commentsId).comment = req.body.comment;
            }
            dish.save().then((dishes) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(dishes);
            });
          } else if (dish == null) {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.statusCode = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentsId + " not found");
            err.statusCode = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .delete((req, res, next) => {
    Dishes.findById(req.params.dishId).then(
      (dish) => {
        if (dish != null && dish.comment.id(req.params.commentsId) != null) {
          dish.comment.id(req.params.commentsId).remove();
          dish.save().then((dishes) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish);
          });
        } else if (dish == null) {
          err = new Error("Dish " + req.params.dishId + " not found");
          err.statusCode = 404;
          return next(err);
        } else {
          err = new Error("Comment " + req.params.commentsId + " not found");
          err.statusCode = 404;
          return next(err);
        }
      },
      (err) => next(err)
    );
  });

module.exports = dishRouter;
