/** @jsx glasgow */

// Glasgow documentation: https://github.com/vanviegen/glasgow
import glasgow from 'glasgow';

//main programma 
glasgow.setDebug(1);
let mount = glasgow.mount(document.body, logIn);
let token

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

function doregisterreq(event, props) {
    HTTPrequest('POST', '/api/user/auth', {username: props.$username, password: props.$password}, function (body) {
        if (body.err) {
            console.log(body.err)
        } else {
            gotoPage(null, {$pageNumber: 0});
        }
    });
}

function gotoPage(event, props) {
    let page;
    console.log(event)
    console.log(props)
    if (props.$pageNumber) {
        page = props.$pageNumber;
    } else {
        page = event.toElement.value;
    }

   mount.unmount();

    if (page == 0) {
        mount = glasgow.mount(document.body, logIn);
    } else if (page == 1) {
        mount = glasgow.mount(document.body, register);
    } else if (page == 2) {
        mount = glasgow.mount(document.body, diploma);
    } else if (page == 3) {
        mount = glasgow.mount(document.body, makereq);
    } else if (page == 4) {
        mount = glasgow.mount(document.body, incomingreq);
    }

}

function navigationBar() {
    return <div>
        <button name="name" value="2" type="submit" onclick={gotoPage(null, {$pageNumber: 2})}>diploma</button>
        <button name="name" value="3" type="submit" onclick={gotoPage(null, {$pageNumber: 3})}>conectie</button>
        <button name="name" value="4" type="submit" onclick={gotoPage(null, {$pageNumber: 4})}>inkomende verzoeken</button>
        <button name="name" value="0" type="submit" onclick={gotoPage(null, {$pageNumber: 0})}>Log uit</button>
    </div>
}

function makereq() {
    return <main>
        <h1>maak verzoek</h1>
        {navigationBar()}
    </main>
}

function incomingreq() {
    return <main>
        <h1>inkomdende verzoeken</h1>
        {navigationBar()}
    </main>
}

function diploma() {
    return <main>
        <h1>credentials</h1>
        {navigationBar()}

    </main>
}

function logIn() {
    return <main>
        <h1>Saxion</h1>

        <span>Gebruikersnaam: </span><input type="text" binding="$username"/><br/>
        <span>Wachtwoord: </span><input type="password" binding="$password"/><br/>
        <input type="submit" value="Log in" onclick={doLoginRequest}/>
    </main>
}

function register() {
    return <main>
        <h1>Saxion</h1>
        {navigationBar()}
        <span>Gebruikersnaam: </span><input type="text" binding="$username"/><br/>
        <span>Wachtwoord: </span><input type="password" binding="$password"/><br/>
        <input type="submit" value="Log in" onclick={doLoginRequest}/>
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

