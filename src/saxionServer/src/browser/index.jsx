/** @jsx glasgow */

// Glasgow documentation: https://github.com/vanviegen/glasgow
import glasgow from 'glasgow';

//main programma 
glasgow.setDebug(1);
let mount = glasgow.mount(document.body, logIn);

function doLoginRequest(event, props){
  HTTPrequest('POST', '/api/user/auth', {username: props.$username, password: props.$password}, function(body){
    if(body.err){
      console.log(body.err)
    }else{
      gotoPage(null, {$pageNumber: 1});
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
    mountScreen = glasgow.mount(document.body, logIn);
  }else if(page == 1){
    mountScreen = glasgow.mount(document.body, connectieRequestenScherm);
  }else if(page == 2){
    mountScreen = glasgow.mount(document.body, vakAanmakenScherm);
  }else if(page == 3){
    mountScreen = glasgow.mount(document.body, geefCompetentieUitScherm);
  }
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
    <h1>Saxion</h1>
    {navigationBar()}
  </main>
}

function vakAanmakenScherm(){
  return <main>
    <h1>Saxion</h1>
    {navigationBar()}
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
      if(xhr.status === 200){
        //wanneer succesvol roep de callback aan
        cb(JSON.parse(xhr.responseText));
      }else if(xhr.status >= 500){
        //als er iets mis is met de server maak de call nog eens.
        //hier moet eigenlijk nog wat seconde tussen zitten.
        //HTTPrequest(method, url, body, cb)
      }
    }
  };
  
  xhr.open(method, url, true);
  
  // if(token){
  //   xhr.setRequestHeader("Authorization", token);
  // }
  
  if(body != null){
    xhr.setRequestHeader("Content-Type", "application/json");
  }
  
  xhr.send(JSON.stringify(body));
}