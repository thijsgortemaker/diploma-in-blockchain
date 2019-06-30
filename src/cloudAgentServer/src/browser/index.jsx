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
        getAllCredentials()
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
    return <div id="conn-request">
        {navigationBar()}
        <div class="request-form">
        <h3>Make a connection request</h3>
            <input type="text" binding="$naam" placeholder="name"/>
            <input type="text" binding="$studentNummer" placeholder="studentnummer"/>
            <input class="btn" type="submit" value="Make request" onclick = {sendConnectieRequest}/>
            </div>
        </div>
}

function myCredentialsPage(props) {
    let creds = props.success;

    return <div>
    {navigationBar()}
    <div id="credential-page-wrap">  
          <h2>My Credentials</h2>
    <div id="credentials-list">
    {creds.map(cred => <ACredential cred = {cred} />)}

    </div>
    </div>

  </div>
}

/**
 * Element for a single credential.
 * ** VERGEET PROPS NIET TE ADDEN **
 */
function ACredential(props) {
    return <div class="credential">
        <h4>Credential</h4>
        <p><b>Issued By:</b> Saxion</p>
        <p><b>Extra info:</b>  
          {JSON.stringify(props.cred)}
        </p>
    </div>
}


function logInPage() {
    return <div class="log-in-prompt">
        <h2>Cloud Agent Log-in</h2>
        <div id ="inlogSchermError" hidden>Vervang dit met een error</div>
        <input placeholder="Username" type="text" binding="$username"/>
        <input placeholder="Password" type="password" binding="$password"/>
        <input class="btn" type="submit" value="Log in" onclick={doLoginRequest}/>
        <p>Don't have an account yet ?</p><a href="#" value="5" onclick={gotoPage}>Register</a>
    </div>
}

function registerPage() {
    return <div class="log-in-prompt">
        <h2>Cloud Agent Register</h2>
        <div id ="inlogSchermError" hidden>Vervang dit met een error</div>
        <input placeholder="Username" type="text" binding="$username"/>
        <input placeholder="Password" type="password" binding="$password"/>
        <input class="btn" type="submit" value="Submit!" onclick={doRegisterRequest}/>
    </div> 
}

function offersPage(props) {
    let offers = props.success;

    return <main>
    {navigationBar()}
    <div id="wrap-cuck">
    <h2>Incoming offers: </h2>
    <div id="incoming-offers-list">
    {offers.map(offer => <IncomingOffer offer = {offer} />)}

    </div>
    </div>
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
function IncomingOffer() {
    // let offer = props.offer;
//{offer.vak}
    return <div id="incoming-offer">
    <div class="incoming-offer-info">
        <p><b>Offer</b></p>
        <p><b>From:</b> Saxion</p>
        <p><b>Vak:</b> </p>
    </div>
    <div id="buttons">
            <input type="submit" value="Accept" onclick={accepteerCredOffer}/>
            <input type="submit" value="Decline" id="decline-offer"/>
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

