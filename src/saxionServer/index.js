const express = require('express');
const bodyParser = require('body-parser');
const databaseHandler = require('./src/database/databaseHandler');
const ledgerHandler = require('./src/ledger/ledgerHandler');

const PORT = 3000;
const app = express();

//global variabelen
let server;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(require('./routes'));
app.use(express.static('public'));

run();

async function run(){
    await ledgerHandler.init(PORT);
    databaseHandler.init();
    server = app.listen(PORT, function () {
        console.log('Listening on port: ' + PORT);
    });
}


//afsluiten van de server
async function cleanup(){
    databaseHandler.close();
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