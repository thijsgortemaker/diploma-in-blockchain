/** @jsx glasgow */

// Glasgow documentation: https://github.com/vanviegen/glasgow
import glasgow from 'glasgow';

//main programma 
glasgow.setDebug(1);
let mount = glasgow.mount(document.body, logInPage);
let token;

window.onbeforeunload = closingCode;
function closingCode(){
    HTTPrequest('POST', '/api/logOut', {}, function(body){
        if(body.err){
        }else{
            token = undefined;
            mount = glasgow.mount(document.body, logInPage);
        }
    });
}

function doLoginRequest(event, props){
    HTTPrequest('POST', '/api/wallet-log-in', {username: props.$username, password: props.$password}, function(body){
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

function doRegisterRequest(event, props) {
    HTTPrequest('POST', '/api/wallet-register', {username: props.$username, password: props.$password}, function (body) {
        if (body.err) {
            let errorElement = document.getElementById("inlogSchermError");
            errorElement.hidden = false;
            errorElement.firstChild.innerHTML = body.err;
        } else {
            token = body.token;
            gotoPage(null, {$pageNumber: 2});
        }
    });
}

function sendConnectieRequest(event, props) {
    HTTPrequest('POST', '/api/sendreq', {naam: props.$naam, studentNummer: props.$studentNummer}, function (body) {
        if (body.err) {
        } else {
            gotoPage(null, {$pageNumber: 2});
            showSnackBarMessage("succes");
        }
    });
}

function getAllCredentials(event, props) {
    console.log("hallo");
    HTTPrequest('GET', '/api/credentials', {}, function (body) {
        if (body.err) {
        } else {
            mount = glasgow.mount(document.body, myCredentialsPage, body);
        }
    });
}

function doOffersRequest(event, props) {
    HTTPrequest('GET', '/api/get-all-offers', {}, function (body) {
        if (body.err) {
        } else {
            mount = glasgow.mount(document.body, offersPage, body);
        }
    });
}

function accepteerCredOffer(event, props) {
    console.log(event);

    HTTPrequest('POST', '/api/accept-cred-offer', {id: props.offer.id}, function (body) {
        if (body.err) {
        } else {
            gotoPage(null, {$pageNumber: 3});            
        }
    });
}

function gotoPage(event, props, node) {
    let page;
  
    if (props.$pageNumber) {
        page = props.$pageNumber;
    } else {
        page = node.value;
    }

   mount.unmount();

    if (page == 0) {
        mount = glasgow.mount(document.body, logInPage);
    } else if (page == 1) {
        getAllCredentials();
    } else if (page == 2) {
        mount = glasgow.mount(document.body, connRequestPage);
    } else if (page == 3) {
        doOffersRequest();
    } else if (page == 4) {
        closingCode();
    }else if(page == 5){
        mount = glasgow.mount(document.body, registerPage);
    }
}

function connRequestPage() {
    return <main>
    {navigationBar()}
    <span>Doe connectie request naar saxion</span><br/>
    <span>Enter naam:</span> <input type="text" binding="$naam"></input><br/>
    <span>Enter studentnummer:</span> <input type="text" binding="$studentNummer"></input><br/> 
    <input type="submit" value="stuur connectie request" onclick = {sendConnectieRequest}/><br/>
  </main>
}

function myCredentialsPage(props) {
    let creds = props.success;

    return <main>
    {navigationBar()}
    <div id="credentials-list">
        {creds.map(cred => <ACredential cred = {cred} />)}
    </div>
    
  </main>
}

/**
 * Element for a single credential.
 */
function ACredential(props) {
    console.log(props);

    return <div class="credential">
        <h4>Credential</h4>
        <p>Issued By: Saxion</p>
        <p>Extra info: {JSON.stringify(props.cred)}</p>
    </div>
}


function logInPage() {
    return <div class="log-in-prompt">
        <h1>Cloud Agent Log-in</h1>
        <div id ="inlogSchermError" hidden><span>Vervang dit met een error</span><br/></div>
        <input placeholder="Username" type="text" binding="$username"/><br/>
        <input placeholder="Password" type="password" binding="$password"/><br/>
        <p value="5" onclick={gotoPage}>Register</p>
        <input type="submit" value="Log in" onclick={doLoginRequest}/>
    </div>
}

function registerPage() {
    return <div class="log-in-prompt">
        <h1>Cloud Agent Register</h1>
        <div id ="inlogSchermError" hidden><span>Vervang dit met een error</span><br/></div>
        <input placeholder="Username" type="text" binding="$username"/><br/>
        <input placeholder="Password" type="password" binding="$password"/><br/>
        <input type="submit" value="Submit!" onclick={doRegisterRequest}/>
    </div> 
}

function offersPage(props) {
    let offers = props.success;

    return <main>
    {navigationBar()}
    <h3>Incoming offers: </h3>
    {offers.map(offer => <IncomingOffer offer = {offer} />)}
  </main>
}

function navigationBar() {
    return <div class="navbar">
        <ul>
            <li id="logo-ting">Saxion</li>
            <li value="1" onclick={gotoPage}>My Credentials</li>
            <li value="2" onclick={gotoPage}>Make a Request</li>
            <li value="3" onclick={gotoPage}>Offers</li>
            <li value="4" onclick={gotoPage}>Log out</li>
        </ul>
    </div>
}

/**
 * Element for a single offer.
 */
function IncomingOffer(props) {
    let offer = props.offer;

    return <div class="incoming-offer">
        <p>Offer</p>
        <p>From: Saxion</p>
        <p>Vak: {offer.vak}</p>
        <div id="buttons">
            <input type="submit" value="accepteer" onclick={accepteerCredOffer}/>
            <button id="decline-offer">Decline</button>
        </div>
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

