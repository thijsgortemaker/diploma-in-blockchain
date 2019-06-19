const bcrypt = require('bcrypt');
const saltRounds = 10;

var hash = bcrypt.hashSync("username2", saltRounds);
console.log(hash);

console.log(bcrypt.compareSync("username2", hash));