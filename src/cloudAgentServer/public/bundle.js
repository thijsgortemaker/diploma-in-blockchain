!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";var r,o=n(1),l=(r=o)&&r.__esModule?r:{default:r};l.default.setDebug(1);var i=l.default.mount(document.body,y),u=void 0;function a(){k("POST","/api/logOut",{},function(e){e.err||(u=void 0,i=l.default.mount(document.body,y))})}function f(e,t){k("POST","/api/wallet-log-in",{username:t.$username,password:t.$password},function(e){if(e.err){var t=document.getElementById("inlogSchermError");t.hidden=!1,t.firstChild.innerHTML=e.err}else u=e.token,p(null,{$pageNumber:1})})}function s(e,t){k("POST","/api/wallet-register",{username:t.$username,password:t.$password},function(e){if(e.err){var t=document.getElementById("inlogSchermError");t.hidden=!1,t.firstChild.innerHTML=e.err}else u=e.token,p(null,{$pageNumber:2})})}function c(e,t){k("POST","/api/sendreq",{naam:t.$naam,studentNummer:t.$studentNummer},function(e){var t,n;e.err||(p(null,{$pageNumber:2}),t="succes",(n=document.getElementById("snackbar")).innerHTML=t,n.className="show",setTimeout(function(){n.className=n.className.replace("show","")},3e3))})}function d(e,t){console.log(e),k("POST","/api/accept-cred-offer",{id:t.offer.id},function(e){e.err||p(null,{$pageNumber:3})})}function p(e,t,n){var r=void 0;r=t.$pageNumber?t.$pageNumber:n.value,i.unmount(),0==r?i=l.default.mount(document.body,y):1==r?(console.log("hallo"),k("GET","/api/credentials",{},function(e){e.err||(i=l.default.mount(document.body,m,e))})):2==r?i=l.default.mount(document.body,g):3==r?k("GET","/api/get-all-offers",{},function(e){e.err||(i=l.default.mount(document.body,v,e))}):4==r?a():5==r&&(i=l.default.mount(document.body,b))}function g(){return(0,l.default)("div",{id:"conn-request"},w(),(0,l.default)("div",{class:"request-form"},(0,l.default)("h3",null,"Make a connection request"),(0,l.default)("input",{type:"text",binding:"$naam",placeholder:"name"}),(0,l.default)("input",{type:"text",binding:"$studentNummer",placeholder:"studentnummer"}),(0,l.default)("input",{class:"btn",type:"submit",value:"Make request",onclick:c})))}function m(e){var t=e.success;return(0,l.default)("div",null,w(),(0,l.default)("div",{id:"credential-page-wrap"},(0,l.default)("h2",null,"My Credentials"),(0,l.default)("div",{id:"credentials-list"},t.map(function(e){return(0,l.default)(h,{cred:e})}))))}function h(e){return(0,l.default)("div",{class:"credential"},(0,l.default)("h4",null,"Credential"),(0,l.default)("p",null,(0,l.default)("b",null,"Issued By:")," Saxion"),(0,l.default)("p",null,(0,l.default)("b",null,"Extra info:"),JSON.stringify(e.cred)))}function y(){return(0,l.default)("div",{class:"log-in-prompt"},(0,l.default)("h2",null,"Cloud Agent Log-in"),(0,l.default)("div",{id:"inlogSchermError",hidden:!0},"Vervang dit met een error"),(0,l.default)("input",{placeholder:"Username",type:"text",binding:"$username"}),(0,l.default)("input",{placeholder:"Password",type:"password",binding:"$password"}),(0,l.default)("input",{class:"btn",type:"submit",value:"Log in",onclick:f}),(0,l.default)("p",null,"Don't have an account yet ?"),(0,l.default)("a",{href:"#",value:"5",onclick:p},"Register"))}function b(){return(0,l.default)("div",{class:"log-in-prompt"},(0,l.default)("h2",null,"Cloud Agent Register"),(0,l.default)("div",{id:"inlogSchermError",hidden:!0},"Vervang dit met een error"),(0,l.default)("input",{placeholder:"Username",type:"text",binding:"$username"}),(0,l.default)("input",{placeholder:"Password",type:"password",binding:"$password"}),(0,l.default)("input",{class:"btn",type:"submit",value:"Submit!",onclick:s}))}function v(e){var t=e.success;return(0,l.default)("main",null,w(),(0,l.default)("div",{id:"wrap-cuck"},(0,l.default)("h2",null,"Incoming offers: "),(0,l.default)("div",{id:"incoming-offers-list"},t.map(function(e){return(0,l.default)(_,{offer:e})}))))}function w(){return(0,l.default)("div",{class:"navbar"},(0,l.default)("ul",null,(0,l.default)("li",{id:"logo-ting"},"Saxion"),(0,l.default)("li",{value:"1",onclick:p},"My Credentials"),(0,l.default)("li",{value:"2",onclick:p},"Make a Request"),(0,l.default)("li",{value:"3",onclick:p},"Offers"),(0,l.default)("li",{value:"4",onclick:p},"Log out")))}function _(){return(0,l.default)("div",{id:"incoming-offer"},(0,l.default)("div",{class:"incoming-offer-info"},(0,l.default)("p",null,(0,l.default)("b",null,"Offer")),(0,l.default)("p",null,(0,l.default)("b",null,"From:")," Saxion"),(0,l.default)("p",null,(0,l.default)("b",null,"Vak:")," ")),(0,l.default)("div",{id:"buttons"},(0,l.default)("input",{type:"submit",value:"Accept",onclick:d}),(0,l.default)("input",{type:"submit",value:"Decline",id:"decline-offer"})))}function k(e,t,n,r){var o=new XMLHttpRequest;o.onreadystatechange=function(){o.readyState===XMLHttpRequest.DONE&&(o.status<500?r(JSON.parse(o.responseText)):o.status>=500&&console.log(n))},o.open(e,t,!0),u&&o.setRequestHeader("Authorization",u),null!=n&&o.setRequestHeader("Content-Type","application/json"),o.send(JSON.stringify(n))}window.onbeforeunload=a},function(e,t,n){"use strict";n.r(t),n.d(t,"default",function(){return a});const r=[],o={_c:r};for(let e of[r,o])Object.freeze(e);let l=[],i=window.fetch?window.fetch.bind(window):null,u=1;function a(e,t){if(u&&"string"!=typeof e&&"function"!=typeof e)throw new Error("first parameter should be a tag string or a component function");if(null==t)t={};else if(u&&Object.getPrototypeOf(t)!==Object.prototype)throw new Error("second parameter should be a plain javascript object or null");if("string"==typeof e){let n=e.indexOf(".");n>=0&&(t.className=e.substr(n+1).replace(/\./g," "),e=e.substr(0,n)||"div")}t._t=e;var n=t._c=[];for(let e=2;e<arguments.length;e++)f(n,arguments[e]);return t}function f(e,t){if(null==t)return;let n=typeof t;if("object"===n){if(t instanceof Array){for(let n=0;n<t.length;n++)f(e,t[n]);return}let n=typeof t._t;if("string"===n||"function"===n)return e.push(t)}else{if("number"===n)return e.push(""+t);if("string"===n)return e.push(t)}throw new Error("invalid child VDOM node: "+JSON.stringify(t))}function s(e,t){if("string"==typeof e)return[t,e];for(let n=0;n<e.length-1;n++){let r=e[n];t="object"==typeof r?r:t[r]=t[r]||{}}return[t,e[e.length-1]]}function c(e){let t=this.refreshNow;function n(e){return t(),e&&"function"==typeof e.then&&e.then(n),e}return function(){return n(e.apply(this,arguments))}}function d(e){return function(){for(let t of l)t[e].apply(t,arguments)}}a.mount=function(e,t,n={}){let d,p,g={_t:t,_a:{_t:"div",_c:[]}},m=document.createElement("div");e.appendChild(m);let h={},y={},b=[],v=0,w={refresh:function(){u&&v<0&&console.warn("refresh triggered during refresh"),v<1&&(v=setTimeout(S,0))},refreshNow:S,unmount:function(){let t=l.indexOf(this);if(t<0)throw new Error("not mountesd");l.splice(t,1),x(g,{},m),e.removeChild(m)},refreshify:c,getTree:function(){return g}};return i&&(w.fetch=w.refreshify(i)),l.push(w),S(),w;function _(e){let t=e._t(e,e._c);delete e._c;let n=[];return f(n,t),1===n.length?n[0]:{_t:"div",_c:n}}function k(e,t,n){if("string"==typeof e)return p++,u>=3&&a.log("glasgow update create TextNode",e),document.createTextNode(e);let r=e._t;if("function"==typeof r)return e._a=_(e),k(e._a,e,n);"svg"===r&&(e._svg=!0);let l=e._svg?document.createElementNS("http://www.w3.org/2000/svg",r):document.createElement(r);p++,u>=3&&a.log("glasgow update create",r);let i=e.oncreate||e.create;return"function"==typeof i&&$(i,l,[{type:"create",parentStable:n},t,e]),O(e,o,[l],t),l}function N(e,t){let n=typeof e;return n===typeof t&&("string"===n||e.key===t.key&&e._t===t._t)}function O(e,t,n,o){if(u&&(e._e&&console.error("double patch",e,T(n)),t._e&&t._e!==T(n)&&console.error("dom element not properly matched with old node",t,T(n))),"string"==typeof e)return e!==t&&(T(n).textContent=e,p++,u>=3&&a.log("glasgow update set TextNode",e)),e;let l,i=n.length;if("function"==typeof e._t){t._t&&function(e,t){for(let n in e)if("_"!==n[0]&&"$"!==n[0]&&e[n]!==t[n])return!1;for(let n in t)if("_"!==n[0]&&"$"!==n[0]&&!e.hasOwnProperty(n))return!1;return!0}(e,t)&&(t._c=e._c,e=t);let r=_(e);if(N(r,t._a))e._a=O(r,t._a,n,e);else{x(t._a,t),e._a=r;let o=T(n,i-1),l=k(r,e,!0),f=T(n);o.replaceChild(l,f),p++,u>=3&&a.log("glasgow update replace child",T(n)),f===m&&(u&&a.log("replacing root element"),m=n[0]=l,h=y)}return e}u&&(e._e=T(n));let f=e._c,c=t._c;const g=e._svg;if(g)for(let e of f)e._svg=!0;let b,v,S=Math.min(f.length,c.length);for(b=0;b<S&&N(f[b],c[b]);b++)n[i]=b,f[b]=O(f[b],c[b],n,o);S-=b;let E=f.length-1,j=c.length-1;for(v=0;v<S&&N(f[E-v],c[j-v]);v++)n[i]=j-v,f[E-v]=O(f[E-v],c[j-v],n,o);if(v+b!==f.length||f.length!==c.length){l=l||T(n,i);let e={},t=[],s=null;if(c.length>b){n[i]=b,s=T(n);for(let n=b;n<c.length-v;n++){let r=c[n];if("object"==typeof r&&r.key&&(e[r.key]=n),u&&!s)throw new Error("element missing");t.push(s),s=s.nextSibling,d++}}let g={};for(let e=b;e<f.length-v;e++){let t=f[e];"object"==typeof t&&t.key&&(g[t.key]=e)}let m=0;e:for(let n=b;n<f.length-v;n++){let i=void 0,d=f[n];if("object"==typeof d){let r,l=d.key;if(l&&(r=e[l])&&N(d,c[r]))i=t[r-b],t[r-b]=void 0,f[n]=O(d,c[r],[i],o);else if(!l||"~"===l[0]){let e=Math.min(n+5,c.length);for(let r=Math.max(n-5,0);r<e;r++){let e=c[r];if("object"==typeof e&&e._t===d._t&&t[r-b]){let l=e.key;if(!l||"~"===l[0]&&null==g[l]){if(i=t[r-b],t[r-b]=void 0,f[n]=O(d,e,[i],o),r===b+m){m++;continue e}break}}}}}i||(i=k(d,o,c!==r)),l.insertBefore(i,s),p++,u>=3&&a.log("glasgow update insert node",i)}let h=b;for(let e=0;e<t.length;e++){let n=t[e];if(n){let t=c[b+e];if("string"!=typeof t){if("kept"===t._t){f.splice(h++,0,t);continue}let e=x(t,o,n);if(e&&"function"==typeof e.then){let t={_t:"kept",_c:[]};f.splice(h++,0,t),function(t){e.then(function(){t._t="discard",w.refreshNow()})}(t);continue}}l.removeChild(n),p++,u>=3&&a.log("glasgow update remove element",n)}}}n.length=i,e.binding&&function(e,t){let n=function(e,t){let[n,r]=s(e,t);return n[r]}(e.binding,t);"checkbox"===e.type?e.checked=!!n:e.value=null==n?"":""+n,e.oninput=M}(e,o);for(let r in e){if("key"===r||"binding"===r||"_"===r[0])continue;let o=e[r];if("function"==typeof o){"on"===r.substr(0,2)&&(r=r.substr(2)),y[r]||(u&&a.log("glasgow delegating event type",r),h[r]=y[r]=!0);continue}let i=t[r];if(o!==i){if(null==o){if(null==i)continue;o=""}l=l||T(n),"checked"===r||"value"===r||"className"===r||"selectedIndex"===r||"disabled"===r?l[r]=o:"style"===r&&"object"==typeof o?(i&&(l.style=""),Object.assign(l.style,o)):g?l.setAttributeNS(null,r,o):l.setAttribute(r,o),p++,u>=3&&a.log("glasgow update set attribute",r,o)}}for(let r in t)"_"!==r[0]&&"function"!=typeof t[r]&&(e.hasOwnProperty(r)||(l=l||T(n),"style"===r||"checked"===r||"value"===r||"className"===r?l[r]="":l.removeAttribute(r),p++,u>=3&&a.log("glasgow update unset attribute",r)));let P=e.onrefresh||e.refresh;return"function"==typeof P&&$(P,T(n),[{type:"refresh"},o,e]),e}function S(){u&&v<0&&console.error("recursive invocation?"),v=-1;let e=g;g=a(t,n),d=p=0;let r=new Date;u&&!N(g,e)&&console.error("root cannot be patched",g,e),g=O(g,e,[m]);for(let e in h)m.addEventListener(e,E),p++,u>=3&&a.log("glasgow update add event listener",e);h={},a.log("glasgow refreshed in",new Date-r,"ms, using",p,"DOM updates and",d,"DOM reads"+(u?" [use glasgow.setDebug(0) if you're interested in speed]":""));for(let e=0;e<b.length;e+=3)b[e].apply(b[e+1],b[e+2]);b.length=0,-1===v&&(v=0)}function x(e,t,n){if("string"==typeof e)return;if(e._a)return x(e._a,e,n);let r=e._c;for(let e=0;e<r.length;e++)x(r[e],t);let o=e.onremove||e.remove;return"function"==typeof o?o.call(n,{type:"remove",parentStable:!!n},t,e):void 0}function T(t,n){let r=(null==n?t.length:n)-1;for(let e=r;e>=0;e--)if("number"!=typeof t[e]){let n=t[e];for(let o=e+1;o<=r;o++){if(n=n.childNodes[t[o]],u&&!n)throw new Error("invalid DOM path "+t);t[o]=n,d++}return n}return e}function E(e){let t=[];for(let n=e.target;n!==m;n=n.parentNode){let e=0;for(let t=n.previousSibling;t;t=t.previousSibling)e++;t.push(e)}let n,r=g,o=[],l=t.length;for(;;){for(;r._a;)n=r,r=r._a;if("kept"===r._t)break;if(o.push(r,n),--l<0){u&&o[o.length-2]._e!==e.target&&console.error("event tree resolve failed",e.target,o[o.length-2]._e,t);break}if(!0===r._leaf)return;r=r._c[t[l]]}let i=e.type,f="on"+e.type;a.log("glasgow event",i);let s=e.target,c=!1;for(let t=o.length-2;t>=0;t-=2){let n=o[t],r=n[f]||n[i];if("function"==typeof r){c=!0;let l=o[t+1];if(r.call(s,e,l,n)!==a.NOT_HANDLED){e.preventDefault(),e.stopPropagation();break}}s=s.parentNode}c&&S()}function M(e,t,n){let r="checkbox"===n.type?n.checked=this.checked:"number"===n.type?parseFloat(n.value=this.value):n.value=this.value;!function(e,t,n){let[r,o]=s(e,t);r[o]=n}(n.binding,t,r)}function $(e,t,n){b.push(e,t,n)}},a.NOT_HANDLED={},a.transition=function({element:e,from:t,to:n,time:r,easing:o,keep:l}){r=r||400,o=o||"ease-out";let i={};for(let n in t)i[n]=e.style[n],e.style[n]=t[n];return new Promise(function(t){setTimeout(function(){i.transition=e.style.transition,e.style.transition=`all ${o} ${r}ms`;for(let t in n)i.hasOwnProperty(t)||(i[t]=e.style[t]),e.style[t]="original"===n[t]?i[t]:n[t];setTimeout(function(){setTimeout(function(){for(let t in i)l&&"transition"!==t||(e.style[t]=i[t]);t()},r)},1)},0)})},a.fadeIn=function(e){if(e.parentStable)return a.transition({element:this,from:{marginTop:this.offsetHeight/-2+"px",marginBottom:this.offsetHeight/-2+"px",opacity:0,transform:"scaleY(0)"},to:{marginTop:getComputedStyle(this).getPropertyValue("margin-top"),marginBottom:getComputedStyle(this).getPropertyValue("margin-bottom"),opacity:1,transform:"scaleY(1)"},easing:"ease-out"})},a.fadeOut=function(e){if(e.parentStable)return a.transition({element:this,to:{marginTop:this.offsetHeight/-2+"px",marginBottom:this.offsetHeight/-2+"px",opacity:0,transform:"scaleY(0)"},keep:!0,easing:"ease-out"})},a.setDebug=function(e){u=0|e},a.refresh=d("refresh"),a.refreshNow=d("refreshNow"),a.refreshify=c,a.log=function(){console.log.apply(console,arguments)},i&&(a.fetch=a.refreshify(i))}]);