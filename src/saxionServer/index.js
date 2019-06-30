const express = require('express');
const bodyParser = require('body-parser');
const databaseHandler = require('./src/database/databaseHandler');
const ledgerHandler = require('./src/ledger/ledgerHandler');

const app = express();
const PORT = 3000;

// Imports for documentation
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

// Defining base information for this route
const swaggerDefinition = {
    info: {
        title: 'SaxionServer API Documentation',
        version: '1.0.0',
        description: 'API Description for the back-end of the SaxionServer'
    },
    host: 'localhost:' + PORT,
    basePath: '/'
}

// Setting up options
const options = {
    swaggerDefinition,
    apis: ['./routes/api/*.js'],
}

const swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
})

// Base route for API documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));


//global variabelen
let server;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(require('./routes'));
app.use(express.static('public'));

run();

async function run(){
    await ledgerHandler.init(PORT);
    // databaseHandler.init();
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