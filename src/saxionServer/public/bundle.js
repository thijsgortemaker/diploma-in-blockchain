!function(e){var t={};function n(r){if(t[r])return t[r].exports;var l=t[r]={i:r,l:!1,exports:{}};return e[r].call(l.exports,l,l.exports,n),l.l=!0,l.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var l in e)n.d(r,l,function(t){return e[t]}.bind(null,l));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";var r,l=n(1),o=(r=l)&&r.__esModule?r:{default:r};var i=o.default.mount(document.body,v),u=void 0;function a(e,t){b("POST","/api/user/auth",{username:t.$username,password:t.$password},function(e){if(e.err){var t=document.getElementById("inlogSchermError");t.hidden=!1,t.firstChild.innerHTML=e.err}else u=e.token,s(null,{$pageNumber:1})})}function f(e,t){b("POST","/api/vak",{naam:t.$naamvak,omschrijving:t.$omschrijving,ecs:t.$ecs},function(e){if(e.err){var t=document.getElementById("vakAanmaakError");t.hidden=!1,t.firstChild.innerHTML=e.err}else s(null,{$pageNumber:2}),_("vak aangemaakt")})}function s(e,t,n){var r=void 0;r=t.$pageNumber?t.$pageNumber:n.value,i.unmount(),0==r?(u=void 0,i=o.default.mount(document.body,v)):1==r?b("GET","/api/connectieRequest",{},function(e){e.err||(i=o.default.mount(document.body,d,e))}):2==r?i=o.default.mount(document.body,m):3==r&&b("GET","/api/vak",{},function(e){e.err||b("GET","/api/student",{},function(t){t.err||(console.log(e),console.log(t),i=o.default.mount(document.body,h,{studenten:t.results,vakken:e.results}))})})}function c(){return(0,o.default)("div",{class:"navbar"},(0,o.default)("ul",null,(0,o.default)("li",{id:"logo-ting"},"Saxion"),(0,o.default)("li",{value:"1",onclick:s},"Connectie requesten"),(0,o.default)("li",{value:"2",onclick:s},"Vak aanmaken"),(0,o.default)("li",{value:"3",onclick:s},"Geef competentie uit"),(0,o.default)("li",{value:"4",onclick:s},"Log out")),(0,o.default)("br",null))}function d(e){return(0,o.default)("main",null,(0,o.default)("h1",null,"Saxion"),c(),e.results.map(function(e){return(0,o.default)(p,{result:e})}))}function p(e){return(0,o.default)("section",{class:"inkomendRequest"},(0,o.default)("p",null,"naam: ",e.result.naam),(0,o.default)("p",null,"studentnummer: ",e.result.studentnummer),(0,o.default)("p",null,"did: ",e.result.did),(0,o.default)("p",null,"verinym: ",e.result.verinym),(0,o.default)("input",{type:"submit",value:"accepteer",onclick:g})," ",(0,o.default)("input",{type:"submit",value:"niet accepteer"}))}function g(e,t){b("POST","/api/accepteerConnectionRequest",{id:t.result.idconnectierequest},function(e){e.err||(s(0,{$pageNumber:1}),_("connectie met "+t.naam+"geaccepteert"))})}function m(){return(0,o.default)("div",{class:"vak-aanmaken"},(0,o.default)("h1",null,"Saxion"),c(),(0,o.default)("div",{id:"vakAanmaakError",hidden:!0},(0,o.default)("span",null,"Vervang dit met een error"),(0,o.default)("br",null)),(0,o.default)("span",null,"Naam vak "),(0,o.default)("input",{type:"text",binding:"$naamvak"}),(0,o.default)("br",null),(0,o.default)("span",null,"Omschrijving vak "),(0,o.default)("input",{type:"text",binding:"$omschrijving"}),(0,o.default)("br",null),(0,o.default)("span",null,"ecs "),(0,o.default)("input",{type:"text",binding:"$ecs"}),(0,o.default)("br",null),(0,o.default)("input",{type:"submit",value:"Maak vak aan",onclick:f}))}function h(e){var t=e.studenten,n=e.vakken;return console.log("hallo"),(0,o.default)("main",null,(0,o.default)("h1",null,"Saxion"),c(),(0,o.default)("div",{id:"competentieSchermError",hidden:!0},(0,o.default)("span",null,"Vervang dit met een error"),(0,o.default)("br",null)),(0,o.default)("span",null,"student:"),(0,o.default)("select",{binding:"$student"},t.map(function(e){return(0,o.default)("option",{value:e.idStudent},e.naamstudent)})),(0,o.default)("br",null),(0,o.default)("span",null,"vak: "),(0,o.default)("select",{binding:"$vak"},n.map(function(e){return(0,o.default)("option",{value:e.idvak},e.vaknaam)})),(0,o.default)("br",null),(0,o.default)("span",null,"cijfer"),(0,o.default)("input",{type:"number",binding:"$cijfer"}),(0,o.default)("br",null),(0,o.default)("input",{type:"submit",value:"geef competentie uit",onclick:y}),(0,o.default)("br",null))}function y(e,t){b("POST","/api/competentie",{student:t.$student,vak:t.$vak,cijfer:t.$cijfer},function(e){if(e.err){var t=document.getElementById("competentieSchermError");t.hidden=!1,t.firstChild.innerHTML="Competentie al uitgegeven"}else s(0,{$pageNumber:3}),_("competentie uitgegeven")})}function v(){return(0,o.default)("div",{class:"log-in-prompt"},(0,o.default)("h1",null,"Saxion Log-in"),(0,o.default)("div",{id:"inlogSchermError",hidden:!0},(0,o.default)("span",null,"Vervang dit met een error"),(0,o.default)("br",null)),(0,o.default)("input",{placeholder:"Username",type:"text",binding:"$username"}),(0,o.default)("br",null),(0,o.default)("input",{placeholder:"Password",type:"password",binding:"$password"}),(0,o.default)("br",null),(0,o.default)("input",{type:"submit",value:"Log in",onclick:a}))}function b(e,t,n,r){var l=new XMLHttpRequest;l.onreadystatechange=function(){l.readyState===XMLHttpRequest.DONE&&(l.status<500?r(JSON.parse(l.responseText)):l.status>=500&&console.log(n))},l.open(e,t,!0),u&&l.setRequestHeader("Authorization",u),null!=n&&l.setRequestHeader("Content-Type","application/json"),l.send(JSON.stringify(n))}function _(e){var t=document.getElementById("snackbar");t.innerHTML=e,t.className="show",setTimeout(function(){t.className=t.className.replace("show","")},3e3)}},function(e,t,n){"use strict";n.r(t),n.d(t,"default",function(){return a});const r=[],l={_c:r};for(let e of[r,l])Object.freeze(e);let o=[],i=window.fetch?window.fetch.bind(window):null,u=1;function a(e,t){if(u&&"string"!=typeof e&&"function"!=typeof e)throw new Error("first parameter should be a tag string or a component function");if(null==t)t={};else if(u&&Object.getPrototypeOf(t)!==Object.prototype)throw new Error("second parameter should be a plain javascript object or null");t._t=e;var n=t._c=[];for(let e=2;e<arguments.length;e++)f(n,arguments[e]);return t}function f(e,t){if(null==t)return;let n=typeof t;if("object"===n){if(t instanceof Array){for(let n=0;n<t.length;n++)f(e,t[n]);return}let n=typeof t._t;if("string"===n||"function"===n)return e.push(t)}else{if("number"===n)return e.push(""+t);if("string"===n)return e.push(t)}throw new Error("invalid child VDOM node: "+JSON.stringify(t))}function s(e,t){if("string"==typeof e)return[t,e];for(let n=0;n<e.length-1;n++){let r=e[n];t="object"==typeof r?r:t[r]=t[r]||{}}return[t,e[e.length-1]]}function c(e){let t=this.refreshNow;function n(e){return t(),e&&"function"==typeof e.then&&e.then(n),e}return function(){return n(e.apply(this,arguments))}}function d(e){return function(){for(let t of o)t[e].apply(t,arguments)}}a.mount=function(e,t,n={}){let d,p,g={_t:t,_a:{_t:"div",_c:[]}},m=document.createElement("div");e.appendChild(m);let h={},y={},v=[],b=0,_={refresh:function(){u&&b<0&&console.warn("refresh triggered during refresh"),b<1&&(b=setTimeout(O,0))},refreshNow:O,unmount:function(){let t=o.indexOf(this);if(t<0)throw new Error("not mountesd");o.splice(t,1),j(g,{},m),e.removeChild(m)},refreshify:c,getTree:function(){return g}};return i&&(_.fetch=_.refreshify(i)),o.push(_),O(),_;function k(e){let t=e._t(e,e._c);delete e._c;let n=[];return f(n,t),1===n.length?n[0]:{_t:"div",_c:n}}function w(e,t,n){if("string"==typeof e)return p++,u>=3&&a.log("glasgow update create TextNode",e),document.createTextNode(e);let r=e._t;if("function"==typeof r)return e._a=k(e),w(e._a,e,n);"svg"===r&&(e._svg=!0);let o=e._svg?document.createElementNS("http://www.w3.org/2000/svg",r):document.createElement(r);p++,u>=3&&a.log("glasgow update create",r);let i=e.oncreate||e.create;return"function"==typeof i&&$(i,o,[{type:"create",parentStable:n},t,e]),N(e,l,[o],t),o}function S(e,t){let n=typeof e;return n===typeof t&&("string"===n||e.key===t.key&&e._t===t._t)}function N(e,t,n,l){if(u&&(e._e&&console.error("double patch",e,x(n)),t._e&&t._e!==x(n)&&console.error("dom element not properly matched with old node",t,x(n))),"string"==typeof e)return e!==t&&(x(n).textContent=e,p++,u>=3&&a.log("glasgow update set TextNode",e)),e;let o,i=n.length;if("function"==typeof e._t){t._t&&function(e,t){for(let n in e)if("_"!==n[0]&&"$"!==n[0]&&e[n]!==t[n])return!1;for(let n in t)if("_"!==n[0]&&"$"!==n[0]&&!e.hasOwnProperty(n))return!1;return!0}(e,t)&&(t._c=e._c,e=t);let r=k(e);if(S(r,t._a))e._a=N(r,t._a,n,e);else{j(t._a,t),e._a=r;let l=x(n,i-1),o=w(r,e,!0),f=x(n);l.replaceChild(o,f),p++,u>=3&&a.log("glasgow update replace child",x(n)),f===m&&(u&&a.log("replacing root element"),m=n[0]=o,h=y)}return e}u&&(e._e=x(n));let f=e._c,c=t._c;const g=e._svg;if(g)for(let e of f)e._svg=!0;let v,b,O=Math.min(f.length,c.length);for(v=0;v<O&&S(f[v],c[v]);v++)n[i]=v,f[v]=N(f[v],c[v],n,l);O-=v;let T=f.length-1,M=c.length-1;for(b=0;b<O&&S(f[T-b],c[M-b]);b++)n[i]=M-b,f[T-b]=N(f[T-b],c[M-b],n,l);if(b+v!==f.length||f.length!==c.length){o=o||x(n,i);let e={},t=[],s=null;if(c.length>v){n[i]=v,s=x(n);for(let n=v;n<c.length-b;n++){let r=c[n];if("object"==typeof r&&r.key&&(e[r.key]=n),u&&!s)throw new Error("element missing");t.push(s),s=s.nextSibling,d++}}let g={};for(let e=v;e<f.length-b;e++){let t=f[e];"object"==typeof t&&t.key&&(g[t.key]=e)}let m=0;e:for(let n=v;n<f.length-b;n++){let i=void 0,d=f[n];if("object"==typeof d){let r,o=d.key;if(o&&(r=e[o])&&S(d,c[r]))i=t[r-v],t[r-v]=void 0,f[n]=N(d,c[r],[i],l);else if(!o||"~"===o[0]){let e=Math.min(n+5,c.length);for(let r=Math.max(n-5,0);r<e;r++){let e=c[r];if("object"==typeof e&&e._t===d._t&&t[r-v]){let o=e.key;if(!o||"~"===o[0]&&null==g[o]){if(i=t[r-v],t[r-v]=void 0,f[n]=N(d,e,[i],l),r===v+m){m++;continue e}break}}}}}i||(i=w(d,l,c!==r)),o.insertBefore(i,s),p++,u>=3&&a.log("glasgow update insert node",i)}let h=v;for(let e=0;e<t.length;e++){let n=t[e];if(n){let t=c[v+e];if("string"!=typeof t){if("kept"===t._t){f.splice(h++,0,t);continue}let e=j(t,l,n);if(e&&"function"==typeof e.then){let t={_t:"kept",_c:[]};f.splice(h++,0,t),function(t){e.then(function(){t._t="discard",_.refreshNow()})}(t);continue}}o.removeChild(n),p++,u>=3&&a.log("glasgow update remove element",n)}}}n.length=i,e.binding&&function(e,t){let n=function(e,t){let[n,r]=s(e,t);return n[r]}(e.binding,t);"checkbox"===e.type?e.checked=!!n:e.value=null==n?"":""+n,e.oninput=E}(e,l);for(let r in e){if("key"===r||"binding"===r||"_"===r[0])continue;let l=e[r];if("function"==typeof l){"on"===r.substr(0,2)&&(r=r.substr(2)),y[r]||(u&&a.log("glasgow delegating event type",r),h[r]=y[r]=!0);continue}let i=t[r];if(l!==i){if(null==l){if(null==i)continue;l=""}o=o||x(n),"checked"===r||"value"===r||"className"===r||"selectedIndex"===r||"disabled"===r?o[r]=l:"style"===r&&"object"==typeof l?(i&&(o.style=""),Object.assign(o.style,l)):g?o.setAttributeNS(null,r,l):o.setAttribute(r,l),p++,u>=3&&a.log("glasgow update set attribute",r,l)}}for(let r in t)"_"!==r[0]&&"function"!=typeof t[r]&&(e.hasOwnProperty(r)||(o=o||x(n),"style"===r||"checked"===r||"value"===r||"className"===r?o[r]="":o.removeAttribute(r),p++,u>=3&&a.log("glasgow update unset attribute",r)));let P=e.onrefresh||e.refresh;return"function"==typeof P&&$(P,x(n),[{type:"refresh"},l,e]),e}function O(){u&&b<0&&console.error("recursive invocation?"),b=-1;let e=g;g=a(t,n),d=p=0;let r=new Date;u&&!S(g,e)&&console.error("root cannot be patched",g,e),g=N(g,e,[m]);for(let e in h)m.addEventListener(e,T),p++,u>=3&&a.log("glasgow update add event listener",e);h={},a.log("glasgow refreshed in",new Date-r,"ms, using",p,"DOM updates and",d,"DOM reads"+(u?" [use glasgow.setDebug(0) if you're interested in speed]":""));for(let e=0;e<v.length;e+=3)v[e].apply(v[e+1],v[e+2]);v.length=0,-1===b&&(b=0)}function j(e,t,n){if("string"==typeof e)return;if(e._a)return j(e._a,e,n);let r=e._c;for(let e=0;e<r.length;e++)j(r[e],t);let l=e.onremove||e.remove;return"function"==typeof l?l.call(n,{type:"remove",parentStable:!!n},t,e):void 0}function x(t,n){let r=(null==n?t.length:n)-1;for(let e=r;e>=0;e--)if("number"!=typeof t[e]){let n=t[e];for(let l=e+1;l<=r;l++){if(n=n.childNodes[t[l]],u&&!n)throw new Error("invalid DOM path "+t);t[l]=n,d++}return n}return e}function T(e){let t=[];for(let n=e.target;n!==m;n=n.parentNode){let e=0;for(let t=n.previousSibling;t;t=t.previousSibling)e++;t.push(e)}let n,r=g,l=[],o=t.length;for(;;){for(;r._a;)n=r,r=r._a;if("kept"===r._t)break;if(l.push(r,n),--o<0){u&&l[l.length-2]._e!==e.target&&console.error("event tree resolve failed",e.target,l[l.length-2]._e,t);break}if(!0===r._leaf)return;r=r._c[t[o]]}let i=e.type,f="on"+e.type;a.log("glasgow event",i);let s=e.target,c=!1;for(let t=l.length-2;t>=0;t-=2){let n=l[t],r=n[f]||n[i];if("function"==typeof r){c=!0;let o=l[t+1];if(r.call(s,e,o,n)!==a.NOT_HANDLED){e.preventDefault(),e.stopPropagation();break}}s=s.parentNode}c&&O()}function E(e,t,n){let r="checkbox"===n.type?n.checked=this.checked:"number"===n.type?parseFloat(n.value=this.value):n.value=this.value;!function(e,t,n){let[r,l]=s(e,t);r[l]=n}(n.binding,t,r)}function $(e,t,n){v.push(e,t,n)}},a.NOT_HANDLED={},a.transition=function({element:e,from:t,to:n,time:r,easing:l,keep:o}){r=r||400,l=l||"ease-out";let i={};for(let n in t)i[n]=e.style[n],e.style[n]=t[n];return new Promise(function(t){setTimeout(function(){i.transition=e.style.transition,e.style.transition=`all ${l} ${r}ms`;for(let t in n)i.hasOwnProperty(t)||(i[t]=e.style[t]),e.style[t]="original"===n[t]?i[t]:n[t];setTimeout(function(){setTimeout(function(){for(let t in i)o&&"transition"!==t||(e.style[t]=i[t]);t()},r)},1)},0)})},a.fadeIn=function(e){if(e.parentStable)return a.transition({element:this,from:{marginTop:this.offsetHeight/-2+"px",marginBottom:this.offsetHeight/-2+"px",opacity:0,transform:"scaleY(0)"},to:{marginTop:getComputedStyle(this).getPropertyValue("margin-top"),marginBottom:getComputedStyle(this).getPropertyValue("margin-bottom"),opacity:1,transform:"scaleY(1)"},easing:"ease-out"})},a.fadeOut=function(e){if(e.parentStable)return a.transition({element:this,to:{marginTop:this.offsetHeight/-2+"px",marginBottom:this.offsetHeight/-2+"px",opacity:0,transform:"scaleY(0)"},keep:!0,easing:"ease-out"})},a.setDebug=function(e){u=0|e},a.refresh=d("refresh"),a.refreshNow=d("refreshNow"),a.refreshify=c,a.log=function(){console.log.apply(console,arguments)},i&&(a.fetch=a.refreshify(i))}]);