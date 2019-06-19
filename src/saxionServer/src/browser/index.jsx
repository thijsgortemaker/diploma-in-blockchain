/** @jsx glasgow */

// Glasgow documentation: https://github.com/vanviegen/glasgow
import glasgow from 'glasgow';

//main programma 
let mount = glasgow.mount(document.body, logIn);
let token;

function doLoginRequest(event, props){
  HTTPrequest('POST', '/api/user/auth', {username: props.$username, password: props.$password}, function(body){
    if(body.err){
      let errorElement = document.getElementById("inlogSchermError");
      errorElement.hidden = false;
      errorElement.firstChild.innerHTML = body.err;
    }else{
      token = body.token;
      gotoPage(null, {$pageNumber: 1});
    }
  });
}

function doeVakAanmaakRequest(event, props){
  HTTPrequest('POST', '/api/vak', {naam: props.$naamvak, omschrijving: props.$omschrijving, ecs: props.$ecs}, function(body){
    if(body.err){
      let errorElement = document.getElementById("vakAanmaakError");
      errorElement.hidden = false;
      errorElement.firstChild.innerHTML = body.err;
    }else{
      gotoPage(null, {$pageNumber: 2});
      showSnackBarMessage("cool brah");
    }
  });
}


function gotoPage(event, props){
  let page;

  if(props.$pageNumber){
    page = props.$pageNumber;
  }else{
    page = event.toElement.value;
  }

  mount.unmount();

  if(page == 0){
    logOut();
  }else if(page == 1){
    mount = glasgow.mount(document.body, connectieRequestenScherm);
  }else if(page == 2){
    mount = glasgow.mount(document.body, vakAanmakenScherm);
  }else if(page == 3){
    mount = glasgow.mount(document.body, geefCompetentieUitScherm);
  }
}

function logOut(){
  token = undefined;
  mount = glasgow.mount(document.body, logIn);
}

function navigationBar(){
  return <div>
    <button name="name" value="1" type="submit" onclick={gotoPage}>Connectie requesten</button>
    <button name="name" value="2" type="submit" onclick={gotoPage}>Vak aanmaken</button>
    <button name="name" value="3" type="submit" onclick={gotoPage}>Geef competentie uit</button>
    <button name="name" value="0" type="submit" onclick={gotoPage}>Log uit</button>
  </div>
}

function connectieRequestenScherm(){
  return <main>
    <h1 >Saxion</h1>
    {navigationBar()}
  </main>
}

function vakAanmakenScherm(){
  return <main>
    <h1>Saxion</h1>
    {navigationBar()}<br/>
    <div id ="vakAanmaakError" hidden><span>Vervang dit met een error</span><br/></div>
    <span>Naam vak </span><input type="text" binding="$naamvak"/><br/>
    <span>Omschrijving vak </span><input type="text" binding="$omschrijving"/><br/>
    <span>ecs </span><input type="text" binding="$ecs"/><br/>
    <input type="submit" value="Maak vak aan" onclick = {doeVakAanmaakRequest}/>
    <div id="snackbar">Some text some message..</div>
  </main>
}

function geefCompetentieUitScherm(){
  return <main>
    <h1>Saxion</h1>
    {navigationBar()}
  </main>
}

function logIn() {      
  return <main>
    <h1>Saxion</h1>
    <div id ="inlogSchermError" hidden><span>Vervang dit met een error</span><br/></div>
    <span>Gebruikersnaam: </span><input type="text" binding="$username"/><br/>
    <span>Wachtwoord: </span><input type="password" binding="$password"/><br/>
    <input type="submit" value="Log in" onclick = {doLoginRequest}/>
  </main>
}


//standaard methode om requesten te doen naar de server.
function HTTPrequest(method, url, body, cb){
  const xhr = new XMLHttpRequest();
  
  xhr.onreadystatechange = function(){
    if(xhr.readyState === XMLHttpRequest.DONE){
      if(xhr.status < 500){
        //wanneer succesvol roep de callback aan
        cb(JSON.parse(xhr.responseText));
      }else if(xhr.status >= 500){
        console.log(body);
      }
    }
  };
  
  xhr.open(method, url, true);
  
  if(token){
    xhr.setRequestHeader("Authorization", token);
  }
  
  if(body != null){
    xhr.setRequestHeader("Content-Type", "application/json");
  }
  
  xhr.send(JSON.stringify(body));
}

function showSnackBarMessage(message) {
  var x = document.getElementById("snackbar");
  x.innerHTML = message;
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
