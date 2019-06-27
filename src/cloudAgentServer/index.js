const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const ledgerHandler = require('./src/ledgerHandler');
const userMap = require('./src/userMap');

const PORT = 3001;
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(require('./routes'));
app.use(express.static('public'));

run();

async function run(){
    await ledgerHandler.init(PORT);
    userMap.init();

    app.listen(PORT, function () {
        console.log('Listening on port: ' + PORT);
    });
}

async function cleanup(){
    //await ledgerHandler.close();
    console.log("cleanup");
    userMap.close();
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




