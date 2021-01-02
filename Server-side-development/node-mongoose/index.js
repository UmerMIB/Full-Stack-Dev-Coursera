const mongoose = require("mongoose"),
  dishes = require("./models/dishes"),
  url = "mongodb://localhost:27017/conFusion";
// mongoose.connect(url)
//     .then((db) => {
//         console.log(` Server correctly connected `);
//         var newDish = dishes({
//             name: 'umer1 ',
//             description: 'umer testing here1'
//         });
//         newDish.save()
//             .then((dish) => {
//                 console.log('dishes are', dish);
//                 return dishes.find({})
//             })
//             .then((dish) => {
//                 console.log('all dishes are', dish);
//                 return dishes.remove()
//             })
//             .then(() => {
//                 mongoose.connection.close()
//             })
//             .catch((err) => {
//                 console.log(' Error occured', err)
//             })
//     })
//     .catch((err) => {
//         console.log('server cannot  connect to the server err is ', err)
//     })

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => {
    console.log(` Server correctly connected `);
    dishes
      .create({
        name: "umer4 ",
        description: "umer testing here4",
        // comment: {
        //     rating: 3,
        //     comment: "good",
        //     author: 'umer here',
        // }
      })
      .then((dish) => {
        console.log("dishes are", dish);
        return dishes
          .findByIdAndUpdate(
            dish.id,
            {
              $set: { description: "updated2 test" },
            },
            {
              new: true,
            }
          )
          .exec();
      })
      .then((dish) => {
        console.log("all dishes are", dish);
        dish.comment.push({
          rating: 3,
          comment: "good",
          author: "umer here",
        });
        return dish.save();
      })
      .then((dish) => {
        console.log("comments added", dish);
        return dishes.remove();
      })
      .then(() => {
        mongoose.connection.close();
      })
      .catch((err) => {
        console.log(" Error occured", err);
      });
  })
  .catch((err) => {
    console.log("server cannot  connect to the server err is ", err);
  });
