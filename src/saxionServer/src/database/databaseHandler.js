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

    callBack(req, res, error);
  }); 
}

DataBaseHandler.voegConnectieRequestToe = function(naam, studentnummer, did, verinym,callBack, req, res){
  connection.query(`INSERT INTO connectierequest (naam, studentnummer, did, verinym) VALUES (?, ?, ?, ?)`, [naam, studentnummer, did, verinym] , function (error, results, fields) {    

    callBack(req, res, error);
  }); 
}

DataBaseHandler.getConnectieRequest = function(callBack, req, res){
  connection.query(`SELECT * FROM connectierequest`, function (error, results, fields) {    
    callBack(results, error, req, res);
  }); 
}

DataBaseHandler.getVakken = function(callBack, req, res){
  connection.query(`SELECT * FROM vak`, function (error, results, fields) {    
    callBack(results, error, req, res);
  }); 
}

DataBaseHandler.getStudenten = function(callBack, req, res){
  connection.query(`SELECT * FROM student`, function (error, results, fields) {    
    callBack(results, error, req, res);
  }); 
}

DataBaseHandler.voegCompetentieToe = function(student, vak, cijfer, callBack, req, res){
  connection.query(`INSERT INTO competentie (idStudent, idVak, cijfer) VALUES (?, ?, ?)`, [student, vak, cijfer] , function (error, results, fields) {    

    callBack(req, res, error);
  }); 
}

DataBaseHandler.acceptConnectionRequest = function(id, callBack, req, res){
  connection.beginTransaction(function(err) {
    if (err) { 
      callBack(results, error, req, res); 
    }else{
    
      connection.query(`SELECT * FROM connectierequest WHERE idconnectierequest = ?`, id,function (error, results, fields) {    
        if(error){
          callBack(results, error, req, res);
        }else{
          let result = results[0];
    
          connection.query(`INSERT INTO student (didstudent, naamstudent, mijndid, studentnummer, verinym) VALUES (?, ?, ?, ?, ?)`, [result.did, result.naam, "1234", result.studentnummer, result.verinym],function (error, results, fields) {    
            if(error){
              callBack(results, error, req, res);
            }else{
              connection.query(`DELETE FROM connectierequest WHERE idconnectierequest = ?`, id,function (error, results, fields){
                if(error){
                  callBack(results, error, req, res);
                }else{
                  connection.commit(function(err) {
                    if (err) {
                      return connection.rollback(function() {
                        callBack(1, err, req, res);
                      });
                    }else{
                      callBack(1, err, req, res);
                    }
                  });
                }
              });
            } 
          });
        }    
      });
      
    }
  });  
}
