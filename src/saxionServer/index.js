const express = require('express');
const bodyParser = require('body-parser');
const databaseHandler = require('./src/database/databaseHandler');

const PORT = 3000;
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(require('./routes'));
app.use(express.static('public'));

//database
databaseHandler.init();

let server = app.listen(PORT, function () {
    console.log('Listening on port: ' + PORT);
});

//afsluiten van de server
async function cleanup(){
    databaseHandler.close();
    console.log("cleanup");
    server.close();
    process.exit();
}

//do something when app is closing
process.on('exit', function() {
    cleanup();
});

//catches ctrl+c event
process.on('SIGINT', function() {
    cleanup();
});

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', function() {
    cleanup();
});

process.on('SIGUSR2', function() {
    cleanup();
});