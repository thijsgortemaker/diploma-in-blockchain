/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/browser/index.jsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/glasgow/glasgow.js":
/*!*****************************************!*\
  !*** ./node_modules/glasgow/glasgow.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return glasgow; });\n// glasgow.js\n// (c) Frank van Viegen\n// MIT license\n\nconst NON_TOP_EMPTY_CHILDREN = [];\nconst NON_TOP_EMPTY_NODE = {_c: NON_TOP_EMPTY_CHILDREN};\nfor(let obj of [NON_TOP_EMPTY_CHILDREN, NON_TOP_EMPTY_NODE])\n\tObject.freeze(obj);\n\nconst NOT_HANDLED = {}; // constant that can be returned by event handlers\n\nlet instances = [];\n\nlet fetch = window.fetch ? window.fetch.bind(window) : null;\n\nlet debug = 1;\n\t// 0. production build\n\t// 1. extra checking, a lot slower!\n\t// 2. reserved\n\t// 3. same as 1 + glasgow.log every DOM update\n\n\nfunction glasgow(tag, props) {\n\tif (debug && typeof tag !== 'string' && typeof tag !== 'function') {\n\t\tthrow new Error(\"first parameter should be a tag string or a component function\");\n\t}\n\t\n\tif (props==null) props = {};\n\telse if (debug && Object.getPrototypeOf(props) !== Object.prototype) {\n\t\tthrow new Error(\"second parameter should be a plain javascript object or null\");\n\t}\n\n\tif (typeof tag === 'string') {\n\t\tlet pos = tag.indexOf('.');\n\t\tif (pos>=0) {\n\t\t\tprops.className = tag.substr(pos+1).replace(/\\./g, ' ');\n\t\t\ttag = tag.substr(0,pos) || 'div';\n\t\t}\n\t}\n\t\n\tprops._t = tag;\n\n\tvar children = props._c = [];\n\tfor(let i=2; i<arguments.length; i++) {\n\t\taddChild(children, arguments[i]);\n\t}\n\t\n\treturn props;\n};\n\nfunction addChild(children, child) {\n\tif (child == null) return; // null or undefined\n\tlet type = typeof child;\n\tif (type === 'object') {\n\t\tif (child instanceof Array) {\n\t\t\tfor(let j=0; j<child.length; j++) addChild(children, child[j]);\n\t\t\treturn;\n\t\t}\n\t\tlet tagType = typeof child._t;\n\t\tif (tagType === 'string' || tagType === 'function') return children.push(child);\n\t}\n\telse if (type === 'number') return children.push(''+child);\n\telse if (type === 'string') return children.push(child);\n\n\tthrow new Error(\"invalid child VDOM node: \"+JSON.stringify(child));\n}\n\n\nfunction propsEqual(p1,p2) {\n\tfor(let k in p1) {\n\t\tif (k[0]!=='_' && k[0]!=='$' && p1[k]!==p2[k]) return false;\n\t}\n\tfor(let k in p2) {\n\t\tif (k[0]!=='_' && k[0]!=='$' && !p1.hasOwnProperty(k)) return false;\n\t}\n\treturn true;\n}\n\n\nfunction resolveBinding(binding, props) {\n\tif (typeof binding === 'string') return [props,binding];\n\tfor(let i=0; i<binding.length-1; i++) {\n\t\tlet term = binding[i];\n\t\tprops = typeof term === 'object' ? term : (props[term] = props[term] || {});\n\t}\n\treturn [props, binding[binding.length-1]];\n}\n\nfunction writeBinding(binding, props, value) {\n\tlet [obj,key] = resolveBinding(binding, props);\n\tobj[key] = value;\n}\n\nfunction readBinding(binding, props) {\n\tlet [obj,key] = resolveBinding(binding, props);\n\treturn obj[key];\n}\n\nfunction refreshify(func) {\n\tlet refreshNow = this.refreshNow;\n\t\n\tfunction refreshEventResult (result) {\n\t\trefreshNow();\n\t\tif (result && typeof result.then === 'function') {\n\t\t\tresult.then(refreshEventResult);\n\t\t}\n\t\treturn result;\n\t}\n\n\treturn function() {\n\t\treturn refreshEventResult(func.apply(this, arguments));\n\t}\n}\n\n\n\nfunction mount(domParent, rootFunc, rootProps = {}) {\n\n\tlet treeRoot = {_t: rootFunc, _a: {_t: 'div', _c: []}};\n\tlet domRoot = document.createElement('div');\n\tdomParent.appendChild(domRoot);\n\n\tlet domReads, domWrites; // DOM operations counters\n\tlet newDelegatedEvents = {}, allDelegatedEvents = {}; // eg {'onclick' => true}\n\tlet afterRefreshArray = [];\n\n\tlet scheduled = 0;\n\tlet instance = {refresh, refreshNow, unmount, refreshify, getTree};\n\tif (fetch) instance.fetch = instance.refreshify(fetch);\n\n\tinstances.push(instance);\n\n\trefreshNow();\n\n\treturn instance;\n\n\tfunction materialize(newNode) {\n\t\tlet res = newNode._t(newNode, newNode._c);\n\t\tdelete newNode._c;\n\n\t\tlet arr = [];\n\t\taddChild(arr, res);\n\t\treturn arr.length===1 ? arr[0] : {_t:'div', _c: arr};\n\t}\n\n\tfunction create(newNode, props, parentStable) {\n\t\tif (typeof newNode === 'string') {\n\t\t\tdomWrites++;\n\t\t\tif (debug>=3) glasgow.log('glasgow update create TextNode', newNode);\n\t\t\treturn document.createTextNode(newNode);\n\t\t}\n\n\t\tlet tag = newNode._t;\n\t\tif (typeof tag === 'function') { // create a component\n\t\t\tnewNode._a = materialize(newNode);\n\t\t\treturn create(newNode._a, newNode, parentStable);\n\t\t}\n\t\tif (tag==='svg') newNode._svg = true;\n\t\t\n\t\tlet el = newNode._svg ? document.createElementNS(\"http://www.w3.org/2000/svg\", tag) : document.createElement(tag);\n\t\tdomWrites++;\n\t\tif (debug>=3) glasgow.log('glasgow update create', tag);\n\t\tlet func = newNode.oncreate || newNode.create;\n\t\tif (typeof func==='function') afterRefresh(func, el, [{type:'create', parentStable}, props, newNode]);\n\t\tpatch(newNode, NON_TOP_EMPTY_NODE, [el], props);\n\t\treturn el;\n\t}\n\t\n\tfunction canPatch(newNode, oldNode) {\n\t\tlet type = typeof newNode;\n\t\treturn type === typeof oldNode && (\n\t\t\t\t\t\t type==='string' || (\n\t\t\t\t\t\t\t newNode.key === oldNode.key &&\n\t\t\t\t\t\t\t newNode._t === oldNode._t\n\t\t\t\t\t\t )\n\t\t\t\t\t );\n\t}\n\t\n\tfunction patch(newNode, oldNode, domPath, context) {\n\t\tif (debug) {\n\t\t\tif (newNode._e) console.error('double patch', newNode, resolveDomPath(domPath));\n\t\t\tif (oldNode._e && oldNode._e !== resolveDomPath(domPath)) console.error('dom element not properly matched with old node', oldNode, resolveDomPath(domPath));\n\t\t}\n\n\t\tif (typeof newNode === 'string') {\n\t\t\tif (newNode !== oldNode) {\n\t\t\t\tresolveDomPath(domPath).textContent = newNode;\n\t\t\t\tdomWrites++;\n\t\t\t\tif (debug>=3) glasgow.log('glasgow update set TextNode', newNode);\n\t\t\t}\n\t\t\treturn newNode;\n\t\t}\n\n\t\tlet domPathPos = domPath.length;\n\n\t\tlet tag = newNode._t;\n\t\tif (typeof tag === 'function') { // a component\n\t\t\t// When the properties match, we will transfer state from the old component.\n\t\t\tif (oldNode._t && propsEqual(newNode,oldNode)) {\n\t\t\t\toldNode._c = newNode._c;\n\t\t\t\tnewNode = oldNode;\n\t\t\t}\n\n\t\t\tlet materialized = materialize(newNode);\n\t\t\n\t\t\tif (canPatch(materialized, oldNode._a)) {\n\t\t\t\tnewNode._a = patch(materialized, oldNode._a, domPath, newNode);\n\t\t\t} else {\n\t\t\t\t// the top-level tag or key for this component changed\n\t\t\t\tdestroy(oldNode._a, oldNode);\n\t\t\t\tnewNode._a = materialized;\n\n\t\t\t\tlet parentE = resolveDomPath(domPath, domPathPos-1);\n\t\t\t\tlet newE = create(materialized, newNode, true);\n\t\t\t\tlet oldE = resolveDomPath(domPath);\n\t\t\t\tparentE.replaceChild(newE, oldE);\n\n\t\t\t\tdomWrites++;\n\t\t\t\tif (debug>=3) glasgow.log('glasgow update replace child', resolveDomPath(domPath));\n\t\t\t\t\n\t\t\t\tif (oldE===domRoot) {\n\t\t\t\t\tif (debug) glasgow.log('replacing root element');\n\t\t\t\t\tdomRoot = domPath[0] = newE;\n\t\t\t\t\tnewDelegatedEvents = allDelegatedEvents;\n\t\t\t\t}\n\t\t\t}\n\t\t\treturn newNode;\n\t\t}\n\t\t\n\t\tif (debug) newNode._e = resolveDomPath(domPath);\n\t\t\n\t\tlet dom;\n\t\t\n\t\t// Now let's sync some children\n\t\tlet newChildren = newNode._c;\n\t\tlet oldChildren = oldNode._c; // === NON_TOP_EMPTY_CHILDREN when parent is newly create\n\n\t\t// SVG tag is propagated recursively\n\t\tconst svg = newNode._svg;\n\t\tif (svg) {\n\t\t\tfor(let child of newChildren) child._svg = true;\n\t\t}\n\t\n\t\t// First, we'll try to match the head and tail\n\t\tlet start, end, count = Math.min(newChildren.length, oldChildren.length);\n\n\t\tfor(start = 0; start < count && canPatch(newChildren[start], oldChildren[start]); start++) {\n\t\t\tdomPath[domPathPos] = start;\n\t\t\tnewChildren[start] = patch(newChildren[start], oldChildren[start], domPath, context);\n\t\t}\n\t\tcount -= start;\n\n\t\tlet newLast = newChildren.length - 1;\n\t\tlet oldLast = oldChildren.length - 1;\n\t\tfor(end = 0; end < count && canPatch(newChildren[newLast-end], oldChildren[oldLast-end]); end++) {\n\t\t\tdomPath[domPathPos] = oldLast-end;\n\t\t\tnewChildren[newLast-end] = patch(newChildren[newLast-end], oldChildren[oldLast-end], domPath, context);\n\t\t}\n\t\t\n\t\tif (end+start !== newChildren.length || newChildren.length !== oldChildren.length) {\n\t\t\t// We need to do some extra work to sort out the middle part.\n\n\t\t\tdom = dom || resolveDomPath(domPath, domPathPos);\n\n\t\t\t// For the middle range (that wasn't synced yet) in the old child list,\n\t\t\t// create an oldKeys index and an oldElements list of elements.\n\t\t\tlet oldKeys = {};\n\t\t\tlet oldElements = [];\n\t\t\tlet insertBeforeE = null;\n\t\t\tif (oldChildren.length > start) {\n\t\t\t\tdomPath[domPathPos] = start;\n\t\t\t\tinsertBeforeE = resolveDomPath(domPath);\n\t\t\t\tfor(let i=start; i<oldChildren.length-end; i++) {\n\t\t\t\t\tlet child = oldChildren[i];\n\t\t\t\t\tif (typeof child === 'object' && child.key) oldKeys[child.key] = i;\n\t\t\t\t\tif (debug && !insertBeforeE) throw new Error(\"element missing\");\n\t\t\t\t\toldElements.push(insertBeforeE); // at i-start\n\t\t\t\t\tinsertBeforeE = insertBeforeE.nextSibling;\n\t\t\t\t\tdomReads++;\n\t\t\t\t}\n\t\t\t}\n\n\n\t\t\tlet newKeys = {};\n\t\t\tfor(let i=start; i<newChildren.length-end; i++) {\n\t\t\t\tlet child = newChildren[i];\n\t\t\t\tif (typeof child === 'object' && child.key) newKeys[child.key] = i;\n\t\t\t}\n\n\t\t\t// Now for each item in the (yet unsynced) middle range of the new child\n\t\t\t// list, recycle (based on key) or create an element and insert/move it.\n\t\t\tlet keepAfterall = 0;\n\t\t\tremainingChildLoop:\n\t\t\tfor(let i=start; i<newChildren.length-end; i++) {\n\t\t\t\tlet childDom = undefined;\n\t\t\t\tlet newChild = newChildren[i];\n\t\t\t\tif (typeof newChild === 'object') {\n\t\t\t\t\tlet idx, newKey = newChild.key;\n\t\t\t\t\tif (newKey && (idx = oldKeys[newKey]) && canPatch(newChild, oldChildren[idx])) {\n\t\t\t\t\t\t// Okay, we can recycle a keyed object\n\t\t\t\t\t\tchildDom = oldElements[idx-start];\n\t\t\t\t\t\toldElements[idx-start] = undefined;\n\t\t\t\t\t\tnewChildren[i] = patch(newChild, oldChildren[idx], [childDom], context);\n\t\t\t\t\t}\n\t\t\t\t\telse if (!newKey || newKey[0]==='~') {\n\t\t\t\t\t\t// Scan for usable elements around this element\n\t\t\t\t\t\tlet endJ = Math.min(i+5, oldChildren.length)\n\t\t\t\t\t\tfor(let j=Math.max(i-5,0); j<endJ; j++) {\n\t\t\t\t\t\t\tlet oldChild = oldChildren[j];\n\t\t\t\t\t\t\tif (typeof oldChild === 'object' && oldChild._t === newChild._t && oldElements[j-start]) {\n\t\t\t\t\t\t\t\tlet oldKey = oldChild.key;\n\t\t\t\t\t\t\t\tif (!oldKey || (oldKey[0]==='~' && newKeys[oldKey]==null)) {\n\t\t\t\t\t\t\t\t\tchildDom = oldElements[j-start];\n\t\t\t\t\t\t\t\t\toldElements[j-start] = undefined;\n\t\t\t\t\t\t\t\t\tnewChildren[i] = patch(newChild, oldChild, [childDom], context);\n\t\t\t\t\t\t\t\t\tif (j===start+keepAfterall) {\n\t\t\t\t\t\t\t\t\t\tkeepAfterall++;\n\t\t\t\t\t\t\t\t\t\tcontinue remainingChildLoop;\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tif (!childDom) childDom = create(newChild, context, oldChildren!==NON_TOP_EMPTY_CHILDREN);\n\t\t\t\tdom.insertBefore(childDom, insertBeforeE);\n\t\t\t\tdomWrites++;\n\t\t\t\tif (debug>=3) glasgow.log('glasgow update insert node', childDom);\n\t\t\t}\n\n\t\t\t// Remove spurious elements from the DOM\n\t\t\tlet insertKept = start;\n\t\t\tfor(let i=0; i<oldElements.length; i++) {\n\t\t\t\tlet element = oldElements[i];\n\t\t\t\tif (element) {\n\t\t\t\t\tlet child = oldChildren[start+i];\n\t\t\t\t\tif (typeof child !== 'string') {\n\t\t\t\t\t\tif (child._t === 'kept') {\n\t\t\t\t\t\t\tnewChildren.splice(insertKept++, 0, child);\n\t\t\t\t\t\t\tcontinue;\n\t\t\t\t\t\t}\n\t\t\t\t\t\tlet res = destroy(child, context, element);\n\t\t\t\t\t\tif (res && typeof res.then === 'function') {\n\t\t\t\t\t\t\tlet kept = {_t: 'kept', _c: []};\n\t\t\t\t\t\t\tnewChildren.splice(insertKept++, 0, kept);\n\t\t\t\t\t\t\t(function(kept) {\n\t\t\t\t\t\t\t\tres.then(function() {\n\t\t\t\t\t\t\t\t\tkept._t = 'discard';\n\t\t\t\t\t\t\t\t\tinstance.refreshNow();\n\t\t\t\t\t\t\t\t});\n\t\t\t\t\t\t\t})(kept);\n\t\t\t\t\t\t\tcontinue;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tdom.removeChild(element);\n\t\t\t\t\tdomWrites++;\n\t\t\t\t\tif (debug>=3) glasgow.log('glasgow update remove element', element);\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\tdomPath.length = domPathPos;\n\t\t\n\t\t\n\t\t// That's it for the children. And now for the properties!\n\t\tif (newNode.binding) bind(newNode, context);\n\t\t\n\t\tfor(let prop in newNode) {\n\t\t\tif (prop==='key' || prop==='binding' || prop[0]==='_') continue;\n\t\t\t\n\t\t\tlet newVal = newNode[prop];\n\t\t\tif (typeof newVal === 'function') {\n\t\t\t\tif (prop.substr(0,2)==='on') prop = prop.substr(2);\n\t\t\t\tif (!allDelegatedEvents[prop]) {\n\t\t\t\t\tif (debug) glasgow.log('glasgow delegating event type', prop);\n\t\t\t\t\tnewDelegatedEvents[prop] = allDelegatedEvents[prop] = true;\n\t\t\t\t}\n\t\t\t\tcontinue;\n\t\t\t}\n\t\t\t\n\t\t\tlet oldVal = oldNode[prop];\n\t\t\tif (newVal === oldVal) continue;\n\t\t\tif (newVal == null) {\n\t\t\t\tif (oldVal == null) continue;\n\t\t\t\tnewVal = '';\n\t\t\t}\n\n\t\t\tdom = dom || resolveDomPath(domPath);\n\t\t\tif (prop === 'checked' || prop === 'value' || prop === 'className' || prop === 'selectedIndex' || prop === 'disabled') {\n\t\t\t\tdom[prop] = newVal;\n\t\t\t} else if (prop === 'style' && typeof newVal === 'object') {\n\t\t\t\tif (oldVal) dom.style = '';\n\t\t\t\tObject.assign(dom.style, newVal);\n\t\t\t} else if (svg) {\n\t\t\t\tdom.setAttributeNS(null, prop, newVal);\n\t\t\t} else {\n\t\t\t\tdom.setAttribute(prop, newVal);\n\t\t\t}\n\t\t\tdomWrites++;\n\t\t\tif (debug>=3) glasgow.log('glasgow update set attribute', prop, newVal);\n\t\t}\n\n\t\tfor(let key in oldNode) {\n\t\t\tif (key[0]==='_' || typeof oldNode[key]==='function') continue;\n\t\t\tif (newNode.hasOwnProperty(key)) continue;\n\t\t\tdom = dom || resolveDomPath(domPath);\t \n\t\t\tif (key === 'style' || key === 'checked' || key === 'value' || key === 'className') {\n\t\t\t\tdom[key] = '';\n\t\t\t} else {\n\t\t\t\tdom.removeAttribute(key);\n\t\t\t}\n\t\t\tdomWrites++;\n\t\t\tif (debug>=3) glasgow.log('glasgow update unset attribute', key);\n\t\t}\n\n\t\tlet func = newNode.onrefresh || newNode.refresh;\n\t\tif (typeof func==='function') afterRefresh(func, resolveDomPath(domPath), [{type:\"refresh\"}, context, newNode]);\n\t\t\n\t\treturn newNode;\n\t}\n\t\n\t\n\tfunction refresh() {\n\t\tif (debug && scheduled<0) console.warn(\"refresh triggered during refresh\");\n\t\tif (scheduled<1) scheduled = setTimeout(refreshNow, 0);\n\t}\n\n\tfunction refreshNow() {\n\t\tif (debug && scheduled < 0) console.error(\"recursive invocation?\");\n\t\tscheduled = -1;\n\n\t\tlet oldTree = treeRoot;\n\t\ttreeRoot = glasgow(rootFunc, rootProps);\n\t\t\n\t\tdomReads = domWrites = 0;\n\t\tlet startTime = new Date();\n\n\t\tif (debug && !canPatch(treeRoot, oldTree)) console.error(\"root cannot be patched\", treeRoot, oldTree);\n\t\ttreeRoot = patch(treeRoot, oldTree, [domRoot]);\n\n\t\tfor(let prop in newDelegatedEvents) {\n\t\t\tdomRoot.addEventListener(prop, delegator);\n\t\t\tdomWrites++;\n\t\t\tif (debug>=3) glasgow.log('glasgow update add event listener', prop);\n\t\t}\n\t\tnewDelegatedEvents = {};\n\n\t\tglasgow.log('glasgow refreshed in', new Date() - startTime, 'ms, using', domWrites, 'DOM updates and', domReads, 'DOM reads'+(debug ? \" [use glasgow.setDebug(0) if you're interested in speed]\" : \"\"));\n\t\t\n\t\tfor(let i=0; i<afterRefreshArray.length; i+=3) {\n\t\t\tafterRefreshArray[i].apply(afterRefreshArray[i+1], afterRefreshArray[i+2]);\n\t\t}\n\t\tafterRefreshArray.length = 0;\n\n\t\tif (scheduled===-1) scheduled = 0;\n\t}\n\t\n\t\t\t\t\t\n\tfunction unmount() {\n\t\tlet pos = instances.indexOf(this);\n\t\tif (pos<0) throw new Error(\"not mountesd\");\n\t\tinstances.splice(pos,1);\n\t\tdestroy(treeRoot, {}, domRoot);\n\t\tdomParent.removeChild(domRoot);\n\t}\n\t\n\tfunction destroy(node, props, element) {\n\t\tif (typeof node === 'string') return;\n\t\tif (node._a) return destroy(node._a, node, element);\n\t\tlet children = node._c;\n\t\tfor(let i = 0; i < children.length; i++) {\n\t\t\tdestroy(children[i], props);\n\t\t}\n\t\tlet func = node.onremove || node.remove;\n\t\tif (typeof func==='function') return func.call(element, {type: \"remove\", parentStable: !!element}, props, node);\n\t}\n\t\n\tfunction resolveDomPath(path,limit) {\n\t\tlet max = (limit==null ? path.length : limit) - 1;\n\t\tfor(let i = max; i>=0; i--) {\n\t\t\tif (typeof path[i] !== 'number') {\n\t\t\t\t// we found a dom element!\n\t\t\t\tlet el = path[i];\n\t\t\t\tfor(let j=i+1; j<=max; j++) {\n\t\t\t\t\tel = el.childNodes[path[j]];\n\t\t\t\t\tif (debug && !el) throw new Error('invalid DOM path '+path);\n\t\t\t\t\tpath[j] = el;\n\t\t\t\t\tdomReads++;\n\t\t\t\t}\n\t\t\t\treturn el;\n\t\t\t}\n\t\t}\n\t\t// limit === 0, we want the parent element\n\t\treturn domParent;\n\t}\n\t\n\t\n\tfunction delegator(event) {\n\t\tlet indexes = [];\n\t\t\n\t\t// indexes = [0,3,5] means that the event was fired on the 1st element, from the\n\t\t// 4th elements from the 6th element in domRoot.\n\t\tfor (let element = event.target; element !== domRoot; element = element.parentNode) {\n\t\t\tlet i = 0;\n\t\t\tfor( let e = element.previousSibling; e; e = e.previousSibling) i++;\n\t\t\tindexes.push(i);\n\t\t}\n\n\t\tlet tree = treeRoot, context;\n\t\tlet treeArray = [];\n\t\tlet i = indexes.length;\n\t\twhile(true) {\n\t\t\twhile(tree._a) {\n\t\t\t\tcontext = tree;\n\t\t\t\ttree = tree._a;\n\t\t\t}\n\t\t\tif (tree._t==='kept') break; // not really part of the virtual DOM anymore\n\t\t\ttreeArray.push(tree, context);\n\t\t\tif (--i < 0) {\n\t\t\t\tif (debug && treeArray[treeArray.length-2]._e !== event.target) console.error(\"event tree resolve failed\", event.target, treeArray[treeArray.length-2]._e, indexes);\n\t\t\t\tbreak;\n\t\t\t}\n\t\t\tif (tree._leaf===true) return;\n\t\t\ttree = tree._c[indexes[i]];\n\t\t}\n\t\t\n\n\t\tlet type = event.type;\n\t\tlet ontype = 'on'+event.type;\n\t\tglasgow.log('glasgow event', type);\n\t\t\n\t\tlet element = event.target;\n\t\tlet doRefresh = false;\n\t\tfor (let i = treeArray.length-2; i >= 0; i-=2) {\n\t\t\tlet node = treeArray[i];\n\t\t\tlet func = node[ontype] || node[type];\n\t\t\tif (typeof func==='function') {\n\t\t\t\tdoRefresh = true;\n\t\t\t\tlet props = treeArray[i+1];\n\t\t\t\tlet res = func.call(element, event, props, node);\n\t\t\t\tif (res !== glasgow.NOT_HANDLED) {\n\t\t\t\t\tevent.preventDefault();\n\t\t\t\t\tevent.stopPropagation();\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\t\t\t}\n\t\t\telement = element.parentNode;\n\t\t}\n\t\tif (doRefresh) refreshNow();\n\t}\n\t\n\tfunction bindingEventHandler(event, props, node) {\n\t\tlet val = (node.type === 'checkbox') ? (node.checked = this.checked) :\n\t\t\t\t\t\t\t(node.type === 'number') ? parseFloat(node.value = this.value) :\n\t\t\t\t\t\t\t(node.value = this.value);\n\t\twriteBinding(node.binding, props, val);\n\t}\n\t\n\tfunction bind(node, props) {\n\t\tlet val = readBinding(node.binding, props);\n\t\tif (node.type === 'checkbox') node.checked = !!val;\n\t\telse node.value = val==null ? \"\" : \"\"+val;\n\t\tnode.oninput = bindingEventHandler;\n\t}\n\t\n\tfunction getTree() {\n\t\treturn treeRoot;\n\t}\n\t\n\t// Called when we're done updating the DOM\n\tfunction afterRefresh(func, self, args) {\n\t\tafterRefreshArray.push(func, self, args);\n\t}\n\t\n}\n\nfunction fadeOut(event) {\n\tif (event.parentStable) return glasgow.transition({\n\t\telement: this,\n\t\tto: {\n\t\t\tmarginTop: (this.offsetHeight / -2) + 'px',\n\t\t\tmarginBottom: (this.offsetHeight / -2) + 'px',\n\t\t\topacity: 0,\n\t\t\ttransform: \"scaleY(0)\"\n\t\t},\n\t\tkeep: true,\n\t\teasing: 'ease-out'\n\t});\n}\n\nfunction fadeIn(event) {\n\tif (event.parentStable) return glasgow.transition({\n\t\telement: this,\n\t\tfrom: {\n\t\t\tmarginTop: (this.offsetHeight / -2) + 'px',\n\t\t\tmarginBottom: (this.offsetHeight / -2) + 'px',\n\t\t\topacity: 0,\n\t\t\ttransform: \"scaleY(0)\"\n\t\t},\n\t\tto: {\n\t\t\tmarginTop: getComputedStyle(this).getPropertyValue('margin-top'),\n\t\t\tmarginBottom: getComputedStyle(this).getPropertyValue('margin-bottom'),\n\t\t\topacity: 1,\n\t\t\ttransform: \"scaleY(1)\"\n\t\t},\n\t\teasing: 'ease-out'\n\t});\n}\n\nfunction transition({element, from, to, time, easing, keep}) {\n\ttime = time || 400;\n\teasing = easing || 'ease-out';\n\n\tlet original = {};\n\tfor(let k in from) {\n\t\toriginal[k] = element.style[k];\n\t\telement.style[k] = from[k];\n\t}\n\n\treturn new Promise(function(accept) {\n\t\tsetTimeout(function() {\n\t\t\toriginal.transition = element.style.transition;\n\t\t\telement.style.transition = `all ${easing} ${time}ms`;\n\t\t\tfor(let k in to) {\n\t\t\t\tif (!original.hasOwnProperty(k)) original[k] = element.style[k];\n\t\t\t\telement.style[k] = to[k]==='original' ? original[k] : to[k];\n\t\t\t}\n\t\t\tsetTimeout(function() {\n\t\t\t\t// The extra timeout is to start this timer after the transition has actually started.\n\t\t\t\tsetTimeout(function() {\n\t\t\t\t\tfor(let k in original) {\n\t\t\t\t\t\tif (!keep || k==='transition') element.style[k] = original[k];\n\t\t\t\t\t}\n\t\t\t\t\taccept();\n\t\t\t\t}, time);\n\t\t\t}, 1);\n\t\t}, 0);\n\t});\n}\n\nfunction setDebug(_debug) {\n\tdebug = 0|_debug;\n}\n\nfunction getInstancesCaller(method) {\n\treturn function() {\n\t\tfor(let instance of instances) {\n\t\t\tinstance[method].apply(instance, arguments);\n\t\t}\n\t}\n}\n\nglasgow.mount = mount;\nglasgow.NOT_HANDLED = NOT_HANDLED;\nglasgow.transition = transition;\nglasgow.fadeIn = fadeIn;\nglasgow.fadeOut = fadeOut;\nglasgow.setDebug = setDebug;\nglasgow.refresh = getInstancesCaller('refresh');\nglasgow.refreshNow = getInstancesCaller('refreshNow');\nglasgow.refreshify = refreshify;\nglasgow.log = function() { // ment to be overridden\n\tconsole.log.apply(console, arguments);\n};\nif (fetch) glasgow.fetch = glasgow.refreshify(fetch);\n\n\n\n//# sourceURL=webpack:///./node_modules/glasgow/glasgow.js?");

/***/ }),

/***/ "./src/browser/index.jsx":
/*!*******************************!*\
  !*** ./src/browser/index.jsx ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _glasgow = __webpack_require__(/*! glasgow */ \"./node_modules/glasgow/glasgow.js\");\n\nvar _glasgow2 = _interopRequireDefault(_glasgow);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n//main programma \n_glasgow2.default.setDebug(1); /** @jsx glasgow */\n\n// Glasgow documentation: https://github.com/vanviegen/glasgow\n\nvar mount = _glasgow2.default.mount(document.body, logInPage);\nvar token = void 0;\n\nwindow.onbeforeunload = closingCode;\nfunction closingCode() {\n    HTTPrequest('POST', '/api/logOut', {}, function (body) {\n        if (body.err) {} else {\n            token = undefined;\n            mount = _glasgow2.default.mount(document.body, logInPage);\n        }\n    });\n}\n\nfunction doLoginRequest(event, props) {\n    HTTPrequest('POST', '/api/wallet-log-in', { username: props.$username, password: props.$password }, function (body) {\n        if (body.err) {\n            var errorElement = document.getElementById(\"inlogSchermError\");\n            errorElement.hidden = false;\n            errorElement.firstChild.innerHTML = body.err;\n        } else {\n            token = body.token;\n            gotoPage(null, { $pageNumber: 1 });\n        }\n    });\n}\n\nfunction doRegisterRequest(event, props) {\n    HTTPrequest('POST', '/api/wallet-register', { username: props.$username, password: props.$password }, function (body) {\n        if (body.err) {\n            var errorElement = document.getElementById(\"inlogSchermError\");\n            errorElement.hidden = false;\n            errorElement.firstChild.innerHTML = body.err;\n        } else {\n            token = body.token;\n            gotoPage(null, { $pageNumber: 2 });\n        }\n    });\n}\n\nfunction sendConnectieRequest(event, props) {\n    HTTPrequest('POST', '/api/sendreq', { naam: props.$naam, studentNummer: props.$studentNummer }, function (body) {\n        if (body.err) {} else {\n            gotoPage(null, { $pageNumber: 2 });\n            showSnackBarMessage(\"succes\");\n        }\n    });\n}\n\nfunction getAllCredentials(event, props) {\n    console.log(\"hallo\");\n    HTTPrequest('GET', '/api/credentials', {}, function (body) {\n        if (body.err) {} else {\n            mount = _glasgow2.default.mount(document.body, myCredentialsPage, body);\n        }\n    });\n}\n\nfunction doOffersRequest(event, props) {\n    HTTPrequest('GET', '/api/get-all-offers', {}, function (body) {\n        if (body.err) {} else {\n            mount = _glasgow2.default.mount(document.body, offersPage, body);\n        }\n    });\n}\n\nfunction accepteerCredOffer(event, props) {\n    console.log(event);\n\n    HTTPrequest('POST', '/api/accept-cred-offer', { id: props.offer.id }, function (body) {\n        if (body.err) {} else {\n            gotoPage(null, { $pageNumber: 3 });\n        }\n    });\n}\n\nfunction gotoPage(event, props, node) {\n    var page = void 0;\n\n    if (props.$pageNumber) {\n        page = props.$pageNumber;\n    } else {\n        page = node.value;\n    }\n\n    mount.unmount();\n\n    if (page == 0) {\n        mount = _glasgow2.default.mount(document.body, logInPage);\n    } else if (page == 1) {\n        getAllCredentials();\n    } else if (page == 2) {\n        mount = _glasgow2.default.mount(document.body, connRequestPage);\n    } else if (page == 3) {\n        doOffersRequest();\n    } else if (page == 4) {\n        closingCode();\n    } else if (page == 5) {\n        mount = _glasgow2.default.mount(document.body, registerPage);\n    }\n}\n\nfunction connRequestPage() {\n    return (0, _glasgow2.default)(\n        'main',\n        null,\n        navigationBar(),\n        (0, _glasgow2.default)(\n            'span',\n            null,\n            'Doe connectie request naar saxion'\n        ),\n        (0, _glasgow2.default)('br', null),\n        (0, _glasgow2.default)(\n            'span',\n            null,\n            'Enter naam:'\n        ),\n        ' ',\n        (0, _glasgow2.default)('input', { type: 'text', binding: '$naam' }),\n        (0, _glasgow2.default)('br', null),\n        (0, _glasgow2.default)(\n            'span',\n            null,\n            'Enter studentnummer:'\n        ),\n        ' ',\n        (0, _glasgow2.default)('input', { type: 'text', binding: '$studentNummer' }),\n        (0, _glasgow2.default)('br', null),\n        (0, _glasgow2.default)('input', { type: 'submit', value: 'stuur connectie request', onclick: sendConnectieRequest }),\n        (0, _glasgow2.default)('br', null)\n    );\n}\n\nfunction myCredentialsPage(props) {\n    var creds = props.success;\n\n    return (0, _glasgow2.default)(\n        'main',\n        null,\n        navigationBar(),\n        (0, _glasgow2.default)(\n            'div',\n            { id: 'credentials-list' },\n            creds.map(function (cred) {\n                return (0, _glasgow2.default)(ACredential, { cred: cred });\n            })\n        )\n    );\n}\n\n/**\r\n * Element for a single credential.\r\n */\nfunction ACredential(props) {\n    console.log(props);\n\n    return (0, _glasgow2.default)(\n        'div',\n        { 'class': 'credential' },\n        (0, _glasgow2.default)(\n            'h4',\n            null,\n            'Credential'\n        ),\n        (0, _glasgow2.default)(\n            'p',\n            null,\n            'Issued By: Saxion'\n        ),\n        (0, _glasgow2.default)(\n            'p',\n            null,\n            'Extra info: ',\n            JSON.stringify(props.cred)\n        )\n    );\n}\n\nfunction logInPage() {\n    return (0, _glasgow2.default)(\n        'div',\n        { 'class': 'log-in-prompt' },\n        (0, _glasgow2.default)(\n            'h1',\n            null,\n            'Cloud Agent Log-in'\n        ),\n        (0, _glasgow2.default)(\n            'div',\n            { id: 'inlogSchermError', hidden: true },\n            (0, _glasgow2.default)(\n                'span',\n                null,\n                'Vervang dit met een error'\n            ),\n            (0, _glasgow2.default)('br', null)\n        ),\n        (0, _glasgow2.default)('input', { placeholder: 'Username', type: 'text', binding: '$username' }),\n        (0, _glasgow2.default)('br', null),\n        (0, _glasgow2.default)('input', { placeholder: 'Password', type: 'password', binding: '$password' }),\n        (0, _glasgow2.default)('br', null),\n        (0, _glasgow2.default)(\n            'p',\n            { value: '5', onclick: gotoPage },\n            'Register'\n        ),\n        (0, _glasgow2.default)('input', { type: 'submit', value: 'Log in', onclick: doLoginRequest })\n    );\n}\n\nfunction registerPage() {\n    return (0, _glasgow2.default)(\n        'div',\n        { 'class': 'log-in-prompt' },\n        (0, _glasgow2.default)(\n            'h1',\n            null,\n            'Cloud Agent Register'\n        ),\n        (0, _glasgow2.default)(\n            'div',\n            { id: 'inlogSchermError', hidden: true },\n            (0, _glasgow2.default)(\n                'span',\n                null,\n                'Vervang dit met een error'\n            ),\n            (0, _glasgow2.default)('br', null)\n        ),\n        (0, _glasgow2.default)('input', { placeholder: 'Username', type: 'text', binding: '$username' }),\n        (0, _glasgow2.default)('br', null),\n        (0, _glasgow2.default)('input', { placeholder: 'Password', type: 'password', binding: '$password' }),\n        (0, _glasgow2.default)('br', null),\n        (0, _glasgow2.default)('input', { type: 'submit', value: 'Submit!', onclick: doRegisterRequest })\n    );\n}\n\nfunction offersPage(props) {\n    var offers = props.success;\n\n    return (0, _glasgow2.default)(\n        'main',\n        null,\n        navigationBar(),\n        (0, _glasgow2.default)(\n            'h3',\n            null,\n            'Incoming offers: '\n        ),\n        offers.map(function (offer) {\n            return (0, _glasgow2.default)(IncomingOffer, { offer: offer });\n        })\n    );\n}\n\nfunction navigationBar() {\n    return (0, _glasgow2.default)(\n        'div',\n        { 'class': 'navbar' },\n        (0, _glasgow2.default)(\n            'ul',\n            null,\n            (0, _glasgow2.default)(\n                'li',\n                { id: 'logo-ting' },\n                'Saxion'\n            ),\n            (0, _glasgow2.default)(\n                'li',\n                { value: '1', onclick: gotoPage },\n                'My Credentials'\n            ),\n            (0, _glasgow2.default)(\n                'li',\n                { value: '2', onclick: gotoPage },\n                'Make a Request'\n            ),\n            (0, _glasgow2.default)(\n                'li',\n                { value: '3', onclick: gotoPage },\n                'Offers'\n            ),\n            (0, _glasgow2.default)(\n                'li',\n                { value: '4', onclick: gotoPage },\n                'Log out'\n            )\n        )\n    );\n}\n\n/**\r\n * Element for a single offer.\r\n */\nfunction IncomingOffer(props) {\n    var offer = props.offer;\n\n    return (0, _glasgow2.default)(\n        'div',\n        { 'class': 'incoming-offer' },\n        (0, _glasgow2.default)(\n            'p',\n            null,\n            'Offer'\n        ),\n        (0, _glasgow2.default)(\n            'p',\n            null,\n            'From: Saxion'\n        ),\n        (0, _glasgow2.default)(\n            'p',\n            null,\n            'Vak: ',\n            offer.vak\n        ),\n        (0, _glasgow2.default)(\n            'div',\n            { id: 'buttons' },\n            (0, _glasgow2.default)('input', { type: 'submit', value: 'accepteer', onclick: accepteerCredOffer }),\n            (0, _glasgow2.default)(\n                'button',\n                { id: 'decline-offer' },\n                'Decline'\n            )\n        )\n    );\n}\n\n//standaard methode om requesten te doen naar de server.\nfunction HTTPrequest(method, url, body, cb) {\n    var xhr = new XMLHttpRequest();\n\n    xhr.onreadystatechange = function () {\n        if (xhr.readyState === XMLHttpRequest.DONE) {\n            if (xhr.status < 500) {\n                //wanneer succesvol roep de callback aan\n                cb(JSON.parse(xhr.responseText));\n            } else if (xhr.status >= 500) {\n                console.log(body);\n            }\n        }\n    };\n\n    xhr.open(method, url, true);\n\n    if (token) {\n        xhr.setRequestHeader(\"Authorization\", token);\n    }\n\n    if (body != null) {\n        xhr.setRequestHeader(\"Content-Type\", \"application/json\");\n    }\n\n    xhr.send(JSON.stringify(body));\n}\n\nfunction showSnackBarMessage(message) {\n    var x = document.getElementById(\"snackbar\");\n    x.innerHTML = message;\n    x.className = \"show\";\n    setTimeout(function () {\n        x.className = x.className.replace(\"show\", \"\");\n    }, 3000);\n}\n\n//# sourceURL=webpack:///./src/browser/index.jsx?");

/***/ })

/******/ });