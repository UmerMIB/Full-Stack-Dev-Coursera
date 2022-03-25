// // 'use strict';

// console.log(hoist); // Output: ReferenceError: hoist is not defined
// hoist = 'Hoisted';


function getCircumference(radius) {
    console.log(circumference)
    circumference = PI * radius * 2;
    const PI = 22 / 7;
}

getCircumference(2)