var mysql = require('mysql');

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

DataBaseHandler.voegCompetentieToe = function(student, vak, cijfer, credOffer,callBack, req, res){
  connection.query(`INSERT INTO competentie (idStudent, idVak, cijfer, competentieOffer) VALUES (?, ?, ?, ?);`, [student, vak, cijfer, credOffer] , function (error, results, fields) {    
    if(error){
      callBack(req, res,credOffer, null, null, null , error);
    }
    connection.query(`SELECT * FROM student where idStudent = ?`, student,function (error, resultsstudent, fields) {    
      connection.query(`SELECT * FROM vak where idvak = ?`, vak ,function (error, resultsvak, fields) {    
        connection.query(`SELECT * FROM competentie where idVak = ? AND idStudent = ?`, [vak, student],function (error, resultscomp, fields) {    
          callBack(req, res,credOffer, resultsstudent[0], resultsvak[0], resultscomp[0], error);
        });
      }); 
    }); 
  }); 
}

DataBaseHandler.haalCompetentieOp = function(competentieOfferNR, callBack, req, res){
  connection.query(`SELECT * FROM competentie where idCompetentie = ?`, [ competentieOfferNR] , function (error, compresults, fields) {    
    connection.query(`SELECT * FROM student where idStudent = ?`, compresults[0].idStudent ,function (error, resultsstudent, fields) {    
      connection.query(`SELECT * FROM vak where idvak = ?`, compresults[0].idVak ,function (error, resultsvak, fields) { 
        callBack(req, res, compresults[0], resultsstudent[0], resultsvak[0],error);
      });
    });
  }); 
}

DataBaseHandler.voegDiplomaCredToe = function(competentieOfferNR, diplomaCred){
  connection.query(`UPDATE competentie SET competentie = ? WHERE (idCompetentie = ?)`, [ competentieOfferNR, diplomaCred] , function (error, results, fields) { 
  }); 
}

DataBaseHandler.acceptConnectionRequest = function(id, did,callBack, req, res){
  connection.beginTransaction(function(err) {
    if (err) { 
      callBack(results, error, req, res); 
    }else{
    
      connection.query(`SELECT * FROM connectierequest WHERE idconnectierequest = ?`, id,function (error, results, fields) {    
        if(error){
          callBack(results, error, req, res);
        }else{
          let result = results[0];
    
          connection.query(`INSERT INTO student (didstudent, naamstudent, mijndid, studentnummer, verinym) VALUES (?, ?, ?, ?, ?)`, [result.did, result.naam, did, result.studentnummer, result.verinym],function (error, resultsins, fields) {    
            if(error){
              callBack(resultsins, error, req, res);
            }else{
              connection.query(`DELETE FROM connectierequest WHERE idconnectierequest = ?`, id,function (error, results, fields){
                if(error){
                  callBack(results, error, req, res);
                }else{
                  connection.commit(function(err) {
                    if (err) {
                      return connection.rollback(function() {
                        callBack(0, err, req, res);
                      });
                    }else{
                      connection.query(`SELECT * FROM student where idStudent = ?`, resultsins.insertId,function (error, results, fields) {    
                        callBack(results, error, req, res);
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
  });  
}
