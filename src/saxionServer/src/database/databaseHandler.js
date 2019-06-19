var mysql      = require('mysql');

let connection;

var DataBaseHandler = module.exports;

DataBaseHandler.init = function(){
  connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'SaxionDB'
  });
 
  connection.connect();

  connection = connection;
}

DataBaseHandler.close = function(){
  connection.end();
}

DataBaseHandler.getUser = function(userName, callBack, req, res){
  
  connection.query('SELECT * FROM user WHERE username LIKE ?', userName , function (error, results, fields) {
    if (error) throw error; 
    if(results.length > 1 ) throw new Error({});
    
    callBack(results, fields, req , res);
  }); 
}

DataBaseHandler.voegVakToe = function(naam, omschrijving, ecs, callBack, req, res){
  connection.query(`INSERT INTO vak (vaknaam, vakomschrijving, ecs) VALUES (?, ?, ?)`, [naam, omschrijving, ecs] , function (error, results, fields) {    
    console.log(error);
    callBack(req, res, error);
  }); 
}