const express = require("express"),
  dishRouter = express.Router(),
  Dishes = require("../models/dishes"),
  bodyParser = require("body-parser");
dishRouter.use(bodyParser.json());

/* GET dishes listing. */
dishRouter
  .route("/")
  .all((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
  })

  .get((req, res, next) => {
    Dishes.find({})
      .then(
        (dishes) => {
          res.json(dishes);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post((req, res, next) => {
    Dishes.create(req.body)
      .then(
        (dish) => {
          res.status(200).json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put((req, res, next) => {
    res.send("put is not supported");
  })

  .delete((req, res, next) => {
    // res.send("");
    Dishes.remove({})
      .then(
        (dishes) => {
          res.status(200).json(dishes);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

dishRouter
  .route("/:dishId")
  .all((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
  })

  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post((req, res, next) => {
    res.status(200).send("Post is not supported");
  })

  .put((req, res, next) => {
    Dishes.findByIdAndUpdate(
      req.params.dishId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (dish) => {
          res.status(200).json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .delete((req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
      .then(
        (dishes) => {
          res.status(200).json(dishes);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

dishRouter
  .route("/:dishId/comments")
  .all((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
  })

  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish) {
            console.log("dish", dish);
            res.status(200).send(dish.comments);
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
    // res.status(200).send("Post is not supported");
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish) {
            console.log("req.body", req.body);
            console.log(dish, "dish");
            dish.comments.push(req.body);
            dish.save().then((dish) => res.status(200).json(dish));
          } else {
            var err = new Error("Dish " + req.params.dishId + " not found");
            err.statusCode(404);
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put((req, res, next) => {
    res.send("put is not supported");
  })

  .delete((req, res, next) => {
    // res.send("");
    Dishes.findByIdAndRemove(req.params.dishId)
      .then(
        (dish) => {
          // res.status(200).json(dishes);
          if (dish) {
            for (var i = dish.comments.length - 1; i >= 0; i--) {
              dish.comments.id(dish.comment[i]._id).remove();
            }
            dish.save().then((dishes) => {
              res.statusCode = 200;
              res.json(dishes);
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
  });

dishRouter
  .route("/:dishId/comments/:commentsId")
  .all((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
  })

  .get((req, res, next) => {
    Dishes.findById(req.params.dishId).then(
      (dish) => {
        if (dish && dish.comments.id(req.params.commentsId))
          res.status(200).json(dish.comments.id(req.params.commentsId));
        else if (!dish) {
          const err = new Error("Dish " + req.params.dishId + " not found");
          err.statusCode = 404;
          return next(err);
        } else {
          const err = new Error(
            "Comment " + req.params.commentsId + " not found"
          );
          err.statusCode = 404;
          return next(err);
        }
      },
      (err) => next(err)
    );
  })
  .post((req, res, next) => {
    res.status(200).send("Post is not supported");
  })
  .put((req, res, next) => {
    Dishes.findById(req.params.dishId).then(
      (dish) => {
        if (dish && dish.comments.id(req.params.commentsId)) {
          if (req.body.rating) {
            dish.comments.id(req.params.commentsId).rating = req.body.rating;
          }
          if (req.body.comment) {
            dish.comments.id(req.params.commentsId).comment = req.body.comment;
          }
          dish.save().then((dishes) => {
            res.status(200).json(dishes);
          });
        } else if (!dish) {
          const err = new Error("Dish " + req.params.dishId + " not found");
          err.statusCode = 404;
          return next(err);
        } else {
          const err = new Error(
            "Comment " + req.params.commentsId + " not found"
          );
          err.statusCode = 404;
          return next(err);
        }
      },
      (err) => next(err)
    );
  })
  .delete((req, res, next) => {
    // res.send("");
    Dishes.findById(req.params.dishId).then(
      (dish) => {
        if (dish && dish.comments.id(req.params.commentsId)) {
          dish.comments.id(req.params.commentsId).remove();
          dish.save().then((dishes) => {
            res.status(200).json(dishes);
          });
        } else if (dish == null) {
          let err = new Error("Dish " + req.params.dishId + " not found");
          err.statusCode = 404;
          return next(err);
        } else {
          let err = new Error(
            "Comment " + req.params.commentsId + " not found"
          );
          err.statusCode = 404;
          return next(err);
        }
      },
      (err) => next(err)
    );
  });

module.exports = dishRouter;
