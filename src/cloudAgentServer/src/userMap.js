const fs = require('fs');

var UserMap = module.exports = {
    map : undefined
}

UserMap.init = function(){
    try{
        let rawdata = fs.readFileSync('map.json');  
        UserMap.map = new Map(JSON.parse(rawdata)); 
    }catch(e){
        UserMap.map = new Map();
    }
}

UserMap.close = function(){
    let data = JSON.stringify(Array.from(UserMap.map));  
    try{
        fs.writeFileSync('map.json', data); 
    }catch(e){
        console.log(e);
    }
}