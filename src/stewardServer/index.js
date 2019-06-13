const express = require('express');
const bodyParser = require('body-parser');
const ledgerHandler = require('./src/ledgerHandler');

const PORT = 3000;
const app = express();

run();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(require('./routes'));

let server = app.listen(PORT, function () {
    console.log('Listening on port: ' + PORT);
});

async function run(){
    await ledgerHandler.init(PORT);
}

async function cleanup(){
    await ledgerHandler.close();
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

//catches uncaught exceptions
process.on('uncaughtException', function() {
    cleanup();
});