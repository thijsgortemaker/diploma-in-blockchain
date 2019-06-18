const express = require('express');
const bodyParser = require('body-parser');

const PORT = 3000;
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(require('./routes'));
app.use(express.static('public'));

app.listen(PORT, function () {
    console.log('Listening on port: ' + PORT);
});