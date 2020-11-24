module.exports = (x, y, callback) => {
  if (x <= 0 || y <= 0) {
    setTimeout(() => {
      callback(
        new Error(` The values of length and breath should be greater than 0 `),
        null
      ),
        2000;
    });
  } else {
    setTimeout(() => {
      callback(null, {
        perimeter: () => 2 * (x * y),
        area: () => x * y
      }),
        2000;
    });
  }
};

// export default (x, y, callback) => {         //ES6 module
//     if (x <= 0 || y <= 0) {
//         setTimeout(() => {
//             callback(new Error(` The values of length and breath should be greater than 0 `),
//                     null),
//                 2000
//         });
//     } else {
//         setTimeout(() => {
//             callback(null, {
//                     perimeter: () => (2 * (x * y)),
//                     area: () => (x * y),
//                 }),
//                 2000
//         });
//     }
// }
