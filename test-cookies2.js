const { cookies } = require('next/headers');
const c = cookies();
console.log("Is promise:", c instanceof Promise);
