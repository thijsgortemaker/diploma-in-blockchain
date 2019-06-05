const express = require('express');
const bodyParser = require('body-parser');

const PORT = 3000;
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('public'));

var users = require('./routes/api/users');
var indexRouter = require('./routes/index');

app.use('/',indexRouter);
app.use('/users',users);

app.listen(PORT, function () {
    console.log('Listening on port: ' + PORT);
});