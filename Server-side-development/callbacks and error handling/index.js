var rect = require("./rectangle");

function solveRect(l, b) {
  console.log(` solving rectangle for length ${l} and breath ${b} `);
  rect(l, b, (err, rectangle) => {
    if (err) {
      console.log(`Error`, err.message);
    } else {
      console.log(
        ` Area is ${rectangle.area()} and rectangle is ${rectangle.perimeter()} `
      );
    }
  });
  console.log(`this statement is after the callback`);
}

solveRect(2, 1);
solveRect(2, 2);
solveRect(2, 3);
