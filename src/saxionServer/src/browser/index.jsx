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
      showSnackBarMessage("vak aangemaakt");
    }
  });
}

function gaNaarConnectieRequestenScherm(){
    HTTPrequest('GET', '/api/connectieRequest', {}, function(body){
      if(body.err){

      }else
        mount = glasgow.mount(document.body, connectieRequestenScherm, body);
      }
    );
}

function gaNaarGeefCompetentieUitScherm(){
  HTTPrequest('GET', '/api/vak', {}, function(body1){
    if(body1.err){
    }else
      HTTPrequest('GET', '/api/student', {}, function(body2){
        if(body2.err){
        }else{

          console.log(body1);
          console.log(body2);
          mount = glasgow.mount(document.body, geefCompetentieUitScherm, {studenten: body2.results, vakken: body1.results});
        }
      });
    }
  );
}


function gotoPage(event, props, node){
  let page;

  if(props.$pageNumber){
    page = props.$pageNumber;
  }else{
    page = node.value;
  }

  mount.unmount();

  if(page == 0){
    logOut();
  }else if(page == 1){
    gaNaarConnectieRequestenScherm();
  }else if(page == 2){
    mount = glasgow.mount(document.body, vakAanmakenScherm);
  }else if(page == 3){
    gaNaarGeefCompetentieUitScherm();
  }
  // dd
}

function logOut(){
  token = undefined;
  mount = glasgow.mount(document.body, logIn);
}

function navigationBar() {
  return <div class="navbar">
      <ul>
          <li id="logo-ting">Saxion</li>
          <li value="1" onclick={gotoPage}>Connectie requesten</li>
          <li value="2" onclick={gotoPage}>Vak aanmaken</li>
          <li value="3" onclick={gotoPage}>Geef competentie uit</li>
          <li value="4" onclick={gotoPage}>Log out</li>
      </ul><br/>
  </div>
}

function connectieRequestenScherm(props){
  return <main>
    <h1 >Saxion</h1>
    {navigationBar()}
    {props.results.map(result => <Request result = {result} />)}
  </main>
}

function Request(props){
  return <section class = "inkomendRequest">
    <p>naam: {props.result.naam}</p>
    <p>studentnummer: {props.result.studentnummer}</p>
    <p>did: {props.result.did}</p>
    <p>verinym: {props.result.verinym}</p>
    <input type="submit" value="accepteer" onclick={accepteerConnectionRequest}/> <input type="submit" value="niet accepteer"/>
  </section>
}

function accepteerConnectionRequest(event, props){

  HTTPrequest('POST', '/api/accepteerConnectionRequest', {id: props.result.idconnectierequest}, function(body){
    if(body.err){
    }else{
      gotoPage(null,  {$pageNumber: 1});
      showSnackBarMessage("connectie met " + props.naam + "geaccepteert");
    }
  });

}

function vakAanmakenScherm(){
  return <div class="vak-aanmaken">
    <h1 >Saxion</h1>
    {navigationBar()}
    <div id ="vakAanmaakError" hidden><span>Vervang dit met een error</span><br/></div>
    <span>Naam vak: &emsp;&emsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input type="text" binding="$naamvak"/><br/>
    <span>Omschrijving vak:&nbsp;</span><input type="text" binding="$omschrijving"/><br/>
    <span>ecs &emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input type="text" binding="$ecs"/><br/>
    <input type="submit" value="Maak vak aan" onclick = {doeVakAanmaakRequest}/>
  </div>
}

function geefCompetentieUitScherm(props){
  let studenten = props.studenten;
  let vakken = props.vakken;
  
  console.log("hallo");

  return <main>
    <h1 >Saxion</h1>
    {navigationBar()}
    <div id ="competentieSchermError" hidden><span>Vervang dit met een error</span><br/></div>
    <span>student: &nbsp;</span>
    <select binding="$student">
      {studenten.map(student =>  <option value= {student.idStudent}>{student.naamstudent}</option>)}
    </select><br/>
    <span>vak: &emsp;&nbsp;&nbsp;&nbsp;</span>
    <select binding="$vak">
      {vakken.map(vak =>  <option value = {vak.idvak}>{vak.vaknaam}</option>)}
    </select><br/>

    <span>cijfer: &nbsp;&nbsp;&nbsp;&nbsp;</span><input type="number" binding="$cijfer"/><br/>
    <input type="submit" value="geef competentie uit" onclick = {geefCompetentieUit}/><br/>
  </main>
}

function geefCompetentieUit(event, props){
  HTTPrequest('POST', '/api/competentie', {student: props.$student, vak : props.$vak, cijfer : props.$cijfer}, function(body){
    if(body.err){
      let errorElement = document.getElementById("competentieSchermError");
      errorElement.hidden = false;
      errorElement.firstChild.innerHTML = "Competentie al uitgegeven";
    }else{
      gotoPage(null,  {$pageNumber: 3});
      showSnackBarMessage("competentie uitgegeven");
    }
  });
}

function logIn() {      
  return <div class="log-in-prompt">
    <h1>Saxion Log-in</h1>
        <div id ="inlogSchermError" hidden><span>Vervang dit met een error</span><br/></div>
        <input placeholder="Username" type="text" binding="$username"/><br/>
        <input placeholder="Password" type="password" binding="$password"/><br/>
        <input type="submit" value="Log in" onclick={doLoginRequest}/>
    </div>
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
