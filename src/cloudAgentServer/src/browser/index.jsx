/** @jsx glasgow */

// Glasgow documentation: https://github.com/vanviegen/glasgow
import glasgow from 'glasgow';

//main programma 
glasgow.setDebug(1);
let mount = glasgow.mount(document.body, logInPage);
let token;

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
            gotoPage(null, {$pageNumber: 2});
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
        mount = glasgow.mount(document.body, myCredentialsPage);
    } else if (page == 2) {
        mount = glasgow.mount(document.body, connRequestPage);
    } else if (page == 3) {
        mount = glasgow.mount(document.body, offersPage);
    } else if (page == 4) {
        mount = glasgow.mount(document.body, incomingreq);
    } else if (page == 5) {
        mount = glasgow.mount(document.body, registerPage);
    }

}

function connRequestPage() {
    return <main>
    {navigationBar()}
    <p>Enter Verinym: </p>
    <form>
        <input type="text"></input>
        <button type="submit">Send Request</button>
    </form>
  </main>
}

function myCredentialsPage() {
    return <main>
    {navigationBar()}
    {myCredentialsList()}
  </main>
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

function offersPage() {
    return <main>
    {navigationBar()}
    {incomingOfferList()}
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
 * All incoming offers should be listed here.
 */
function incomingOfferList() {
    return <div id="offers-list">
        <h3>Incoming offers: </h3>
        {incomingOffer()}
        {incomingOffer()}
    </div>
}

/**
 * Element for a single offer.
 */
function incomingOffer() {
    return <div class="incoming-offer">
        <p>Offer</p>
        <p>From: </p>
        <p>Schema: </p>
        <p>Extra info:</p>
        <div id="buttons">
            <button id="accept-offer">Accept</button>
            <button id="decline-offer">Decline</button>
        </div>
    </div>
}

/**
 * List of all users credentials.
 */
function myCredentialsList() {
    return <div id="credentials-list">
        <h3>My Credentials: </h3>
        {aCredential()}
        {aCredential()}
    </div>
}

/**
 * Element for a single credential.
 */
function aCredential() {
    return <div class="credential">
        <h4>Credential</h4>
        <p>Issued By: </p>
        <p>Grade: </p>
        <p>Extra info:</p>
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

