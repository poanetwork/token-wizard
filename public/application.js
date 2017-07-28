/*! jQuery v2.2.4 | (c) jQuery Foundation | jquery.org/license */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=a.document,e=c.slice,f=c.concat,g=c.push,h=c.indexOf,i={},j=i.toString,k=i.hasOwnProperty,l={},m="2.2.4",n=function(a,b){return new n.fn.init(a,b)},o=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,p=/^-ms-/,q=/-([\da-z])/gi,r=function(a,b){return b.toUpperCase()};n.fn=n.prototype={jquery:m,constructor:n,selector:"",length:0,toArray:function(){return e.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:e.call(this)},pushStack:function(a){var b=n.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a){return n.each(this,a)},map:function(a){return this.pushStack(n.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(e.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor()},push:g,sort:c.sort,splice:c.splice},n.extend=n.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||n.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(n.isPlainObject(d)||(e=n.isArray(d)))?(e?(e=!1,f=c&&n.isArray(c)?c:[]):f=c&&n.isPlainObject(c)?c:{},g[b]=n.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},n.extend({expando:"jQuery"+(m+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===n.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){var b=a&&a.toString();return!n.isArray(a)&&b-parseFloat(b)+1>=0},isPlainObject:function(a){var b;if("object"!==n.type(a)||a.nodeType||n.isWindow(a))return!1;if(a.constructor&&!k.call(a,"constructor")&&!k.call(a.constructor.prototype||{},"isPrototypeOf"))return!1;for(b in a);return void 0===b||k.call(a,b)},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?i[j.call(a)]||"object":typeof a},globalEval:function(a){var b,c=eval;a=n.trim(a),a&&(1===a.indexOf("use strict")?(b=d.createElement("script"),b.text=a,d.head.appendChild(b).parentNode.removeChild(b)):c(a))},camelCase:function(a){return a.replace(p,"ms-").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b){var c,d=0;if(s(a)){for(c=a.length;c>d;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(o,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?n.merge(c,"string"==typeof a?[a]:a):g.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:h.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;c>d;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,g=0,h=[];if(s(a))for(d=a.length;d>g;g++)e=b(a[g],g,c),null!=e&&h.push(e);else for(g in a)e=b(a[g],g,c),null!=e&&h.push(e);return f.apply([],h)},guid:1,proxy:function(a,b){var c,d,f;return"string"==typeof b&&(c=a[b],b=a,a=c),n.isFunction(a)?(d=e.call(arguments,2),f=function(){return a.apply(b||this,d.concat(e.call(arguments)))},f.guid=a.guid=a.guid||n.guid++,f):void 0},now:Date.now,support:l}),"function"==typeof Symbol&&(n.fn[Symbol.iterator]=c[Symbol.iterator]),n.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(a,b){i["[object "+b+"]"]=b.toLowerCase()});function s(a){var b=!!a&&"length"in a&&a.length,c=n.type(a);return"function"===c||n.isWindow(a)?!1:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ga(),z=ga(),A=ga(),B=function(a,b){return a===b&&(l=!0),0},C=1<<31,D={}.hasOwnProperty,E=[],F=E.pop,G=E.push,H=E.push,I=E.slice,J=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},K="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",L="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",N="\\["+L+"*("+M+")(?:"+L+"*([*^$|!~]?=)"+L+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+M+"))|)"+L+"*\\]",O=":("+M+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+N+")*)|.*)\\)|)",P=new RegExp(L+"+","g"),Q=new RegExp("^"+L+"+|((?:^|[^\\\\])(?:\\\\.)*)"+L+"+$","g"),R=new RegExp("^"+L+"*,"+L+"*"),S=new RegExp("^"+L+"*([>+~]|"+L+")"+L+"*"),T=new RegExp("="+L+"*([^\\]'\"]*?)"+L+"*\\]","g"),U=new RegExp(O),V=new RegExp("^"+M+"$"),W={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),TAG:new RegExp("^("+M+"|[*])"),ATTR:new RegExp("^"+N),PSEUDO:new RegExp("^"+O),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+L+"*(even|odd|(([+-]|)(\\d*)n|)"+L+"*(?:([+-]|)"+L+"*(\\d+)|))"+L+"*\\)|)","i"),bool:new RegExp("^(?:"+K+")$","i"),needsContext:new RegExp("^"+L+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+L+"*((?:-\\d)?\\d*)"+L+"*\\)|)(?=[^-]|$)","i")},X=/^(?:input|select|textarea|button)$/i,Y=/^h\d$/i,Z=/^[^{]+\{\s*\[native \w/,$=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,_=/[+~]/,aa=/'|\\/g,ba=new RegExp("\\\\([\\da-f]{1,6}"+L+"?|("+L+")|.)","ig"),ca=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},da=function(){m()};try{H.apply(E=I.call(v.childNodes),v.childNodes),E[v.childNodes.length].nodeType}catch(ea){H={apply:E.length?function(a,b){G.apply(a,I.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function fa(a,b,d,e){var f,h,j,k,l,o,r,s,w=b&&b.ownerDocument,x=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==x&&9!==x&&11!==x)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==x&&(o=$.exec(a)))if(f=o[1]){if(9===x){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(w&&(j=w.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(o[2])return H.apply(d,b.getElementsByTagName(a)),d;if((f=o[3])&&c.getElementsByClassName&&b.getElementsByClassName)return H.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==x)w=b,s=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(aa,"\\$&"):b.setAttribute("id",k=u),r=g(a),h=r.length,l=V.test(k)?"#"+k:"[id='"+k+"']";while(h--)r[h]=l+" "+qa(r[h]);s=r.join(","),w=_.test(a)&&oa(b.parentNode)||b}if(s)try{return H.apply(d,w.querySelectorAll(s)),d}catch(y){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(Q,"$1"),b,d,e)}function ga(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ha(a){return a[u]=!0,a}function ia(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ja(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function ka(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||C)-(~a.sourceIndex||C);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function la(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function na(a){return ha(function(b){return b=+b,ha(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function oa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=fa.support={},f=fa.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=fa.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ia(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ia(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Z.test(n.getElementsByClassName),c.getById=ia(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}},d.filter.ID=function(a){var b=a.replace(ba,ca);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(ba,ca);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return"undefined"!=typeof b.getElementsByClassName&&p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=Z.test(n.querySelectorAll))&&(ia(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+L+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+L+"*(?:value|"+K+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ia(function(a){var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+L+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Z.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ia(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",O)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Z.test(o.compareDocumentPosition),t=b||Z.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?J(k,a)-J(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?J(k,a)-J(k,b):0;if(e===f)return ka(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?ka(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},fa.matches=function(a,b){return fa(a,null,null,b)},fa.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(T,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return fa(b,n,null,[a]).length>0},fa.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},fa.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&D.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},fa.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},fa.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=fa.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=fa.selectors={cacheLength:50,createPseudo:ha,match:W,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(ba,ca),a[3]=(a[3]||a[4]||a[5]||"").replace(ba,ca),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||fa.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&fa.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return W.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&U.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(ba,ca).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+L+")"+a+"("+L+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=fa.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(P," ")+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||fa.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ha(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=J(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ha(function(a){var b=[],c=[],d=h(a.replace(Q,"$1"));return d[u]?ha(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ha(function(a){return function(b){return fa(a,b).length>0}}),contains:ha(function(a){return a=a.replace(ba,ca),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ha(function(a){return V.test(a||"")||fa.error("unsupported lang: "+a),a=a.replace(ba,ca).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Y.test(a.nodeName)},input:function(a){return X.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:na(function(){return[0]}),last:na(function(a,b){return[b-1]}),eq:na(function(a,b,c){return[0>c?c+b:c]}),even:na(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:na(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:na(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:na(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=la(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=ma(b);function pa(){}pa.prototype=d.filters=d.pseudos,d.setFilters=new pa,g=fa.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){c&&!(e=R.exec(h))||(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=S.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(Q," ")}),h=h.slice(c.length));for(g in d.filter)!(e=W[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?fa.error(a):z(a,i).slice(0)};function qa(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function ra(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j,k=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(j=b[u]||(b[u]={}),i=j[b.uniqueID]||(j[b.uniqueID]={}),(h=i[d])&&h[0]===w&&h[1]===f)return k[2]=h[2];if(i[d]=k,k[2]=a(b,c,g))return!0}}}function sa(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function ta(a,b,c){for(var d=0,e=b.length;e>d;d++)fa(a,b[d],c);return c}function ua(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(c&&!c(f,d,e)||(g.push(f),j&&b.push(h)));return g}function va(a,b,c,d,e,f){return d&&!d[u]&&(d=va(d)),e&&!e[u]&&(e=va(e,f)),ha(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||ta(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:ua(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=ua(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?J(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=ua(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):H.apply(g,r)})}function wa(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ra(function(a){return a===b},h,!0),l=ra(function(a){return J(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];f>i;i++)if(c=d.relative[a[i].type])m=[ra(sa(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return va(i>1&&sa(m),i>1&&qa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(Q,"$1"),c,e>i&&wa(a.slice(i,e)),f>e&&wa(a=a.slice(e)),f>e&&qa(a))}m.push(c)}return sa(m)}function xa(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=F.call(i));u=ua(u)}H.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&fa.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ha(f):f}return h=fa.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=wa(b[c]),f[u]?d.push(f):e.push(f);f=A(a,xa(e,d)),f.selector=a}return f},i=fa.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(ba,ca),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=W.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(ba,ca),_.test(j[0].type)&&oa(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&qa(j),!a)return H.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,!b||_.test(a)&&oa(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ia(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),ia(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ja("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ia(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ja("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),ia(function(a){return null==a.getAttribute("disabled")})||ja(K,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),fa}(a);n.find=t,n.expr=t.selectors,n.expr[":"]=n.expr.pseudos,n.uniqueSort=n.unique=t.uniqueSort,n.text=t.getText,n.isXMLDoc=t.isXML,n.contains=t.contains;var u=function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&n(a).is(c))break;d.push(a)}return d},v=function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c},w=n.expr.match.needsContext,x=/^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,y=/^.[^:#\[\.,]*$/;function z(a,b,c){if(n.isFunction(b))return n.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return n.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(y.test(b))return n.filter(b,a,c);b=n.filter(b,a)}return n.grep(a,function(a){return h.call(b,a)>-1!==c})}n.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?n.find.matchesSelector(d,a)?[d]:[]:n.find.matches(a,n.grep(b,function(a){return 1===a.nodeType}))},n.fn.extend({find:function(a){var b,c=this.length,d=[],e=this;if("string"!=typeof a)return this.pushStack(n(a).filter(function(){for(b=0;c>b;b++)if(n.contains(e[b],this))return!0}));for(b=0;c>b;b++)n.find(a,e[b],d);return d=this.pushStack(c>1?n.unique(d):d),d.selector=this.selector?this.selector+" "+a:a,d},filter:function(a){return this.pushStack(z(this,a||[],!1))},not:function(a){return this.pushStack(z(this,a||[],!0))},is:function(a){return!!z(this,"string"==typeof a&&w.test(a)?n(a):a||[],!1).length}});var A,B=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,C=n.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||A,"string"==typeof a){if(e="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:B.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof n?b[0]:b,n.merge(this,n.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),x.test(e[1])&&n.isPlainObject(b))for(e in b)n.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}return f=d.getElementById(e[2]),f&&f.parentNode&&(this.length=1,this[0]=f),this.context=d,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):n.isFunction(a)?void 0!==c.ready?c.ready(a):a(n):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),n.makeArray(a,this))};C.prototype=n.fn,A=n(d);var D=/^(?:parents|prev(?:Until|All))/,E={children:!0,contents:!0,next:!0,prev:!0};n.fn.extend({has:function(a){var b=n(a,this),c=b.length;return this.filter(function(){for(var a=0;c>a;a++)if(n.contains(this,b[a]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=w.test(a)||"string"!=typeof a?n(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&n.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?n.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?h.call(n(a),this[0]):h.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(n.uniqueSort(n.merge(this.get(),n(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function F(a,b){while((a=a[b])&&1!==a.nodeType);return a}n.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return u(a,"parentNode")},parentsUntil:function(a,b,c){return u(a,"parentNode",c)},next:function(a){return F(a,"nextSibling")},prev:function(a){return F(a,"previousSibling")},nextAll:function(a){return u(a,"nextSibling")},prevAll:function(a){return u(a,"previousSibling")},nextUntil:function(a,b,c){return u(a,"nextSibling",c)},prevUntil:function(a,b,c){return u(a,"previousSibling",c)},siblings:function(a){return v((a.parentNode||{}).firstChild,a)},children:function(a){return v(a.firstChild)},contents:function(a){return a.contentDocument||n.merge([],a.childNodes)}},function(a,b){n.fn[a]=function(c,d){var e=n.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=n.filter(d,e)),this.length>1&&(E[a]||n.uniqueSort(e),D.test(a)&&e.reverse()),this.pushStack(e)}});var G=/\S+/g;function H(a){var b={};return n.each(a.match(G)||[],function(a,c){b[c]=!0}),b}n.Callbacks=function(a){a="string"==typeof a?H(a):n.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){n.each(b,function(b,c){n.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==n.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return n.each(arguments,function(a,b){var c;while((c=n.inArray(b,f,c))>-1)f.splice(c,1),h>=c&&h--}),this},has:function(a){return a?n.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=g=[],c||(f=c=""),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j},n.extend({Deferred:function(a){var b=[["resolve","done",n.Callbacks("once memory"),"resolved"],["reject","fail",n.Callbacks("once memory"),"rejected"],["notify","progress",n.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return n.Deferred(function(c){n.each(b,function(b,f){var g=n.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&n.isFunction(a.promise)?a.promise().progress(c.notify).done(c.resolve).fail(c.reject):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?n.extend(a,d):d}},e={};return d.pipe=d.then,n.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=e.call(arguments),d=c.length,f=1!==d||a&&n.isFunction(a.promise)?d:0,g=1===f?a:n.Deferred(),h=function(a,b,c){return function(d){b[a]=this,c[a]=arguments.length>1?e.call(arguments):d,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(d>1)for(i=new Array(d),j=new Array(d),k=new Array(d);d>b;b++)c[b]&&n.isFunction(c[b].promise)?c[b].promise().progress(h(b,j,i)).done(h(b,k,c)).fail(g.reject):--f;return f||g.resolveWith(k,c),g.promise()}});var I;n.fn.ready=function(a){return n.ready.promise().done(a),this},n.extend({isReady:!1,readyWait:1,holdReady:function(a){a?n.readyWait++:n.ready(!0)},ready:function(a){(a===!0?--n.readyWait:n.isReady)||(n.isReady=!0,a!==!0&&--n.readyWait>0||(I.resolveWith(d,[n]),n.fn.triggerHandler&&(n(d).triggerHandler("ready"),n(d).off("ready"))))}});function J(){d.removeEventListener("DOMContentLoaded",J),a.removeEventListener("load",J),n.ready()}n.ready.promise=function(b){return I||(I=n.Deferred(),"complete"===d.readyState||"loading"!==d.readyState&&!d.documentElement.doScroll?a.setTimeout(n.ready):(d.addEventListener("DOMContentLoaded",J),a.addEventListener("load",J))),I.promise(b)},n.ready.promise();var K=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===n.type(c)){e=!0;for(h in c)K(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,n.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(n(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},L=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function M(){this.expando=n.expando+M.uid++}M.uid=1,M.prototype={register:function(a,b){var c=b||{};return a.nodeType?a[this.expando]=c:Object.defineProperty(a,this.expando,{value:c,writable:!0,configurable:!0}),a[this.expando]},cache:function(a){if(!L(a))return{};var b=a[this.expando];return b||(b={},L(a)&&(a.nodeType?a[this.expando]=b:Object.defineProperty(a,this.expando,{value:b,configurable:!0}))),b},set:function(a,b,c){var d,e=this.cache(a);if("string"==typeof b)e[b]=c;else for(d in b)e[d]=b[d];return e},get:function(a,b){return void 0===b?this.cache(a):a[this.expando]&&a[this.expando][b]},access:function(a,b,c){var d;return void 0===b||b&&"string"==typeof b&&void 0===c?(d=this.get(a,b),void 0!==d?d:this.get(a,n.camelCase(b))):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d,e,f=a[this.expando];if(void 0!==f){if(void 0===b)this.register(a);else{n.isArray(b)?d=b.concat(b.map(n.camelCase)):(e=n.camelCase(b),b in f?d=[b,e]:(d=e,d=d in f?[d]:d.match(G)||[])),c=d.length;while(c--)delete f[d[c]]}(void 0===b||n.isEmptyObject(f))&&(a.nodeType?a[this.expando]=void 0:delete a[this.expando])}},hasData:function(a){var b=a[this.expando];return void 0!==b&&!n.isEmptyObject(b)}};var N=new M,O=new M,P=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,Q=/[A-Z]/g;function R(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(Q,"-$&").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:P.test(c)?n.parseJSON(c):c;
}catch(e){}O.set(a,b,c)}else c=void 0;return c}n.extend({hasData:function(a){return O.hasData(a)||N.hasData(a)},data:function(a,b,c){return O.access(a,b,c)},removeData:function(a,b){O.remove(a,b)},_data:function(a,b,c){return N.access(a,b,c)},_removeData:function(a,b){N.remove(a,b)}}),n.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=O.get(f),1===f.nodeType&&!N.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=n.camelCase(d.slice(5)),R(f,d,e[d])));N.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){O.set(this,a)}):K(this,function(b){var c,d;if(f&&void 0===b){if(c=O.get(f,a)||O.get(f,a.replace(Q,"-$&").toLowerCase()),void 0!==c)return c;if(d=n.camelCase(a),c=O.get(f,d),void 0!==c)return c;if(c=R(f,d,void 0),void 0!==c)return c}else d=n.camelCase(a),this.each(function(){var c=O.get(this,d);O.set(this,d,b),a.indexOf("-")>-1&&void 0!==c&&O.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){O.remove(this,a)})}}),n.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=N.get(a,b),c&&(!d||n.isArray(c)?d=N.access(a,b,n.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=n.queue(a,b),d=c.length,e=c.shift(),f=n._queueHooks(a,b),g=function(){n.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return N.get(a,c)||N.access(a,c,{empty:n.Callbacks("once memory").add(function(){N.remove(a,[b+"queue",c])})})}}),n.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?n.queue(this[0],a):void 0===b?this:this.each(function(){var c=n.queue(this,a,b);n._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&n.dequeue(this,a)})},dequeue:function(a){return this.each(function(){n.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=n.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=N.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var S=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,T=new RegExp("^(?:([+-])=|)("+S+")([a-z%]*)$","i"),U=["Top","Right","Bottom","Left"],V=function(a,b){return a=b||a,"none"===n.css(a,"display")||!n.contains(a.ownerDocument,a)};function W(a,b,c,d){var e,f=1,g=20,h=d?function(){return d.cur()}:function(){return n.css(a,b,"")},i=h(),j=c&&c[3]||(n.cssNumber[b]?"":"px"),k=(n.cssNumber[b]||"px"!==j&&+i)&&T.exec(n.css(a,b));if(k&&k[3]!==j){j=j||k[3],c=c||[],k=+i||1;do f=f||".5",k/=f,n.style(a,b,k+j);while(f!==(f=h()/i)&&1!==f&&--g)}return c&&(k=+k||+i||0,e=c[1]?k+(c[1]+1)*c[2]:+c[2],d&&(d.unit=j,d.start=k,d.end=e)),e}var X=/^(?:checkbox|radio)$/i,Y=/<([\w:-]+)/,Z=/^$|\/(?:java|ecma)script/i,$={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};$.optgroup=$.option,$.tbody=$.tfoot=$.colgroup=$.caption=$.thead,$.th=$.td;function _(a,b){var c="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):[];return void 0===b||b&&n.nodeName(a,b)?n.merge([a],c):c}function aa(a,b){for(var c=0,d=a.length;d>c;c++)N.set(a[c],"globalEval",!b||N.get(b[c],"globalEval"))}var ba=/<|&#?\w+;/;function ca(a,b,c,d,e){for(var f,g,h,i,j,k,l=b.createDocumentFragment(),m=[],o=0,p=a.length;p>o;o++)if(f=a[o],f||0===f)if("object"===n.type(f))n.merge(m,f.nodeType?[f]:f);else if(ba.test(f)){g=g||l.appendChild(b.createElement("div")),h=(Y.exec(f)||["",""])[1].toLowerCase(),i=$[h]||$._default,g.innerHTML=i[1]+n.htmlPrefilter(f)+i[2],k=i[0];while(k--)g=g.lastChild;n.merge(m,g.childNodes),g=l.firstChild,g.textContent=""}else m.push(b.createTextNode(f));l.textContent="",o=0;while(f=m[o++])if(d&&n.inArray(f,d)>-1)e&&e.push(f);else if(j=n.contains(f.ownerDocument,f),g=_(l.appendChild(f),"script"),j&&aa(g),c){k=0;while(f=g[k++])Z.test(f.type||"")&&c.push(f)}return l}!function(){var a=d.createDocumentFragment(),b=a.appendChild(d.createElement("div")),c=d.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),l.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",l.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var da=/^key/,ea=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,fa=/^([^.]*)(?:\.(.+)|)/;function ga(){return!0}function ha(){return!1}function ia(){try{return d.activeElement}catch(a){}}function ja(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)ja(a,h,c,d,b[h],f);return a}if(null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1)e=ha;else if(!e)return a;return 1===f&&(g=e,e=function(a){return n().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=n.guid++)),a.each(function(){n.event.add(this,b,e,d,c)})}n.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=N.get(a);if(r){c.handler&&(f=c,c=f.handler,e=f.selector),c.guid||(c.guid=n.guid++),(i=r.events)||(i=r.events={}),(g=r.handle)||(g=r.handle=function(b){return"undefined"!=typeof n&&n.event.triggered!==b.type?n.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(G)||[""],j=b.length;while(j--)h=fa.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o&&(l=n.event.special[o]||{},o=(e?l.delegateType:l.bindType)||o,l=n.event.special[o]||{},k=n.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&n.expr.match.needsContext.test(e),namespace:p.join(".")},f),(m=i[o])||(m=i[o]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,p,g)!==!1||a.addEventListener&&a.addEventListener(o,g)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),n.event.global[o]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=N.hasData(a)&&N.get(a);if(r&&(i=r.events)){b=(b||"").match(G)||[""],j=b.length;while(j--)if(h=fa.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=n.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,m=i[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&q!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||n.removeEvent(a,o,r.handle),delete i[o])}else for(o in i)n.event.remove(a,o+b[j],c,d,!0);n.isEmptyObject(i)&&N.remove(a,"handle events")}},dispatch:function(a){a=n.event.fix(a);var b,c,d,f,g,h=[],i=e.call(arguments),j=(N.get(this,"events")||{})[a.type]||[],k=n.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=n.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,c=0;while((g=f.handlers[c++])&&!a.isImmediatePropagationStopped())a.rnamespace&&!a.rnamespace.test(g.namespace)||(a.handleObj=g,a.data=g.data,d=((n.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==d&&(a.result=d)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&("click"!==a.type||isNaN(a.button)||a.button<1))for(;i!==this;i=i.parentNode||this)if(1===i.nodeType&&(i.disabled!==!0||"click"!==a.type)){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?n(e,this).index(i)>-1:n.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},props:"altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,e,f,g=b.button;return null==a.pageX&&null!=b.clientX&&(c=a.target.ownerDocument||d,e=c.documentElement,f=c.body,a.pageX=b.clientX+(e&&e.scrollLeft||f&&f.scrollLeft||0)-(e&&e.clientLeft||f&&f.clientLeft||0),a.pageY=b.clientY+(e&&e.scrollTop||f&&f.scrollTop||0)-(e&&e.clientTop||f&&f.clientTop||0)),a.which||void 0===g||(a.which=1&g?1:2&g?3:4&g?2:0),a}},fix:function(a){if(a[n.expando])return a;var b,c,e,f=a.type,g=a,h=this.fixHooks[f];h||(this.fixHooks[f]=h=ea.test(f)?this.mouseHooks:da.test(f)?this.keyHooks:{}),e=h.props?this.props.concat(h.props):this.props,a=new n.Event(g),b=e.length;while(b--)c=e[b],a[c]=g[c];return a.target||(a.target=d),3===a.target.nodeType&&(a.target=a.target.parentNode),h.filter?h.filter(a,g):a},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==ia()&&this.focus?(this.focus(),!1):void 0},delegateType:"focusin"},blur:{trigger:function(){return this===ia()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&n.nodeName(this,"input")?(this.click(),!1):void 0},_default:function(a){return n.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}}},n.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)},n.Event=function(a,b){return this instanceof n.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?ga:ha):this.type=a,b&&n.extend(this,b),this.timeStamp=a&&a.timeStamp||n.now(),void(this[n.expando]=!0)):new n.Event(a,b)},n.Event.prototype={constructor:n.Event,isDefaultPrevented:ha,isPropagationStopped:ha,isImmediatePropagationStopped:ha,isSimulated:!1,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=ga,a&&!this.isSimulated&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=ga,a&&!this.isSimulated&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=ga,a&&!this.isSimulated&&a.stopImmediatePropagation(),this.stopPropagation()}},n.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){n.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return e&&(e===d||n.contains(d,e))||(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),n.fn.extend({on:function(a,b,c,d){return ja(this,a,b,c,d)},one:function(a,b,c,d){return ja(this,a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,n(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return b!==!1&&"function"!=typeof b||(c=b,b=void 0),c===!1&&(c=ha),this.each(function(){n.event.remove(this,a,c,b)})}});var ka=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,la=/<script|<style|<link/i,ma=/checked\s*(?:[^=]|=\s*.checked.)/i,na=/^true\/(.*)/,oa=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function pa(a,b){return n.nodeName(a,"table")&&n.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function qa(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function ra(a){var b=na.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function sa(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(N.hasData(a)&&(f=N.access(a),g=N.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;d>c;c++)n.event.add(b,e,j[e][c])}O.hasData(a)&&(h=O.access(a),i=n.extend({},h),O.set(b,i))}}function ta(a,b){var c=b.nodeName.toLowerCase();"input"===c&&X.test(a.type)?b.checked=a.checked:"input"!==c&&"textarea"!==c||(b.defaultValue=a.defaultValue)}function ua(a,b,c,d){b=f.apply([],b);var e,g,h,i,j,k,m=0,o=a.length,p=o-1,q=b[0],r=n.isFunction(q);if(r||o>1&&"string"==typeof q&&!l.checkClone&&ma.test(q))return a.each(function(e){var f=a.eq(e);r&&(b[0]=q.call(this,e,f.html())),ua(f,b,c,d)});if(o&&(e=ca(b,a[0].ownerDocument,!1,a,d),g=e.firstChild,1===e.childNodes.length&&(e=g),g||d)){for(h=n.map(_(e,"script"),qa),i=h.length;o>m;m++)j=e,m!==p&&(j=n.clone(j,!0,!0),i&&n.merge(h,_(j,"script"))),c.call(a[m],j,m);if(i)for(k=h[h.length-1].ownerDocument,n.map(h,ra),m=0;i>m;m++)j=h[m],Z.test(j.type||"")&&!N.access(j,"globalEval")&&n.contains(k,j)&&(j.src?n._evalUrl&&n._evalUrl(j.src):n.globalEval(j.textContent.replace(oa,"")))}return a}function va(a,b,c){for(var d,e=b?n.filter(b,a):a,f=0;null!=(d=e[f]);f++)c||1!==d.nodeType||n.cleanData(_(d)),d.parentNode&&(c&&n.contains(d.ownerDocument,d)&&aa(_(d,"script")),d.parentNode.removeChild(d));return a}n.extend({htmlPrefilter:function(a){return a.replace(ka,"<$1></$2>")},clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=n.contains(a.ownerDocument,a);if(!(l.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||n.isXMLDoc(a)))for(g=_(h),f=_(a),d=0,e=f.length;e>d;d++)ta(f[d],g[d]);if(b)if(c)for(f=f||_(a),g=g||_(h),d=0,e=f.length;e>d;d++)sa(f[d],g[d]);else sa(a,h);return g=_(h,"script"),g.length>0&&aa(g,!i&&_(a,"script")),h},cleanData:function(a){for(var b,c,d,e=n.event.special,f=0;void 0!==(c=a[f]);f++)if(L(c)){if(b=c[N.expando]){if(b.events)for(d in b.events)e[d]?n.event.remove(c,d):n.removeEvent(c,d,b.handle);c[N.expando]=void 0}c[O.expando]&&(c[O.expando]=void 0)}}}),n.fn.extend({domManip:ua,detach:function(a){return va(this,a,!0)},remove:function(a){return va(this,a)},text:function(a){return K(this,function(a){return void 0===a?n.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=a)})},null,a,arguments.length)},append:function(){return ua(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=pa(this,a);b.appendChild(a)}})},prepend:function(){return ua(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=pa(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return ua(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return ua(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(n.cleanData(_(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return n.clone(this,a,b)})},html:function(a){return K(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!la.test(a)&&!$[(Y.exec(a)||["",""])[1].toLowerCase()]){a=n.htmlPrefilter(a);try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(n.cleanData(_(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=[];return ua(this,arguments,function(b){var c=this.parentNode;n.inArray(this,a)<0&&(n.cleanData(_(this)),c&&c.replaceChild(b,this))},a)}}),n.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){n.fn[a]=function(a){for(var c,d=[],e=n(a),f=e.length-1,h=0;f>=h;h++)c=h===f?this:this.clone(!0),n(e[h])[b](c),g.apply(d,c.get());return this.pushStack(d)}});var wa,xa={HTML:"block",BODY:"block"};function ya(a,b){var c=n(b.createElement(a)).appendTo(b.body),d=n.css(c[0],"display");return c.detach(),d}function za(a){var b=d,c=xa[a];return c||(c=ya(a,b),"none"!==c&&c||(wa=(wa||n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=wa[0].contentDocument,b.write(),b.close(),c=ya(a,b),wa.detach()),xa[a]=c),c}var Aa=/^margin/,Ba=new RegExp("^("+S+")(?!px)[a-z%]+$","i"),Ca=function(b){var c=b.ownerDocument.defaultView;return c&&c.opener||(c=a),c.getComputedStyle(b)},Da=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e},Ea=d.documentElement;!function(){var b,c,e,f,g=d.createElement("div"),h=d.createElement("div");if(h.style){h.style.backgroundClip="content-box",h.cloneNode(!0).style.backgroundClip="",l.clearCloneStyle="content-box"===h.style.backgroundClip,g.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",g.appendChild(h);function i(){h.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",h.innerHTML="",Ea.appendChild(g);var d=a.getComputedStyle(h);b="1%"!==d.top,f="2px"===d.marginLeft,c="4px"===d.width,h.style.marginRight="50%",e="4px"===d.marginRight,Ea.removeChild(g)}n.extend(l,{pixelPosition:function(){return i(),b},boxSizingReliable:function(){return null==c&&i(),c},pixelMarginRight:function(){return null==c&&i(),e},reliableMarginLeft:function(){return null==c&&i(),f},reliableMarginRight:function(){var b,c=h.appendChild(d.createElement("div"));return c.style.cssText=h.style.cssText="-webkit-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",c.style.marginRight=c.style.width="0",h.style.width="1px",Ea.appendChild(g),b=!parseFloat(a.getComputedStyle(c).marginRight),Ea.removeChild(g),h.removeChild(c),b}})}}();function Fa(a,b,c){var d,e,f,g,h=a.style;return c=c||Ca(a),g=c?c.getPropertyValue(b)||c[b]:void 0,""!==g&&void 0!==g||n.contains(a.ownerDocument,a)||(g=n.style(a,b)),c&&!l.pixelMarginRight()&&Ba.test(g)&&Aa.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f),void 0!==g?g+"":g}function Ga(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}var Ha=/^(none|table(?!-c[ea]).+)/,Ia={position:"absolute",visibility:"hidden",display:"block"},Ja={letterSpacing:"0",fontWeight:"400"},Ka=["Webkit","O","Moz","ms"],La=d.createElement("div").style;function Ma(a){if(a in La)return a;var b=a[0].toUpperCase()+a.slice(1),c=Ka.length;while(c--)if(a=Ka[c]+b,a in La)return a}function Na(a,b,c){var d=T.exec(b);return d?Math.max(0,d[2]-(c||0))+(d[3]||"px"):b}function Oa(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=n.css(a,c+U[f],!0,e)),d?("content"===c&&(g-=n.css(a,"padding"+U[f],!0,e)),"margin"!==c&&(g-=n.css(a,"border"+U[f]+"Width",!0,e))):(g+=n.css(a,"padding"+U[f],!0,e),"padding"!==c&&(g+=n.css(a,"border"+U[f]+"Width",!0,e)));return g}function Pa(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=Ca(a),g="border-box"===n.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=Fa(a,b,f),(0>e||null==e)&&(e=a.style[b]),Ba.test(e))return e;d=g&&(l.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+Oa(a,b,c||(g?"border":"content"),d,f)+"px"}function Qa(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=N.get(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&V(d)&&(f[g]=N.access(d,"olddisplay",za(d.nodeName)))):(e=V(d),"none"===c&&e||N.set(d,"olddisplay",e?c:n.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}n.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Fa(a,"opacity");return""===c?"1":c}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=n.camelCase(b),i=a.style;return b=n.cssProps[h]||(n.cssProps[h]=Ma(h)||h),g=n.cssHooks[b]||n.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=T.exec(c))&&e[1]&&(c=W(a,b,e),f="number"),null!=c&&c===c&&("number"===f&&(c+=e&&e[3]||(n.cssNumber[h]?"":"px")),l.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=n.camelCase(b);return b=n.cssProps[h]||(n.cssProps[h]=Ma(h)||h),g=n.cssHooks[b]||n.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=Fa(a,b,d)),"normal"===e&&b in Ja&&(e=Ja[b]),""===c||c?(f=parseFloat(e),c===!0||isFinite(f)?f||0:e):e}}),n.each(["height","width"],function(a,b){n.cssHooks[b]={get:function(a,c,d){return c?Ha.test(n.css(a,"display"))&&0===a.offsetWidth?Da(a,Ia,function(){return Pa(a,b,d)}):Pa(a,b,d):void 0},set:function(a,c,d){var e,f=d&&Ca(a),g=d&&Oa(a,b,d,"border-box"===n.css(a,"boxSizing",!1,f),f);return g&&(e=T.exec(c))&&"px"!==(e[3]||"px")&&(a.style[b]=c,c=n.css(a,b)),Na(a,c,g)}}}),n.cssHooks.marginLeft=Ga(l.reliableMarginLeft,function(a,b){return b?(parseFloat(Fa(a,"marginLeft"))||a.getBoundingClientRect().left-Da(a,{marginLeft:0},function(){return a.getBoundingClientRect().left}))+"px":void 0}),n.cssHooks.marginRight=Ga(l.reliableMarginRight,function(a,b){return b?Da(a,{display:"inline-block"},Fa,[a,"marginRight"]):void 0}),n.each({margin:"",padding:"",border:"Width"},function(a,b){n.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+U[d]+b]=f[d]||f[d-2]||f[0];return e}},Aa.test(a)||(n.cssHooks[a+b].set=Na)}),n.fn.extend({css:function(a,b){return K(this,function(a,b,c){var d,e,f={},g=0;if(n.isArray(b)){for(d=Ca(a),e=b.length;e>g;g++)f[b[g]]=n.css(a,b[g],!1,d);return f}return void 0!==c?n.style(a,b,c):n.css(a,b)},a,b,arguments.length>1)},show:function(){return Qa(this,!0)},hide:function(){return Qa(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){V(this)?n(this).show():n(this).hide()})}});function Ra(a,b,c,d,e){return new Ra.prototype.init(a,b,c,d,e)}n.Tween=Ra,Ra.prototype={constructor:Ra,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||n.easing._default,this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(n.cssNumber[c]?"":"px")},cur:function(){var a=Ra.propHooks[this.prop];return a&&a.get?a.get(this):Ra.propHooks._default.get(this)},run:function(a){var b,c=Ra.propHooks[this.prop];return this.options.duration?this.pos=b=n.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Ra.propHooks._default.set(this),this}},Ra.prototype.init.prototype=Ra.prototype,Ra.propHooks={_default:{get:function(a){var b;return 1!==a.elem.nodeType||null!=a.elem[a.prop]&&null==a.elem.style[a.prop]?a.elem[a.prop]:(b=n.css(a.elem,a.prop,""),b&&"auto"!==b?b:0)},set:function(a){n.fx.step[a.prop]?n.fx.step[a.prop](a):1!==a.elem.nodeType||null==a.elem.style[n.cssProps[a.prop]]&&!n.cssHooks[a.prop]?a.elem[a.prop]=a.now:n.style(a.elem,a.prop,a.now+a.unit)}}},Ra.propHooks.scrollTop=Ra.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},n.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2},_default:"swing"},n.fx=Ra.prototype.init,n.fx.step={};var Sa,Ta,Ua=/^(?:toggle|show|hide)$/,Va=/queueHooks$/;function Wa(){return a.setTimeout(function(){Sa=void 0}),Sa=n.now()}function Xa(a,b){var c,d=0,e={height:a};for(b=b?1:0;4>d;d+=2-b)c=U[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function Ya(a,b,c){for(var d,e=(_a.tweeners[b]||[]).concat(_a.tweeners["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function Za(a,b,c){var d,e,f,g,h,i,j,k,l=this,m={},o=a.style,p=a.nodeType&&V(a),q=N.get(a,"fxshow");c.queue||(h=n._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,l.always(function(){l.always(function(){h.unqueued--,n.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=n.css(a,"display"),k="none"===j?N.get(a,"olddisplay")||za(a.nodeName):j,"inline"===k&&"none"===n.css(a,"float")&&(o.display="inline-block")),c.overflow&&(o.overflow="hidden",l.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],Ua.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}m[d]=q&&q[d]||n.style(a,d)}else j=void 0;if(n.isEmptyObject(m))"inline"===("none"===j?za(a.nodeName):j)&&(o.display=j);else{q?"hidden"in q&&(p=q.hidden):q=N.access(a,"fxshow",{}),f&&(q.hidden=!p),p?n(a).show():l.done(function(){n(a).hide()}),l.done(function(){var b;N.remove(a,"fxshow");for(b in m)n.style(a,b,m[b])});for(d in m)g=Ya(p?q[d]:0,d,l),d in q||(q[d]=g.start,p&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function $a(a,b){var c,d,e,f,g;for(c in a)if(d=n.camelCase(c),e=b[d],f=a[c],n.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=n.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function _a(a,b,c){var d,e,f=0,g=_a.prefilters.length,h=n.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=Sa||Wa(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:n.extend({},b),opts:n.extend(!0,{specialEasing:{},easing:n.easing._default},c),originalProperties:b,originalOptions:c,startTime:Sa||Wa(),duration:c.duration,tweens:[],createTween:function(b,c){var d=n.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?(h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j,b])):h.rejectWith(a,[j,b]),this}}),k=j.props;for($a(k,j.opts.specialEasing);g>f;f++)if(d=_a.prefilters[f].call(j,a,k,j.opts))return n.isFunction(d.stop)&&(n._queueHooks(j.elem,j.opts.queue).stop=n.proxy(d.stop,d)),d;return n.map(k,Ya,j),n.isFunction(j.opts.start)&&j.opts.start.call(a,j),n.fx.timer(n.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}n.Animation=n.extend(_a,{tweeners:{"*":[function(a,b){var c=this.createTween(a,b);return W(c.elem,a,T.exec(b),c),c}]},tweener:function(a,b){n.isFunction(a)?(b=a,a=["*"]):a=a.match(G);for(var c,d=0,e=a.length;e>d;d++)c=a[d],_a.tweeners[c]=_a.tweeners[c]||[],_a.tweeners[c].unshift(b)},prefilters:[Za],prefilter:function(a,b){b?_a.prefilters.unshift(a):_a.prefilters.push(a)}}),n.speed=function(a,b,c){var d=a&&"object"==typeof a?n.extend({},a):{complete:c||!c&&b||n.isFunction(a)&&a,duration:a,easing:c&&b||b&&!n.isFunction(b)&&b};return d.duration=n.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in n.fx.speeds?n.fx.speeds[d.duration]:n.fx.speeds._default,null!=d.queue&&d.queue!==!0||(d.queue="fx"),d.old=d.complete,d.complete=function(){n.isFunction(d.old)&&d.old.call(this),d.queue&&n.dequeue(this,d.queue)},d},n.fn.extend({fadeTo:function(a,b,c,d){return this.filter(V).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=n.isEmptyObject(a),f=n.speed(b,c,d),g=function(){var b=_a(this,n.extend({},a),f);(e||N.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=n.timers,g=N.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&Va.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));!b&&c||n.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=N.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=n.timers,g=d?d.length:0;for(c.finish=!0,n.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),n.each(["toggle","show","hide"],function(a,b){var c=n.fn[b];n.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(Xa(b,!0),a,d,e)}}),n.each({slideDown:Xa("show"),slideUp:Xa("hide"),slideToggle:Xa("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){n.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),n.timers=[],n.fx.tick=function(){var a,b=0,c=n.timers;for(Sa=n.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||n.fx.stop(),Sa=void 0},n.fx.timer=function(a){n.timers.push(a),a()?n.fx.start():n.timers.pop()},n.fx.interval=13,n.fx.start=function(){Ta||(Ta=a.setInterval(n.fx.tick,n.fx.interval))},n.fx.stop=function(){a.clearInterval(Ta),Ta=null},n.fx.speeds={slow:600,fast:200,_default:400},n.fn.delay=function(b,c){return b=n.fx?n.fx.speeds[b]||b:b,c=c||"fx",this.queue(c,function(c,d){var e=a.setTimeout(c,b);d.stop=function(){a.clearTimeout(e)}})},function(){var a=d.createElement("input"),b=d.createElement("select"),c=b.appendChild(d.createElement("option"));a.type="checkbox",l.checkOn=""!==a.value,l.optSelected=c.selected,b.disabled=!0,l.optDisabled=!c.disabled,a=d.createElement("input"),a.value="t",a.type="radio",l.radioValue="t"===a.value}();var ab,bb=n.expr.attrHandle;n.fn.extend({attr:function(a,b){return K(this,n.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){n.removeAttr(this,a)})}}),n.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return"undefined"==typeof a.getAttribute?n.prop(a,b,c):(1===f&&n.isXMLDoc(a)||(b=b.toLowerCase(),e=n.attrHooks[b]||(n.expr.match.bool.test(b)?ab:void 0)),void 0!==c?null===c?void n.removeAttr(a,b):e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:(a.setAttribute(b,c+""),c):e&&"get"in e&&null!==(d=e.get(a,b))?d:(d=n.find.attr(a,b),null==d?void 0:d))},attrHooks:{type:{set:function(a,b){if(!l.radioValue&&"radio"===b&&n.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(G);if(f&&1===a.nodeType)while(c=f[e++])d=n.propFix[c]||c,n.expr.match.bool.test(c)&&(a[d]=!1),a.removeAttribute(c)}}),ab={set:function(a,b,c){return b===!1?n.removeAttr(a,c):a.setAttribute(c,c),c}},n.each(n.expr.match.bool.source.match(/\w+/g),function(a,b){var c=bb[b]||n.find.attr;bb[b]=function(a,b,d){var e,f;return d||(f=bb[b],bb[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,bb[b]=f),e}});var cb=/^(?:input|select|textarea|button)$/i,db=/^(?:a|area)$/i;n.fn.extend({prop:function(a,b){return K(this,n.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[n.propFix[a]||a]})}}),n.extend({prop:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return 1===f&&n.isXMLDoc(a)||(b=n.propFix[b]||b,e=n.propHooks[b]),
void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=n.find.attr(a,"tabindex");return b?parseInt(b,10):cb.test(a.nodeName)||db.test(a.nodeName)&&a.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),l.optSelected||(n.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null},set:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex)}}),n.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){n.propFix[this.toLowerCase()]=this});var eb=/[\t\r\n\f]/g;function fb(a){return a.getAttribute&&a.getAttribute("class")||""}n.fn.extend({addClass:function(a){var b,c,d,e,f,g,h,i=0;if(n.isFunction(a))return this.each(function(b){n(this).addClass(a.call(this,b,fb(this)))});if("string"==typeof a&&a){b=a.match(G)||[];while(c=this[i++])if(e=fb(c),d=1===c.nodeType&&(" "+e+" ").replace(eb," ")){g=0;while(f=b[g++])d.indexOf(" "+f+" ")<0&&(d+=f+" ");h=n.trim(d),e!==h&&c.setAttribute("class",h)}}return this},removeClass:function(a){var b,c,d,e,f,g,h,i=0;if(n.isFunction(a))return this.each(function(b){n(this).removeClass(a.call(this,b,fb(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof a&&a){b=a.match(G)||[];while(c=this[i++])if(e=fb(c),d=1===c.nodeType&&(" "+e+" ").replace(eb," ")){g=0;while(f=b[g++])while(d.indexOf(" "+f+" ")>-1)d=d.replace(" "+f+" "," ");h=n.trim(d),e!==h&&c.setAttribute("class",h)}}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):n.isFunction(a)?this.each(function(c){n(this).toggleClass(a.call(this,c,fb(this),b),b)}):this.each(function(){var b,d,e,f;if("string"===c){d=0,e=n(this),f=a.match(G)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else void 0!==a&&"boolean"!==c||(b=fb(this),b&&N.set(this,"__className__",b),this.setAttribute&&this.setAttribute("class",b||a===!1?"":N.get(this,"__className__")||""))})},hasClass:function(a){var b,c,d=0;b=" "+a+" ";while(c=this[d++])if(1===c.nodeType&&(" "+fb(c)+" ").replace(eb," ").indexOf(b)>-1)return!0;return!1}});var gb=/\r/g,hb=/[\x20\t\r\n\f]+/g;n.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=n.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,n(this).val()):a,null==e?e="":"number"==typeof e?e+="":n.isArray(e)&&(e=n.map(e,function(a){return null==a?"":a+""})),b=n.valHooks[this.type]||n.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=n.valHooks[e.type]||n.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(gb,""):null==c?"":c)}}}),n.extend({valHooks:{option:{get:function(a){var b=n.find.attr(a,"value");return null!=b?b:n.trim(n.text(a)).replace(hb," ")}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],(c.selected||i===e)&&(l.optDisabled?!c.disabled:null===c.getAttribute("disabled"))&&(!c.parentNode.disabled||!n.nodeName(c.parentNode,"optgroup"))){if(b=n(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=n.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=n.inArray(n.valHooks.option.get(d),f)>-1)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),n.each(["radio","checkbox"],function(){n.valHooks[this]={set:function(a,b){return n.isArray(b)?a.checked=n.inArray(n(a).val(),b)>-1:void 0}},l.checkOn||(n.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var ib=/^(?:focusinfocus|focusoutblur)$/;n.extend(n.event,{trigger:function(b,c,e,f){var g,h,i,j,l,m,o,p=[e||d],q=k.call(b,"type")?b.type:b,r=k.call(b,"namespace")?b.namespace.split("."):[];if(h=i=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!ib.test(q+n.event.triggered)&&(q.indexOf(".")>-1&&(r=q.split("."),q=r.shift(),r.sort()),l=q.indexOf(":")<0&&"on"+q,b=b[n.expando]?b:new n.Event(q,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=r.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+r.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:n.makeArray(c,[b]),o=n.event.special[q]||{},f||!o.trigger||o.trigger.apply(e,c)!==!1)){if(!f&&!o.noBubble&&!n.isWindow(e)){for(j=o.delegateType||q,ib.test(j+q)||(h=h.parentNode);h;h=h.parentNode)p.push(h),i=h;i===(e.ownerDocument||d)&&p.push(i.defaultView||i.parentWindow||a)}g=0;while((h=p[g++])&&!b.isPropagationStopped())b.type=g>1?j:o.bindType||q,m=(N.get(h,"events")||{})[b.type]&&N.get(h,"handle"),m&&m.apply(h,c),m=l&&h[l],m&&m.apply&&L(h)&&(b.result=m.apply(h,c),b.result===!1&&b.preventDefault());return b.type=q,f||b.isDefaultPrevented()||o._default&&o._default.apply(p.pop(),c)!==!1||!L(e)||l&&n.isFunction(e[q])&&!n.isWindow(e)&&(i=e[l],i&&(e[l]=null),n.event.triggered=q,e[q](),n.event.triggered=void 0,i&&(e[l]=i)),b.result}},simulate:function(a,b,c){var d=n.extend(new n.Event,c,{type:a,isSimulated:!0});n.event.trigger(d,null,b)}}),n.fn.extend({trigger:function(a,b){return this.each(function(){n.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?n.event.trigger(a,b,c,!0):void 0}}),n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){n.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),n.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),l.focusin="onfocusin"in a,l.focusin||n.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){n.event.simulate(b,a.target,n.event.fix(a))};n.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=N.access(d,b);e||d.addEventListener(a,c,!0),N.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=N.access(d,b)-1;e?N.access(d,b,e):(d.removeEventListener(a,c,!0),N.remove(d,b))}}});var jb=a.location,kb=n.now(),lb=/\?/;n.parseJSON=function(a){return JSON.parse(a+"")},n.parseXML=function(b){var c;if(!b||"string"!=typeof b)return null;try{c=(new a.DOMParser).parseFromString(b,"text/xml")}catch(d){c=void 0}return c&&!c.getElementsByTagName("parsererror").length||n.error("Invalid XML: "+b),c};var mb=/#.*$/,nb=/([?&])_=[^&]*/,ob=/^(.*?):[ \t]*([^\r\n]*)$/gm,pb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,qb=/^(?:GET|HEAD)$/,rb=/^\/\//,sb={},tb={},ub="*/".concat("*"),vb=d.createElement("a");vb.href=jb.href;function wb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(G)||[];if(n.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function xb(a,b,c,d){var e={},f=a===tb;function g(h){var i;return e[h]=!0,n.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function yb(a,b){var c,d,e=n.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&n.extend(!0,a,d),a}function zb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function Ab(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}n.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:jb.href,type:"GET",isLocal:pb.test(jb.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":ub,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":n.parseJSON,"text xml":n.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?yb(yb(a,n.ajaxSettings),b):yb(n.ajaxSettings,a)},ajaxPrefilter:wb(sb),ajaxTransport:wb(tb),ajax:function(b,c){"object"==typeof b&&(c=b,b=void 0),c=c||{};var e,f,g,h,i,j,k,l,m=n.ajaxSetup({},c),o=m.context||m,p=m.context&&(o.nodeType||o.jquery)?n(o):n.event,q=n.Deferred(),r=n.Callbacks("once memory"),s=m.statusCode||{},t={},u={},v=0,w="canceled",x={readyState:0,getResponseHeader:function(a){var b;if(2===v){if(!h){h={};while(b=ob.exec(g))h[b[1].toLowerCase()]=b[2]}b=h[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===v?g:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return v||(a=u[c]=u[c]||a,t[a]=b),this},overrideMimeType:function(a){return v||(m.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>v)for(b in a)s[b]=[s[b],a[b]];else x.always(a[x.status]);return this},abort:function(a){var b=a||w;return e&&e.abort(b),z(0,b),this}};if(q.promise(x).complete=r.add,x.success=x.done,x.error=x.fail,m.url=((b||m.url||jb.href)+"").replace(mb,"").replace(rb,jb.protocol+"//"),m.type=c.method||c.type||m.method||m.type,m.dataTypes=n.trim(m.dataType||"*").toLowerCase().match(G)||[""],null==m.crossDomain){j=d.createElement("a");try{j.href=m.url,j.href=j.href,m.crossDomain=vb.protocol+"//"+vb.host!=j.protocol+"//"+j.host}catch(y){m.crossDomain=!0}}if(m.data&&m.processData&&"string"!=typeof m.data&&(m.data=n.param(m.data,m.traditional)),xb(sb,m,c,x),2===v)return x;k=n.event&&m.global,k&&0===n.active++&&n.event.trigger("ajaxStart"),m.type=m.type.toUpperCase(),m.hasContent=!qb.test(m.type),f=m.url,m.hasContent||(m.data&&(f=m.url+=(lb.test(f)?"&":"?")+m.data,delete m.data),m.cache===!1&&(m.url=nb.test(f)?f.replace(nb,"$1_="+kb++):f+(lb.test(f)?"&":"?")+"_="+kb++)),m.ifModified&&(n.lastModified[f]&&x.setRequestHeader("If-Modified-Since",n.lastModified[f]),n.etag[f]&&x.setRequestHeader("If-None-Match",n.etag[f])),(m.data&&m.hasContent&&m.contentType!==!1||c.contentType)&&x.setRequestHeader("Content-Type",m.contentType),x.setRequestHeader("Accept",m.dataTypes[0]&&m.accepts[m.dataTypes[0]]?m.accepts[m.dataTypes[0]]+("*"!==m.dataTypes[0]?", "+ub+"; q=0.01":""):m.accepts["*"]);for(l in m.headers)x.setRequestHeader(l,m.headers[l]);if(m.beforeSend&&(m.beforeSend.call(o,x,m)===!1||2===v))return x.abort();w="abort";for(l in{success:1,error:1,complete:1})x[l](m[l]);if(e=xb(tb,m,c,x)){if(x.readyState=1,k&&p.trigger("ajaxSend",[x,m]),2===v)return x;m.async&&m.timeout>0&&(i=a.setTimeout(function(){x.abort("timeout")},m.timeout));try{v=1,e.send(t,z)}catch(y){if(!(2>v))throw y;z(-1,y)}}else z(-1,"No Transport");function z(b,c,d,h){var j,l,t,u,w,y=c;2!==v&&(v=2,i&&a.clearTimeout(i),e=void 0,g=h||"",x.readyState=b>0?4:0,j=b>=200&&300>b||304===b,d&&(u=zb(m,x,d)),u=Ab(m,u,x,j),j?(m.ifModified&&(w=x.getResponseHeader("Last-Modified"),w&&(n.lastModified[f]=w),w=x.getResponseHeader("etag"),w&&(n.etag[f]=w)),204===b||"HEAD"===m.type?y="nocontent":304===b?y="notmodified":(y=u.state,l=u.data,t=u.error,j=!t)):(t=y,!b&&y||(y="error",0>b&&(b=0))),x.status=b,x.statusText=(c||y)+"",j?q.resolveWith(o,[l,y,x]):q.rejectWith(o,[x,y,t]),x.statusCode(s),s=void 0,k&&p.trigger(j?"ajaxSuccess":"ajaxError",[x,m,j?l:t]),r.fireWith(o,[x,y]),k&&(p.trigger("ajaxComplete",[x,m]),--n.active||n.event.trigger("ajaxStop")))}return x},getJSON:function(a,b,c){return n.get(a,b,c,"json")},getScript:function(a,b){return n.get(a,void 0,b,"script")}}),n.each(["get","post"],function(a,b){n[b]=function(a,c,d,e){return n.isFunction(c)&&(e=e||d,d=c,c=void 0),n.ajax(n.extend({url:a,type:b,dataType:e,data:c,success:d},n.isPlainObject(a)&&a))}}),n._evalUrl=function(a){return n.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},n.fn.extend({wrapAll:function(a){var b;return n.isFunction(a)?this.each(function(b){n(this).wrapAll(a.call(this,b))}):(this[0]&&(b=n(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this)},wrapInner:function(a){return n.isFunction(a)?this.each(function(b){n(this).wrapInner(a.call(this,b))}):this.each(function(){var b=n(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=n.isFunction(a);return this.each(function(c){n(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){n.nodeName(this,"body")||n(this).replaceWith(this.childNodes)}).end()}}),n.expr.filters.hidden=function(a){return!n.expr.filters.visible(a)},n.expr.filters.visible=function(a){return a.offsetWidth>0||a.offsetHeight>0||a.getClientRects().length>0};var Bb=/%20/g,Cb=/\[\]$/,Db=/\r?\n/g,Eb=/^(?:submit|button|image|reset|file)$/i,Fb=/^(?:input|select|textarea|keygen)/i;function Gb(a,b,c,d){var e;if(n.isArray(b))n.each(b,function(b,e){c||Cb.test(a)?d(a,e):Gb(a+"["+("object"==typeof e&&null!=e?b:"")+"]",e,c,d)});else if(c||"object"!==n.type(b))d(a,b);else for(e in b)Gb(a+"["+e+"]",b[e],c,d)}n.param=function(a,b){var c,d=[],e=function(a,b){b=n.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=n.ajaxSettings&&n.ajaxSettings.traditional),n.isArray(a)||a.jquery&&!n.isPlainObject(a))n.each(a,function(){e(this.name,this.value)});else for(c in a)Gb(c,a[c],b,e);return d.join("&").replace(Bb,"+")},n.fn.extend({serialize:function(){return n.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=n.prop(this,"elements");return a?n.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!n(this).is(":disabled")&&Fb.test(this.nodeName)&&!Eb.test(a)&&(this.checked||!X.test(a))}).map(function(a,b){var c=n(this).val();return null==c?null:n.isArray(c)?n.map(c,function(a){return{name:b.name,value:a.replace(Db,"\r\n")}}):{name:b.name,value:c.replace(Db,"\r\n")}}).get()}}),n.ajaxSettings.xhr=function(){try{return new a.XMLHttpRequest}catch(b){}};var Hb={0:200,1223:204},Ib=n.ajaxSettings.xhr();l.cors=!!Ib&&"withCredentials"in Ib,l.ajax=Ib=!!Ib,n.ajaxTransport(function(b){var c,d;return l.cors||Ib&&!b.crossDomain?{send:function(e,f){var g,h=b.xhr();if(h.open(b.type,b.url,b.async,b.username,b.password),b.xhrFields)for(g in b.xhrFields)h[g]=b.xhrFields[g];b.mimeType&&h.overrideMimeType&&h.overrideMimeType(b.mimeType),b.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest");for(g in e)h.setRequestHeader(g,e[g]);c=function(a){return function(){c&&(c=d=h.onload=h.onerror=h.onabort=h.onreadystatechange=null,"abort"===a?h.abort():"error"===a?"number"!=typeof h.status?f(0,"error"):f(h.status,h.statusText):f(Hb[h.status]||h.status,h.statusText,"text"!==(h.responseType||"text")||"string"!=typeof h.responseText?{binary:h.response}:{text:h.responseText},h.getAllResponseHeaders()))}},h.onload=c(),d=h.onerror=c("error"),void 0!==h.onabort?h.onabort=d:h.onreadystatechange=function(){4===h.readyState&&a.setTimeout(function(){c&&d()})},c=c("abort");try{h.send(b.hasContent&&b.data||null)}catch(i){if(c)throw i}},abort:function(){c&&c()}}:void 0}),n.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(a){return n.globalEval(a),a}}}),n.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),n.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(e,f){b=n("<script>").prop({charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&f("error"===a.type?404:200,a.type)}),d.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Jb=[],Kb=/(=)\?(?=&|$)|\?\?/;n.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Jb.pop()||n.expando+"_"+kb++;return this[a]=!0,a}}),n.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Kb.test(b.url)?"url":"string"==typeof b.data&&0===(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Kb.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=n.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Kb,"$1"+e):b.jsonp!==!1&&(b.url+=(lb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||n.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){void 0===f?n(a).removeProp(e):a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Jb.push(e)),g&&n.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),n.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||d;var e=x.exec(a),f=!c&&[];return e?[b.createElement(e[1])]:(e=ca([a],b,f),f&&f.length&&n(f).remove(),n.merge([],e.childNodes))};var Lb=n.fn.load;n.fn.load=function(a,b,c){if("string"!=typeof a&&Lb)return Lb.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>-1&&(d=n.trim(a.slice(h)),a=a.slice(0,h)),n.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&n.ajax({url:a,type:e||"GET",dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?n("<div>").append(n.parseHTML(a)).find(d):a)}).always(c&&function(a,b){g.each(function(){c.apply(this,f||[a.responseText,b,a])})}),this},n.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){n.fn[b]=function(a){return this.on(b,a)}}),n.expr.filters.animated=function(a){return n.grep(n.timers,function(b){return a===b.elem}).length};function Mb(a){return n.isWindow(a)?a:9===a.nodeType&&a.defaultView}n.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=n.css(a,"position"),l=n(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=n.css(a,"top"),i=n.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),n.isFunction(b)&&(b=b.call(a,c,n.extend({},h))),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},n.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){n.offset.setOffset(this,a,b)});var b,c,d=this[0],e={top:0,left:0},f=d&&d.ownerDocument;if(f)return b=f.documentElement,n.contains(b,d)?(e=d.getBoundingClientRect(),c=Mb(f),{top:e.top+c.pageYOffset-b.clientTop,left:e.left+c.pageXOffset-b.clientLeft}):e},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===n.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),n.nodeName(a[0],"html")||(d=a.offset()),d.top+=n.css(a[0],"borderTopWidth",!0),d.left+=n.css(a[0],"borderLeftWidth",!0)),{top:b.top-d.top-n.css(c,"marginTop",!0),left:b.left-d.left-n.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent;while(a&&"static"===n.css(a,"position"))a=a.offsetParent;return a||Ea})}}),n.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c="pageYOffset"===b;n.fn[a]=function(d){return K(this,function(a,d,e){var f=Mb(a);return void 0===e?f?f[b]:a[d]:void(f?f.scrollTo(c?f.pageXOffset:e,c?e:f.pageYOffset):a[d]=e)},a,d,arguments.length)}}),n.each(["top","left"],function(a,b){n.cssHooks[b]=Ga(l.pixelPosition,function(a,c){return c?(c=Fa(a,b),Ba.test(c)?n(a).position()[b]+"px":c):void 0})}),n.each({Height:"height",Width:"width"},function(a,b){n.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){n.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return K(this,function(b,c,d){var e;return n.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?n.css(b,c,g):n.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),n.fn.extend({bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)},size:function(){return this.length}}),n.fn.andSelf=n.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return n});var Nb=a.jQuery,Ob=a.$;return n.noConflict=function(b){return a.$===n&&(a.$=Ob),b&&a.jQuery===n&&(a.jQuery=Nb),n},b||(a.jQuery=a.$=n),n});

/**
 * @preserve Copyright (c) 2012, Northfield X Ltd
All rights reserved.

Modified BSD License

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the <organization> nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
(function ($) {
    'use strict';

    var DEFAULT_VALUE = 360;

    var DEFAULT_SETTINGS = {
        seconds: 10,
        color: 'rgba(255, 255, 255, 0.8)',
        height: null,
        width: null,
        elementID: null
    };

    // Internal constants
    var PIE_TIMER_INTERVAL = 40;

    var TIMER_CSS_CLASS = 'pie_timer';

    var PIE_TIMER_DATA_NAME = 'pie_timer';

    // Math constants
    var THREE_PI_BY_TWO = 3 * Math.PI / 2;

    var PI_BY_180 = Math.PI / 180;

    var PieTimer = function (jquery_object, settings, callback) {
        if (settings.width === null) {
            settings.width = jquery_object.width();
        }
        if (settings.height === null) {
            settings.height = jquery_object.height();
        }

        this.settings = settings;
        this.jquery_object = jquery_object;
        this.interval_id = null;
        this.current_value = DEFAULT_VALUE;
				this.initial_time = settings.initial_time;
				this.accrued_time = 0;
        this.callback = callback;
        this.is_paused = true;
				this.is_reversed = typeof settings.is_reversed != 'undefined' ? settings.is_reversed : false;
        this.jquery_object.html('<canvas class="' + TIMER_CSS_CLASS + '" width="' + settings.width + '" height="' + settings.height + '"></canvas>');
        this.canvas = this.jquery_object.children('.' + TIMER_CSS_CLASS)[0];
        this.pieSeconds = this.settings.seconds;
    };

    PieTimer.prototype = {
        start: function () {
            if (this.is_paused) {
                if (this.current_value <= 0) {
                    this.current_value = DEFAULT_VALUE;
                }
                this.interval_id = setInterval($.proxy(this.run_timer, this), PIE_TIMER_INTERVAL);
                this.is_paused = false;
            }
        },

        pause: function () {
            if (!this.is_paused) {
							this.accrued_time = (new Date() - this.initial_time);
                clearInterval(this.interval_id);
                this.is_paused = true;
            }
        },

        run_timer: function () {
            if (this.canvas.getContext) {
							this.elapsed_time = (new Date() - this.initial_time) / 1000;
							this.current_value = DEFAULT_VALUE * Math.max(0, this.settings.seconds - this.elapsed_time) / this.settings.seconds;

                if(this.settings.elementID){
                    var seconds = Math.ceil(this.current_value/DEFAULT_VALUE * this.settings.seconds);
                    if(this.pieSeconds !== seconds){
                        this.pieSeconds = seconds;
                        $('#'+this.settings.elementID).html(this.pieSeconds);
                    }
                }

                if (this.current_value <= 0) {
                    clearInterval(this.interval_id);

                    // This is a total hack to clear the canvas. It would be
                    // better to fill the canvas with the background color
                    this.canvas.width = this.settings.width;

                    if ($.isFunction(this.callback)) {
                        this.callback.call();
                    }
                    this.is_paused = true;

                } else {
                    // This is a total hack to clear the canvas. It would be
                    // better to fill the canvas with the background color
                    this.canvas.width = this.settings.width;

                    var ctx = this.canvas.getContext('2d');

                    var canvas_size = [this.canvas.width, this.canvas.height];
                    var radius = Math.min(canvas_size[0], canvas_size[1]) / 2;
                    var center = [canvas_size[0] / 2, canvas_size[1] / 2];
										var isReversed = this.is_reversed;

                    ctx.beginPath();
                    ctx.moveTo(center[0], center[1]);
                    var start = THREE_PI_BY_TWO;
                    ctx.arc(
                        center[0],
                        center[1],
                        radius,
												isReversed
														? start - (360 - this.current_value) * PI_BY_180
														: start - this.current_value * PI_BY_180,
												start,
												isReversed
                    );

                    ctx.closePath();
                    ctx.fillStyle = this.settings.color;
                    ctx.fill();

                }
            }
        }
    };

    var create_timer = function (options, callback) {
        var settings = $.extend({}, DEFAULT_SETTINGS, options);

        return this.each(function () {
            var $element = $(this);
            var pie_timer = new PieTimer($element, settings, callback);
            $element.data(PIE_TIMER_DATA_NAME, pie_timer);
        });
    };

    var call_timer_method = function (method_name) {
        if (!(method_name in PieTimer.prototype)) {
            $.error('Method ' + method_name + ' does not exist on jQuery.pietimer');
        }
        var sliced_arguments = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $element = $(this);
            var pie_timer = $element.data(PIE_TIMER_DATA_NAME);

            if (!pie_timer) {
                // This element hasn't had pie timer constructed yet, so skip it
                return true;
            }
            pie_timer[method_name].apply(pie_timer, sliced_arguments);
        });
    };

    $.fn.pietimer = function (method) {

        if (typeof method === 'object' || ! method) {
            return create_timer.apply(this, arguments);
        } else {
            return call_timer_method.apply(this, arguments);
        }
    };

})(jQuery);

!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["web3.js"]=t():e["web3.js"]=t()}(this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var a=n[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=329)}([function(e,t,n){"use strict";t.__esModule=!0,t.default=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var a=n(107),o=r(a);t.default=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,o.default)(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}()},function(e,t,n){!function(n,r){e.exports=t=r()}(0,function(){var e=e||function(e,t){var n=Object.create||function(){function e(){}return function(t){var n;return e.prototype=t,n=new e,e.prototype=null,n}}(),r={},a=r.lib={},o=a.Base=function(){return{extend:function(e){var t=n(this);return e&&t.mixIn(e),t.hasOwnProperty("init")&&this.init!==t.init||(t.init=function(){t.$super.init.apply(this,arguments)}),t.init.prototype=t,t.$super=this,t},create:function(){var e=this.extend();return e.init.apply(e,arguments),e},init:function(){},mixIn:function(e){for(var t in e)e.hasOwnProperty(t)&&(this[t]=e[t]);e.hasOwnProperty("toString")&&(this.toString=e.toString)},clone:function(){return this.init.prototype.extend(this)}}}(),s=a.WordArray=o.extend({init:function(e,n){e=this.words=e||[],this.sigBytes=n!=t?n:4*e.length},toString:function(e){return(e||c).stringify(this)},concat:function(e){var t=this.words,n=e.words,r=this.sigBytes,a=e.sigBytes;if(this.clamp(),r%4)for(var o=0;o<a;o++){var s=n[o>>>2]>>>24-o%4*8&255;t[r+o>>>2]|=s<<24-(r+o)%4*8}else for(var o=0;o<a;o+=4)t[r+o>>>2]=n[o>>>2];return this.sigBytes+=a,this},clamp:function(){var t=this.words,n=this.sigBytes;t[n>>>2]&=4294967295<<32-n%4*8,t.length=e.ceil(n/4)},clone:function(){var e=o.clone.call(this);return e.words=this.words.slice(0),e},random:function(t){for(var n,r=[],a=function(t){var t=t,n=987654321,r=4294967295;return function(){n=36969*(65535&n)+(n>>16)&r,t=18e3*(65535&t)+(t>>16)&r;var a=(n<<16)+t&r;return a/=4294967296,(a+=.5)*(e.random()>.5?1:-1)}},o=0;o<t;o+=4){var i=a(4294967296*(n||e.random()));n=987654071*i(),r.push(4294967296*i()|0)}return new s.init(r,t)}}),i=r.enc={},c=i.Hex={stringify:function(e){for(var t=e.words,n=e.sigBytes,r=[],a=0;a<n;a++){var o=t[a>>>2]>>>24-a%4*8&255;r.push((o>>>4).toString(16)),r.push((15&o).toString(16))}return r.join("")},parse:function(e){for(var t=e.length,n=[],r=0;r<t;r+=2)n[r>>>3]|=parseInt(e.substr(r,2),16)<<24-r%8*4;return new s.init(n,t/2)}},u=i.Latin1={stringify:function(e){for(var t=e.words,n=e.sigBytes,r=[],a=0;a<n;a++){var o=t[a>>>2]>>>24-a%4*8&255;r.push(String.fromCharCode(o))}return r.join("")},parse:function(e){for(var t=e.length,n=[],r=0;r<t;r++)n[r>>>2]|=(255&e.charCodeAt(r))<<24-r%4*8;return new s.init(n,t)}},d=i.Utf8={stringify:function(e){try{return decodeURIComponent(escape(u.stringify(e)))}catch(e){throw new Error("Malformed UTF-8 data")}},parse:function(e){return u.parse(unescape(encodeURIComponent(e)))}},l=a.BufferedBlockAlgorithm=o.extend({reset:function(){this._data=new s.init,this._nDataBytes=0},_append:function(e){"string"==typeof e&&(e=d.parse(e)),this._data.concat(e),this._nDataBytes+=e.sigBytes},_process:function(t){var n=this._data,r=n.words,a=n.sigBytes,o=this.blockSize,i=4*o,c=a/i;c=t?e.ceil(c):e.max((0|c)-this._minBufferSize,0);var u=c*o,d=e.min(4*u,a);if(u){for(var l=0;l<u;l+=o)this._doProcessBlock(r,l);var f=r.splice(0,u);n.sigBytes-=d}return new s.init(f,d)},clone:function(){var e=o.clone.call(this);return e._data=this._data.clone(),e},_minBufferSize:0}),f=(a.Hasher=l.extend({cfg:o.extend(),init:function(e){this.cfg=this.cfg.extend(e),this.reset()},reset:function(){l.reset.call(this),this._doReset()},update:function(e){return this._append(e),this._process(),this},finalize:function(e){return e&&this._append(e),this._doFinalize()},blockSize:16,_createHelper:function(e){return function(t,n){return new e.init(n).finalize(t)}},_createHmacHelper:function(e){return function(t,n){return new f.HMAC.init(e,n).finalize(t)}}}),r.algo={});return r}(Math);return e})},function(e,t){var n=e.exports={version:"2.4.0"};"number"==typeof __e&&(__e=n)},function(e,t,n){!function(r,a){e.exports=t=a(n(2))}(0,function(e){e.lib.Cipher||function(t){var n=e,r=n.lib,a=r.Base,o=r.WordArray,s=r.BufferedBlockAlgorithm,i=n.enc,c=(i.Utf8,i.Base64),u=n.algo,d=u.EvpKDF,l=r.Cipher=s.extend({cfg:a.extend(),createEncryptor:function(e,t){return this.create(this._ENC_XFORM_MODE,e,t)},createDecryptor:function(e,t){return this.create(this._DEC_XFORM_MODE,e,t)},init:function(e,t,n){this.cfg=this.cfg.extend(n),this._xformMode=e,this._key=t,this.reset()},reset:function(){s.reset.call(this),this._doReset()},process:function(e){return this._append(e),this._process()},finalize:function(e){return e&&this._append(e),this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(){function e(e){return"string"==typeof e?k:x}return function(t){return{encrypt:function(n,r,a){return e(r).encrypt(t,n,r,a)},decrypt:function(n,r,a){return e(r).decrypt(t,n,r,a)}}}}()}),f=(r.StreamCipher=l.extend({_doFinalize:function(){return this._process(!0)},blockSize:1}),n.mode={}),p=r.BlockCipherMode=a.extend({createEncryptor:function(e,t){return this.Encryptor.create(e,t)},createDecryptor:function(e,t){return this.Decryptor.create(e,t)},init:function(e,t){this._cipher=e,this._iv=t}}),h=f.CBC=function(){function e(e,n,r){var a=this._iv;if(a){var o=a;this._iv=t}else var o=this._prevBlock;for(var s=0;s<r;s++)e[n+s]^=o[s]}var n=p.extend();return n.Encryptor=n.extend({processBlock:function(t,n){var r=this._cipher,a=r.blockSize;e.call(this,t,n,a),r.encryptBlock(t,n),this._prevBlock=t.slice(n,n+a)}}),n.Decryptor=n.extend({processBlock:function(t,n){var r=this._cipher,a=r.blockSize,o=t.slice(n,n+a);r.decryptBlock(t,n),e.call(this,t,n,a),this._prevBlock=o}}),n}(),m=n.pad={},b=m.Pkcs7={pad:function(e,t){for(var n=4*t,r=n-e.sigBytes%n,a=r<<24|r<<16|r<<8|r,s=[],i=0;i<r;i+=4)s.push(a);var c=o.create(s,r);e.concat(c)},unpad:function(e){var t=255&e.words[e.sigBytes-1>>>2];e.sigBytes-=t}},y=(r.BlockCipher=l.extend({cfg:l.cfg.extend({mode:h,padding:b}),reset:function(){l.reset.call(this);var e=this.cfg,t=e.iv,n=e.mode;if(this._xformMode==this._ENC_XFORM_MODE)var r=n.createEncryptor;else{var r=n.createDecryptor;this._minBufferSize=1}this._mode=r.call(n,this,t&&t.words)},_doProcessBlock:function(e,t){this._mode.processBlock(e,t)},_doFinalize:function(){var e=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){e.pad(this._data,this.blockSize);var t=this._process(!0)}else{var t=this._process(!0);e.unpad(t)}return t},blockSize:4}),r.CipherParams=a.extend({init:function(e){this.mixIn(e)},toString:function(e){return(e||this.formatter).stringify(this)}})),g=n.format={},v=g.OpenSSL={stringify:function(e){var t=e.ciphertext,n=e.salt;if(n)var r=o.create([1398893684,1701076831]).concat(n).concat(t);else var r=t;return r.toString(c)},parse:function(e){var t=c.parse(e),n=t.words;if(1398893684==n[0]&&1701076831==n[1]){var r=o.create(n.slice(2,4));n.splice(0,4),t.sigBytes-=16}return y.create({ciphertext:t,salt:r})}},x=r.SerializableCipher=a.extend({cfg:a.extend({format:v}),encrypt:function(e,t,n,r){r=this.cfg.extend(r);var a=e.createEncryptor(n,r),o=a.finalize(t),s=a.cfg;return y.create({ciphertext:o,key:n,iv:s.iv,algorithm:e,mode:s.mode,padding:s.padding,blockSize:e.blockSize,formatter:r.format})},decrypt:function(e,t,n,r){return r=this.cfg.extend(r),t=this._parse(t,r.format),e.createDecryptor(n,r).finalize(t.ciphertext)},_parse:function(e,t){return"string"==typeof e?t.parse(e,this):e}}),w=n.kdf={},_=w.OpenSSL={execute:function(e,t,n,r){r||(r=o.random(8));var a=d.create({keySize:t+n}).compute(e,r),s=o.create(a.words.slice(t),4*n);return a.sigBytes=4*t,y.create({key:a,iv:s,salt:r})}},k=r.PasswordBasedCipher=x.extend({cfg:x.cfg.extend({kdf:_}),encrypt:function(e,t,n,r){r=this.cfg.extend(r);var a=r.kdf.execute(n,e.keySize,e.ivSize);r.iv=a.iv;var o=x.encrypt.call(this,e,t,a.key,r);return o.mixIn(a),o},decrypt:function(e,t,n,r){r=this.cfg.extend(r),t=this._parse(t,r.format);var a=r.kdf.execute(n,e.keySize,e.ivSize,t.salt);return r.iv=a.iv,x.decrypt.call(this,e,t,a.key,r)}})}()})},function(e,t,n){var r=n(46),a=n(43),o=n(70),s={noether:"0",wei:"1",kwei:"1000",Kwei:"1000",babbage:"1000",femtoether:"1000",mwei:"1000000",Mwei:"1000000",lovelace:"1000000",picoether:"1000000",gwei:"1000000000",Gwei:"1000000000",shannon:"1000000000",nanoether:"1000000000",nano:"1000000000",szabo:"1000000000000",microether:"1000000000000",micro:"1000000000000",finney:"1000000000000000",milliether:"1000000000000000",milli:"1000000000000000",ether:"1000000000000000000",kether:"1000000000000000000000",grand:"1000000000000000000000",mether:"1000000000000000000000000",gether:"1000000000000000000000000000",tether:"1000000000000000000000000000000"},i=function(e,t,n){return new Array(t-e.length+1).join(n?n:"0")+e},c=function(e,t,n){return e+new Array(t-e.length+1).join(n?n:"0")},u=function(e){var t="",n=0,r=e.length;for("0x"===e.substring(0,2)&&(n=2);n<r;n+=2){var a=parseInt(e.substr(n,2),16);if(0===a)break;t+=String.fromCharCode(a)}return o.decode(t)},d=function(e){var t="",n=0,r=e.length;for("0x"===e.substring(0,2)&&(n=2);n<r;n+=2){var a=parseInt(e.substr(n,2),16);t+=String.fromCharCode(a)}return t},l=function(e){e=o.encode(e);for(var t="",n=0;n<e.length;n++){var r=e.charCodeAt(n);if(0===r)break;var a=r.toString(16);t+=a.length<2?"0"+a:a}return"0x"+t},f=function(e){for(var t="",n=0;n<e.length;n++){var r=e.charCodeAt(n),a=r.toString(16);t+=a.length<2?"0"+a:a}return"0x"+t},p=function(e){if(e.name.indexOf("(")!==-1)return e.name;var t=e.inputs.map(function(e){return e.type}).join();return e.name+"("+t+")"},h=function(e){var t=e.indexOf("(");return t!==-1?e.substr(0,t):e},m=function(e){var t=e.indexOf("(");return t!==-1?e.substr(t+1,e.length-1-(t+1)).replace(" ",""):""},b=function(e){return _(e).toNumber()},y=function(e){var t=_(e),n=t.toString(16);return t.lessThan(0)?"-0x"+n.substr(1):"0x"+n},g=function(e){if(R(e))return y(+e);if(D(e))return y(e);if(F(e))return l(JSON.stringify(e));if(P(e)){if(0===e.indexOf("-0x"))return y(e);if(0===e.indexOf("0x"))return e;if(!isFinite(e))return f(e)}return y(e)},v=function(e){e=e?e.toLowerCase():"ether";var t=s[e];if(void 0===t)throw new Error("This unit doesn't exists, please use the one of the following units"+JSON.stringify(s,null,2));return new r(t,10)},x=function(e,t){var n=_(e).dividedBy(v(t));return D(e)?n:n.toString(10)},w=function(e,t){var n=_(e).times(v(t));return D(e)?n:n.toString(10)},_=function(e){return e=e||0,D(e)?e:!P(e)||0!==e.indexOf("0x")&&0!==e.indexOf("-0x")?new r(e.toString(10),10):new r(e.replace("0x",""),16)},k=function(e){var t=_(e);return t.lessThan(0)?new r("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",16).plus(t).plus(1):t},A=function(e){return/^0x[0-9a-f]{40}$/i.test(e)},B=function(e){return!!/^(0x)?[0-9a-f]{40}$/i.test(e)&&(!(!/^(0x)?[0-9a-f]{40}$/.test(e)&&!/^(0x)?[0-9A-F]{40}$/.test(e))||S(e))},S=function(e){e=e.replace("0x","");for(var t=a(e.toLowerCase()),n=0;n<40;n++)if(parseInt(t[n],16)>7&&e[n].toUpperCase()!==e[n]||parseInt(t[n],16)<=7&&e[n].toLowerCase()!==e[n])return!1;return!0},T=function(e){if(void 0===e)return"";e=e.toLowerCase().replace("0x","");for(var t=a(e),n="0x",r=0;r<e.length;r++)parseInt(t[r],16)>7?n+=e[r].toUpperCase():n+=e[r];return n},C=function(e){return A(e)?e:/^[0-9a-f]{40}$/.test(e)?"0x"+e:"0x"+i(g(e).substr(2),40)},D=function(e){return e instanceof r||e&&e.constructor&&"BigNumber"===e.constructor.name},P=function(e){return"string"==typeof e||e&&e.constructor&&"String"===e.constructor.name},O=function(e){return"function"==typeof e},F=function(e){return"object"==typeof e},R=function(e){return"boolean"==typeof e},I=function(e){return e instanceof Array},N=function(e){try{return!!JSON.parse(e)}catch(e){return!1}};e.exports={padLeft:i,padRight:c,toHex:g,toDecimal:b,fromDecimal:y,toUtf8:u,toAscii:d,fromUtf8:l,fromAscii:f,transformToFullName:p,extractDisplayName:h,extractTypeName:m,toWei:w,fromWei:x,toBigNumber:_,toTwosComplement:k,toAddress:C,isBigNumber:D,isStrictAddress:A,isAddress:B,isChecksumAddress:S,toChecksumAddress:T,isFunction:O,isString:P,isObject:F,isBoolean:R,isArray:I,isJson:N}},function(e,t){var n=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},,function(e,t,n){var r=n(46),a=n(5),o=n(66),s=n(133),i=function(e){r.config(o.ETH_BIGNUMBER_ROUNDING_MODE);var t=a.padLeft(a.toTwosComplement(e).round().toString(16),64);return new s(t)},c=function(e){var t=a.toHex(e).substr(2),n=Math.floor((t.length+63)/64);return t=a.padRight(t,64*n),new s(t)},u=function(e){var t=a.toHex(e).substr(2),n=t.length/2,r=Math.floor((t.length+63)/64);return t=a.padRight(t,64*r),new s(i(n).value+t)},d=function(e){var t=a.fromUtf8(e).substr(2),n=t.length/2,r=Math.floor((t.length+63)/64);return t=a.padRight(t,64*r),new s(i(n).value+t)},l=function(e){return new s("000000000000000000000000000000000000000000000000000000000000000"+(e?"1":"0"))},f=function(e){return i(new r(e).times(new r(2).pow(128)))},p=function(e){return"1"===new r(e.substr(0,1),16).toString(2).substr(0,1)},h=function(e){var t=e.staticPart()||"0";return p(t)?new r(t,16).minus(new r("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",16)).minus(1):new r(t,16)},m=function(e){var t=e.staticPart()||"0";return new r(t,16)},b=function(e){return h(e).dividedBy(new r(2).pow(128))},y=function(e){return m(e).dividedBy(new r(2).pow(128))},g=function(e){return"0000000000000000000000000000000000000000000000000000000000000001"===e.staticPart()},v=function(e){return"0x"+e.staticPart()},x=function(e){var t=2*new r(e.dynamicPart().slice(0,64),16).toNumber();return"0x"+e.dynamicPart().substr(64,t)},w=function(e){var t=2*new r(e.dynamicPart().slice(0,64),16).toNumber();return a.toUtf8(e.dynamicPart().substr(64,t))},_=function(e){var t=e.staticPart();return"0x"+t.slice(t.length-40,t.length)};e.exports={formatInputInt:i,formatInputBytes:c,formatInputDynamicBytes:u,formatInputString:d,formatInputBool:l,formatInputReal:f,formatOutputInt:h,formatOutputUInt:m,formatOutputReal:b,formatOutputUReal:y,formatOutputBool:g,formatOutputBytes:v,formatOutputDynamicBytes:x,formatOutputString:w,formatOutputAddress:_}},function(e,t,n){e.exports=!n(16)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(e,t,n){var r=n(6),a=n(3),o=n(32),s=n(18),i="prototype",c=function(e,t,n){var u,d,l,f=e&c.F,p=e&c.G,h=e&c.S,m=e&c.P,b=e&c.B,y=e&c.W,g=p?a:a[t]||(a[t]={}),v=g[i],x=p?r:h?r[t]:(r[t]||{})[i];p&&(n=t);for(u in n)(d=!f&&x&&void 0!==x[u])&&u in g||(l=d?x[u]:n[u],g[u]=p&&"function"!=typeof x[u]?n[u]:b&&d?o(l,r):y&&x[u]==l?function(e){var t=function(t,n,r){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,n)}return new e(t,n,r)}return e.apply(this,arguments)};return t[i]=e[i],t}(l):m&&"function"==typeof l?o(Function.call,l):l,m&&((g.virtual||(g.virtual={}))[u]=l,e&c.R&&v&&!v[u]&&s(v,u,l)))};c.F=1,c.G=2,c.S=4,c.P=8,c.B=16,c.W=32,c.U=64,c.R=128,e.exports=c},function(e,t,n){var r=n(19);e.exports=function(e){if(!r(e))throw TypeError(e+" is not an object!");return e}},function(e,t,n){var r=n(11),a=n(81),o=n(61),s=Object.defineProperty;t.f=n(9)?Object.defineProperty:function(e,t,n){if(r(e),t=o(t,!0),r(n),a)try{return s(e,t,n)}catch(e){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(e[t]=n.value),e}},function(e,t,n){var r=n(82),a=n(47);e.exports=function(e){return r(a(e))}},function(e,t,n){var r=n(8),a=n(133),o=function(e){this._inputFormatter=e.inputFormatter,this._outputFormatter=e.outputFormatter};o.prototype.isType=function(e){throw"this method should be overrwritten for type "+e},o.prototype.staticPartLength=function(e){throw"this method should be overrwritten for type: "+e},o.prototype.isDynamicArray=function(e){var t=this.nestedTypes(e);return!!t&&!t[t.length-1].match(/[0-9]{1,}/g)},o.prototype.isStaticArray=function(e){var t=this.nestedTypes(e);return!!t&&!!t[t.length-1].match(/[0-9]{1,}/g)},o.prototype.staticArrayLength=function(e){var t=this.nestedTypes(e);return t?parseInt(t[t.length-1].match(/[0-9]{1,}/g)||1):1},o.prototype.nestedName=function(e){var t=this.nestedTypes(e);return t?e.substr(0,e.length-t[t.length-1].length):e},o.prototype.isDynamicType=function(){return!1},o.prototype.nestedTypes=function(e){return e.match(/(\[[0-9]*\])/g)},o.prototype.encode=function(e,t){var n=this;return this.isDynamicArray(t)?function(){var a=e.length,o=n.nestedName(t),s=[];return s.push(r.formatInputInt(a).encode()),e.forEach(function(e){s.push(n.encode(e,o))}),s}():this.isStaticArray(t)?function(){for(var r=n.staticArrayLength(t),a=n.nestedName(t),o=[],s=0;s<r;s++)o.push(n.encode(e[s],a));return o}():this._inputFormatter(e,t).encode()},o.prototype.decode=function(e,t,n){var r=this;if(this.isDynamicArray(n))return function(){for(var a=parseInt("0x"+e.substr(2*t,64)),o=parseInt("0x"+e.substr(2*a,64)),s=a+32,i=r.nestedName(n),c=r.staticPartLength(i),u=32*Math.floor((c+31)/32),d=[],l=0;l<o*u;l+=u)d.push(r.decode(e,s+l,i));return d}();if(this.isStaticArray(n))return function(){for(var a=r.staticArrayLength(n),o=t,s=r.nestedName(n),i=r.staticPartLength(s),c=32*Math.floor((i+31)/32),u=[],d=0;d<a*c;d+=c)u.push(r.decode(e,o+d,s));return u}();if(this.isDynamicType(n))return function(){var n=parseInt("0x"+e.substr(2*t,64)),o=parseInt("0x"+e.substr(2*n,64)),s=Math.floor((o+31)/32);return r._outputFormatter(new a(e.substr(2*n,64*(1+s)),0))}();var o=this.staticPartLength(n);return this._outputFormatter(new a(e.substr(2*t,2*o)))},e.exports=o},function(e,t,n){var r=n(5),a=n(66),o=n(68),s=function(e){return r.toBigNumber(e)},i=function(e){return"latest"===e||"pending"===e||"earliest"===e},c=function(e){return void 0===e?a.defaultBlock:u(e)},u=function(e){if(void 0!==e)return i(e)?e:r.toHex(e)},d=function(e){return e.from=e.from||a.defaultAccount,e.from&&(e.from=g(e.from)),e.to&&(e.to=g(e.to)),["gasPrice","gas","value","nonce"].filter(function(t){return void 0!==e[t]}).forEach(function(t){e[t]=r.fromDecimal(e[t])}),e},l=function(e){return e.from=e.from||a.defaultAccount,e.from=g(e.from),e.to&&(e.to=g(e.to)),["gasPrice","gas","value","nonce"].filter(function(t){return void 0!==e[t]}).forEach(function(t){e[t]=r.fromDecimal(e[t])}),e},f=function(e){return null!==e.blockNumber&&(e.blockNumber=r.toDecimal(e.blockNumber)),null!==e.transactionIndex&&(e.transactionIndex=r.toDecimal(e.transactionIndex)),e.nonce=r.toDecimal(e.nonce),e.gas=r.toDecimal(e.gas),e.gasPrice=r.toBigNumber(e.gasPrice),e.value=r.toBigNumber(e.value),e},p=function(e){return null!==e.blockNumber&&(e.blockNumber=r.toDecimal(e.blockNumber)),null!==e.transactionIndex&&(e.transactionIndex=r.toDecimal(e.transactionIndex)),e.cumulativeGasUsed=r.toDecimal(e.cumulativeGasUsed),e.gasUsed=r.toDecimal(e.gasUsed),r.isArray(e.logs)&&(e.logs=e.logs.map(function(e){return m(e)})),e},h=function(e){return e.gasLimit=r.toDecimal(e.gasLimit),e.gasUsed=r.toDecimal(e.gasUsed),e.size=r.toDecimal(e.size),e.timestamp=r.toDecimal(e.timestamp),null!==e.number&&(e.number=r.toDecimal(e.number)),e.difficulty=r.toBigNumber(e.difficulty),e.totalDifficulty=r.toBigNumber(e.totalDifficulty),r.isArray(e.transactions)&&e.transactions.forEach(function(e){if(!r.isString(e))return f(e)}),e},m=function(e){return null!==e.blockNumber&&(e.blockNumber=r.toDecimal(e.blockNumber)),null!==e.transactionIndex&&(e.transactionIndex=r.toDecimal(e.transactionIndex)),null!==e.logIndex&&(e.logIndex=r.toDecimal(e.logIndex)),e},b=function(e){return e.ttl=r.fromDecimal(e.ttl),e.workToProve=r.fromDecimal(e.workToProve),e.priority=r.fromDecimal(e.priority),r.isArray(e.topics)||(e.topics=e.topics?[e.topics]:[]),e.topics=e.topics.map(function(e){return 0===e.indexOf("0x")?e:r.fromUtf8(e)}),e},y=function(e){return e.expiry=r.toDecimal(e.expiry),e.sent=r.toDecimal(e.sent),e.ttl=r.toDecimal(e.ttl),e.workProved=r.toDecimal(e.workProved),e.topics||(e.topics=[]),e.topics=e.topics.map(function(e){return r.toAscii(e)}),e},g=function(e){var t=new o(e);if(t.isValid()&&t.isDirect())return"0x"+t.address();if(r.isStrictAddress(e))return e;if(r.isAddress(e))return"0x"+e;throw new Error("invalid address")},v=function(e){return e.startingBlock=r.toDecimal(e.startingBlock),e.currentBlock=r.toDecimal(e.currentBlock),e.highestBlock=r.toDecimal(e.highestBlock),e.knownStates&&(e.knownStates=r.toDecimal(e.knownStates),e.pulledStates=r.toDecimal(e.pulledStates)),e};e.exports={inputDefaultBlockNumberFormatter:c,inputBlockNumberFormatter:u,inputCallFormatter:d,inputTransactionFormatter:l,inputAddressFormatter:g,inputPostFormatter:b,outputBigNumberFormatter:s,outputTransactionFormatter:f,outputTransactionReceiptFormatter:p,outputBlockFormatter:h,outputLogFormatter:m,outputPostFormatter:y,outputSyncingFormatter:v}},function(e,t){e.exports=function(e){try{return!!e()}catch(e){return!0}}},function(e,t){var n={}.hasOwnProperty;e.exports=function(e,t){return n.call(e,t)}},function(e,t,n){var r=n(12),a=n(40);e.exports=n(9)?function(e,t,n){return r.f(e,t,a(1,n))}:function(e,t,n){return e[t]=n,e}},function(e,t){e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},function(e,t,n){var r=n(85),a=n(56);e.exports=Object.keys||function(e){return r(e,a)}},,,,,function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){e.exports={default:n(112),__esModule:!0}},,,,,function(e,t){var n={}.toString;e.exports=function(e){return n.call(e).slice(8,-1)}},function(e,t,n){var r=n(54);e.exports=function(e,t,n){if(r(e),void 0===t)return e;switch(n){case 1:return function(n){return e.call(t,n)};case 2:return function(n,r){return e.call(t,n,r)};case 3:return function(n,r,a){return e.call(t,n,r,a)}}return function(){return e.apply(t,arguments)}}},,function(e,t,n){!function(r,a){e.exports=t=a(n(2))}(0,function(e){return function(){function t(e,t,n){for(var r=[],o=0,s=0;s<t;s++)if(s%4){var i=n[e.charCodeAt(s-1)]<<s%4*2,c=n[e.charCodeAt(s)]>>>6-s%4*2;r[o>>>2]|=(i|c)<<24-o%4*8,o++}return a.create(r,o)}var n=e,r=n.lib,a=r.WordArray,o=n.enc;o.Base64={stringify:function(e){var t=e.words,n=e.sigBytes,r=this._map;e.clamp();for(var a=[],o=0;o<n;o+=3)for(var s=t[o>>>2]>>>24-o%4*8&255,i=t[o+1>>>2]>>>24-(o+1)%4*8&255,c=t[o+2>>>2]>>>24-(o+2)%4*8&255,u=s<<16|i<<8|c,d=0;d<4&&o+.75*d<n;d++)a.push(r.charAt(u>>>6*(3-d)&63));var l=r.charAt(64);if(l)for(;a.length%4;)a.push(l);return a.join("")},parse:function(e){var n=e.length,r=this._map,a=this._reverseMap;if(!a){a=this._reverseMap=[];for(var o=0;o<r.length;o++)a[r.charCodeAt(o)]=o}var s=r.charAt(64);if(s){var i=e.indexOf(s);i!==-1&&(n=i)}return t(e,n,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}(),e.enc.Base64})},function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(91),n(90))}(0,function(e){return function(){var t=e,n=t.lib,r=n.Base,a=n.WordArray,o=t.algo,s=o.MD5,i=o.EvpKDF=r.extend({cfg:r.extend({keySize:4,hasher:s,iterations:1}),init:function(e){this.cfg=this.cfg.extend(e)},compute:function(e,t){for(var n=this.cfg,r=n.hasher.create(),o=a.create(),s=o.words,i=n.keySize,c=n.iterations;s.length<i;){u&&r.update(u);var u=r.update(e).finalize(t);r.reset();for(var d=1;d<c;d++)u=r.finalize(u),r.reset();o.concat(u)}return o.sigBytes=4*i,o}});t.EvpKDF=function(e,t,n){return i.create(n).compute(e,t)}}(),e.EvpKDF})},function(e,t,n){!function(r,a){e.exports=t=a(n(2))}(0,function(e){return function(t){function n(e,t,n,r,a,o,s){var i=e+(t&n|~t&r)+a+s;return(i<<o|i>>>32-o)+t}function r(e,t,n,r,a,o,s){var i=e+(t&r|n&~r)+a+s;return(i<<o|i>>>32-o)+t}function a(e,t,n,r,a,o,s){var i=e+(t^n^r)+a+s;return(i<<o|i>>>32-o)+t}function o(e,t,n,r,a,o,s){var i=e+(n^(t|~r))+a+s;return(i<<o|i>>>32-o)+t}var s=e,i=s.lib,c=i.WordArray,u=i.Hasher,d=s.algo,l=[];!function(){for(var e=0;e<64;e++)l[e]=4294967296*t.abs(t.sin(e+1))|0}();var f=d.MD5=u.extend({_doReset:function(){this._hash=new c.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(e,t){for(var s=0;s<16;s++){var i=t+s,c=e[i];e[i]=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8)}var u=this._hash.words,d=e[t+0],f=e[t+1],p=e[t+2],h=e[t+3],m=e[t+4],b=e[t+5],y=e[t+6],g=e[t+7],v=e[t+8],x=e[t+9],w=e[t+10],_=e[t+11],k=e[t+12],A=e[t+13],B=e[t+14],S=e[t+15],T=u[0],C=u[1],D=u[2],P=u[3];T=n(T,C,D,P,d,7,l[0]),P=n(P,T,C,D,f,12,l[1]),D=n(D,P,T,C,p,17,l[2]),C=n(C,D,P,T,h,22,l[3]),T=n(T,C,D,P,m,7,l[4]),P=n(P,T,C,D,b,12,l[5]),D=n(D,P,T,C,y,17,l[6]),C=n(C,D,P,T,g,22,l[7]),T=n(T,C,D,P,v,7,l[8]),P=n(P,T,C,D,x,12,l[9]),D=n(D,P,T,C,w,17,l[10]),C=n(C,D,P,T,_,22,l[11]),T=n(T,C,D,P,k,7,l[12]),P=n(P,T,C,D,A,12,l[13]),D=n(D,P,T,C,B,17,l[14]),C=n(C,D,P,T,S,22,l[15]),T=r(T,C,D,P,f,5,l[16]),P=r(P,T,C,D,y,9,l[17]),D=r(D,P,T,C,_,14,l[18]),C=r(C,D,P,T,d,20,l[19]),T=r(T,C,D,P,b,5,l[20]),P=r(P,T,C,D,w,9,l[21]),D=r(D,P,T,C,S,14,l[22]),C=r(C,D,P,T,m,20,l[23]),T=r(T,C,D,P,x,5,l[24]),P=r(P,T,C,D,B,9,l[25]),D=r(D,P,T,C,h,14,l[26]),C=r(C,D,P,T,v,20,l[27]),T=r(T,C,D,P,A,5,l[28]),P=r(P,T,C,D,p,9,l[29]),D=r(D,P,T,C,g,14,l[30]),C=r(C,D,P,T,k,20,l[31]),T=a(T,C,D,P,b,4,l[32]),P=a(P,T,C,D,v,11,l[33]),D=a(D,P,T,C,_,16,l[34]),C=a(C,D,P,T,B,23,l[35]),T=a(T,C,D,P,f,4,l[36]),P=a(P,T,C,D,m,11,l[37]),D=a(D,P,T,C,g,16,l[38]),C=a(C,D,P,T,w,23,l[39]),T=a(T,C,D,P,A,4,l[40]),P=a(P,T,C,D,d,11,l[41]),D=a(D,P,T,C,h,16,l[42]),C=a(C,D,P,T,y,23,l[43]),T=a(T,C,D,P,x,4,l[44]),P=a(P,T,C,D,k,11,l[45]),D=a(D,P,T,C,S,16,l[46]),C=a(C,D,P,T,p,23,l[47]),T=o(T,C,D,P,d,6,l[48]),P=o(P,T,C,D,g,10,l[49]),D=o(D,P,T,C,B,15,l[50]),C=o(C,D,P,T,b,21,l[51]),T=o(T,C,D,P,k,6,l[52]),P=o(P,T,C,D,h,10,l[53]),D=o(D,P,T,C,w,15,l[54]),C=o(C,D,P,T,f,21,l[55]),T=o(T,C,D,P,v,6,l[56]),P=o(P,T,C,D,S,10,l[57]),D=o(D,P,T,C,y,15,l[58]),C=o(C,D,P,T,A,21,l[59]),T=o(T,C,D,P,m,6,l[60]),P=o(P,T,C,D,_,10,l[61]),D=o(D,P,T,C,p,15,l[62]),C=o(C,D,P,T,x,21,l[63]),u[0]=u[0]+T|0,u[1]=u[1]+C|0,u[2]=u[2]+D|0,u[3]=u[3]+P|0},_doFinalize:function(){var e=this._data,n=e.words,r=8*this._nDataBytes,a=8*e.sigBytes;n[a>>>5]|=128<<24-a%32;var o=t.floor(r/4294967296),s=r;n[15+(a+64>>>9<<4)]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8),n[14+(a+64>>>9<<4)]=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),e.sigBytes=4*(n.length+1),this._process();for(var i=this._hash,c=i.words,u=0;u<4;u++){var d=c[u];c[u]=16711935&(d<<8|d>>>24)|4278255360&(d<<24|d>>>8)}return i},clone:function(){var e=u.clone.call(this);return e._hash=this._hash.clone(),e}});s.MD5=u._createHelper(f),s.HmacMD5=u._createHmacHelper(f)}(Math),e.MD5})},function(e,t,n){var r=n(5),a=n(44),o=function(e){this.name=e.name,this.call=e.call,this.params=e.params||0,this.inputFormatter=e.inputFormatter,this.outputFormatter=e.outputFormatter,this.requestManager=null};o.prototype.setRequestManager=function(e){this.requestManager=e},o.prototype.getCall=function(e){return r.isFunction(this.call)?this.call(e):this.call},o.prototype.extractCallback=function(e){if(r.isFunction(e[e.length-1]))return e.pop()},o.prototype.validateArgs=function(e){if(e.length!==this.params)throw a.InvalidNumberOfParams()},o.prototype.formatInput=function(e){return this.inputFormatter?this.inputFormatter.map(function(t,n){return t?t(e[n]):e[n]}):e},o.prototype.formatOutput=function(e){return this.outputFormatter&&e?this.outputFormatter(e):e},o.prototype.toPayload=function(e){var t=this.getCall(e),n=this.extractCallback(e),r=this.formatInput(e);return this.validateArgs(r),{method:t,params:r,callback:n}},o.prototype.attachToObject=function(e){var t=this.buildCall();t.call=this.call;var n=this.name.split(".");n.length>1?(e[n[0]]=e[n[0]]||{},e[n[0]][n[1]]=t):e[n[0]]=t},o.prototype.buildCall=function(){var e=this,t=function(){var t=e.toPayload(Array.prototype.slice.call(arguments));return t.callback?e.requestManager.sendAsync(t,function(n,r){t.callback(n,e.formatOutput(r))}):e.formatOutput(e.requestManager.send(t))};return t.request=this.request.bind(this),t},o.prototype.request=function(){var e=this.toPayload(Array.prototype.slice.call(arguments));return e.format=this.formatOutput.bind(this),e},e.exports=o},function(e,t,n){e.exports={default:n(110),__esModule:!0}},,function(e,t){e.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},function(e,t,n){var r=n(47);e.exports=function(e){return Object(r(e))}},function(e,t){var n=0,r=Math.random();e.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++n+r).toString(36))}},function(e,t,n){var r=n(248),a=n(127);e.exports=function(e,t){return t&&"hex"===t.encoding&&(e.length>2&&"0x"===e.substr(0,2)&&(e=e.substr(2)),e=r.enc.Hex.parse(e)),a(e,{outputLength:256}).toString()}},function(e,t){e.exports={InvalidNumberOfParams:function(){return new Error("Invalid number of input parameters")},InvalidConnection:function(e){return new Error("CONNECTION ERROR: Couldn't connect to node "+e+".")},InvalidProvider:function(){return new Error("Provider not set or invalid")},InvalidResponse:function(e){var t=e&&e.error&&e.error.message?e.error.message:"Invalid JSON RPC response: "+JSON.stringify(e);return new Error(t)}}},function(e,t,n){var r=n(5),a=function(e){this.name=e.name,this.getter=e.getter,this.setter=e.setter,this.outputFormatter=e.outputFormatter,this.inputFormatter=e.inputFormatter,this.requestManager=null};a.prototype.setRequestManager=function(e){this.requestManager=e},a.prototype.formatInput=function(e){return this.inputFormatter?this.inputFormatter(e):e},a.prototype.formatOutput=function(e){return this.outputFormatter&&null!==e?this.outputFormatter(e):e},a.prototype.extractCallback=function(e){if(r.isFunction(e[e.length-1]))return e.pop()},a.prototype.attachToObject=function(e){var t={get:this.buildGet(),enumerable:!0},n=this.name.split("."),r=n[0];n.length>1&&(e[n[0]]=e[n[0]]||{},e=e[n[0]],r=n[1]),Object.defineProperty(e,r,t),e[o(r)]=this.buildAsyncGet()};var o=function(e){return"get"+e.charAt(0).toUpperCase()+e.slice(1)};a.prototype.buildGet=function(){var e=this;return function(){return e.formatOutput(e.requestManager.send({method:e.getter}))}},a.prototype.buildAsyncGet=function(){var e=this,t=function(t){e.requestManager.sendAsync({method:e.getter},function(n,r){t(n,e.formatOutput(r))})};return t.request=this.request.bind(this),t},a.prototype.request=function(){var e={method:this.getter,params:[],callback:this.extractCallback(Array.prototype.slice.call(arguments))};return e.format=this.formatOutput.bind(this),e},e.exports=a},function(e,t,n){var r;!function(a){"use strict";function o(e){function t(e,r){var a,o,s,i,c,u,d=this;if(!(d instanceof t))return G&&F(26,"constructor call without new",e),new t(e,r);if(null!=r&&W(r,2,64,N,"base")){if(r|=0,u=e+"",10==r)return d=new t(e instanceof t?e:u),R(d,H+d.e+1,j);if((i="number"==typeof e)&&0*e!=0||!new RegExp("^-?"+(a="["+A.slice(0,r)+"]+")+"(?:\\."+a+")?$",r<37?"i":"").test(u))return y(d,u,i,r);i?(d.s=1/e<0?(u=u.slice(1),-1):1,G&&u.replace(/^0\.0*|\./,"").length>15&&F(N,k,e),i=!1):d.s=45===u.charCodeAt(0)?(u=u.slice(1),-1):1,u=n(u,10,r,d.s)}else{if(e instanceof t)return d.s=e.s,d.e=e.e,d.c=(e=e.c)?e.slice():e,void(N=0);if((i="number"==typeof e)&&0*e==0){if(d.s=1/e<0?(e=-e,-1):1,e===~~e){for(o=0,s=e;s>=10;s/=10,o++);return d.e=o,d.c=[e],void(N=0)}u=e+""}else{if(!g.test(u=e+""))return y(d,u,i);d.s=45===u.charCodeAt(0)?(u=u.slice(1),-1):1}}for((o=u.indexOf("."))>-1&&(u=u.replace(".","")),(s=u.search(/e/i))>0?(o<0&&(o=s),o+=+u.slice(s+1),u=u.substring(0,s)):o<0&&(o=u.length),s=0;48===u.charCodeAt(s);s++);for(c=u.length;48===u.charCodeAt(--c););if(u=u.slice(s,c+1))if(c=u.length,i&&G&&c>15&&F(N,k,d.s*e),(o=o-s-1)>z)d.c=d.e=null;else if(o<U)d.c=[d.e=0];else{if(d.e=o,d.c=[],s=(o+1)%S,o<0&&(s+=S),s<c){for(s&&d.c.push(+u.slice(0,s)),c-=S;s<c;)d.c.push(+u.slice(s,s+=S));u=u.slice(s),s=S-u.length}else s-=c;for(;s--;u+="0");d.c.push(+u)}else d.c=[d.e=0];N=0}function n(e,n,r,a){var o,s,c,u,d,f,h,m=e.indexOf("."),b=H,y=j;for(r<37&&(e=e.toLowerCase()),m>=0&&(c=Q,Q=0,e=e.replace(".",""),h=new t(r),d=h.pow(e.length-m),Q=c,h.c=l(p(i(d.c),d.e),10,n),h.e=h.c.length),f=l(e,r,n),s=c=f.length;0==f[--c];f.pop());if(!f[0])return"0";if(m<0?--s:(d.c=f,d.e=s,d.s=a,d=I(d,h,b,y,n),f=d.c,u=d.r,s=d.e),o=s+b+1,m=f[o],c=n/2,u=u||o<0||null!=f[o+1],u=y<4?(null!=m||u)&&(0==y||y==(d.s<0?3:2)):m>c||m==c&&(4==y||u||6==y&&1&f[o-1]||y==(d.s<0?8:7)),o<1||!f[0])e=u?p("1",-b):"0";else{if(f.length=o,u)for(--n;++f[--o]>n;)f[o]=0,o||(++s,f.unshift(1));for(c=f.length;!f[--c];);for(m=0,e="";m<=c;e+=A.charAt(f[m++]));e=p(e,s)}return e}function r(e,n,r,a){var o,s,c,u,d;if(r=null!=r&&W(r,0,8,a,_)?0|r:j,!e.c)return e.toString();if(o=e.c[0],c=e.e,null==n)d=i(e.c),d=19==a||24==a&&c<=q?f(d,c):p(d,c);else if(e=R(new t(e),n,r),s=e.e,d=i(e.c),u=d.length,19==a||24==a&&(n<=s||s<=q)){for(;u<n;d+="0",u++);d=f(d,s)}else if(n-=c,d=p(d,s),s+1>u){if(--n>0)for(d+=".";n--;d+="0");}else if((n+=s-u)>0)for(s+1==u&&(d+=".");n--;d+="0");return e.s<0&&o?"-"+d:d}function a(e,n){var r,a,o=0;for(d(e[0])&&(e=e[0]),r=new t(e[0]);++o<e.length;){if(a=new t(e[o]),!a.s){r=a;break}n.call(r,a)&&(r=a)}return r}function m(e,t,n,r,a){return(e<t||e>n||e!=h(e))&&F(r,(a||"decimal places")+(e<t||e>n?" out of range":" not an integer"),e),!0}function O(e,t,n){for(var r=1,a=t.length;!t[--a];t.pop());for(a=t[0];a>=10;a/=10,r++);return(n=r+n*S-1)>z?e.c=e.e=null:n<U?e.c=[e.e=0]:(e.e=n,e.c=t),e}function F(e,t,n){var r=new Error(["new BigNumber","cmp","config","div","divToInt","eq","gt","gte","lt","lte","minus","mod","plus","precision","random","round","shift","times","toDigits","toExponential","toFixed","toFormat","toFraction","pow","toPrecision","toString","BigNumber"][e]+"() "+t+": "+n);throw r.name="BigNumber Error",N=0,r}function R(e,t,n,r){var a,o,s,i,c,u,d,l=e.c,f=C;if(l){e:{for(a=1,i=l[0];i>=10;i/=10,a++);if((o=t-a)<0)o+=S,s=t,c=l[u=0],d=c/f[a-s-1]%10|0;else if((u=v((o+1)/S))>=l.length){if(!r)break e;for(;l.length<=u;l.push(0));c=d=0,a=1,o%=S,s=o-S+1}else{for(c=i=l[u],a=1;i>=10;i/=10,a++);o%=S,s=o-S+a,d=s<0?0:c/f[a-s-1]%10|0}if(r=r||t<0||null!=l[u+1]||(s<0?c:c%f[a-s-1]),r=n<4?(d||r)&&(0==n||n==(e.s<0?3:2)):d>5||5==d&&(4==n||r||6==n&&(o>0?s>0?c/f[a-s]:0:l[u-1])%10&1||n==(e.s<0?8:7)),t<1||!l[0])return l.length=0,r?(t-=e.e+1,l[0]=f[t%S],e.e=-t||0):l[0]=e.e=0,e;if(0==o?(l.length=u,i=1,u--):(l.length=u+1,i=f[S-o],l[u]=s>0?x(c/f[a-s]%f[s])*i:0),r)for(;;){if(0==u){for(o=1,s=l[0];s>=10;s/=10,o++);for(s=l[0]+=i,i=1;s>=10;s/=10,i++);o!=i&&(e.e++,l[0]==B&&(l[0]=1));break}if(l[u]+=i,l[u]!=B)break;l[u--]=0,i=1}for(o=l.length;0===l[--o];l.pop());}e.e>z?e.c=e.e=null:e.e<U&&(e.c=[e.e=0])}return e}var I,N=0,E=t.prototype,M=new t(1),H=20,j=4,q=-7,L=21,U=-1e7,z=1e7,G=!0,W=m,V=!1,J=1,Q=100,K={decimalSeparator:".",groupSeparator:",",groupSize:3,secondaryGroupSize:0,fractionGroupSeparator:" ",fractionGroupSize:0};return t.another=o,t.ROUND_UP=0,t.ROUND_DOWN=1,t.ROUND_CEIL=2,t.ROUND_FLOOR=3,t.ROUND_HALF_UP=4,t.ROUND_HALF_DOWN=5,t.ROUND_HALF_EVEN=6,t.ROUND_HALF_CEIL=7,t.ROUND_HALF_FLOOR=8,t.EUCLID=9,t.config=function(){var e,t,n=0,r={},a=arguments,o=a[0],s=o&&"object"==typeof o?function(){if(o.hasOwnProperty(t))return null!=(e=o[t])}:function(){if(a.length>n)return null!=(e=a[n++])};return s(t="DECIMAL_PLACES")&&W(e,0,P,2,t)&&(H=0|e),r[t]=H,s(t="ROUNDING_MODE")&&W(e,0,8,2,t)&&(j=0|e),r[t]=j,s(t="EXPONENTIAL_AT")&&(d(e)?W(e[0],-P,0,2,t)&&W(e[1],0,P,2,t)&&(q=0|e[0],L=0|e[1]):W(e,-P,P,2,t)&&(q=-(L=0|(e<0?-e:e)))),r[t]=[q,L],s(t="RANGE")&&(d(e)?W(e[0],-P,-1,2,t)&&W(e[1],1,P,2,t)&&(U=0|e[0],z=0|e[1]):W(e,-P,P,2,t)&&(0|e?U=-(z=0|(e<0?-e:e)):G&&F(2,t+" cannot be zero",e))),r[t]=[U,z],s(t="ERRORS")&&(e===!!e||1===e||0===e?(N=0,W=(G=!!e)?m:u):G&&F(2,t+w,e)),r[t]=G,s(t="CRYPTO")&&(e===!!e||1===e||0===e?(V=!(!e||!b||"object"!=typeof b),e&&!V&&G&&F(2,"crypto unavailable",b)):G&&F(2,t+w,e)),r[t]=V,s(t="MODULO_MODE")&&W(e,0,9,2,t)&&(J=0|e),r[t]=J,s(t="POW_PRECISION")&&W(e,0,P,2,t)&&(Q=0|e),r[t]=Q,s(t="FORMAT")&&("object"==typeof e?K=e:G&&F(2,t+" not an object",e)),r[t]=K,r},t.max=function(){return a(arguments,E.lt)},t.min=function(){return a(arguments,E.gt)},t.random=function(){var e=9007199254740992,n=Math.random()*e&2097151?function(){return x(Math.random()*e)}:function(){return 8388608*(1073741824*Math.random()|0)+(8388608*Math.random()|0)};return function(e){var r,a,o,s,i,c=0,u=[],d=new t(M);if(e=null!=e&&W(e,0,P,14)?0|e:H,s=v(e/S),V)if(b&&b.getRandomValues){for(r=b.getRandomValues(new Uint32Array(s*=2));c<s;)i=131072*r[c]+(r[c+1]>>>11),i>=9e15?(a=b.getRandomValues(new Uint32Array(2)),r[c]=a[0],r[c+1]=a[1]):(u.push(i%1e14),c+=2);c=s/2}else if(b&&b.randomBytes){for(r=b.randomBytes(s*=7);c<s;)i=281474976710656*(31&r[c])+1099511627776*r[c+1]+4294967296*r[c+2]+16777216*r[c+3]+(r[c+4]<<16)+(r[c+5]<<8)+r[c+6],i>=9e15?b.randomBytes(7).copy(r,c):(u.push(i%1e14),c+=7);c=s/7}else G&&F(14,"crypto unavailable",b);if(!c)for(;c<s;)(i=n())<9e15&&(u[c++]=i%1e14);for(s=u[--c],e%=S,s&&e&&(i=C[S-e],u[c]=x(s/i)*i);0===u[c];u.pop(),c--);if(c<0)u=[o=0];else{for(o=-1;0===u[0];u.shift(),o-=S);for(c=1,i=u[0];i>=10;i/=10,c++);c<S&&(o-=S-c)}return d.e=o,d.c=u,d}}(),I=function(){function e(e,t,n){var r,a,o,s,i=0,c=e.length,u=t%D,d=t/D|0;for(e=e.slice();c--;)o=e[c]%D,s=e[c]/D|0,r=d*o+s*u,a=u*o+r%D*D+i,i=(a/n|0)+(r/D|0)+d*s,e[c]=a%n;return i&&e.unshift(i),e}function n(e,t,n,r){var a,o;if(n!=r)o=n>r?1:-1;else for(a=o=0;a<n;a++)if(e[a]!=t[a]){o=e[a]>t[a]?1:-1;break}return o}function r(e,t,n,r){for(var a=0;n--;)e[n]-=a,a=e[n]<t[n]?1:0,e[n]=a*r+e[n]-t[n];for(;!e[0]&&e.length>1;e.shift());}return function(a,o,i,c,u){var d,l,f,p,h,m,b,y,g,v,w,_,k,A,T,C,D,P=a.s==o.s?1:-1,O=a.c,F=o.c;if(!(O&&O[0]&&F&&F[0]))return new t(a.s&&o.s&&(O?!F||O[0]!=F[0]:F)?O&&0==O[0]||!F?0*P:P/0:NaN);for(y=new t(P),g=y.c=[],l=a.e-o.e,P=i+l+1,u||(u=B,l=s(a.e/S)-s(o.e/S),P=P/S|0),f=0;F[f]==(O[f]||0);f++);if(F[f]>(O[f]||0)&&l--,P<0)g.push(1),p=!0;else{for(A=O.length,C=F.length,f=0,P+=2,h=x(u/(F[0]+1)),h>1&&(F=e(F,h,u),O=e(O,h,u),C=F.length,A=O.length),k=C,v=O.slice(0,C),w=v.length;w<C;v[w++]=0);D=F.slice(),D.unshift(0),T=F[0],F[1]>=u/2&&T++;do{if(h=0,(d=n(F,v,C,w))<0){if(_=v[0],C!=w&&(_=_*u+(v[1]||0)),(h=x(_/T))>1)for(h>=u&&(h=u-1),m=e(F,h,u),b=m.length,w=v.length;1==n(m,v,b,w);)h--,r(m,C<b?D:F,b,u),b=m.length,d=1;else 0==h&&(d=h=1),m=F.slice(),b=m.length;if(b<w&&m.unshift(0),r(v,m,w,u),w=v.length,d==-1)for(;n(F,v,C,w)<1;)h++,r(v,C<w?D:F,w,u),w=v.length}else 0===d&&(h++,v=[0]);g[f++]=h,v[0]?v[w++]=O[k]||0:(v=[O[k]],w=1)}while((k++<A||null!=v[0])&&P--);p=null!=v[0],g[0]||g.shift()}if(u==B){for(f=1,P=g[0];P>=10;P/=10,f++);R(y,i+(y.e=f+l*S-1)+1,c,p)}else y.e=l,y.r=+p;return y}}(),y=function(){var e=/^(-?)0([xbo])/i,n=/^([^.]+)\.$/,r=/^\.([^.]+)$/,a=/^-?(Infinity|NaN)$/,o=/^\s*\+|^\s+|\s+$/g;return function(s,i,c,u){var d,l=c?i:i.replace(o,"");if(a.test(l))s.s=isNaN(l)?null:l<0?-1:1;else{if(!c&&(l=l.replace(e,function(e,t,n){return d="x"==(n=n.toLowerCase())?16:"b"==n?2:8,u&&u!=d?e:t}),u&&(d=u,l=l.replace(n,"$1").replace(r,"0.$1")),i!=l))return new t(l,d);G&&F(N,"not a"+(u?" base "+u:"")+" number",i),s.s=null}s.c=s.e=null,N=0}}(),E.absoluteValue=E.abs=function(){var e=new t(this);return e.s<0&&(e.s=1),e},E.ceil=function(){return R(new t(this),this.e+1,2)},E.comparedTo=E.cmp=function(e,n){return N=1,c(this,new t(e,n))},E.decimalPlaces=E.dp=function(){var e,t,n=this.c;if(!n)return null;if(e=((t=n.length-1)-s(this.e/S))*S,t=n[t])for(;t%10==0;t/=10,e--);return e<0&&(e=0),e},E.dividedBy=E.div=function(e,n){return N=3,I(this,new t(e,n),H,j)},E.dividedToIntegerBy=E.divToInt=function(e,n){return N=4,I(this,new t(e,n),0,1)},E.equals=E.eq=function(e,n){return N=5,0===c(this,new t(e,n))},E.floor=function(){return R(new t(this),this.e+1,3)},E.greaterThan=E.gt=function(e,n){return N=6,c(this,new t(e,n))>0},E.greaterThanOrEqualTo=E.gte=function(e,n){return N=7,1===(n=c(this,new t(e,n)))||0===n},E.isFinite=function(){return!!this.c},E.isInteger=E.isInt=function(){return!!this.c&&s(this.e/S)>this.c.length-2},E.isNaN=function(){return!this.s},E.isNegative=E.isNeg=function(){return this.s<0},E.isZero=function(){return!!this.c&&0==this.c[0]},E.lessThan=E.lt=function(e,n){return N=8,c(this,new t(e,n))<0},E.lessThanOrEqualTo=E.lte=function(e,n){return N=9,(n=c(this,new t(e,n)))===-1||0===n},E.minus=E.sub=function(e,n){var r,a,o,i,c=this,u=c.s;if(N=10,e=new t(e,n),n=e.s,!u||!n)return new t(NaN);if(u!=n)return e.s=-n,c.plus(e);var d=c.e/S,l=e.e/S,f=c.c,p=e.c;if(!d||!l){if(!f||!p)return f?(e.s=-n,e):new t(p?c:NaN);if(!f[0]||!p[0])return p[0]?(e.s=-n,e):new t(f[0]?c:3==j?-0:0)}if(d=s(d),l=s(l),f=f.slice(),u=d-l){for((i=u<0)?(u=-u,o=f):(l=d,o=p),o.reverse(),n=u;n--;o.push(0));o.reverse()}else for(a=(i=(u=f.length)<(n=p.length))?u:n,u=n=0;n<a;n++)if(f[n]!=p[n]){i=f[n]<p[n];break}if(i&&(o=f,f=p,p=o,e.s=-e.s),(n=(a=p.length)-(r=f.length))>0)for(;n--;f[r++]=0);for(n=B-1;a>u;){if(f[--a]<p[a]){for(r=a;r&&!f[--r];f[r]=n);--f[r],f[a]+=B}f[a]-=p[a]}for(;0==f[0];f.shift(),--l);return f[0]?O(e,f,l):(e.s=3==j?-1:1,e.c=[e.e=0],e)},E.modulo=E.mod=function(e,n){var r,a,o=this;return N=11,e=new t(e,n),!o.c||!e.s||e.c&&!e.c[0]?new t(NaN):!e.c||o.c&&!o.c[0]?new t(o):(9==J?(a=e.s,e.s=1,r=I(o,e,0,3),e.s=a,r.s*=a):r=I(o,e,0,J),o.minus(r.times(e)))},E.negated=E.neg=function(){var e=new t(this);return e.s=-e.s||null,e},E.plus=E.add=function(e,n){var r,a=this,o=a.s;if(N=12,e=new t(e,n),n=e.s,!o||!n)return new t(NaN);if(o!=n)return e.s=-n,a.minus(e);var i=a.e/S,c=e.e/S,u=a.c,d=e.c;if(!i||!c){if(!u||!d)return new t(o/0);if(!u[0]||!d[0])return d[0]?e:new t(u[0]?a:0*o)}if(i=s(i),c=s(c),u=u.slice(),o=i-c){for(o>0?(c=i,r=d):(o=-o,r=u),r.reverse();o--;r.push(0));r.reverse()}for(o=u.length,n=d.length,o-n<0&&(r=d,d=u,u=r,n=o),o=0;n;)o=(u[--n]=u[n]+d[n]+o)/B|0,u[n]%=B;return o&&(u.unshift(o),++c),O(e,u,c)},E.precision=E.sd=function(e){var t,n,r=this,a=r.c;if(null!=e&&e!==!!e&&1!==e&&0!==e&&(G&&F(13,"argument"+w,e),e!=!!e&&(e=null)),!a)return null;if(n=a.length-1,t=n*S+1,n=a[n]){for(;n%10==0;n/=10,t--);for(n=a[0];n>=10;n/=10,t++);}return e&&r.e+1>t&&(t=r.e+1),t},E.round=function(e,n){var r=new t(this);return(null==e||W(e,0,P,15))&&R(r,~~e+this.e+1,null!=n&&W(n,0,8,15,_)?0|n:j),r},E.shift=function(e){var n=this;return W(e,-T,T,16,"argument")?n.times("1e"+h(e)):new t(n.c&&n.c[0]&&(e<-T||e>T)?n.s*(e<0?0:1/0):n)},E.squareRoot=E.sqrt=function(){var e,n,r,a,o,c=this,u=c.c,d=c.s,l=c.e,f=H+4,p=new t("0.5");if(1!==d||!u||!u[0])return new t(!d||d<0&&(!u||u[0])?NaN:u?c:1/0);if(d=Math.sqrt(+c),0==d||d==1/0?(n=i(u),(n.length+l)%2==0&&(n+="0"),d=Math.sqrt(n),l=s((l+1)/2)-(l<0||l%2),d==1/0?n="1e"+l:(n=d.toExponential(),n=n.slice(0,n.indexOf("e")+1)+l),r=new t(n)):r=new t(d+""),r.c[0])for(l=r.e,d=l+f,d<3&&(d=0);;)if(o=r,r=p.times(o.plus(I(c,o,f,1))),i(o.c).slice(0,d)===(n=i(r.c)).slice(0,d)){if(r.e<l&&--d,"9999"!=(n=n.slice(d-3,d+1))&&(a||"4999"!=n)){+n&&(+n.slice(1)||"5"!=n.charAt(0))||(R(r,r.e+H+2,1),e=!r.times(r).eq(c));break}if(!a&&(R(o,o.e+H+2,0),o.times(o).eq(c))){r=o;break}f+=4,d+=4,a=1}return R(r,r.e+H+1,j,e)},E.times=E.mul=function(e,n){var r,a,o,i,c,u,d,l,f,p,h,m,b,y,g,v=this,x=v.c,w=(N=17,e=new t(e,n)).c;if(!(x&&w&&x[0]&&w[0]))return!v.s||!e.s||x&&!x[0]&&!w||w&&!w[0]&&!x?e.c=e.e=e.s=null:(e.s*=v.s,x&&w?(e.c=[0],e.e=0):e.c=e.e=null),e;for(a=s(v.e/S)+s(e.e/S),e.s*=v.s,d=x.length,p=w.length,d<p&&(b=x,x=w,w=b,o=d,d=p,p=o),o=d+p,b=[];o--;b.push(0));for(y=B,g=D,o=p;--o>=0;){for(r=0,h=w[o]%g,m=w[o]/g|0,c=d,i=o+c;i>o;)l=x[--c]%g,f=x[c]/g|0,u=m*l+f*h,l=h*l+u%g*g+b[i]+r,r=(l/y|0)+(u/g|0)+m*f,b[i--]=l%y;b[i]=r}return r?++a:b.shift(),O(e,b,a)},E.toDigits=function(e,n){var r=new t(this);return e=null!=e&&W(e,1,P,18,"precision")?0|e:null,n=null!=n&&W(n,0,8,18,_)?0|n:j,e?R(r,e,n):r},E.toExponential=function(e,t){return r(this,null!=e&&W(e,0,P,19)?1+~~e:null,t,19)},E.toFixed=function(e,t){return r(this,null!=e&&W(e,0,P,20)?~~e+this.e+1:null,t,20)},E.toFormat=function(e,t){var n=r(this,null!=e&&W(e,0,P,21)?~~e+this.e+1:null,t,21);if(this.c){var a,o=n.split("."),s=+K.groupSize,i=+K.secondaryGroupSize,c=K.groupSeparator,u=o[0],d=o[1],l=this.s<0,f=l?u.slice(1):u,p=f.length;if(i&&(a=s,s=i,i=a,p-=a),s>0&&p>0){for(a=p%s||s,u=f.substr(0,a);a<p;a+=s)u+=c+f.substr(a,s);i>0&&(u+=c+f.slice(a)),l&&(u="-"+u)}n=d?u+K.decimalSeparator+((i=+K.fractionGroupSize)?d.replace(new RegExp("\\d{"+i+"}\\B","g"),"$&"+K.fractionGroupSeparator):d):u}return n},E.toFraction=function(e){var n,r,a,o,s,c,u,d,l,f=G,p=this,h=p.c,m=new t(M),b=r=new t(M),y=u=new t(M);if(null!=e&&(G=!1,c=new t(e),G=f,(f=c.isInt())&&!c.lt(M)||(G&&F(22,"max denominator "+(f?"out of range":"not an integer"),e),e=!f&&c.c&&R(c,c.e+1,1).gte(M)?c:null)),!h)return p.toString();for(l=i(h),o=m.e=l.length-p.e-1,m.c[0]=C[(s=o%S)<0?S+s:s],e=!e||c.cmp(m)>0?o>0?m:b:c,s=z,z=1/0,c=new t(l),u.c[0]=0;d=I(c,m,0,1),a=r.plus(d.times(y)),1!=a.cmp(e);)r=y,y=a,b=u.plus(d.times(a=b)),u=a,m=c.minus(d.times(a=m)),c=a;return a=I(e.minus(r),y,0,1),u=u.plus(a.times(b)),r=r.plus(a.times(y)),u.s=b.s=p.s,o*=2,n=I(b,y,o,j).minus(p).abs().cmp(I(u,r,o,j).minus(p).abs())<1?[b.toString(),y.toString()]:[u.toString(),r.toString()],z=s,n},E.toNumber=function(){var e=this;return+e||(e.s?0*e.s:NaN)},E.toPower=E.pow=function(e){var n,r,a=x(e<0?-e:+e),o=this;if(!W(e,-T,T,23,"exponent")&&(!isFinite(e)||a>T&&(e/=0)||parseFloat(e)!=e&&!(e=NaN)))return new t(Math.pow(+o,e));for(n=Q?v(Q/S+2):0,r=new t(M);;){if(a%2){if(r=r.times(o),!r.c)break;n&&r.c.length>n&&(r.c.length=n)}if(!(a=x(a/2)))break;o=o.times(o),n&&o.c&&o.c.length>n&&(o.c.length=n)}return e<0&&(r=M.div(r)),n?R(r,Q,j):r},E.toPrecision=function(e,t){return r(this,null!=e&&W(e,1,P,24,"precision")?0|e:null,t,24)},E.toString=function(e){var t,r=this,a=r.s,o=r.e;return null===o?a?(t="Infinity",a<0&&(t="-"+t)):t="NaN":(t=i(r.c),t=null!=e&&W(e,2,64,25,"base")?n(p(t,o),0|e,10,a):o<=q||o>=L?f(t,o):p(t,o),a<0&&r.c[0]&&(t="-"+t)),t},E.truncated=E.trunc=function(){return R(new t(this),this.e+1,1)},E.valueOf=E.toJSON=function(){return this.toString()},null!=e&&t.config(e),t}function s(e){var t=0|e;return e>0||e===t?t:t-1}function i(e){for(var t,n,r=1,a=e.length,o=e[0]+"";r<a;){for(t=e[r++]+"",n=S-t.length;n--;t="0"+t);o+=t}for(a=o.length;48===o.charCodeAt(--a););return o.slice(0,a+1||1)}function c(e,t){var n,r,a=e.c,o=t.c,s=e.s,i=t.s,c=e.e,u=t.e;if(!s||!i)return null;if(n=a&&!a[0],r=o&&!o[0],n||r)return n?r?0:-i:s;if(s!=i)return s;if(n=s<0,r=c==u,!a||!o)return r?0:!a^n?1:-1;if(!r)return c>u^n?1:-1;for(i=(c=a.length)<(u=o.length)?c:u,s=0;s<i;s++)if(a[s]!=o[s])return a[s]>o[s]^n?1:-1;return c==u?0:c>u^n?1:-1}function u(e,t,n){return(e=h(e))>=t&&e<=n}function d(e){return"[object Array]"==Object.prototype.toString.call(e)}function l(e,t,n){for(var r,a,o=[0],s=0,i=e.length;s<i;){for(a=o.length;a--;o[a]*=t);for(o[r=0]+=A.indexOf(e.charAt(s++));r<o.length;r++)o[r]>n-1&&(null==o[r+1]&&(o[r+1]=0),o[r+1]+=o[r]/n|0,o[r]%=n)}return o.reverse()}function f(e,t){return(e.length>1?e.charAt(0)+"."+e.slice(1):e)+(t<0?"e":"e+")+t}function p(e,t){var n,r;if(t<0){for(r="0.";++t;r+="0");e=r+e}else if(n=e.length,++t>n){for(r="0",t-=n;--t;r+="0");e+=r}else t<n&&(e=e.slice(0,t)+"."+e.slice(t));return e}function h(e){return e=parseFloat(e),e<0?v(e):x(e)}var m,b,y,g=/^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,v=Math.ceil,x=Math.floor,w=" not a boolean or binary digit",_="rounding mode",k="number type has more than 15 significant digits",A="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_",B=1e14,S=14,T=9007199254740991,C=[1,10,100,1e3,1e4,1e5,1e6,1e7,1e8,1e9,1e10,1e11,1e12,1e13],D=1e7,P=1e9;m=o(),void 0!==(r=function(){return m}.call(t,n,t,e))&&(e.exports=r)}()},function(e,t){e.exports=function(e){if(void 0==e)throw TypeError("Can't call method on  "+e);return e}},function(e,t){var n=Math.ceil,r=Math.floor;e.exports=function(e){return isNaN(e=+e)?0:(e>0?r:n)(e)}},,,,,,function(e,t){e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},function(e,t,n){var r=n(19),a=n(6).document,o=r(a)&&r(a.createElement);e.exports=function(e){return o?a.createElement(e):{}}},function(e,t){e.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},,,function(e,t,n){var r=n(60)("keys"),a=n(42);e.exports=function(e){return r[e]||(r[e]=a(e))}},function(e,t,n){var r=n(6),a="__core-js_shared__",o=r[a]||(r[a]={});e.exports=function(e){return o[e]||(o[e]={})}},function(e,t,n){var r=n(19);e.exports=function(e,t){if(!r(e))return e;var n,a;if(t&&"function"==typeof(n=e.toString)&&!r(a=n.call(e)))return a;if("function"==typeof(n=e.valueOf)&&!r(a=n.call(e)))return a;if(!t&&"function"==typeof(n=e.toString)&&!r(a=n.call(e)))return a;throw TypeError("Can't convert object to primitive value")}},,,function(e,t,n){!function(r,a){e.exports=t=a(n(2))}(0,function(e){return function(t){var n=e,r=n.lib,a=r.Base,o=r.WordArray,s=n.x64={};s.Word=a.extend({init:function(e,t){this.high=e,this.low=t}}),s.WordArray=a.extend({init:function(e,n){e=this.words=e||[],this.sigBytes=n!=t?n:8*e.length},toX32:function(){for(var e=this.words,t=e.length,n=[],r=0;r<t;r++){var a=e[r];n.push(a.high),n.push(a.low)}return o.create(n,this.sigBytes)},clone:function(){for(var e=a.clone.call(this),t=e.words=this.words.slice(0),n=t.length,r=0;r<n;r++)t[r]=t[r].clone();return e}})}(),e})},,function(e,t,n){var r=n(46),a=["wei","kwei","Mwei","Gwei","szabo","finney","femtoether","picoether","nanoether","microether","milliether","nano","micro","milli","ether","grand","Mether","Gether","Tether","Pether","Eether","Zether","Yether","Nether","Dether","Vether","Uether"];e.exports={ETH_PADDING:32,ETH_SIGNATURE_LENGTH:4,ETH_UNITS:a,ETH_BIGNUMBER_ROUNDING_MODE:{ROUNDING_MODE:r.ROUND_DOWN},ETH_POLLING_TIMEOUT:500,defaultBlock:"latest",defaultAccount:void 0}},function(e,t,n){var r=n(15),a=n(5),o=function(e){return null===e||void 0===e?null:(e=String(e),0===e.indexOf("0x")?e:a.fromUtf8(e))},s=function(e){return a.isString(e)?e:(e=e||{},e.topics=e.topics||[],e.topics=e.topics.map(function(e){return a.isArray(e)?e.map(o):o(e)}),{topics:e.topics,from:e.from,to:e.to,address:e.address,fromBlock:r.inputBlockNumberFormatter(e.fromBlock),toBlock:r.inputBlockNumberFormatter(e.toBlock)})},i=function(e,t){a.isString(e.options)||e.get(function(e,n){e&&t(e),a.isArray(n)&&n.forEach(function(e){t(null,e)})})},c=function(e){var t=function(t,n){if(t)return e.callbacks.forEach(function(e){e(t)});a.isArray(n)&&n.forEach(function(t){t=e.formatter?e.formatter(t):t,e.callbacks.forEach(function(e){e(null,t)})})};e.requestManager.startPolling({method:e.implementation.poll.call,params:[e.filterId]},e.filterId,t,e.stopWatching.bind(e))},u=function(e,t,n,r,a){var o=this,u={};return n.forEach(function(t){t.setRequestManager(e),t.attachToObject(u)}),this.requestManager=e,this.options=s(t),this.implementation=u,this.filterId=null,this.callbacks=[],this.getLogsCallbacks=[],this.pollFilters=[],this.formatter=r,this.implementation.newFilter(this.options,function(e,t){if(e)o.callbacks.forEach(function(t){t(e)});else if(o.filterId=t,o.getLogsCallbacks.forEach(function(e){o.get(e)}),o.getLogsCallbacks=[],o.callbacks.forEach(function(e){i(o,e)}),o.callbacks.length>0&&c(o),"function"==typeof a)return o.watch(a)}),this};u.prototype.watch=function(e){return this.callbacks.push(e),this.filterId&&(i(this,e),c(this)),this},u.prototype.stopWatching=function(e){if(this.requestManager.stopPolling(this.filterId),this.callbacks=[],!e)return this.implementation.uninstallFilter(this.filterId);this.implementation.uninstallFilter(this.filterId,e)},u.prototype.get=function(e){var t=this;if(!a.isFunction(e)){if(null===this.filterId)throw new Error("Filter ID Error: filter().get() can't be chained synchronous, please provide a callback for the get() method.");return this.implementation.getLogs(this.filterId).map(function(e){return t.formatter?t.formatter(e):e})}return null===this.filterId?this.getLogsCallbacks.push(e):this.implementation.getLogs(this.filterId,function(n,r){n?e(n):e(null,r.map(function(e){return t.formatter?t.formatter(e):e}))}),this},e.exports=u},function(e,t,n){var r=n(46),a=function(e,t){for(var n=e;n.length<2*t;)n="0"+n;return n},o=function(e){var t="A".charCodeAt(0),n="Z".charCodeAt(0);return e=e.toUpperCase(),e=e.substr(4)+e.substr(0,4),e.split("").map(function(e){var r=e.charCodeAt(0);return r>=t&&r<=n?r-t+10:e}).join("")},s=function(e){for(var t,n=e;n.length>2;)t=n.slice(0,9),n=parseInt(t,10)%97+n.slice(t.length);return parseInt(n,10)%97},i=function(e){this._iban=e};i.fromAddress=function(e){var t=new r(e,16),n=t.toString(36),o=a(n,15);return i.fromBban(o.toUpperCase())},i.fromBban=function(e){var t="XE",n=s(o(t+"00"+e)),r=("0"+(98-n)).slice(-2);return new i(t+r+e)},i.createIndirect=function(e){return i.fromBban("ETH"+e.institution+e.identifier)},i.isValid=function(e){return new i(e).isValid()},i.prototype.isValid=function(){return/^XE[0-9]{2}(ETH[0-9A-Z]{13}|[0-9A-Z]{30,31})$/.test(this._iban)&&1===s(o(this._iban))},i.prototype.isDirect=function(){return 34===this._iban.length||35===this._iban.length},i.prototype.isIndirect=function(){return 20===this._iban.length},i.prototype.checksum=function(){return this._iban.substr(2,2)},i.prototype.institution=function(){return this.isIndirect()?this._iban.substr(7,4):""},i.prototype.client=function(){return this.isIndirect()?this._iban.substr(11):""},i.prototype.address=function(){if(this.isDirect()){var e=this._iban.substr(4),t=new r(e,36);return a(t.toString(16),20)}return""},i.prototype.toString=function(){return this._iban},e.exports=i},function(e,t,n){var r=n(37),a=function(){return[new r({name:"newFilter",call:function(e){switch(e[0]){case"latest":return e.shift(),this.params=0,"eth_newBlockFilter";case"pending":return e.shift(),this.params=0,"eth_newPendingTransactionFilter";default:return"eth_newFilter"}},params:1}),new r({name:"uninstallFilter",call:"eth_uninstallFilter",params:1}),new r({name:"getLogs",call:"eth_getFilterLogs",params:1}),new r({name:"poll",call:"eth_getFilterChanges",params:1})]},o=function(){return[new r({name:"newFilter",call:"shh_newFilter",params:1}),new r({name:"uninstallFilter",call:"shh_uninstallFilter",params:1}),new r({name:"getLogs",call:"shh_getMessages",params:1}),new r({name:"poll",call:"shh_getFilterChanges",params:1})]};e.exports={eth:a,shh:o}},function(e,t,n){(function(e,r){var a;!function(o){function s(e){for(var t,n,r=[],a=0,o=e.length;a<o;)t=e.charCodeAt(a++),t>=55296&&t<=56319&&a<o?(n=e.charCodeAt(a++),56320==(64512&n)?r.push(((1023&t)<<10)+(1023&n)+65536):(r.push(t),a--)):r.push(t);return r}function i(e){for(var t,n=e.length,r=-1,a="";++r<n;)t=e[r],t>65535&&(t-=65536,a+=x(t>>>10&1023|55296),t=56320|1023&t),a+=x(t);return a}function c(e){if(e>=55296&&e<=57343)throw Error("Lone surrogate U+"+e.toString(16).toUpperCase()+" is not a scalar value")}function u(e,t){return x(e>>t&63|128)}function d(e){if(0==(4294967168&e))return x(e);var t="";return 0==(4294965248&e)?t=x(e>>6&31|192):0==(4294901760&e)?(c(e),t=x(e>>12&15|224),t+=u(e,6)):0==(4292870144&e)&&(t=x(e>>18&7|240),t+=u(e,12),t+=u(e,6)),t+=x(63&e|128)}function l(e){for(var t,n=s(e),r=n.length,a=-1,o="";++a<r;)t=n[a],o+=d(t);return o}function f(){if(v>=g)throw Error("Invalid byte index");var e=255&y[v];if(v++,128==(192&e))return 63&e;throw Error("Invalid continuation byte")}function p(){var e,t,n,r,a;if(v>g)throw Error("Invalid byte index");if(v==g)return!1;if(e=255&y[v],v++,0==(128&e))return e;if(192==(224&e)){if(t=f(),(a=(31&e)<<6|t)>=128)return a;throw Error("Invalid continuation byte")}if(224==(240&e)){if(t=f(),n=f(),(a=(15&e)<<12|t<<6|n)>=2048)return c(a),a;throw Error("Invalid continuation byte")}if(240==(248&e)&&(t=f(),n=f(),r=f(),(a=(7&e)<<18|t<<12|n<<6|r)>=65536&&a<=1114111))return a;throw Error("Invalid UTF-8 detected")}function h(e){y=s(e),g=y.length,v=0;for(var t,n=[];(t=p())!==!1;)n.push(t);return i(n)}var m="object"==typeof t&&t,b=("object"==typeof e&&e&&e.exports,"object"==typeof r&&r);b.global!==b&&b.window;var y,g,v,x=String.fromCharCode,w={version:"2.1.2",encode:l,decode:h};void 0!==(a=function(){return w}.call(t,n,t,e))&&(e.exports=a)}()}).call(t,n(136)(e),n(25))},,,,,,function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function a(e,t){return Object.defineProperty(t,"_preamble",{value:e.trim(),enumerable:!1}),t}function o(e,t){var n=null==e?null:e.constructor;return n===Object||n===Array?(Object.defineProperty(e,"_comment",{value:t,enumerable:!1}),e):new p(e,t)}function s(e){return o("0x"+e.toString(16),e.toString())}Object.defineProperty(t,"__esModule",{value:!0}),t.Dummy=void 0;var i=n(38),c=r(i),u=n(0),d=r(u),l=n(1),f=r(l);t.withPreamble=a,t.withComment=o,t.fromDecimal=s;var p=(t.Dummy=function(){function e(t){(0,d.default)(this,e),this.value=t}return(0,f.default)(e,[{key:"toString",value:function(){return this.value}},{key:"toJSON",value:function(){return"##"+this.value+"##"}}],[{key:"fixJSON",value:function(e){return e.replace(/"##([^#]+)##"/g,"$1")}},{key:"isDummy",value:function(t){return t instanceof e}},{key:"stringifyJSON",value:function(t){return e.fixJSON((0,c.default)(t))}}]),e}(),function(){function e(t,n){(0,d.default)(this,e),this._value=t,this._comment=n}return(0,f.default)(e,[{key:"toJSON",value:function(){return this._value}}]),e}())},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.TransactionResponse=t.TransactionRequest=t.CallRequest=t.BlockNumber=t.Quantity=t.Integer=t.Hash=t.Data=t.Address=void 0;var a,o,s,i,c,u,d,l,f=n(0),p=r(f),h=t.Address=function e(){(0,p.default)(this,e)},m=t.Data=function e(){(0,p.default)(this,e)},b=t.Hash=function e(){(0,p.default)(this,e)},y=(t.Integer=function e(){(0,p.default)(this,e)},t.Quantity=function e(){(0,p.default)(this,e)}),g=t.BlockNumber=(o=a=function e(){(0,p.default)(this,e)},a.print="`Quantity` | `Tag`",o);t.CallRequest=(i=s=function e(){(0,p.default)(this,e)},s.print="`Object`",s.details={from:{type:h,desc:"20 Bytes - The address the transaction is send from.",optional:!0},to:{type:h,desc:"(optional when creating new contract) 20 Bytes - The address the transaction is directed to."},gas:{type:y,desc:"Integer of the gas provided for the transaction execution. eth_call consumes zero gas, but this parameter may be needed by some executions.",optional:!0},gasPrice:{type:y,desc:"Integer of the gas price used for each paid gas.",optional:!0},value:{type:y,desc:"Integer of the value sent with this transaction.",optional:!0},data:{type:m,desc:"4 byte hash of the method signature followed by encoded parameters. For details see [Ethereum Contract ABI](https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI).",optional:!0}},i),t.TransactionRequest=(u=c=function e(){(0,p.default)(this,e)},c.print="`Object`",c.details={from:{type:h,desc:"20 Bytes - The address the transaction is send from."},to:{type:h,desc:"20 Bytes - The address the transaction is directed to.",optional:!0},gas:{type:y,desc:"Integer of the gas provided for the transaction execution. eth_call consumes zero gas, but this parameter may be needed by some executions.",optional:!0},gasPrice:{type:y,desc:"Integer of the gas price used for each paid gas.",optional:!0},value:{type:y,desc:"Integer of the value sent with this transaction.",optional:!0},data:{type:m,desc:"4 byte hash of the method signature followed by encoded parameters. For details see [Ethereum Contract ABI](https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI).",optional:!0},nonce:{type:y,desc:"Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.",optional:!0},condition:{type:Object,desc:"Conditional submission of the transaction. Can be either an integer block number `{ block: 1 }` or UTC timestamp (in seconds) `{ time: 1491290692 }` or `null`.",optional:!0}},u),t.TransactionResponse=(l=d=function e(){(0,p.default)(this,e)},d.print="`Object`",d.details={hash:{type:b,desc:"32 Bytes - hash of the transaction."},nonce:{type:y,desc:"The number of transactions made by the sender prior to this one."},blockHash:{type:b,desc:"32 Bytes - hash of the block where this transaction was in. `null` when its pending."},blockNumber:{type:g,desc:"Block number where this transaction was in. `null` when its pending."},transactionIndex:{type:y,desc:"Integer of the transactions index position in the block. `null` when its pending."},from:{type:h,desc:"20 Bytes - address of the sender."},to:{type:h,desc:"20 Bytes - address of the receiver. `null` when its a contract creation transaction."},value:{type:y,desc:"Value transferred in Wei."},gasPrice:{type:y,desc:"Gas price provided by the sender in Wei."},gas:{type:y,desc:"Gas provided by the sender."},input:{type:m,desc:"The data send along with the transaction."},creates:{type:h,optional:!0,desc:"Address of a created contract or `null`."},raw:{type:m,desc:"Raw transaction data."},publicKey:{type:m,desc:"Public key of the signer."},networkId:{type:y,desc:"The network id of the transaction, if any."},standardV:{type:y,desc:"The standardized V field of the signature (0 or 1)."},v:{type:y,desc:"The V field of the signature."},r:{type:y,desc:"The R field of the signature."},s:{type:y,desc:"The S field of the signature."},condition:{type:Object,optional:!0,desc:"Conditional submission, Block number in `block` or timestamp in `time` or `null`."}},l)},,,,function(e,t,n){e.exports=!n(9)&&!n(16)(function(){return 7!=Object.defineProperty(n(55)("div"),"a",{get:function(){return 7}}).a})},function(e,t,n){var r=n(31);e.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==r(e)?e.split(""):Object(e)}},,,function(e,t,n){var r=n(17),a=n(13),o=n(113)(!1),s=n(59)("IE_PROTO");e.exports=function(e,t){var n,i=a(e),c=0,u=[];for(n in i)n!=s&&r(i,n)&&u.push(n);for(;t.length>c;)r(i,n=t[c++])&&(~o(u,n)||u.push(n));return u}},function(e,t,n){var r=n(10),a=n(3),o=n(16);e.exports=function(e,t){var n=(a.Object||{})[e]||Object[e],s={};s[e]=t(n),r(r.S+r.F*o(function(){n(1)}),"Object",s)}},function(e,t,n){var r=n(48),a=Math.min;e.exports=function(e){return e>0?a(r(e),9007199254740991):0}},,,function(e,t,n){!function(r,a){e.exports=t=a(n(2))}(0,function(e){!function(){var t=e,n=t.lib,r=n.Base,a=t.enc,o=a.Utf8,s=t.algo;s.HMAC=r.extend({init:function(e,t){e=this._hasher=new e.init,"string"==typeof t&&(t=o.parse(t));var n=e.blockSize,r=4*n;t.sigBytes>r&&(t=e.finalize(t)),t.clamp();for(var a=this._oKey=t.clone(),s=this._iKey=t.clone(),i=a.words,c=s.words,u=0;u<n;u++)i[u]^=1549556828,c[u]^=909522486;a.sigBytes=s.sigBytes=r,this.reset()},reset:function(){var e=this._hasher;e.reset(),e.update(this._iKey)},update:function(e){return this._hasher.update(e),this},finalize:function(e){var t=this._hasher,n=t.finalize(e);return t.reset(),t.finalize(this._oKey.clone().concat(n))}})}()})},function(e,t,n){!function(r,a){e.exports=t=a(n(2))}(0,function(e){return function(){var t=e,n=t.lib,r=n.WordArray,a=n.Hasher,o=t.algo,s=[],i=o.SHA1=a.extend({_doReset:function(){this._hash=new r.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(e,t){for(var n=this._hash.words,r=n[0],a=n[1],o=n[2],i=n[3],c=n[4],u=0;u<80;u++){if(u<16)s[u]=0|e[t+u];else{var d=s[u-3]^s[u-8]^s[u-14]^s[u-16];s[u]=d<<1|d>>>31}var l=(r<<5|r>>>27)+c+s[u];l+=u<20?1518500249+(a&o|~a&i):u<40?1859775393+(a^o^i):u<60?(a&o|a&i|o&i)-1894007588:(a^o^i)-899497514,c=i,i=o,o=a<<30|a>>>2,a=r,r=l}n[0]=n[0]+r|0,n[1]=n[1]+a|0,n[2]=n[2]+o|0,n[3]=n[3]+i|0,n[4]=n[4]+c|0},_doFinalize:function(){var e=this._data,t=e.words,n=8*this._nDataBytes,r=8*e.sigBytes;return t[r>>>5]|=128<<24-r%32,t[14+(r+64>>>9<<4)]=Math.floor(n/4294967296),t[15+(r+64>>>9<<4)]=n,e.sigBytes=4*t.length,this._process(),this._hash},clone:function(){var e=a.clone.call(this);return e._hash=this._hash.clone(),e}});t.SHA1=a._createHelper(i),t.HmacSHA1=a._createHmacHelper(i)}(),e.SHA1})},,function(e,t,n){var r=n(8),a=n(296),o=n(297),s=n(300),i=n(303),c=n(299),u=n(302),d=n(301),l=n(304),f=n(298),p=function(e){this._types=e};p.prototype._requireType=function(e){var t=this._types.filter(function(t){return t.isType(e)})[0];if(!t)throw Error("invalid solidity type!: "+e);return t},p.prototype.encodeParam=function(e,t){return this.encodeParams([e],[t])},p.prototype.encodeParams=function(e,t){var n=this.getSolidityTypes(e),r=n.map(function(n,r){return n.encode(t[r],e[r])}),a=n.reduce(function(t,n,r){var a=n.staticPartLength(e[r]);return t+32*Math.floor((a+31)/32)},0);return this.encodeMultiWithOffset(e,n,r,a)},p.prototype.encodeMultiWithOffset=function(e,t,n,a){var o="",s=this,i=function(n){return t[n].isDynamicArray(e[n])||t[n].isDynamicType(e[n])};return e.forEach(function(c,u){if(i(u)){o+=r.formatInputInt(a).encode();var d=s.encodeWithOffset(e[u],t[u],n[u],a);a+=d.length/2}else o+=s.encodeWithOffset(e[u],t[u],n[u],a)}),e.forEach(function(r,c){if(i(c)){var u=s.encodeWithOffset(e[c],t[c],n[c],a);a+=u.length/2,o+=u}}),o},p.prototype.encodeWithOffset=function(e,t,n,a){var o=this;return t.isDynamicArray(e)?function(){var s=t.nestedName(e),i=t.staticPartLength(s),c=n[0];return function(){var e=2;if(t.isDynamicArray(s))for(var o=1;o<n.length;o++)e+=+n[o-1][0]||0,c+=r.formatInputInt(a+o*i+32*e).encode()}(),function(){for(var e=0;e<n.length-1;e++){var r=c/2;c+=o.encodeWithOffset(s,t,n[e+1],a+r)}}(),c}():t.isStaticArray(e)?function(){var s=t.nestedName(e),i=t.staticPartLength(s),c="";return t.isDynamicArray(s)&&function(){for(var e=0,t=0;t<n.length;t++)e+=+(n[t-1]||[])[0]||0,c+=r.formatInputInt(a+t*i+32*e).encode()}(),function(){for(var e=0;e<n.length;e++){var r=c/2;c+=o.encodeWithOffset(s,t,n[e],a+r)}}(),c}():n},p.prototype.decodeParam=function(e,t){return this.decodeParams([e],t)[0]},p.prototype.decodeParams=function(e,t){var n=this.getSolidityTypes(e),r=this.getOffsets(e,n);return n.map(function(n,a){return n.decode(t,r[a],e[a],a)})},p.prototype.getOffsets=function(e,t){for(var n=t.map(function(t,n){return t.staticPartLength(e[n])}),r=1;r<n.length;r++)n[r]+=n[r-1];return n.map(function(n,r){return n-t[r].staticPartLength(e[r])})},p.prototype.getSolidityTypes=function(e){var t=this;return e.map(function(e){return t._requireType(e)})};var h=new p([new a,new o,new s,new i,new c,new f,new u,new d,new l]);e.exports=h},,,,,,,,,,,,,,function(e,t,n){e.exports={default:n(111),__esModule:!0}},,,function(e,t,n){var r=n(3),a=r.JSON||(r.JSON={stringify:JSON.stringify});e.exports=function(e){return a.stringify.apply(a,arguments)}},function(e,t,n){n(123);var r=n(3).Object;e.exports=function(e,t,n){return r.defineProperty(e,t,n)}},function(e,t,n){n(124),e.exports=n(3).Object.keys},function(e,t,n){var r=n(13),a=n(87),o=n(121);e.exports=function(e){return function(t,n,s){var i,c=r(t),u=a(c.length),d=o(s,u);if(e&&n!=n){for(;u>d;)if((i=c[d++])!=i)return!0}else for(;u>d;d++)if((e||d in c)&&c[d]===n)return e||d||0;return!e&&-1}}},,,,,,,,function(e,t,n){var r=n(48),a=Math.max,o=Math.min;e.exports=function(e,t){return e=r(e),e<0?a(e+t,0):o(e,t)}},,function(e,t,n){var r=n(10);r(r.S+r.F*!n(9),"Object",{defineProperty:n(12).f})},function(e,t,n){var r=n(41),a=n(20);n(86)("keys",function(){return function(e){return a(r(e))}})},,function(e,t,n){!function(r,a){e.exports=t=a(n(2))}(0,function(e){return function(t){var n=e,r=n.lib,a=r.WordArray,o=r.Hasher,s=n.algo,i=[],c=[];!function(){function e(e){for(var n=t.sqrt(e),r=2;r<=n;r++)if(!(e%r))return!1;return!0}function n(e){return 4294967296*(e-(0|e))|0}for(var r=2,a=0;a<64;)e(r)&&(a<8&&(i[a]=n(t.pow(r,.5))),c[a]=n(t.pow(r,1/3)),a++),r++}();var u=[],d=s.SHA256=o.extend({_doReset:function(){this._hash=new a.init(i.slice(0))},_doProcessBlock:function(e,t){for(var n=this._hash.words,r=n[0],a=n[1],o=n[2],s=n[3],i=n[4],d=n[5],l=n[6],f=n[7],p=0;p<64;p++){if(p<16)u[p]=0|e[t+p];else{var h=u[p-15],m=(h<<25|h>>>7)^(h<<14|h>>>18)^h>>>3,b=u[p-2],y=(b<<15|b>>>17)^(b<<13|b>>>19)^b>>>10;u[p]=m+u[p-7]+y+u[p-16]}var g=i&d^~i&l,v=r&a^r&o^a&o,x=(r<<30|r>>>2)^(r<<19|r>>>13)^(r<<10|r>>>22),w=(i<<26|i>>>6)^(i<<21|i>>>11)^(i<<7|i>>>25),_=f+w+g+c[p]+u[p],k=x+v;f=l,l=d,d=i,i=s+_|0,s=o,o=a,a=r,r=_+k|0}n[0]=n[0]+r|0,n[1]=n[1]+a|0,n[2]=n[2]+o|0,n[3]=n[3]+s|0,n[4]=n[4]+i|0,n[5]=n[5]+d|0,n[6]=n[6]+l|0,n[7]=n[7]+f|0},_doFinalize:function(){var e=this._data,n=e.words,r=8*this._nDataBytes,a=8*e.sigBytes;return n[a>>>5]|=128<<24-a%32,n[14+(a+64>>>9<<4)]=t.floor(r/4294967296),n[15+(a+64>>>9<<4)]=r,e.sigBytes=4*n.length,this._process(),this._hash},clone:function(){var e=o.clone.call(this);return e._hash=this._hash.clone(),e}});n.SHA256=o._createHelper(d),n.HmacSHA256=o._createHmacHelper(d)}(Math),e.SHA256})},function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(64))}(0,function(e){return function(t){var n=e,r=n.lib,a=r.WordArray,o=r.Hasher,s=n.x64,i=s.Word,c=n.algo,u=[],d=[],l=[];!function(){for(var e=1,t=0,n=0;n<24;n++){u[e+5*t]=(n+1)*(n+2)/2%64;var r=t%5,a=(2*e+3*t)%5;e=r,t=a}for(var e=0;e<5;e++)for(var t=0;t<5;t++)d[e+5*t]=t+(2*e+3*t)%5*5;for(var o=1,s=0;s<24;s++){for(var c=0,f=0,p=0;p<7;p++){if(1&o){var h=(1<<p)-1;h<32?f^=1<<h:c^=1<<h-32}128&o?o=o<<1^113:o<<=1}l[s]=i.create(c,f)}}();var f=[];!function(){for(var e=0;e<25;e++)f[e]=i.create()}();var p=c.SHA3=o.extend({cfg:o.cfg.extend({outputLength:512}),_doReset:function(){for(var e=this._state=[],t=0;t<25;t++)e[t]=new i.init;this.blockSize=(1600-2*this.cfg.outputLength)/32},_doProcessBlock:function(e,t){for(var n=this._state,r=this.blockSize/2,a=0;a<r;a++){var o=e[t+2*a],s=e[t+2*a+1];o=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8),s=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8);var i=n[a];i.high^=s,i.low^=o}for(var c=0;c<24;c++){for(var p=0;p<5;p++){for(var h=0,m=0,b=0;b<5;b++){var i=n[p+5*b];h^=i.high,m^=i.low}var y=f[p];y.high=h,y.low=m}for(var p=0;p<5;p++)for(var g=f[(p+4)%5],v=f[(p+1)%5],x=v.high,w=v.low,h=g.high^(x<<1|w>>>31),m=g.low^(w<<1|x>>>31),b=0;b<5;b++){var i=n[p+5*b];i.high^=h,i.low^=m}for(var _=1;_<25;_++){var i=n[_],k=i.high,A=i.low,B=u[_];if(B<32)var h=k<<B|A>>>32-B,m=A<<B|k>>>32-B;else var h=A<<B-32|k>>>64-B,m=k<<B-32|A>>>64-B;var S=f[d[_]];S.high=h,S.low=m}var T=f[0],C=n[0];T.high=C.high,T.low=C.low;for(var p=0;p<5;p++)for(var b=0;b<5;b++){var _=p+5*b,i=n[_],D=f[_],P=f[(p+1)%5+5*b],O=f[(p+2)%5+5*b];i.high=D.high^~P.high&O.high,i.low=D.low^~P.low&O.low}var i=n[0],F=l[c];i.high^=F.high,i.low^=F.low}},_doFinalize:function(){var e=this._data,n=e.words,r=(this._nDataBytes,8*e.sigBytes),o=32*this.blockSize;n[r>>>5]|=1<<24-r%32,n[(t.ceil((r+1)/o)*o>>>5)-1]|=128,e.sigBytes=4*n.length,this._process();for(var s=this._state,i=this.cfg.outputLength/8,c=i/8,u=[],d=0;d<c;d++){var l=s[d],f=l.high,p=l.low;f=16711935&(f<<8|f>>>24)|4278255360&(f<<24|f>>>8),p=16711935&(p<<8|p>>>24)|4278255360&(p<<24|p>>>8),u.push(p),u.push(f)}return new a.init(u,i)},clone:function(){for(var e=o.clone.call(this),t=e._state=this._state.slice(0),n=0;n<25;n++)t[n]=t[n].clone();return e}});n.SHA3=o._createHelper(p),n.HmacSHA3=o._createHmacHelper(p)}(Math),e.SHA3})},function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(64))}(0,function(e){return function(){function t(){return s.create.apply(s,arguments)}var n=e,r=n.lib,a=r.Hasher,o=n.x64,s=o.Word,i=o.WordArray,c=n.algo,u=[t(1116352408,3609767458),t(1899447441,602891725),t(3049323471,3964484399),t(3921009573,2173295548),t(961987163,4081628472),t(1508970993,3053834265),t(2453635748,2937671579),t(2870763221,3664609560),t(3624381080,2734883394),t(310598401,1164996542),t(607225278,1323610764),t(1426881987,3590304994),t(1925078388,4068182383),t(2162078206,991336113),t(2614888103,633803317),t(3248222580,3479774868),t(3835390401,2666613458),t(4022224774,944711139),t(264347078,2341262773),t(604807628,2007800933),t(770255983,1495990901),t(1249150122,1856431235),t(1555081692,3175218132),t(1996064986,2198950837),t(2554220882,3999719339),t(2821834349,766784016),t(2952996808,2566594879),t(3210313671,3203337956),t(3336571891,1034457026),t(3584528711,2466948901),t(113926993,3758326383),t(338241895,168717936),t(666307205,1188179964),t(773529912,1546045734),t(1294757372,1522805485),t(1396182291,2643833823),t(1695183700,2343527390),t(1986661051,1014477480),t(2177026350,1206759142),t(2456956037,344077627),t(2730485921,1290863460),t(2820302411,3158454273),t(3259730800,3505952657),t(3345764771,106217008),t(3516065817,3606008344),t(3600352804,1432725776),t(4094571909,1467031594),t(275423344,851169720),t(430227734,3100823752),t(506948616,1363258195),t(659060556,3750685593),t(883997877,3785050280),t(958139571,3318307427),t(1322822218,3812723403),t(1537002063,2003034995),t(1747873779,3602036899),t(1955562222,1575990012),t(2024104815,1125592928),t(2227730452,2716904306),t(2361852424,442776044),t(2428436474,593698344),t(2756734187,3733110249),t(3204031479,2999351573),t(3329325298,3815920427),t(3391569614,3928383900),t(3515267271,566280711),t(3940187606,3454069534),t(4118630271,4000239992),t(116418474,1914138554),t(174292421,2731055270),t(289380356,3203993006),t(460393269,320620315),t(685471733,587496836),t(852142971,1086792851),t(1017036298,365543100),t(1126000580,2618297676),t(1288033470,3409855158),t(1501505948,4234509866),t(1607167915,987167468),t(1816402316,1246189591)],d=[];!function(){for(var e=0;e<80;e++)d[e]=t()}();var l=c.SHA512=a.extend({_doReset:function(){this._hash=new i.init([new s.init(1779033703,4089235720),new s.init(3144134277,2227873595),new s.init(1013904242,4271175723),new s.init(2773480762,1595750129),new s.init(1359893119,2917565137),new s.init(2600822924,725511199),new s.init(528734635,4215389547),new s.init(1541459225,327033209)])},_doProcessBlock:function(e,t){for(var n=this._hash.words,r=n[0],a=n[1],o=n[2],s=n[3],i=n[4],c=n[5],l=n[6],f=n[7],p=r.high,h=r.low,m=a.high,b=a.low,y=o.high,g=o.low,v=s.high,x=s.low,w=i.high,_=i.low,k=c.high,A=c.low,B=l.high,S=l.low,T=f.high,C=f.low,D=p,P=h,O=m,F=b,R=y,I=g,N=v,E=x,M=w,H=_,j=k,q=A,L=B,U=S,z=T,G=C,W=0;W<80;W++){var V=d[W];if(W<16)var J=V.high=0|e[t+2*W],Q=V.low=0|e[t+2*W+1];else{var K=d[W-15],X=K.high,$=K.low,Z=(X>>>1|$<<31)^(X>>>8|$<<24)^X>>>7,Y=($>>>1|X<<31)^($>>>8|X<<24)^($>>>7|X<<25),ee=d[W-2],te=ee.high,ne=ee.low,re=(te>>>19|ne<<13)^(te<<3|ne>>>29)^te>>>6,ae=(ne>>>19|te<<13)^(ne<<3|te>>>29)^(ne>>>6|te<<26),oe=d[W-7],se=oe.high,ie=oe.low,ce=d[W-16],ue=ce.high,de=ce.low,Q=Y+ie,J=Z+se+(Q>>>0<Y>>>0?1:0),Q=Q+ae,J=J+re+(Q>>>0<ae>>>0?1:0),Q=Q+de,J=J+ue+(Q>>>0<de>>>0?1:0);V.high=J,V.low=Q}var le=M&j^~M&L,fe=H&q^~H&U,pe=D&O^D&R^O&R,he=P&F^P&I^F&I,me=(D>>>28|P<<4)^(D<<30|P>>>2)^(D<<25|P>>>7),be=(P>>>28|D<<4)^(P<<30|D>>>2)^(P<<25|D>>>7),ye=(M>>>14|H<<18)^(M>>>18|H<<14)^(M<<23|H>>>9),ge=(H>>>14|M<<18)^(H>>>18|M<<14)^(H<<23|M>>>9),ve=u[W],xe=ve.high,we=ve.low,_e=G+ge,ke=z+ye+(_e>>>0<G>>>0?1:0),_e=_e+fe,ke=ke+le+(_e>>>0<fe>>>0?1:0),_e=_e+we,ke=ke+xe+(_e>>>0<we>>>0?1:0),_e=_e+Q,ke=ke+J+(_e>>>0<Q>>>0?1:0),Ae=be+he,Be=me+pe+(Ae>>>0<be>>>0?1:0);z=L,G=U,L=j,U=q,j=M,q=H,H=E+_e|0,M=N+ke+(H>>>0<E>>>0?1:0)|0,N=R,E=I,R=O,I=F,O=D,F=P,P=_e+Ae|0,D=ke+Be+(P>>>0<_e>>>0?1:0)|0}h=r.low=h+P,r.high=p+D+(h>>>0<P>>>0?1:0),b=a.low=b+F,a.high=m+O+(b>>>0<F>>>0?1:0),g=o.low=g+I,o.high=y+R+(g>>>0<I>>>0?1:0),x=s.low=x+E,s.high=v+N+(x>>>0<E>>>0?1:0),_=i.low=_+H,i.high=w+M+(_>>>0<H>>>0?1:0),A=c.low=A+q,c.high=k+j+(A>>>0<q>>>0?1:0),S=l.low=S+U,l.high=B+L+(S>>>0<U>>>0?1:0),C=f.low=C+G,f.high=T+z+(C>>>0<G>>>0?1:0)},_doFinalize:function(){var e=this._data,t=e.words,n=8*this._nDataBytes,r=8*e.sigBytes;return t[r>>>5]|=128<<24-r%32,t[30+(r+128>>>10<<5)]=Math.floor(n/4294967296),t[31+(r+128>>>10<<5)]=n,e.sigBytes=4*t.length,this._process(),this._hash.toX32()},clone:function(){var e=a.clone.call(this);return e._hash=this._hash.clone(),e},blockSize:32});n.SHA512=a._createHelper(l),n.HmacSHA512=a._createHmacHelper(l)}(),e.SHA512})},,,,,function(e,t,n){var r=n(5),a=function(e,t){this.value=e||"",this.offset=t};a.prototype.dynamicPartLength=function(){return this.dynamicPart().length/2},a.prototype.withOffset=function(e){return new a(this.value,e)},a.prototype.combine=function(e){return new a(this.value+e.value)},a.prototype.isDynamic=function(){return void 0!==this.offset},a.prototype.offsetAsBytes=function(){return this.isDynamic()?r.padLeft(r.toTwosComplement(this.offset).toString(16),64):""},a.prototype.staticPart=function(){return this.isDynamic()?this.offsetAsBytes():this.value},a.prototype.dynamicPart=function(){return this.isDynamic()?this.value:""},a.prototype.encode=function(){return this.staticPart()+this.dynamicPart()},a.encodeList=function(e){var t=32*e.length,n=e.map(function(e){if(!e.isDynamic())return e;var n=t;return t+=e.dynamicPartLength(),e.withOffset(n)});return n.reduce(function(e,t){return e+t.dynamicPart()},n.reduce(function(e,t){return e+t.staticPart()},""))},e.exports=a},function(e,t,n){var r=n(5),a=n(93),o=n(15),s=n(43),i=n(67),c=n(69),u=function(e,t,n){this._requestManager=e,this._params=t.inputs,this._name=r.transformToFullName(t),this._address=n,this._anonymous=t.anonymous};u.prototype.types=function(e){return this._params.filter(function(t){return t.indexed===e}).map(function(e){return e.type})},u.prototype.displayName=function(){return r.extractDisplayName(this._name)},u.prototype.typeName=function(){return r.extractTypeName(this._name)},u.prototype.signature=function(){return s(this._name)},u.prototype.encode=function(e,t){e=e||{},t=t||{};var n={};["fromBlock","toBlock"].filter(function(e){return void 0!==t[e]}).forEach(function(e){n[e]=o.inputBlockNumberFormatter(t[e])}),n.topics=[],n.address=this._address,this._anonymous||n.topics.push("0x"+this.signature());var s=this._params.filter(function(e){return e.indexed===!0}).map(function(t){var n=e[t.name];return void 0===n||null===n?null:r.isArray(n)?n.map(function(e){return"0x"+a.encodeParam(t.type,e)}):"0x"+a.encodeParam(t.type,n)});return n.topics=n.topics.concat(s),n},u.prototype.decode=function(e){e.data=e.data||"",e.topics=e.topics||[];var t=this._anonymous?e.topics:e.topics.slice(1),n=t.map(function(e){return e.slice(2)}).join(""),r=a.decodeParams(this.types(!0),n),s=e.data.slice(2),i=a.decodeParams(this.types(!1),s),c=o.outputLogFormatter(e);return c.event=this.displayName(),c.address=e.address,c.args=this._params.reduce(function(e,t){return e[t.name]=t.indexed?r.shift():i.shift(),e},{}),delete c.data,delete c.topics,c},u.prototype.execute=function(e,t,n){r.isFunction(arguments[arguments.length-1])&&(n=arguments[arguments.length-1],2===arguments.length&&(t=null),1===arguments.length&&(t=null,e={}));var a=this.encode(e,t),o=this.decode.bind(this);return new i(this._requestManager,a,c.eth(),o,n)},u.prototype.attachToContract=function(e){var t=this.execute.bind(this),n=this.displayName();e[n]||(e[n]=t),e[n][this.typeName()]=this.execute.bind(this,e)},e.exports=u},function(e,t){var n={messageId:0};n.toPayload=function(e,t){return e||console.error("jsonrpc method should be specified!"),n.messageId++,{jsonrpc:"2.0",id:n.messageId,method:e,params:t||[]}},n.isValidResponse=function(e){function t(e){return!!e&&!e.error&&"2.0"===e.jsonrpc&&"number"==typeof e.id&&void 0!==e.result}return Array.isArray(e)?e.every(t):t(e)},n.toBatchPayload=function(e){return e.map(function(e){return n.toPayload(e.method,e.params)})},e.exports=n},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},,function(e,t,n){"use strict";(function(e){function t(e){return e&&e.__esModule?e:{default:e}}var r=n(295),a=t(r),o=n(191),s=t(o);n(271);var i=new a.default.providers.HttpProvider("/rpc/"),c=new a.default(i);c.eth.getAccounts(function(e,t){!e&&t&&t[0]&&(c.eth.defaultAccount=t[0])}),(0,s.default)(c).map(function(e){return c._extend(e)}),e.web3=c}).call(t,n(25))},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(77),a=n(76),o="Accounts (read-only) and Signatures",s="Development",i='Block Authoring (aka "mining")',c="Network Information",u="Node Settings",d="Account Vaults",l="set",f="accounts";t.default={accountsInfo:{section:o,desc:"Provides metadata for accounts.",params:[],returns:{type:Object,desc:"Maps account address to metadata.",details:{name:{type:String,desc:"Account name"}},example:{"0x0024d0c7ab4c52f723f3aaf0872b9ea4406846a4":{name:"Foo"},"0x004385d8be6140e6f889833f68b51e17b6eacb29":{name:"Bar"},"0x009047ed78fa2be48b62aaf095b64094c934dab0":{name:"Baz"}}}},chainStatus:{section:c,desc:"Returns the information on warp sync blocks",params:[],returns:{type:Object,desc:"The status object",details:{blockGap:{type:Array,desc:"Describes the gap in the blockchain, if there is one: (first, last)",optional:!0}}}},changeVault:{section:d,desc:"Changes the current valut for the account",params:[{type:r.Address,desc:"Account address",example:"0x63Cf90D3f0410092FC0fca41846f596223979195"},{type:String,desc:"Vault name",example:"StrongVault"}],returns:{type:Boolean,desc:"True on success",example:!0}},changeVaultPassword:{section:d,desc:"Changes the password for any given vault",params:[{type:String,desc:"Vault name",example:"StrongVault"},{type:String,desc:"New Password",example:"p@55w0rd"}],returns:{type:Boolean,desc:"True on success",example:!0}},closeVault:{section:d,desc:"Closes a vault with the given name",params:[{type:String,desc:"Vault name",example:"StrongVault"}],returns:{type:Boolean,desc:"True on success",example:!0}},consensusCapability:{desc:"Returns information on current consensus capability.",params:[],returns:{type:Object,desc:'or `String` - Either `"capable"`, `{"capableUntil":N}`, `{"incapableSince":N}` or `"unknown"` (`N` is a block number).',example:"capable"}},dappsList:{subdoc:l,desc:"Returns a list of available local dapps.",params:[],returns:{type:Array,desc:"The list of dapps",example:[{author:"Parity Technologies Ltd",description:"A skeleton dapp",iconUrl:"title.png",id:"skeleton",name:"Skeleton",version:"0.1"}]}},dappsUrl:{section:u,desc:"Returns the hostname and the port of dapps/rpc server, error if not enabled.",params:[],returns:{type:String,desc:"The hostname and port number",example:"localhost:8545"}},defaultAccount:{section:o,desc:"Returns the defaultAccount that is to be used with transactions",params:[],returns:{type:r.Address,desc:"The account address",example:"0x63Cf90D3f0410092FC0fca41846f596223979195"}},defaultExtraData:{section:i,desc:"Returns the default extra data",params:[],returns:{type:r.Data,desc:"Extra data",example:"0xd5830106008650617269747986312e31342e30826c69"}},devLogs:{section:s,desc:"Returns latest stdout logs of your node.",params:[],returns:{type:Array,desc:"Development logs",example:["2017-01-20 18:14:19  Updated conversion rate to Ξ1 = US$10.63 (11199212000 wei/gas)","2017-01-20 18:14:19  Configured for DevelopmentChain using InstantSeal engine","2017-01-20 18:14:19  Operating mode: active","2017-01-20 18:14:19  State DB configuration: fast","2017-01-20 18:14:19  Starting Parity/v1.7.0-unstable-2ae8b4c-20170120/x86_64-linux-gnu/rustc1.14.0"]}},devLogsLevels:{section:s,desc:'Returns current logging level settings. Logging level can be set with `--logging` and be one of: `""` (default), `"info"`, `"debug"`, `"warn"`, `"error"`, `"trace"`.',params:[],returns:{type:String,decs:"Current log level.",example:"debug"}},enode:{section:u,desc:"Returns the node enode URI.",params:[],returns:{type:String,desc:"Enode URI",example:"enode://050929adcfe47dbe0b002cb7ef2bf91ca74f77c4e0f68730e39e717f1ce38908542369ae017148bee4e0d968340885e2ad5adea4acd19c95055080a4b625df6a@172.17.0.1:30303"}},extraData:{section:i,desc:"Returns currently set extra data.",params:[],returns:{type:r.Data,desc:"Extra data.",example:"0xd5830106008650617269747986312e31342e30826c69"}},gasFloorTarget:{section:i,desc:"Returns current target for gas floor.",params:[],returns:{type:r.Quantity,desc:"Gas floor target.",format:"outputBigNumberFormatter",example:(0,a.fromDecimal)(47e5)}},gasCeilTarget:{section:i,desc:"Returns current target for gas ceiling.",params:[],returns:{type:r.Quantity,desc:"Gas ceiling target.",format:"outputBigNumberFormatter",example:(0,a.fromDecimal)(6283184)}},gasPriceHistogram:{section:c,desc:"Returns a snapshot of the historic gas prices.",params:[],returns:{type:Object,desc:"Historic values",details:{bucketBounds:{type:Array,desc:"Array of bound values."},count:{type:Array,desc:"Array of counts."}},example:{bucketBounds:["0x4a817c800","0x525433d01","0x5a26eb202","0x61f9a2703","0x69cc59c04","0x719f11105","0x7971c8606","0x81447fb07","0x891737008","0x90e9ee509","0x98bca5a0a"],counts:[487,9,7,1,8,0,0,0,0,14]}}},generateSecretPhrase:{section:o,desc:"Creates a secret phrase that can be associated with an account.",params:[],returns:{type:String,desc:"The secret phrase.",example:"boasting breeches reshape reputably exit handrail stony jargon moneywise unhinge handed ruby"}},getVaultMeta:{section:d,desc:"Returns the metadata for a specific vault",params:[{type:String,desc:"Vault name",example:"StrongVault"}],returns:{type:String,desc:"The associated JSON metadata for this vault",example:'{"passwordHint":"something"}'}},hardwareAccountsInfo:{section:o,desc:"Provides metadata for attached hardware wallets",params:[],returns:{type:Object,desc:"Maps account address to metadata.",details:{manufacturer:{type:String,desc:"Manufacturer"},name:{type:String,desc:"Account name"}},example:{"0x0024d0c7ab4c52f723f3aaf0872b9ea4406846a4":{manufacturer:"Ledger",name:"Nano S"}}}},listOpenedVaults:{desc:"Returns a list of all opened vaults",params:[],returns:{type:Array,desc:"Names of all opened vaults",example:"['Personal']"}},listVaults:{desc:"Returns a list of all available vaults",params:[],returns:{type:Array,desc:"Names of all available vaults",example:"['Personal','Work']"}},localTransactions:{desc:"Returns an object of current and past local transactions.",params:[],returns:{type:Object,desc:"Mapping of transaction hashes to status objects status object.",example:{"0x09e64eb1ae32bb9ac415ce4ddb3dbad860af72d9377bb5f073c9628ab413c532":{status:"mined",transaction:{from:"0x00a329c0648769a73afac7f9381e08fb43dbea72",to:"0x00a289b43e1e4825dbedf2a78ba60a640634dc40",value:"0xfffff",blockHash:null,blockNumber:null,creates:null,gas:"0xe57e0",gasPrice:"0x2d20cff33",hash:"0x09e64eb1ae32bb9ac415ce4ddb3dbad860af72d9377bb5f073c9628ab413c532",input:"0x",condition:{block:1},networkId:null,nonce:"0x0",publicKey:"0x3fa8c08c65a83f6b4ea3e04e1cc70cbe3cd391499e3e05ab7dedf28aff9afc538200ff93e3f2b2cb5029f03c7ebee820d63a4c5a9541c83acebe293f54cacf0e",raw:"0xf868808502d20cff33830e57e09400a289b43e1e4825dbedf2a78ba60a640634dc40830fffff801ca034c333b0b91cd832a3414d628e3fea29a00055cebf5ba59f7038c188404c0cf3a0524fd9b35be170439b5ffe89694ae0cfc553cb49d1d8b643239e353351531532",standardV:"0x1",v:"0x1c",r:"0x34c333b0b91cd832a3414d628e3fea29a00055cebf5ba59f7038c188404c0cf3",s:"0x524fd9b35be170439b5ffe89694ae0cfc553cb49d1d8b643239e353351531532",transactionIndex:null}},"0x...":new a.Dummy("{ ... }")}}},minGasPrice:{section:i,desc:"Returns currently set minimal gas price",params:[],returns:{type:r.Quantity,desc:"Minimal Gas Price",format:"outputBigNumberFormatter",example:(0,a.fromDecimal)(11262783488)}},mode:{section:u,desc:'Get the mode. Results one of: `"active"`, `"passive"`, `"dark"`, `"offline"`.',params:[],returns:{type:String,desc:"The mode.",example:"active"}},nodeKind:{section:u,desc:"Returns the node type availability and capability",params:[],returns:{type:Object,desc:"Availability and Capability.",details:{availability:{type:String,desc:"Availability, either `personal` or `public`."},capability:{type:String,desc:"Capability, either `full` or `light`."}},example:{availability:"personal",capability:"light"}}},netChain:{section:c,desc:"Returns the name of the connected chain. DEPRECATED use `parity_chain` instead.",params:[],returns:{type:String,desc:"chain name.",example:"homestead"}},chain:{section:c,desc:"Returns the name of the connected chain. ",params:[],returns:{type:String,desc:'chain name, one of: "foundation", "kovan", &c. of a filename.',example:"homestead"}},netPeers:{section:c,desc:"Returns number of peers.",params:[],returns:{type:Object,desc:"Number of peers",details:{active:{type:r.Quantity,desc:"Number of active peers."},connected:{type:r.Quantity,desc:"Number of connected peers."},max:{type:r.Quantity,desc:"Maximum number of connected peers."},peers:{type:Array,desc:"List of all peers with details."}},example:{active:0,connected:25,max:25,peers:[new a.Dummy("{ ... }, { ... }, { ... }, ...")]}}},netPort:{section:c,desc:"Returns network port the node is listening on.",params:[],returns:{type:r.Quantity,desc:"Port number",example:30303}},newVault:{section:d,desc:"Creates a new vault with the given name & password",params:[{type:String,desc:"Vault name",example:"StrongVault"},{type:String,desc:"Password",example:"p@55w0rd"}],returns:{type:Boolean,desc:"True on success",example:!0}},nextNonce:{section:c,desc:"Returns next available nonce for transaction from given account. Includes pending block and transaction queue.",params:[{type:r.Address,desc:"Account",example:"0x00A289B43e1e4825DbEDF2a78ba60a640634DC40"}],returns:{type:r.Quantity,desc:"Next valid nonce",example:(0,a.fromDecimal)(12)}},nodeName:{section:u,desc:"Returns node name, set when starting parity with `--identity NAME`.",params:[],returns:{type:String,desc:"Node name.",example:"Doge"}},openVault:{section:d,desc:"Opens a vault with the given name & password",params:[{type:String,desc:"Vault name",example:"StrongVault"},{type:String,desc:"Password",example:"p@55w0rd"}],returns:{type:Boolean,desc:"True on success",example:!0}},pendingTransactions:{section:c,desc:"Returns a list of transactions currently in the queue.",params:[],returns:{type:Array,desc:"Transactions ordered by priority",details:r.TransactionResponse.details,example:[{blockHash:null,blockNumber:null,creates:null,from:"0xee3ea02840129123d5397f91be0391283a25bc7d",gas:"0x23b58",gasPrice:"0xba43b7400",hash:"0x160b3c30ab1cf5871083f97ee1cee3901cfba3b0a2258eb337dd20a7e816b36e",input:"0x095ea7b3000000000000000000000000bf4ed7b27f1d666546e30d74d50d173d20bca75400000000000000000000000000002643c948210b4bd99244ccd64d5555555555",condition:{block:1},networkId:1,nonce:"0x5",publicKey:"0x96157302dade55a1178581333e57d60ffe6fdf5a99607890456a578b4e6b60e335037d61ed58aa4180f9fd747dc50d44a7924aa026acbfb988b5062b629d6c36",r:"0x92e8beb19af2bad0511d516a86e77fa73004c0811b2173657a55797bdf8558e1",raw:"0xf8aa05850ba43b740083023b5894bb9bc244d798123fde783fcc1c72d3bb8c18941380b844095ea7b3000000000000000000000000bf4ed7b27f1d666546e30d74d50d173d20bca75400000000000000000000000000002643c948210b4bd99244ccd64d555555555526a092e8beb19af2bad0511d516a86e77fa73004c0811b2173657a55797bdf8558e1a062b4d4d125bbcb9c162453bc36ca156537543bb4414d59d1805d37fb63b351b8",s:"0x62b4d4d125bbcb9c162453bc36ca156537543bb4414d59d1805d37fb63b351b8",standardV:"0x1",to:"0xbb9bc244d798123fde783fcc1c72d3bb8c189413",transactionIndex:null,v:"0x26",value:"0x0"},new a.Dummy("{ ... }"),new a.Dummy("{ ... }")]}},pendingTransactionsStats:{section:c,desc:"Returns propagation stats for transactions in the queue.",params:[],returns:{type:Object,desc:"mapping of transaction hashes to stats.",example:{"0xdff37270050bcfba242116c745885ce2656094b2d3a0f855649b4a0ee9b5d15a":{firstSeen:3032066,propagatedTo:{"0x605e04a43b1156966b3a3b66b980c87b7f18522f7f712035f84576016be909a2798a438b2b17b1a8c58db314d88539a77419ca4be36148c086900fba487c9d39":1,"0xbab827781c852ecf52e7c8bf89b806756329f8cbf8d3d011e744a0bc5e3a0b0e1095257af854f3a8415ebe71af11b0c537f8ba797b25972f519e75339d6d1864":1}}}}},removeTransaction:{section:c,desc:"Removes transaction from local transaction pool. Scheduled transactions and not-propagated transactions are safe to remove, removal of other transactions may have no effect though.",params:[{type:r.Hash,desc:"Hash of transaction to remove.",example:"0x2547ea3382099c7c76d33dd468063b32d41016aacb02cbd51ebc14ff5d2b6a43"}],returns:{type:Object,desc:"Removed transaction or `null`.",details:r.TransactionResponse.details,example:[{blockHash:null,blockNumber:null,creates:null,from:"0xee3ea02840129123d5397f91be0391283a25bc7d",gas:"0x23b58",gasPrice:"0xba43b7400",hash:"0x160b3c30ab1cf5871083f97ee1cee3901cfba3b0a2258eb337dd20a7e816b36e",input:"0x095ea7b3000000000000000000000000bf4ed7b27f1d666546e30d74d50d173d20bca75400000000000000000000000000002643c948210b4bd99244ccd64d5555555555",condition:{block:1},networkId:1,nonce:"0x5",publicKey:"0x96157302dade55a1178581333e57d60ffe6fdf5a99607890456a578b4e6b60e335037d61ed58aa4180f9fd747dc50d44a7924aa026acbfb988b5062b629d6c36",r:"0x92e8beb19af2bad0511d516a86e77fa73004c0811b2173657a55797bdf8558e1",raw:"0xf8aa05850ba43b740083023b5894bb9bc244d798123fde783fcc1c72d3bb8c18941380b844095ea7b3000000000000000000000000bf4ed7b27f1d666546e30d74d50d173d20bca75400000000000000000000000000002643c948210b4bd99244ccd64d555555555526a092e8beb19af2bad0511d516a86e77fa73004c0811b2173657a55797bdf8558e1a062b4d4d125bbcb9c162453bc36ca156537543bb4414d59d1805d37fb63b351b8",s:"0x62b4d4d125bbcb9c162453bc36ca156537543bb4414d59d1805d37fb63b351b8",standardV:"0x1",to:"0xbb9bc244d798123fde783fcc1c72d3bb8c189413",transactionIndex:null,v:"0x26",value:"0x0"},new a.Dummy("{ ... }"),new a.Dummy("{ ... }")]}},phraseToAddress:{section:o,desc:"Converts a secret phrase into the corresponding address.",params:[{type:String,desc:"The phrase",example:"stylus outing overhand dime radial seducing harmless uselessly evasive tastiness eradicate imperfect"}],returns:{type:r.Address,desc:"Corresponding address",example:"0x004385d8be6140e6f889833f68b51e17b6eacb29"}},releasesInfo:{desc:"returns a ReleasesInfo object describing the current status of releases",params:[],returns:{type:Object,desc:"Information on current releases, `null` if not available.",details:{fork:{type:r.Quantity,desc:"Block number representing the last known fork for this chain, which may be in the future."},minor:{type:Object,desc:"Information about latest minor update to current version, `null` if this is the latest minor version."},track:{type:Object,desc:"Information about the latest release in this track."}},example:null}},registryAddress:{section:c,desc:"The address for the global registry.",params:[],returns:{type:r.Address,desc:"The registry address.",example:"0x3bb2bb5c6c9c9b7f4ef430b47dc7e026310042ea"}},rpcSettings:{section:c,desc:"Provides current JSON-RPC API settings.",params:[],returns:{type:Object,desc:"JSON-RPC settings.",details:{enabled:{type:Boolean,desc:"`true` if JSON-RPC is enabled (default)."},interface:{type:String,desc:"Interface on which JSON-RPC is running."},port:{type:r.Quantity,desc:"Port on which JSON-RPC is running."}},example:{enabled:!0,interface:"local",port:8545}}},setVaultMeta:{section:d,desc:"Sets the metadata for a specific vault",params:[{type:String,desc:"Vault name",example:"StrongVault"},{type:String,desc:"The metadata as a JSON string",example:'{"passwordHint":"something"}'}],returns:{type:Boolean,desc:"The boolean call result, true on success",example:!0}},transactionsLimit:{section:i,desc:"Changes limit for transactions in queue.",params:[],returns:{type:r.Quantity,desc:"Current max number of transactions in queue.",format:"outputBigNumberFormatter",example:1024}},unsignedTransactionsCount:{section:c,desc:"Returns number of unsigned transactions when running with Trusted Signer. Error otherwise",params:[],returns:{type:r.Quantity,desc:"Number of unsigned transactions",example:0}},versionInfo:{desc:"Provides information about running version of Parity.",params:[],returns:{type:Object,desc:"Information on current version.",details:{hash:{type:r.Hash,desc:"20 Byte hash of the current build."},track:{type:String,desc:'Track on which it was released, one of: `"stable"`, `"beta"`, `"nightly"`, `"testing"`, `"null"` (unknown or self-built).'},version:{type:Object,desc:"Version number composed of `major`, `minor` and `patch` integers."}},example:{hash:"0x2ae8b4ca278dd7b896090366615fef81cbbbc0e0",track:"null",version:{major:1,minor:6,patch:0}}}},listAccounts:{desc:"Returns all addresses if Fat DB is enabled (`--fat-db`), `null` otherwise.",section:o,params:[{type:r.Quantity,desc:"Integer number of addresses to display in a batch.",example:5},{type:r.Address,desc:"20 Bytes - Offset address from which the batch should start in order, or `null`.",example:null},{type:r.BlockNumber,desc:"integer block number, or the string `'latest'`, `'earliest'` or `'pending'`.",format:"inputDefaultBlockNumberFormatter",optional:!0}],returns:{type:Array,desc:"Requested number of `Address`es or `null` if Fat DB is not enabled.",example:["0x7205b1bb42edce6e0ced37d1fd0a9d684f5a860f","0x98a2559a814c300b274325c92df1682ae0d344e3","0x2d7a7d0adf9c5f9073fefbdc18188bd23c68b633","0xd4bb3284201db8b03c06d8a3057dd32538e3dfda","0xa6396904b08aa31300ca54278b8e066ecc38e4a0"]}},listStorageKeys:{desc:"Returns all storage keys of the given address (first parameter) if Fat DB is enabled (`--fat-db`), `null` otherwise.",params:[{type:r.Address,desc:"20 Bytes - Account for which to retrieve the storage keys.",example:"0x407d73d8a49eeb85d32cf465507dd71d507100c1"},{type:r.Quantity,desc:"Integer number of addresses to display in a batch.",example:5},{type:r.Hash,desc:"32 Bytes - Offset storage key from which the batch should start in order, or `null`.",example:null},{type:r.BlockNumber,desc:"integer block number, or the string `'latest'`, `'earliest'` or `'pending'`.",format:"inputDefaultBlockNumberFormatter",optional:!0}],returns:{type:Array,desc:"Requested number of 32 byte long storage keys for the given account or `null` if Fat DB is not enabled.",example:["0xaab1a2940583e213f1d57a3ed358d5f5406177c8ff3c94516bfef3ea62d00c22","0xba8469eca5641b186e86cbc5343dfa5352df04feb4564cd3cf784f213aaa0319","0x769d107ba778d90205d7a159e820c41c20bf0783927b426c602561e74b7060e5","0x0289865bcaa58f7f5bf875495ac7af81e3630eb88a3a0358407c7051a850624a","0x32e0536502b9163b0a1ce6e3aabd95fa4a2bf602bbde1b9118015648a7a51178"]}},encryptMessage:{desc:"Encrypt some data with a public key under ECIES.",params:[{type:r.Hash,desc:"Public EC key generated with `secp256k1` curve, truncated to the last 64 bytes.",example:"0xD219959D466D666060284733A80DDF025529FEAA8337169540B3267B8763652A13D878C40830DD0952639A65986DBEC611CF2171A03CFDC37F5A40537068AA4F"},{type:r.Data,desc:"The message to encrypt.",example:(0,a.withComment)("0x68656c6c6f20776f726c64",'"hello world"')}],returns:{type:r.Data,desc:"Encrypted message.",example:"0x0491debeec5e874a453f84114c084c810708ebcb553b02f1b8c05511fa4d1a25fa38eb49a32c815e2b39b7bcd56d66648bf401067f15413dae683084ca7b01e21df89be9ec4bc6c762a657dbd3ba1540f557e366681b53629bb2c02e1443b5c0adc6b68f3442c879456d6a21ec9ed07847fa3c3ecb73ec7ee9f8e32d"}},futureTransactions:{desc:"Returns all future transactions from transaction queue.",params:[],returns:{type:Array,desc:"Transaction list.",details:r.TransactionResponse.details,example:[{hash:"0x80de421cd2e7e46824a91c343ca42b2ff339409eef09e2d9d73882462f8fce31",nonce:"0x1",blockHash:null,blockNumber:null,transactionIndex:null,from:"0xe53e478c072265e2d9a99a4301346700c5fbb406",to:"0xf5d405530dabfbd0c1cab7a5812f008aa5559adf",value:"0x2efc004ac03a4996",gasPrice:"0x4a817c800",gas:"0x5208",input:"0x",creates:null,raw:"0xf86c018504a817c80082520894f5d405530dabfbd0c1cab7a5812f008aa5559adf882efc004ac03a49968025a0b40c6967a7e8bbdfd99a25fd306b9ef23b80e719514aeb7ddd19e2303d6fc139a06bf770ab08119e67dc29817e1412a0e3086f43da308c314db1b3bca9fb6d32bd",publicKey:"0xeba33fd74f06236e17475bc5b6d1bac718eac048350d77d3fc8fbcbd85782a57c821255623c4fd1ebc9d555d07df453b2579ee557b7203fc256ca3b3401e4027",networkId:1,standardV:"0x0",v:"0x25",r:"0xb40c6967a7e8bbdfd99a25fd306b9ef23b80e719514aeb7ddd19e2303d6fc139",s:"0x6bf770ab08119e67dc29817e1412a0e3086f43da308c314db1b3bca9fb6d32bd",condition:{block:1}},new a.Dummy("{ ... }, { ... }, ...")]}},allAccountsInfo:{subdoc:f,desc:"returns a map of accounts as an object.",params:[],returns:{type:Array,desc:"Account metadata.",details:{name:{type:String,desc:"Account name."},meta:{type:String,desc:"Encoded JSON string the defines additional account metadata."},uuid:{type:String,desc:"The account Uuid, or `null` if not available/unknown/not applicable."}},example:{"0x00a289b43e1e4825dbedf2a78ba60a640634dc40":{meta:"{}",name:"Foobar",uuid:"0b9e70e6-235b-682d-a15c-2a98c71b3945"}}}},newAccountFromPhrase:{subdoc:f,desc:"Creates a new account from a recovery phrase.",params:[{type:String,desc:"Recovery phrase.",example:"stylus outing overhand dime radial seducing harmless uselessly evasive tastiness eradicate imperfect"},{type:String,desc:"Password.",example:"hunter2"}],returns:{type:r.Address,desc:"The created address.",example:"0x407d73d8a49eeb85d32cf465507dd71d507100c1"}},newAccountFromSecret:{subdoc:f,desc:"Creates a new account from a private ethstore secret key.",params:[{type:r.Data,desc:"Secret, 32-byte hex",example:"0x1db2c0cf57505d0f4a3d589414f0a0025ca97421d2cd596a9486bc7e2cd2bf8b"},{type:String,desc:"Password",example:"hunter2"}],returns:{type:r.Address,desc:"The created address.",example:"0x407d73d8a49eeb85d32cf465507dd71d507100c1"}},newAccountFromWallet:{subdoc:f,desc:"Creates a new account from a JSON import",params:[{type:String,desc:"Wallet JSON encoded to a string.",example:'{"id": "9c62e86b-3cf9...", ...}'},{type:String,desc:"Password.",example:"hunter2"}],returns:{type:r.Address,desc:"The created address",example:"0x407d73d8a49eeb85d32cf465507dd71d507100c1"}},setAccountName:{subdoc:f,desc:"Sets a name for the account",params:[{type:r.Address,desc:"Address",example:"0x407d73d8a49eeb85d32cf465507dd71d507100c1"},{type:String,desc:"Name",example:"Foobar"}],returns:{type:Boolean,desc:"`true` if the call was successful.",example:!0}},setAccountMeta:{subdoc:f,desc:"Sets metadata for the account",params:[{type:r.Address,desc:"Address",example:"0x407d73d8a49eeb85d32cf465507dd71d507100c1"},{type:String,desc:"Metadata (JSON encoded)",example:'{"foo":"bar"}'}],returns:{type:Boolean,desc:"`true` if the call was successful.",example:!0}},testPassword:{subdoc:f,desc:"Checks if a given password can unlock a given account, without actually unlocking it.",params:[{type:r.Address,desc:"Account to test.",example:"0x407d73d8a49eeb85d32cf465507dd71d507100c1"},{type:String,desc:"Password to test.",example:"hunter2"}],returns:{type:Boolean,desc:"`true` if the account and password are valid.",example:!0}},changePassword:{subdoc:f,desc:"Change the password for a given account.",params:[{type:r.Address,desc:"Address of the account.",example:"0x407d73d8a49eeb85d32cf465507dd71d507100c1"},{type:String,desc:"Old password.",example:"hunter2"},{type:String,desc:"New password.",example:"bazqux5"}],returns:{type:Boolean,desc:"`true` if the call was successful.",example:!0}},killAccount:{subdoc:f,desc:"Deletes an account.",params:[{type:r.Address,desc:"The account to remove.",example:"0x407d73d8a49eeb85d32cf465507dd71d507100c1"},{type:String,desc:"Account password.",example:"hunter2"}],returns:{type:Boolean,desc:"`true` if the call was successful.",example:!0}},removeAddress:{subdoc:f,desc:"Removes an address from the addressbook.",params:[{type:r.Address,desc:"The address to remove.",example:"0x407d73d8a49eeb85d32cf465507dd71d507100c1"}],returns:{type:Boolean,desc:"`true`if the call was successful.",example:!0}},setDappAddresses:{subdoc:f,desc:"Sets the available addresses for a dapp. When provided with non-empty list changes the default account as well.",params:[{type:String,desc:"Dapp Id.",example:"web"},{type:Array,desc:"Array of available accounts available to the dapp or `null` for default list.",example:["0x407d73d8a49eeb85d32cf465507dd71d507100c1"]}],returns:{type:Boolean,desc:"`true` if the call was successful.",example:!0}},getDappAddresses:{subdoc:f,desc:"Returns the list of accounts available to a specific dapp.",params:[{type:String,desc:"Dapp Id.",example:"web"}],returns:{type:Array,desc:"The list of available accounts.",example:["0x407d73d8a49eeb85d32cf465507dd71d507100c1"]}},setDappDefaultAddress:{subdoc:f,desc:"Changes dapp default address. Does not affect other accounts exposed for this dapp, but default account will always be retured as the first one.",params:[{type:String,desc:"Dapp Id.",example:"web"},{type:r.Address,desc:"Default Address.",example:"0x407d73d8a49eeb85d32cf465507dd71d507100c1"}],returns:{type:Boolean,desc:"`true` if the call was successful",example:!0}},getDappDefaultAddress:{subdoc:f,desc:"Returns a default account available to a specific dapp.",params:[{type:String,desc:"Dapp Id.",example:"web"}],returns:{type:r.Address,desc:"Default Address",example:"0x407d73d8a49eeb85d32cf465507dd71d507100c1"}},setNewDappsAddresses:{subdoc:f,desc:"Sets the list of accounts available to new dapps.",params:[{type:Array,desc:"List of accounts available by default or `null` for all accounts.",example:["0x407d73d8a49eeb85d32cf465507dd71d507100c1"]}],returns:{type:Boolean,desc:"`true` if the call was successful",example:!0}},getNewDappsAddresses:{subdoc:f,desc:"Returns the list of accounts available to a new dapps.",params:[],returns:{type:Array,desc:"The list of available accounts, can be `null`.",example:["0x407d73d8a49eeb85d32cf465507dd71d507100c1"]}},setNewDappsDefaultAddress:{subdoc:f,desc:"Changes global default address. This setting may be overriden for a specific dapp.",params:[{type:r.Address,desc:"Default Address.",example:"0x407d73d8a49eeb85d32cf465507dd71d507100c1"}],returns:{type:Boolean,desc:"`true` if the call was successful",example:!0}},getNewDappsDefaultAddress:{subdoc:f,desc:"Returns a default account available to dapps.",params:[],returns:{type:r.Address,desc:"Default Address",example:"0x407d73d8a49eeb85d32cf465507dd71d507100c1"}},listRecentDapps:{subdoc:f,desc:"Returns a list of the most recent active dapps.",params:[],returns:{type:Array,desc:"Array of Dapp Ids.",example:["web"]}},importGethAccounts:{subdoc:f,desc:"Imports a list of accounts from Geth.",params:[{type:Array,desc:"List of the Geth addresses to import.",example:["0x407d73d8a49eeb85d32cf465507dd71d507100c1"]}],returns:{type:Array,desc:"Array of the imported addresses.",example:["0x407d73d8a49eeb85d32cf465507dd71d507100c1"]}},listGethAccounts:{subdoc:f,desc:"Returns a list of the accounts available from Geth.",params:[],returns:{type:Array,desc:"20 Bytes addresses owned by the client.",example:["0x407d73d8a49eeb85d32cf465507dd71d507100c1"]}},deriveAddressHash:{subdoc:f,desc:"Derive new address from given account address using specific hash.",params:[{type:r.Address,desc:"Account address to derive from.",example:"0x407d73d8a49eeb85d32cf465507dd71d507100c1"},{type:String,desc:"Password to the account.",example:"hunter2"},{type:Object,desc:'Derivation hash and type (`soft` or `hard`). E.g. `{ hash: "0x123..123", type: "hard" }`.',example:{hash:"0x2547ea3382099c7c76d33dd468063b32d41016aacb02cbd51ebc14ff5d2b6a43",type:"hard"}},{type:Boolean,desc:"Flag indicating if the account should be saved.",example:!1}],returns:{type:r.Address,desc:"20 Bytes new derived address.",example:"0x407d73d8a49eeb85d32cf465507dd71d507100c1"}},deriveAddressIndex:{subdoc:f,desc:"Derive new address from given account address using hierarchical derivation (sequence of 32-bit integer indices).",params:[{type:r.Address,desc:"Account address to export.",example:"0x407d73d8a49eeb85d32cf465507dd71d507100c1"},{type:String,desc:"Password to the account.",example:"hunter2"},{type:Array,desc:'Hierarchical derivation sequence of index and type (`soft` or `hard`). E.g. `[{index:1,type:"hard"},{index:2,type:"soft"}]`.',example:[{index:1,type:"hard"},{index:2,type:"soft"}]},{type:Boolean,desc:"Flag indicating if the account should be saved.",example:!1}],returns:{type:r.Address,desc:"20 Bytes new derived address.",example:"0x407d73d8a49eeb85d32cf465507dd71d507100c1"}},exportAccount:{subdoc:f,desc:"Returns a standard wallet file for given account if password matches.",params:[{type:r.Address,desc:"Account address to export.",example:"0x407d73d8a49eeb85d32cf465507dd71d507100c1"},{type:String,desc:"Password to the account.",example:"hunter2"}],returns:{type:Object,desc:"Standard wallet JSON.",example:{address:"0042e5d2a662eeaca8a7e828c174f98f35d8925b",crypto:{cipher:"aes-128-ctr",cipherparams:{iv:"a1c6ff99070f8032ca1c4e8add006373"},ciphertext:"df27e3db64aa18d984b6439443f73660643c2d119a6f0fa2fa9a6456fc802d75",kdf:"pbkdf2",kdfparams:{c:10240,dklen:32,prf:"hmac-sha256",salt:"ddc325335cda5567a1719313e73b4842511f3e4a837c9658eeb78e51ebe8c815"},mac:"3dc888ae79cbb226ff9c455669f6cf2d79be72120f2298f6cb0d444fddc0aa3d"},id:"6a186c80-7797-cff2-bc2e-7c1d6a6cc76e",meta:'{"passwordHint":"parity-export-test","timestamp":1490017814987}',name:"parity-export-test",version:3}}},setMinGasPrice:{subdoc:l,desc:"Changes minimal gas price for transaction to be accepted to the queue.",params:[{type:r.Quantity,desc:"Minimal gas price",format:"utils.toHex",example:(0,a.fromDecimal)(1e3)}],returns:{type:Boolean,desc:"whether the call was successful",example:!0}},setGasFloorTarget:{subdoc:l,desc:"Sets a new gas floor target for mined blocks..",params:[{type:r.Quantity,desc:"(default: `0x0`) Gas floor target.",format:"utils.toHex",example:(0,a.fromDecimal)(1e3)}],returns:{type:Boolean,desc:"`true` if the call was successful.",example:!0}},setGasCeilTarget:{subdoc:l,desc:"Sets new gas ceiling target for mined blocks.",params:[{type:r.Quantity,desc:"(default: `0x0`) Gas ceiling target.",format:"utils.toHex",example:(0,a.fromDecimal)(1e10)}],returns:{type:Boolean,desc:"`true` if the call was successful.",example:!0}},setExtraData:{subdoc:l,desc:"Changes extra data for newly mined blocks",params:[{type:r.Data,desc:"Extra Data",format:"utils.toHex",example:"0x"}],returns:{type:Boolean,desc:"whether the call was successful",example:!0}},setAuthor:{subdoc:l,desc:"Changes author (coinbase) for mined blocks.",params:[{type:r.Address,desc:"20 Bytes - Address",format:"inputAddressFormatter",example:"0x407d73d8a49eeb85d32cf465507dd71d507100c1"}],returns:{type:Boolean,desc:"`true` if the call was successful.",example:!0}},setMaxTransactionGas:{subdoc:l,desc:"Sets the maximum amount of gas a single transaction may consume.",params:[{type:r.Quantity,desc:"Gas amount",format:"utils.toHex",example:(0,a.fromDecimal)(1e5)}],returns:{type:Boolean,desc:"`true` if the call was successful.",example:!0}},setTransactionsLimit:{subdoc:l,desc:"Changes limit for transactions in queue.",params:[{type:r.Quantity,desc:"New Limit",format:"utils.toHex",example:(0,a.fromDecimal)(1e3)}],returns:{type:Boolean,desc:"whether the call was successful",example:!0}},addReservedPeer:{subdoc:l,desc:"Add a reserved peer.",params:[{type:String,desc:"Enode address",example:"enode://a979fb575495b8d6db44f750317d0f4622bf4c2aa3365d6af7c284339968eef29b69ad0dce72a4d8db5ebb4968de0e3bec910127f134779fbcb0cb6d3331163c@22.99.55.44:7770"}],returns:{type:Boolean,desc:"`true` if successful.",example:!0}},removeReservedPeer:{subdoc:l,desc:"Remove a reserved peer.",params:[{type:String,desc:"Encode address",example:"enode://a979fb575495b8d6db44f750317d0f4622bf4c2aa3365d6af7c284339968eef29b69ad0dce72a4d8db5ebb4968de0e3bec910127f134779fbcb0cb6d3331163c@22.99.55.44:7770"}],returns:{type:Boolean,desc:"`true` if successful.",example:!0}},dropNonReservedPeers:{subdoc:l,desc:"Set Parity to drop all non-reserved peers. To restore default behavior call [parity_acceptNonReservedPeers](#parity_acceptnonreservedpeers).",params:[],returns:{type:Boolean,desc:"`true` if successful.",example:!0}},acceptNonReservedPeers:{subdoc:l,desc:"Set Parity to accept non-reserved peers (default behavior).",params:[],returns:{type:Boolean,desc:"`true` if successful.",example:!0}},hashContent:{subdoc:l,desc:"Creates a hash of a file at a given URL.",params:[{type:String,desc:"The url of the content.",example:"https://raw.githubusercontent.com/paritytech/parity/master/README.md"}],returns:{type:r.Hash,desc:"The SHA-3 hash of the content.",example:"0x2547ea3382099c7c76d33dd468063b32d41016aacb02cbd51ebc14ff5d2b6a43"}},setChain:{subdoc:l,desc:"Sets the network spec file Parity is using.",params:[{type:String,desc:'Chain spec name, one of: "foundation", "ropsten", "morden", "kovan", "olympic", "classic", "dev", "expanse" or a filename.',example:"foundation"}],returns:{type:Boolean,desc:"`true` if the call succeeded.",example:!0}},setMode:{subdoc:l,desc:"Changes the operating mode of Parity.",params:[{type:String,desc:'The mode to set, one of:\n  * `"active"` - Parity continuously syncs the chain.\n  * `"passive"` - Parity syncs initially, then sleeps and wakes regularly to resync.\n  * `"dark"` - Parity syncs only when the RPC is active.\n  * `"offline"` - Parity doesn\'t sync.\n',example:"passive"}],returns:{type:Boolean,desc:"`true` if the call succeeded.",example:!0}},setEngineSigner:{subdoc:l,desc:"Sets an authority account for signing consensus messages. For more information check the [[Proof of Authority Chains]] page.",params:[{type:r.Address,desc:"Identifier of a valid authority account.",example:"0x407d73d8a49eeb85d32cf465507dd71d507100c1"},{type:String,desc:"Passphrase to unlock the account.",example:"hunter2"}],returns:{type:Boolean,desc:"True if the call succeeded",example:!0}},upgradeReady:{subdoc:l,desc:"Returns a ReleaseInfo object describing the release which is available for upgrade or `null` if none is available.",params:[],returns:{type:Object,desc:"Details or `null` if no new release is available.",details:{version:{type:Object,desc:"Information on the version."},is_critical:{type:Boolean,desc:"Does this release contain critical security updates?"},fork:{type:r.Quantity,desc:"The latest fork that this release can handle."},binary:{type:r.Data,desc:"Keccak-256 checksum of the release parity binary, if known.",optional:!0}},example:null}},executeUpgrade:{subdoc:l,desc:"Attempts to upgrade Parity to the version specified in [parity_upgradeReady](#parity_upgradeready).",params:[],returns:{type:Boolean,desc:"returns `true` if the upgrade to the new release was successfully executed, `false` if not.",example:!0}},postSign:{section:o,desc:"Request an arbitrary transaction to be signed by an account.",params:[{type:r.Address,desc:"Account address.",example:"0xb60e8dd61c5d32be8058bb8eb970870f07233155"},{type:r.Hash,desc:"Transaction hash.",example:"0x8cda01991ae267a539135736132f1f987e76868ce0269b7537d3aab37b7b185e"}],returns:{type:r.Quantity,desc:"The id of the request to the signer. If the account was already unlocked, returns `Hash` of the transaction instead.",example:"0x1"}},postTransaction:{section:o,desc:"Posts a transaction to the signer without waiting for the signer response.",params:[{type:r.TransactionRequest,desc:"see [`eth_sendTransaction`](JSONRPC-eth-module#eth_sendtransaction).",format:"inputCallFormatter",example:{from:"0xb60e8dd61c5d32be8058bb8eb970870f07233155",to:"0xd46e8dd67c5d32be8058bb8eb970870f07244567",gas:(0,a.fromDecimal)(30400),gasPrice:(0,a.fromDecimal)(1e13),value:(0,a.fromDecimal)(2441406250),data:"0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",condition:{block:354221,time:new Date}}}],returns:{type:r.Quantity,desc:"The id of the request to the signer. If the account was already unlocked, returns `Hash` of the transaction instead.",format:"utils.toDecimal",example:"0x1"}},checkRequest:{section:o,desc:"Get the the transaction hash of the request previously posted to [`parity_postTransaction`](#parity_posttransaction) or [`parity_postSign`](#parity_postsign). Will return a JSON-RPC error if the request was rejected.",params:[{type:r.Quantity,desc:"The id of the request sent to the signer.",example:"0x1"}],returns:{type:r.Hash,desc:"32 Bytes - the transaction hash or `null` if the request hasn't been signed yet.",example:"0xde8dfd9642f7eeef12402f2a560dbf40921b4f0bda01fb84709b9d71f6c181be"}},decryptMessage:{desc:"Decrypt a message encrypted with a ECIES public key.",params:[{type:r.Address,desc:"Account which can decrypt the message.",example:"0x00a329c0648769a73afac7f9381e08fb43dbea72"},{type:r.Data,desc:"Encrypted message.",example:"0x0405afee7fa2ab3e48c27b00d543389270cb7267fc191ca1311f297255a83cbe8d77a4ba135b51560700a582924fa86d2b19029fcb50d2b68d60a7df1ba81df317a19c8def117f2b9cf8c2618be0e3f146a5272fb9e5528719d2d7a1bd91fa620901cffa756305c79c093e7af30fa3c1587029421351c34a7c1e5a2b"}],returns:{type:r.Data,desc:"Decrypted message.",example:(0,a.withComment)("0x68656c6c6f20776f726c64","hello world")}},signMessage:{desc:"Sign the hashed message bytes with the given account.",params:[{type:r.Address,desc:"Account which signs the message.",example:"0xc171033d5cbff7175f29dfd3a63dda3d6f8f385e"},{type:String,desc:"Passphrase to unlock the account.",example:"password1"},{type:r.Data,desc:"Hashed message.",example:"0xbc36789e7a1e281436464229828f817d6612f7b477d66591ff96a9e064bcc98a"}],returns:{type:r.Data,desc:"Message signature.",example:"0x1d9e33a8cf8bfc089a172bca01da462f9e359c6cb1b0f29398bc884e4d18df4f78588aee4fb5cc067ca62d2abab995e0bba29527be6ac98105b0320020a2efaf00"}},wsUrl:{section:u,desc:"Returns the hostname and the port of WebSockets/Signer server, error if not enabled.",params:[],returns:{type:String,desc:"The hostname and port number",example:"localhost:8546"}},composeTransaction:{desc:"Given partial transaction request produces transaction with all fields filled in. Such transaction can be then signed externally.",params:[{type:r.TransactionRequest,desc:"see [`eth_sendTransaction`](JSONRPC-eth-module#eth_sendtransaction).",format:"inputCallFormatter",example:{from:"0xb60e8dd61c5d32be8058bb8eb970870f07233155",to:"0xd46e8dd67c5d32be8058bb8eb970870f07244567",value:(0,a.fromDecimal)(2441406250)}}],returns:{type:Object,desc:"Transaction object (same as the parameter) with missing optional fields filled in by defaults.",example:{condition:null,data:"0x",from:"0xb60e8dd61c5d32be8058bb8eb970870f07233155",gas:"0xe57e0",gasPrice:"0x4a817c800",nonce:"0x0",to:"0xd46e8dd67c5d32be8058bb8eb970870f07244567",value:"0x9184e72a"}}},getBlockHeaderByNumber:{desc:"Get block header. Same as [`eth_getBlockByNumber`](JSONRPC-eth-module#eth_getblockbynumber) but without uncles and transactions.",params:[{type:r.BlockNumber,desc:"integer of a block number, or the string `'earliest'`, `'latest'` or `'pending'`, as in the [default block parameter](#the-default-block-parameter).",example:(0,a.fromDecimal)(436)}],returns:{type:Object,desc:"Block header",example:{author:"0xbb7b8287f3f0a933474a79eae42cbca977791171",difficulty:"0x4ea3f27bc",extraData:"0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32",gasLimit:"0x1388",gasUsed:"0x0",hash:"0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae",logsBloom:"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",miner:"0xbb7b8287f3f0a933474a79eae42cbca977791171",mixHash:"0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843",nonce:"0x689056015818adbe",number:"0x1b4",parentHash:"0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54",receiptsRoot:"0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",sealFields:["0xa04fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843","0x88689056015818adbe"],sha3Uncles:"0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",size:"0x21b",stateRoot:"0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d",timestamp:"0x55ba467c",transactionsRoot:"0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421"}}},cidV0:{desc:"Compute a v0 IPFS Content ID from protobuf encoded bytes.",params:[{type:r.Data,desc:"to encode.",example:"0x666f6f626172"}],returns:{type:String,desc:"Base58 encoded CID",example:"QmSbFjqjd6nFwNHqsBCC7SK8GShGcayLUEtysJjNGhZAnC"}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(77),a=n(76);t.default={generateAuthorizationToken:{desc:"Generates a new authorization token.",params:[],returns:{type:String,desc:"The new authorization token.",example:"bNGY-iIPB-j7zK-RSYZ"}},generateWebProxyAccessToken:{desc:"Generates a new web proxy access token.",params:[],returns:{type:String,desc:"The new web proxy access token.",example:"MOWm0tEJjwthDiTU"}},requestsToConfirm:{desc:"Returns a list of the transactions awaiting authorization.",params:[],returns:{type:Array,desc:"A list of the outstanding transactions.",example:new a.Dummy("[ ... ]")}},confirmRequest:{desc:"Confirm a request in the signer queue",params:[{type:r.Quantity,desc:"The request id.",example:(0,a.fromDecimal)(1)},{type:Object,desc:"Modify the transaction before confirmation.",details:{gasPrice:{type:r.Quantity,desc:"Modify the gas price provided by the sender in Wei.",optional:!0},gas:{type:r.Quantity,desc:"Gas provided by the sender in Wei.",optional:!0},condition:{type:Object,desc:"Condition for scheduled transaction. Can be either an integer block number `{ block: 1 }` or UTC timestamp (in seconds) `{ timestamp: 1491290692 }`.",optional:!0}},example:{}},{type:String,desc:"The account password",example:"hunter2"}],returns:{type:Object,desc:"The status of the confirmation, depending on the request type.",example:{}}},confirmRequestRaw:{desc:"Confirm a request in the signer queue providing signed request.",params:[{type:r.Quantity,desc:"Integer - The request id",example:(0,a.fromDecimal)(1)},{type:r.Data,desc:"Signed request (RLP encoded transaction)",example:"0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"}],returns:{type:Object,desc:"The status of the confirmation, depending on the request type.",example:{}}},confirmRequestWithToken:{desc:"Confirm specific request with rolling token.",params:[{type:r.Quantity,desc:"The request id.",example:(0,a.fromDecimal)(1)},{type:Object,desc:"Modify the transaction before confirmation.",details:{gasPrice:{type:r.Quantity,desc:"Modify the gas price provided by the sender in Wei.",optional:!0},gas:{type:r.Quantity,desc:"Gas provided by the sender in Wei.",optional:!0},condition:{type:Object,desc:"Conditional submission of the transaction. Can be either an integer block number `{ block: 1 }` or UTC timestamp (in seconds) `{ time: 1491290692 }` or `null`.",optional:!0}},example:{}},{type:String,desc:"Password (initially) or a token returned by the previous call.",example:"hunter2"}],returns:{type:Object,desc:"Status.",details:{result:{type:Object,desc:"The status of the confirmation, depending on the request type."},token:{type:String,desc:"Token used to authenticate the next request."}},example:{result:new a.Dummy("{ ... }"),token:"cAF2w5LE7XUZ3v3N"}}},rejectRequest:{desc:"Rejects a request in the signer queue",params:[{type:r.Quantity,desc:"Integer - The request id",example:(0,a.fromDecimal)(1)}],returns:{type:Boolean,desc:"The status of the rejection",example:!0}},signerEnabled:{nodoc:"Not present in Rust code",desc:"Returns whether signer is enabled/disabled.",params:[],returns:{type:Boolean,desc:"`true` when enabled, `false` when disabled.",example:!0}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(77),a=n(76),o="Transaction-Trace Filtering",s="Ad-hoc Tracing";t.default=(0,a.withPreamble)("\n\nThe trace module is for getting a deeper insight into transaction processing.\nIt includes two sets of calls; the transaction trace filtering API and the ad-hoc tracing API.\n\n**Note:** In order to use these API Parity must be fully synced with flags `$ parity --tracing on`.\n\n## The Ad-hoc Tracing API\n\nThe ad-hoc tracing API allows you to perform a number of different diagnostics on calls or transactions,\neither historical ones from the chain or hypothetical ones not yet mined. The diagnostics include:\n\n- `trace` **Transaction trace**. An equivalent trace to that in the previous section.\n- `vmTrace` **Virtual Machine execution trace**. Provides a full trace of the VM's state throughout the execution of the transaction, including for any subcalls.\n- `stateDiff` **State difference**. Provides information detailing all altered portions of the Ethereum state made due to the execution of the transaction.\n\nThere are three means of providing a transaction to execute; either providing the same information as when making\na call using `eth_call` (see `trace_call`), through providing raw, signed, transaction data as when using\n`eth_sendRawTransaction` (see `trace_rawTransaction`) or simply a transaction hash for a previously mined\ntransaction (see `trace_replayTransaction`). In the latter case, your node must be in archive mode or the\ntransaction should be within the most recent 1000 blocks.\n\n## The Transaction-Trace Filtering API\n\nThese APIs allow you to get a full *externality* trace on any transaction executed throughout the Parity chain.\nUnlike the log filtering API, you are able to search and filter based only upon address information.\nInformation returned includes the execution of all `CREATE`s, `SUICIDE`s and all variants of `CALL` together\nwith input data, output data, gas usage, amount transferred and the success status of each individual action.\n\n### `traceAddress` field\n\nThe `traceAddress` field of all returned traces, gives the exact location in the call trace [index in root,\nindex in first `CALL`, index in second `CALL`, ...].\n\ni.e. if the trace is:\n```\nA\n  CALLs B\n    CALLs G\n  CALLs C\n    CALLs G\n```\nthen it should look something like:\n\n`[ {A: []}, {B: [0]}, {G: [0, 0]}, {C: [1]}, {G: [1, 0]} ]`\n\n",{block:{section:o,desc:"Returns traces created at given block.",params:[{type:r.BlockNumber,desc:"Integer of a block number, or the string `'earliest'`, `'latest'` or `'pending'`.",example:(0,a.fromDecimal)(3068185)}],returns:{type:Array,desc:"Block traces.",example:[{action:{callType:"call",from:"0xaa7b131dc60b80d3cf5e59b5a21a666aa039c951",gas:"0x0",input:"0x",to:"0xd40aba8166a212d6892125f079c33e6f5ca19814",value:"0x4768d7effc3fbe"},blockHash:"0x7eb25504e4c202cf3d62fd585d3e238f592c780cca82dacb2ed3cb5b38883add",blockNumber:3068185,result:{gasUsed:"0x0",output:"0x"},subtraces:0,traceAddress:[],transactionHash:"0x07da28d752aba3b9dd7060005e554719c6205c8a3aea358599fc9b245c52f1f6",transactionPosition:0,type:"call"},new a.Dummy("...")]}},filter:{section:o,desc:"Returns traces matching given filter",params:[{type:Object,desc:"The filter object",details:{fromBlock:{type:r.BlockNumber,desc:"From this block.",optional:!0},toBlock:{type:r.BlockNumber,desc:"To this block.",optional:!0},fromAddress:{type:Array,desc:"Sent from these addresses.",optional:!0},toAddress:{type:r.Address,desc:"Sent to these addresses.",optional:!0}},example:{fromBlock:(0,a.fromDecimal)(3068100),toBlock:(0,a.fromDecimal)(3068200),toAddress:["0x8bbB73BCB5d553B5A556358d27625323Fd781D37"]}}],returns:{type:Array,desc:"Traces matching given filter",example:[{action:{callType:"call",from:"0x32be343b94f860124dc4fee278fdcbd38c102d88",gas:"0x4c40d",input:"0x",to:"0x8bbb73bcb5d553b5a556358d27625323fd781d37",value:"0x3f0650ec47fd240000"},blockHash:"0x86df301bcdd8248d982dbf039f09faf792684e1aeee99d5b58b77d620008b80f",blockNumber:3068183,result:{gasUsed:"0x0",output:"0x"},subtraces:0,traceAddress:[],transactionHash:"0x3321a7708b1083130bd78da0d62ead9f6683033231617c9d268e2c7e3fa6c104",transactionPosition:3,type:"call"},new a.Dummy("...")]}},get:{section:o,desc:"Returns trace at given position.",params:[{type:r.Hash,desc:"Transaction hash.",example:"0x17104ac9d3312d8c136b7f44d4b8b47852618065ebfa534bd2d3b5ef218ca1f3"},{type:Array,desc:"Index positions of the traces.",example:["0x0"]}],returns:{type:Object,desc:"Trace object",example:{action:{callType:"call",from:"0x1c39ba39e4735cb65978d4db400ddd70a72dc750",gas:"0x13e99",input:"0x16c72721",to:"0x2bd2326c993dfaef84f696526064ff22eba5b362",value:"0x0"},blockHash:"0x7eb25504e4c202cf3d62fd585d3e238f592c780cca82dacb2ed3cb5b38883add",blockNumber:3068185,result:{gasUsed:"0x183",output:"0x0000000000000000000000000000000000000000000000000000000000000001"},subtraces:0,traceAddress:[0],transactionHash:"0x17104ac9d3312d8c136b7f44d4b8b47852618065ebfa534bd2d3b5ef218ca1f3",transactionPosition:2,type:"call"}}},transaction:{section:o,desc:"Returns all traces of given transaction",params:[{type:r.Hash,desc:"Transaction hash",example:"0x17104ac9d3312d8c136b7f44d4b8b47852618065ebfa534bd2d3b5ef218ca1f3"}],returns:{type:Array,desc:"Traces of given transaction",example:[{action:{callType:"call",from:"0x1c39ba39e4735cb65978d4db400ddd70a72dc750",gas:"0x13e99",input:"0x16c72721",to:"0x2bd2326c993dfaef84f696526064ff22eba5b362",value:"0x0"},blockHash:"0x7eb25504e4c202cf3d62fd585d3e238f592c780cca82dacb2ed3cb5b38883add",blockNumber:3068185,result:{gasUsed:"0x183",output:"0x0000000000000000000000000000000000000000000000000000000000000001"},subtraces:0,traceAddress:[0],transactionHash:"0x17104ac9d3312d8c136b7f44d4b8b47852618065ebfa534bd2d3b5ef218ca1f3",transactionPosition:2,type:"call"},new a.Dummy("...")]}},call:{section:s,desc:"Executes the given call and returns a number of possible traces for it.",params:[{type:r.CallRequest,desc:"Call options, same as `eth_call`.",example:new a.Dummy("{ ... }")},{type:Array,desc:'Type of trace, one or more of: `"vmTrace"`, `"trace"`, `"stateDiff"`.',example:["trace"]},{type:r.BlockNumber,optional:!0,desc:"Integer of a block number, or the string `'earliest'`, `'latest'` or `'pending'`."}],returns:{type:Array,desc:"Block traces",example:{output:"0x",stateDiff:null,trace:[{action:new a.Dummy("{ ... }"),result:{gasUsed:"0x0",output:"0x"},subtraces:0,traceAddress:[],type:"call"}],vmTrace:null}}},rawTransaction:{section:s,desc:"Traces a call to `eth_sendRawTransaction` without making the call, returning the traces",params:[{type:r.Data,desc:"Raw transaction data.",example:"0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"},{type:Array,desc:'Type of trace, one or more of: `"vmTrace"`, `"trace"`, `"stateDiff"`.',example:["trace"]}],returns:{type:Object,desc:"Block traces.",example:{output:"0x",stateDiff:null,trace:[{action:new a.Dummy("{ ... }"),result:{gasUsed:"0x0",output:"0x"},subtraces:0,traceAddress:[],type:"call"}],vmTrace:null}}},replayTransaction:{section:s,desc:"Replays a transaction, returning the traces.",params:[{type:r.Hash,desc:"Transaction hash.",example:"0x02d4a872e096445e80d05276ee756cefef7f3b376bcec14246469c0cd97dad8f"},{type:Array,desc:'Type of trace, one or more of: `"vmTrace"`, `"trace"`, `"stateDiff"`.',example:["trace"]}],returns:{type:Object,desc:"Block traces.",example:{output:"0x",stateDiff:null,trace:[{action:new a.Dummy("{ ... }"),result:{gasUsed:"0x0",output:"0x"},subtraces:0,traceAddress:[],type:"call"}],vmTrace:null}}}})},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function a(e){var t=e._extend.Method,n=function(e,n){return(0,s.default)(e).map(function(r){return new t({name:r,call:n+"_{method}",params:e[r].params.length})})};return[{property:"parity",methods:n(c.default,"parity"),properties:[]},{property:"signer",methods:n(d.default,"signer"),properties:[]},{property:"trace",methods:n(f.default,"trace"),properties:[]}]}Object.defineProperty(t,"__esModule",{value:!0});var o=n(26),s=r(o);t.default=a;var i=n(188),c=r(i),u=n(189),d=r(u),l=n(190),f=r(l)},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(34),n(36),n(35),n(4))}(0,function(e){return function(){var t=e,n=t.lib,r=n.BlockCipher,a=t.algo,o=[],s=[],i=[],c=[],u=[],d=[],l=[],f=[],p=[],h=[];!function(){for(var e=[],t=0;t<256;t++)e[t]=t<128?t<<1:t<<1^283;for(var n=0,r=0,t=0;t<256;t++){var a=r^r<<1^r<<2^r<<3^r<<4;a=a>>>8^255&a^99,o[n]=a,s[a]=n;var m=e[n],b=e[m],y=e[b],g=257*e[a]^16843008*a;i[n]=g<<24|g>>>8,c[n]=g<<16|g>>>16,u[n]=g<<8|g>>>24,d[n]=g;var g=16843009*y^65537*b^257*m^16843008*n;l[a]=g<<24|g>>>8,f[a]=g<<16|g>>>16,p[a]=g<<8|g>>>24,h[a]=g,n?(n=m^e[e[e[y^m]]],r^=e[e[r]]):n=r=1}}();var m=[0,1,2,4,8,16,32,64,128,27,54],b=a.AES=r.extend({_doReset:function(){if(!this._nRounds||this._keyPriorReset!==this._key){for(var e=this._keyPriorReset=this._key,t=e.words,n=e.sigBytes/4,r=this._nRounds=n+6,a=4*(r+1),s=this._keySchedule=[],i=0;i<a;i++)if(i<n)s[i]=t[i];else{var c=s[i-1];i%n?n>6&&i%n==4&&(c=o[c>>>24]<<24|o[c>>>16&255]<<16|o[c>>>8&255]<<8|o[255&c]):(c=c<<8|c>>>24,c=o[c>>>24]<<24|o[c>>>16&255]<<16|o[c>>>8&255]<<8|o[255&c],c^=m[i/n|0]<<24),s[i]=s[i-n]^c}for(var u=this._invKeySchedule=[],d=0;d<a;d++){var i=a-d;if(d%4)var c=s[i];else var c=s[i-4];u[d]=d<4||i<=4?c:l[o[c>>>24]]^f[o[c>>>16&255]]^p[o[c>>>8&255]]^h[o[255&c]]}}},encryptBlock:function(e,t){this._doCryptBlock(e,t,this._keySchedule,i,c,u,d,o)},decryptBlock:function(e,t){var n=e[t+1];e[t+1]=e[t+3],e[t+3]=n,this._doCryptBlock(e,t,this._invKeySchedule,l,f,p,h,s);var n=e[t+1];e[t+1]=e[t+3],e[t+3]=n},_doCryptBlock:function(e,t,n,r,a,o,s,i){for(var c=this._nRounds,u=e[t]^n[0],d=e[t+1]^n[1],l=e[t+2]^n[2],f=e[t+3]^n[3],p=4,h=1;h<c;h++){var m=r[u>>>24]^a[d>>>16&255]^o[l>>>8&255]^s[255&f]^n[p++],b=r[d>>>24]^a[l>>>16&255]^o[f>>>8&255]^s[255&u]^n[p++],y=r[l>>>24]^a[f>>>16&255]^o[u>>>8&255]^s[255&d]^n[p++],g=r[f>>>24]^a[u>>>16&255]^o[d>>>8&255]^s[255&l]^n[p++];u=m,d=b,l=y,f=g}var m=(i[u>>>24]<<24|i[d>>>16&255]<<16|i[l>>>8&255]<<8|i[255&f])^n[p++],b=(i[d>>>24]<<24|i[l>>>16&255]<<16|i[f>>>8&255]<<8|i[255&u])^n[p++],y=(i[l>>>24]<<24|i[f>>>16&255]<<16|i[u>>>8&255]<<8|i[255&d])^n[p++],g=(i[f>>>24]<<24|i[u>>>16&255]<<16|i[d>>>8&255]<<8|i[255&l])^n[p++];e[t]=m,e[t+1]=b,e[t+2]=y,e[t+3]=g},keySize:8});t.AES=r._createHelper(b)}(),e.AES})},function(e,t,n){!function(r,a){e.exports=t=a(n(2))}(0,function(e){return function(){function t(e){return e<<8&4278255360|e>>>8&16711935}var n=e,r=n.lib,a=r.WordArray,o=n.enc;o.Utf16=o.Utf16BE={stringify:function(e){for(var t=e.words,n=e.sigBytes,r=[],a=0;a<n;a+=2){var o=t[a>>>2]>>>16-a%4*8&65535;r.push(String.fromCharCode(o))}return r.join("")},parse:function(e){for(var t=e.length,n=[],r=0;r<t;r++)n[r>>>1]|=e.charCodeAt(r)<<16-r%2*16;return a.create(n,2*t)}};o.Utf16LE={stringify:function(e){for(var n=e.words,r=e.sigBytes,a=[],o=0;o<r;o+=2){var s=t(n[o>>>2]>>>16-o%4*8&65535);a.push(String.fromCharCode(s))}return a.join("")},parse:function(e){for(var n=e.length,r=[],o=0;o<n;o++)r[o>>>1]|=t(e.charCodeAt(o)<<16-o%2*16);return a.create(r,2*n)}}}(),e.enc.Utf16})},function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(4))}(0,function(e){return function(t){var n=e,r=n.lib,a=r.CipherParams,o=n.enc,s=o.Hex,i=n.format;i.Hex={stringify:function(e){return e.ciphertext.toString(s)},parse:function(e){var t=s.parse(e);return a.create({ciphertext:t})}}}(),e.format.Hex})},function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(64),n(249),n(246),n(34),n(36),n(91),n(126),n(265),n(128),n(266),n(127),n(264),n(90),n(260),n(35),n(4),n(250),n(252),n(251),n(254),n(253),n(255),n(256),n(257),n(259),n(258),n(247),n(245),n(267),n(263),n(262),n(261))}(0,function(e){return e})},function(e,t,n){!function(r,a){e.exports=t=a(n(2))}(0,function(e){return function(){if("function"==typeof ArrayBuffer){var t=e,n=t.lib,r=n.WordArray,a=r.init;(r.init=function(e){if(e instanceof ArrayBuffer&&(e=new Uint8Array(e)),(e instanceof Int8Array||"undefined"!=typeof Uint8ClampedArray&&e instanceof Uint8ClampedArray||e instanceof Int16Array||e instanceof Uint16Array||e instanceof Int32Array||e instanceof Uint32Array||e instanceof Float32Array||e instanceof Float64Array)&&(e=new Uint8Array(e.buffer,e.byteOffset,e.byteLength)),e instanceof Uint8Array){for(var t=e.byteLength,n=[],r=0;r<t;r++)n[r>>>2]|=e[r]<<24-r%4*8;a.call(this,n,t)}else a.apply(this,arguments)}).prototype=r}}(),e.lib.WordArray})},function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(4))}(0,function(e){return e.mode.CFB=function(){function t(e,t,n,r){var a=this._iv;if(a){var o=a.slice(0);this._iv=void 0}else var o=this._prevBlock;r.encryptBlock(o,0);for(var s=0;s<n;s++)e[t+s]^=o[s]}var n=e.lib.BlockCipherMode.extend();return n.Encryptor=n.extend({processBlock:function(e,n){var r=this._cipher,a=r.blockSize;t.call(this,e,n,a,r),this._prevBlock=e.slice(n,n+a)}}),n.Decryptor=n.extend({processBlock:function(e,n){var r=this._cipher,a=r.blockSize,o=e.slice(n,n+a);t.call(this,e,n,a,r),this._prevBlock=o}}),n}(),e.mode.CFB})},function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(4))}(0,function(e){return e.mode.CTRGladman=function(){function t(e){if(255==(e>>24&255)){var t=e>>16&255,n=e>>8&255,r=255&e;255===t?(t=0,255===n?(n=0,255===r?r=0:++r):++n):++t,e=0,e+=t<<16,e+=n<<8,e+=r}else e+=1<<24;return e}function n(e){return 0===(e[0]=t(e[0]))&&(e[1]=t(e[1])),e}var r=e.lib.BlockCipherMode.extend(),a=r.Encryptor=r.extend({processBlock:function(e,t){var r=this._cipher,a=r.blockSize,o=this._iv,s=this._counter;o&&(s=this._counter=o.slice(0),this._iv=void 0),n(s);var i=s.slice(0);r.encryptBlock(i,0);for(var c=0;c<a;c++)e[t+c]^=i[c]}});return r.Decryptor=a,r}(),e.mode.CTRGladman})},function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(4))}(0,function(e){return e.mode.CTR=function(){var t=e.lib.BlockCipherMode.extend(),n=t.Encryptor=t.extend({processBlock:function(e,t){var n=this._cipher,r=n.blockSize,a=this._iv,o=this._counter;a&&(o=this._counter=a.slice(0),this._iv=void 0);var s=o.slice(0);n.encryptBlock(s,0),o[r-1]=o[r-1]+1|0;for(var i=0;i<r;i++)e[t+i]^=s[i]}});return t.Decryptor=n,t}(),e.mode.CTR})},function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(4))}(0,function(e){return e.mode.ECB=function(){var t=e.lib.BlockCipherMode.extend();return t.Encryptor=t.extend({processBlock:function(e,t){this._cipher.encryptBlock(e,t)}}),t.Decryptor=t.extend({processBlock:function(e,t){this._cipher.decryptBlock(e,t)}}),t}(),e.mode.ECB})},function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(4))}(0,function(e){return e.mode.OFB=function(){var t=e.lib.BlockCipherMode.extend(),n=t.Encryptor=t.extend({processBlock:function(e,t){var n=this._cipher,r=n.blockSize,a=this._iv,o=this._keystream;a&&(o=this._keystream=a.slice(0),this._iv=void 0),n.encryptBlock(o,0);for(var s=0;s<r;s++)e[t+s]^=o[s]}});return t.Decryptor=n,t}(),e.mode.OFB})},function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(4))}(0,function(e){return e.pad.AnsiX923={pad:function(e,t){var n=e.sigBytes,r=4*t,a=r-n%r,o=n+a-1;e.clamp(),e.words[o>>>2]|=a<<24-o%4*8,e.sigBytes+=a},unpad:function(e){var t=255&e.words[e.sigBytes-1>>>2];e.sigBytes-=t}},e.pad.Ansix923})},function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(4))}(0,function(e){return e.pad.Iso10126={pad:function(t,n){var r=4*n,a=r-t.sigBytes%r;t.concat(e.lib.WordArray.random(a-1)).concat(e.lib.WordArray.create([a<<24],1))},unpad:function(e){var t=255&e.words[e.sigBytes-1>>>2];e.sigBytes-=t}},e.pad.Iso10126})},function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(4))}(0,function(e){return e.pad.Iso97971={pad:function(t,n){t.concat(e.lib.WordArray.create([2147483648],1)),e.pad.ZeroPadding.pad(t,n)},unpad:function(t){e.pad.ZeroPadding.unpad(t),t.sigBytes--}},e.pad.Iso97971})},function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(4))}(0,function(e){return e.pad.NoPadding={pad:function(){},unpad:function(){}},e.pad.NoPadding})},function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(4))}(0,function(e){return e.pad.ZeroPadding={pad:function(e,t){var n=4*t;e.clamp(),e.sigBytes+=n-(e.sigBytes%n||n)},unpad:function(e){for(var t=e.words,n=e.sigBytes-1;!(t[n>>>2]>>>24-n%4*8&255);)n--;e.sigBytes=n+1}},e.pad.ZeroPadding})},function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(91),n(90))}(0,function(e){return function(){var t=e,n=t.lib,r=n.Base,a=n.WordArray,o=t.algo,s=o.SHA1,i=o.HMAC,c=o.PBKDF2=r.extend({cfg:r.extend({keySize:4,hasher:s,iterations:1}),init:function(e){this.cfg=this.cfg.extend(e)},compute:function(e,t){for(var n=this.cfg,r=i.create(n.hasher,e),o=a.create(),s=a.create([1]),c=o.words,u=s.words,d=n.keySize,l=n.iterations;c.length<d;){var f=r.update(t).finalize(s);r.reset();for(var p=f.words,h=p.length,m=f,b=1;b<l;b++){m=r.finalize(m),r.reset();for(var y=m.words,g=0;g<h;g++)p[g]^=y[g]}o.concat(f),u[0]++}return o.sigBytes=4*d,o}});t.PBKDF2=function(e,t,n){return c.create(n).compute(e,t)}}(),e.PBKDF2})},function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(34),n(36),n(35),n(4))}(0,function(e){return function(){function t(){for(var e=this._X,t=this._C,n=0;n<8;n++)i[n]=t[n];t[0]=t[0]+1295307597+this._b|0,t[1]=t[1]+3545052371+(t[0]>>>0<i[0]>>>0?1:0)|0,t[2]=t[2]+886263092+(t[1]>>>0<i[1]>>>0?1:0)|0,t[3]=t[3]+1295307597+(t[2]>>>0<i[2]>>>0?1:0)|0,t[4]=t[4]+3545052371+(t[3]>>>0<i[3]>>>0?1:0)|0,t[5]=t[5]+886263092+(t[4]>>>0<i[4]>>>0?1:0)|0,t[6]=t[6]+1295307597+(t[5]>>>0<i[5]>>>0?1:0)|0,t[7]=t[7]+3545052371+(t[6]>>>0<i[6]>>>0?1:0)|0,this._b=t[7]>>>0<i[7]>>>0?1:0;for(var n=0;n<8;n++){var r=e[n]+t[n],a=65535&r,o=r>>>16,s=((a*a>>>17)+a*o>>>15)+o*o,u=((4294901760&r)*r|0)+((65535&r)*r|0);c[n]=s^u}e[0]=c[0]+(c[7]<<16|c[7]>>>16)+(c[6]<<16|c[6]>>>16)|0,e[1]=c[1]+(c[0]<<8|c[0]>>>24)+c[7]|0,e[2]=c[2]+(c[1]<<16|c[1]>>>16)+(c[0]<<16|c[0]>>>16)|0,e[3]=c[3]+(c[2]<<8|c[2]>>>24)+c[1]|0,e[4]=c[4]+(c[3]<<16|c[3]>>>16)+(c[2]<<16|c[2]>>>16)|0,e[5]=c[5]+(c[4]<<8|c[4]>>>24)+c[3]|0,e[6]=c[6]+(c[5]<<16|c[5]>>>16)+(c[4]<<16|c[4]>>>16)|0,e[7]=c[7]+(c[6]<<8|c[6]>>>24)+c[5]|0}var n=e,r=n.lib,a=r.StreamCipher,o=n.algo,s=[],i=[],c=[],u=o.RabbitLegacy=a.extend({_doReset:function(){var e=this._key.words,n=this.cfg.iv,r=this._X=[e[0],e[3]<<16|e[2]>>>16,e[1],e[0]<<16|e[3]>>>16,e[2],e[1]<<16|e[0]>>>16,e[3],e[2]<<16|e[1]>>>16],a=this._C=[e[2]<<16|e[2]>>>16,4294901760&e[0]|65535&e[1],e[3]<<16|e[3]>>>16,4294901760&e[1]|65535&e[2],e[0]<<16|e[0]>>>16,4294901760&e[2]|65535&e[3],e[1]<<16|e[1]>>>16,4294901760&e[3]|65535&e[0]];this._b=0;for(var o=0;o<4;o++)t.call(this);for(var o=0;o<8;o++)a[o]^=r[o+4&7];if(n){var s=n.words,i=s[0],c=s[1],u=16711935&(i<<8|i>>>24)|4278255360&(i<<24|i>>>8),d=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8),l=u>>>16|4294901760&d,f=d<<16|65535&u;a[0]^=u,a[1]^=l,a[2]^=d,a[3]^=f,a[4]^=u,a[5]^=l,a[6]^=d,a[7]^=f;for(var o=0;o<4;o++)t.call(this)}},_doProcessBlock:function(e,n){var r=this._X;t.call(this),s[0]=r[0]^r[5]>>>16^r[3]<<16,s[1]=r[2]^r[7]>>>16^r[5]<<16,s[2]=r[4]^r[1]>>>16^r[7]<<16,s[3]=r[6]^r[3]>>>16^r[1]<<16;for(var a=0;a<4;a++)s[a]=16711935&(s[a]<<8|s[a]>>>24)|4278255360&(s[a]<<24|s[a]>>>8),e[n+a]^=s[a]},blockSize:4,ivSize:2});n.RabbitLegacy=a._createHelper(u)}(),e.RabbitLegacy})},function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(34),n(36),n(35),n(4))}(0,function(e){return function(){function t(){for(var e=this._X,t=this._C,n=0;n<8;n++)i[n]=t[n];t[0]=t[0]+1295307597+this._b|0,t[1]=t[1]+3545052371+(t[0]>>>0<i[0]>>>0?1:0)|0,t[2]=t[2]+886263092+(t[1]>>>0<i[1]>>>0?1:0)|0,t[3]=t[3]+1295307597+(t[2]>>>0<i[2]>>>0?1:0)|0,t[4]=t[4]+3545052371+(t[3]>>>0<i[3]>>>0?1:0)|0,t[5]=t[5]+886263092+(t[4]>>>0<i[4]>>>0?1:0)|0,t[6]=t[6]+1295307597+(t[5]>>>0<i[5]>>>0?1:0)|0,t[7]=t[7]+3545052371+(t[6]>>>0<i[6]>>>0?1:0)|0,this._b=t[7]>>>0<i[7]>>>0?1:0;for(var n=0;n<8;n++){var r=e[n]+t[n],a=65535&r,o=r>>>16,s=((a*a>>>17)+a*o>>>15)+o*o,u=((4294901760&r)*r|0)+((65535&r)*r|0);c[n]=s^u}e[0]=c[0]+(c[7]<<16|c[7]>>>16)+(c[6]<<16|c[6]>>>16)|0,e[1]=c[1]+(c[0]<<8|c[0]>>>24)+c[7]|0,e[2]=c[2]+(c[1]<<16|c[1]>>>16)+(c[0]<<16|c[0]>>>16)|0,e[3]=c[3]+(c[2]<<8|c[2]>>>24)+c[1]|0,e[4]=c[4]+(c[3]<<16|c[3]>>>16)+(c[2]<<16|c[2]>>>16)|0,e[5]=c[5]+(c[4]<<8|c[4]>>>24)+c[3]|0,e[6]=c[6]+(c[5]<<16|c[5]>>>16)+(c[4]<<16|c[4]>>>16)|0,e[7]=c[7]+(c[6]<<8|c[6]>>>24)+c[5]|0}var n=e,r=n.lib,a=r.StreamCipher,o=n.algo,s=[],i=[],c=[],u=o.Rabbit=a.extend({_doReset:function(){for(var e=this._key.words,n=this.cfg.iv,r=0;r<4;r++)e[r]=16711935&(e[r]<<8|e[r]>>>24)|4278255360&(e[r]<<24|e[r]>>>8);var a=this._X=[e[0],e[3]<<16|e[2]>>>16,e[1],e[0]<<16|e[3]>>>16,e[2],e[1]<<16|e[0]>>>16,e[3],e[2]<<16|e[1]>>>16],o=this._C=[e[2]<<16|e[2]>>>16,4294901760&e[0]|65535&e[1],e[3]<<16|e[3]>>>16,4294901760&e[1]|65535&e[2],e[0]<<16|e[0]>>>16,4294901760&e[2]|65535&e[3],e[1]<<16|e[1]>>>16,4294901760&e[3]|65535&e[0]];this._b=0;for(var r=0;r<4;r++)t.call(this);for(var r=0;r<8;r++)o[r]^=a[r+4&7];if(n){var s=n.words,i=s[0],c=s[1],u=16711935&(i<<8|i>>>24)|4278255360&(i<<24|i>>>8),d=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8),l=u>>>16|4294901760&d,f=d<<16|65535&u;o[0]^=u,o[1]^=l,o[2]^=d,o[3]^=f,o[4]^=u,o[5]^=l,o[6]^=d,o[7]^=f;for(var r=0;r<4;r++)t.call(this)}},_doProcessBlock:function(e,n){var r=this._X;t.call(this),s[0]=r[0]^r[5]>>>16^r[3]<<16,s[1]=r[2]^r[7]>>>16^r[5]<<16,s[2]=r[4]^r[1]>>>16^r[7]<<16,s[3]=r[6]^r[3]>>>16^r[1]<<16;for(var a=0;a<4;a++)s[a]=16711935&(s[a]<<8|s[a]>>>24)|4278255360&(s[a]<<24|s[a]>>>8),e[n+a]^=s[a]},blockSize:4,ivSize:2});n.Rabbit=a._createHelper(u)}(),e.Rabbit})},function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(34),n(36),n(35),n(4))}(0,function(e){return function(){function t(){for(var e=this._S,t=this._i,n=this._j,r=0,a=0;a<4;a++){t=(t+1)%256,n=(n+e[t])%256;var o=e[t];e[t]=e[n],e[n]=o,r|=e[(e[t]+e[n])%256]<<24-8*a}return this._i=t,this._j=n,r}var n=e,r=n.lib,a=r.StreamCipher,o=n.algo,s=o.RC4=a.extend({_doReset:function(){for(var e=this._key,t=e.words,n=e.sigBytes,r=this._S=[],a=0;a<256;a++)r[a]=a;for(var a=0,o=0;a<256;a++){var s=a%n,i=t[s>>>2]>>>24-s%4*8&255;o=(o+r[a]+i)%256;var c=r[a];r[a]=r[o],r[o]=c}this._i=this._j=0},_doProcessBlock:function(e,n){e[n]^=t.call(this)},keySize:8,ivSize:0});n.RC4=a._createHelper(s);var i=o.RC4Drop=s.extend({cfg:s.cfg.extend({drop:192}),_doReset:function(){s._doReset.call(this);for(var e=this.cfg.drop;e>0;e--)t.call(this)}});n.RC4Drop=a._createHelper(i)}(),e.RC4})},function(e,t,n){!function(r,a){e.exports=t=a(n(2))}(0,function(e){return function(t){function n(e,t,n){return e^t^n}function r(e,t,n){return e&t|~e&n}function a(e,t,n){return(e|~t)^n}function o(e,t,n){return e&n|t&~n}function s(e,t,n){return e^(t|~n)}function i(e,t){return e<<t|e>>>32-t}var c=e,u=c.lib,d=u.WordArray,l=u.Hasher,f=c.algo,p=d.create([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13]),h=d.create([5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11]),m=d.create([11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6]),b=d.create([8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11]),y=d.create([0,1518500249,1859775393,2400959708,2840853838]),g=d.create([1352829926,1548603684,1836072691,2053994217,0]),v=f.RIPEMD160=l.extend({_doReset:function(){this._hash=d.create([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(e,t){for(var c=0;c<16;c++){var u=t+c,d=e[u];e[u]=16711935&(d<<8|d>>>24)|4278255360&(d<<24|d>>>8)}var l,f,v,x,w,_,k,A,B,S,T=this._hash.words,C=y.words,D=g.words,P=p.words,O=h.words,F=m.words,R=b.words;_=l=T[0],k=f=T[1],A=v=T[2],B=x=T[3],S=w=T[4];for(var I,c=0;c<80;c+=1)I=l+e[t+P[c]]|0,I+=c<16?n(f,v,x)+C[0]:c<32?r(f,v,x)+C[1]:c<48?a(f,v,x)+C[2]:c<64?o(f,v,x)+C[3]:s(f,v,x)+C[4],I|=0,I=i(I,F[c]),I=I+w|0,l=w,w=x,x=i(v,10),v=f,f=I,I=_+e[t+O[c]]|0,I+=c<16?s(k,A,B)+D[0]:c<32?o(k,A,B)+D[1]:c<48?a(k,A,B)+D[2]:c<64?r(k,A,B)+D[3]:n(k,A,B)+D[4],I|=0,I=i(I,R[c]),I=I+S|0,_=S,S=B,B=i(A,10),A=k,k=I;I=T[1]+v+B|0,T[1]=T[2]+x+S|0,T[2]=T[3]+w+_|0,T[3]=T[4]+l+k|0,T[4]=T[0]+f+A|0,T[0]=I},_doFinalize:function(){var e=this._data,t=e.words,n=8*this._nDataBytes,r=8*e.sigBytes;t[r>>>5]|=128<<24-r%32,t[14+(r+64>>>9<<4)]=16711935&(n<<8|n>>>24)|4278255360&(n<<24|n>>>8),e.sigBytes=4*(t.length+1),this._process();for(var a=this._hash,o=a.words,s=0;s<5;s++){var i=o[s];o[s]=16711935&(i<<8|i>>>24)|4278255360&(i<<24|i>>>8)}return a},clone:function(){var e=l.clone.call(this);return e._hash=this._hash.clone(),e}});c.RIPEMD160=l._createHelper(v),c.HmacRIPEMD160=l._createHmacHelper(v)}(Math),e.RIPEMD160})},function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(126))}(0,function(e){return function(){var t=e,n=t.lib,r=n.WordArray,a=t.algo,o=a.SHA256,s=a.SHA224=o.extend({_doReset:function(){this._hash=new r.init([3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428])},_doFinalize:function(){var e=o._doFinalize.call(this);return e.sigBytes-=4,e}});t.SHA224=o._createHelper(s),t.HmacSHA224=o._createHmacHelper(s)}(),e.SHA224})},function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(64),n(128))}(0,function(e){return function(){var t=e,n=t.x64,r=n.Word,a=n.WordArray,o=t.algo,s=o.SHA512,i=o.SHA384=s.extend({_doReset:function(){this._hash=new a.init([new r.init(3418070365,3238371032),new r.init(1654270250,914150663),new r.init(2438529370,812702999),new r.init(355462360,4144912697),new r.init(1731405415,4290775857),new r.init(2394180231,1750603025),new r.init(3675008525,1694076839),new r.init(1203062813,3204075428)])},_doFinalize:function(){var e=s._doFinalize.call(this);return e.sigBytes-=16,e}});t.SHA384=s._createHelper(i),t.HmacSHA384=s._createHmacHelper(i)}(),e.SHA384})},function(e,t,n){!function(r,a,o){e.exports=t=a(n(2),n(34),n(36),n(35),n(4))}(0,function(e){return function(){function t(e,t){var n=(this._lBlock>>>e^this._rBlock)&t;this._rBlock^=n,this._lBlock^=n<<e}function n(e,t){var n=(this._rBlock>>>e^this._lBlock)&t;this._lBlock^=n,this._rBlock^=n<<e}var r=e,a=r.lib,o=a.WordArray,s=a.BlockCipher,i=r.algo,c=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4],u=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32],d=[1,2,4,6,8,10,12,14,15,17,19,21,23,25,27,28],l=[{0:8421888,268435456:32768,536870912:8421378,805306368:2,1073741824:512,1342177280:8421890,1610612736:8389122,1879048192:8388608,2147483648:514,2415919104:8389120,2684354560:33280,2952790016:8421376,3221225472:32770,3489660928:8388610,3758096384:0,4026531840:33282,134217728:0,402653184:8421890,671088640:33282,939524096:32768,1207959552:8421888,1476395008:512,1744830464:8421378,2013265920:2,2281701376:8389120,2550136832:33280,2818572288:8421376,3087007744:8389122,3355443200:8388610,3623878656:32770,3892314112:514,4160749568:8388608,1:32768,268435457:2,536870913:8421888,805306369:8388608,1073741825:8421378,1342177281:33280,1610612737:512,1879048193:8389122,2147483649:8421890,2415919105:8421376,2684354561:8388610,2952790017:33282,3221225473:514,3489660929:8389120,3758096385:32770,4026531841:0,134217729:8421890,402653185:8421376,671088641:8388608,939524097:512,1207959553:32768,1476395009:8388610,1744830465:2,2013265921:33282,2281701377:32770,2550136833:8389122,2818572289:514,3087007745:8421888,3355443201:8389120,3623878657:0,3892314113:33280,4160749569:8421378},{0:1074282512,16777216:16384,33554432:524288,50331648:1074266128,67108864:1073741840,83886080:1074282496,100663296:1073758208,117440512:16,134217728:540672,150994944:1073758224,167772160:1073741824,184549376:540688,201326592:524304,218103808:0,234881024:16400,251658240:1074266112,8388608:1073758208,25165824:540688,41943040:16,58720256:1073758224,75497472:1074282512,92274688:1073741824,109051904:524288,125829120:1074266128,142606336:524304,159383552:0,176160768:16384,192937984:1074266112,209715200:1073741840,226492416:540672,243269632:1074282496,260046848:16400,268435456:0,285212672:1074266128,301989888:1073758224,318767104:1074282496,335544320:1074266112,352321536:16,369098752:540688,385875968:16384,402653184:16400,419430400:524288,436207616:524304,452984832:1073741840,469762048:540672,486539264:1073758208,503316480:1073741824,520093696:1074282512,276824064:540688,293601280:524288,310378496:1074266112,327155712:16384,343932928:1073758208,360710144:1074282512,377487360:16,394264576:1073741824,411041792:1074282496,427819008:1073741840,444596224:1073758224,461373440:524304,478150656:0,494927872:16400,511705088:1074266128,528482304:540672},{0:260,1048576:0,2097152:67109120,3145728:65796,4194304:65540,5242880:67108868,6291456:67174660,7340032:67174400,8388608:67108864,9437184:67174656,10485760:65792,11534336:67174404,12582912:67109124,13631488:65536,14680064:4,15728640:256,524288:67174656,1572864:67174404,2621440:0,3670016:67109120,4718592:67108868,5767168:65536,6815744:65540,7864320:260,8912896:4,9961472:256,11010048:67174400,12058624:65796,13107200:65792,14155776:67109124,15204352:67174660,16252928:67108864,16777216:67174656,17825792:65540,18874368:65536,19922944:67109120,20971520:256,22020096:67174660,23068672:67108868,24117248:0,25165824:67109124,26214400:67108864,27262976:4,28311552:65792,29360128:67174400,30408704:260,31457280:65796,32505856:67174404,17301504:67108864,18350080:260,19398656:67174656,20447232:0,21495808:65540,22544384:67109120,23592960:256,24641536:67174404,25690112:65536,26738688:67174660,27787264:65796,28835840:67108868,29884416:67109124,30932992:67174400,31981568:4,33030144:65792},{0:2151682048,65536:2147487808,131072:4198464,196608:2151677952,262144:0,327680:4198400,393216:2147483712,458752:4194368,524288:2147483648,589824:4194304,655360:64,720896:2147487744,786432:2151678016,851968:4160,917504:4096,983040:2151682112,32768:2147487808,98304:64,163840:2151678016,229376:2147487744,294912:4198400,360448:2151682112,425984:0,491520:2151677952,557056:4096,622592:2151682048,688128:4194304,753664:4160,819200:2147483648,884736:4194368,950272:4198464,1015808:2147483712,1048576:4194368,1114112:4198400,1179648:2147483712,1245184:0,1310720:4160,1376256:2151678016,1441792:2151682048,1507328:2147487808,1572864:2151682112,1638400:2147483648,1703936:2151677952,1769472:4198464,1835008:2147487744,1900544:4194304,1966080:64,2031616:4096,1081344:2151677952,1146880:2151682112,1212416:0,1277952:4198400,1343488:4194368,1409024:2147483648,1474560:2147487808,1540096:64,1605632:2147483712,1671168:4096,1736704:2147487744,1802240:2151678016,1867776:4160,1933312:2151682048,1998848:4194304,2064384:4198464},{0:128,4096:17039360,8192:262144,12288:536870912,16384:537133184,20480:16777344,24576:553648256,28672:262272,32768:16777216,36864:537133056,40960:536871040,45056:553910400,49152:553910272,53248:0,57344:17039488,61440:553648128,2048:17039488,6144:553648256,10240:128,14336:17039360,18432:262144,22528:537133184,26624:553910272,30720:536870912,34816:537133056,38912:0,43008:553910400,47104:16777344,51200:536871040,55296:553648128,59392:16777216,63488:262272,65536:262144,69632:128,73728:536870912,77824:553648256,81920:16777344,86016:553910272,90112:537133184,94208:16777216,98304:553910400,102400:553648128,106496:17039360,110592:537133056,114688:262272,118784:536871040,122880:0,126976:17039488,67584:553648256,71680:16777216,75776:17039360,79872:537133184,83968:536870912,88064:17039488,92160:128,96256:553910272,100352:262272,104448:553910400,108544:0,112640:553648128,116736:16777344,120832:262144,124928:537133056,129024:536871040},{0:268435464,256:8192,512:270532608,768:270540808,1024:268443648,1280:2097152,1536:2097160,1792:268435456,2048:0,2304:268443656,2560:2105344,2816:8,3072:270532616,3328:2105352,3584:8200,3840:270540800,128:270532608,384:270540808,640:8,896:2097152,1152:2105352,1408:268435464,1664:268443648,1920:8200,2176:2097160,2432:8192,2688:268443656,2944:270532616,3200:0,3456:270540800,3712:2105344,3968:268435456,4096:268443648,4352:270532616,4608:270540808,4864:8200,5120:2097152,5376:268435456,5632:268435464,5888:2105344,6144:2105352,6400:0,6656:8,6912:270532608,7168:8192,7424:268443656,7680:270540800,7936:2097160,4224:8,4480:2105344,4736:2097152,4992:268435464,5248:268443648,5504:8200,5760:270540808,6016:270532608,6272:270540800,6528:270532616,6784:8192,7040:2105352,7296:2097160,7552:0,7808:268435456,8064:268443656},{0:1048576,16:33555457,32:1024,48:1049601,64:34604033,80:0,96:1,112:34603009,128:33555456,144:1048577,160:33554433,176:34604032,192:34603008,208:1025,224:1049600,240:33554432,8:34603009,24:0,40:33555457,56:34604032,72:1048576,88:33554433,104:33554432,120:1025,136:1049601,152:33555456,168:34603008,184:1048577,200:1024,216:34604033,232:1,248:1049600,256:33554432,272:1048576,288:33555457,304:34603009,320:1048577,336:33555456,352:34604032,368:1049601,384:1025,400:34604033,416:1049600,432:1,448:0,464:34603008,480:33554433,496:1024,264:1049600,280:33555457,296:34603009,312:1,328:33554432,344:1048576,360:1025,376:34604032,392:33554433,408:34603008,424:0,440:34604033,456:1049601,472:1024,488:33555456,504:1048577},{0:134219808,1:131072,2:134217728,3:32,4:131104,5:134350880,6:134350848,7:2048,8:134348800,9:134219776,10:133120,11:134348832,12:2080,13:0,14:134217760,15:133152,2147483648:2048,2147483649:134350880,2147483650:134219808,2147483651:134217728,2147483652:134348800,2147483653:133120,2147483654:133152,2147483655:32,2147483656:134217760,2147483657:2080,2147483658:131104,2147483659:134350848,2147483660:0,2147483661:134348832,2147483662:134219776,2147483663:131072,16:133152,17:134350848,18:32,19:2048,20:134219776,21:134217760,22:134348832,23:131072,24:0,25:131104,26:134348800,27:134219808,28:134350880,29:133120,30:2080,31:134217728,2147483664:131072,2147483665:2048,2147483666:134348832,2147483667:133152,2147483668:32,2147483669:134348800,2147483670:134217728,2147483671:134219808,2147483672:134350880,2147483673:134217760,2147483674:134219776,2147483675:0,2147483676:133120,2147483677:2080,2147483678:131104,2147483679:134350848}],f=[4160749569,528482304,33030144,2064384,129024,8064,504,2147483679],p=i.DES=s.extend({_doReset:function(){for(var e=this._key,t=e.words,n=[],r=0;r<56;r++){var a=c[r]-1;n[r]=t[a>>>5]>>>31-a%32&1}for(var o=this._subKeys=[],s=0;s<16;s++){for(var i=o[s]=[],l=d[s],r=0;r<24;r++)i[r/6|0]|=n[(u[r]-1+l)%28]<<31-r%6,i[4+(r/6|0)]|=n[28+(u[r+24]-1+l)%28]<<31-r%6;i[0]=i[0]<<1|i[0]>>>31;for(var r=1;r<7;r++)i[r]=i[r]>>>4*(r-1)+3;i[7]=i[7]<<5|i[7]>>>27}for(var f=this._invSubKeys=[],r=0;r<16;r++)f[r]=o[15-r]},encryptBlock:function(e,t){this._doCryptBlock(e,t,this._subKeys)},decryptBlock:function(e,t){this._doCryptBlock(e,t,this._invSubKeys)},_doCryptBlock:function(e,r,a){this._lBlock=e[r],this._rBlock=e[r+1],t.call(this,4,252645135),t.call(this,16,65535),n.call(this,2,858993459),n.call(this,8,16711935),t.call(this,1,1431655765);for(var o=0;o<16;o++){for(var s=a[o],i=this._lBlock,c=this._rBlock,u=0,d=0;d<8;d++)u|=l[d][((c^s[d])&f[d])>>>0];this._lBlock=c,this._rBlock=i^u}var p=this._lBlock;this._lBlock=this._rBlock,this._rBlock=p,t.call(this,1,1431655765),n.call(this,8,16711935),n.call(this,2,858993459),t.call(this,16,65535),t.call(this,4,252645135),e[r]=this._lBlock,e[r+1]=this._rBlock},keySize:2,ivSize:2,blockSize:2});r.DES=s._createHelper(p);var h=i.TripleDES=s.extend({_doReset:function(){var e=this._key,t=e.words;this._des1=p.createEncryptor(o.create(t.slice(0,2))),this._des2=p.createEncryptor(o.create(t.slice(2,4))),this._des3=p.createEncryptor(o.create(t.slice(4,6)))},encryptBlock:function(e,t){this._des1.encryptBlock(e,t),this._des2.decryptBlock(e,t),this._des3.encryptBlock(e,t)},decryptBlock:function(e,t){this._des3.decryptBlock(e,t),this._des2.encryptBlock(e,t),this._des1.decryptBlock(e,t)},keySize:6,ivSize:2,blockSize:2});r.TripleDES=s._createHelper(h)}(),e.TripleDES})},,,,function(e,t,n){e.exports=n.p+"dev.web3.html"},,,function(e,t){e.exports=[{constant:!0,inputs:[{name:"_owner",type:"address"}],name:"name",outputs:[{name:"o_name",type:"bytes32"}],type:"function"},{constant:!0,inputs:[{name:"_name",type:"bytes32"}],name:"owner",outputs:[{name:"",type:"address"}],type:"function"},{constant:!0,inputs:[{name:"_name",type:"bytes32"}],name:"content",outputs:[{name:"",type:"bytes32"}],type:"function"},{constant:!0,inputs:[{name:"_name",type:"bytes32"}],name:"addr",outputs:[{name:"",type:"address"}],type:"function"},{constant:!1,inputs:[{name:"_name",type:"bytes32"}],name:"reserve",outputs:[],type:"function"},{constant:!0,inputs:[{name:"_name",type:"bytes32"}],name:"subRegistrar",outputs:[{name:"",type:"address"}],type:"function"},{constant:!1,inputs:[{name:"_name",type:"bytes32"},{name:"_newOwner",type:"address"}],name:"transfer",outputs:[],type:"function"},{constant:!1,inputs:[{name:"_name",type:"bytes32"},{name:"_registrar",type:"address"}],name:"setSubRegistrar",outputs:[],type:"function"},{constant:!1,inputs:[],name:"Registrar",outputs:[],type:"function"},{constant:!1,inputs:[{name:"_name",type:"bytes32"},{name:"_a",type:"address"},{name:"_primary",type:"bool"}],name:"setAddress",outputs:[],type:"function"},{constant:!1,inputs:[{name:"_name",type:"bytes32"},{name:"_content",type:"bytes32"}],name:"setContent",outputs:[],type:"function"},{constant:!1,inputs:[{name:"_name",type:"bytes32"}],name:"disown",outputs:[],type:"function"},{anonymous:!1,inputs:[{indexed:!0,name:"_name",type:"bytes32"},{indexed:!1,name:"_winner",type:"address"}],name:"AuctionEnded",type:"event"},{anonymous:!1,inputs:[{indexed:!0,name:"_name",type:"bytes32"},{indexed:!1,name:"_bidder",type:"address"},{indexed:!1,name:"_value",type:"uint256"}],name:"NewBid",type:"event"},{anonymous:!1,inputs:[{indexed:!0,name:"name",type:"bytes32"}],name:"Changed",type:"event"},{anonymous:!1,inputs:[{indexed:!0,name:"name",type:"bytes32"},{indexed:!0,name:"addr",type:"address"}],name:"PrimaryChanged",type:"event"}]},function(e,t){e.exports=[{constant:!0,inputs:[{name:"_name",type:"bytes32"}],name:"owner",outputs:[{name:"",type:"address"}],type:"function"},{constant:!1,inputs:[{name:"_name",type:"bytes32"},{name:"_refund",type:"address"}],name:"disown",outputs:[],type:"function"},{constant:!0,inputs:[{name:"_name",type:"bytes32"}],name:"addr",outputs:[{name:"",type:"address"}],type:"function"},{constant:!1,inputs:[{name:"_name",type:"bytes32"}],name:"reserve",outputs:[],type:"function"},{constant:!1,inputs:[{name:"_name",type:"bytes32"},{name:"_newOwner",type:"address"}],name:"transfer",outputs:[],type:"function"},{constant:!1,inputs:[{name:"_name",type:"bytes32"},{name:"_a",type:"address"}],name:"setAddr",outputs:[],type:"function"},{anonymous:!1,inputs:[{indexed:!0,name:"name",type:"bytes32"}],name:"Changed",type:"event"}]},function(e,t){e.exports=[{constant:!1,inputs:[{name:"from",type:"bytes32"},{name:"to",type:"address"},{name:"value",type:"uint256"}],name:"transfer",outputs:[],type:"function"},{constant:!1,inputs:[{name:"from",type:"bytes32"},{name:"to",type:"address"},{name:"indirectId",type:"bytes32"},{name:"value",type:"uint256"}],name:"icapTransfer",outputs:[],type:"function"},{constant:!1,inputs:[{name:"to",type:"bytes32"}],name:"deposit",outputs:[],type:"function"},{anonymous:!1,inputs:[{indexed:!0,name:"from",type:"address"},{indexed:!1,name:"value",type:"uint256"}],name:"AnonymousDeposit",type:"event"},{anonymous:!1,inputs:[{indexed:!0,name:"from",type:"address"},{indexed:!0,name:"to",type:"bytes32"},{indexed:!1,name:"value",type:"uint256"}],name:"Deposit",type:"event"},{anonymous:!1,inputs:[{indexed:!0,name:"from",type:"bytes32"},{indexed:!0,name:"to",type:"address"},{indexed:!1,name:"value",type:"uint256"}],name:"Transfer",type:"event"},{anonymous:!1,inputs:[{indexed:!0,name:"from",type:"bytes32"},{indexed:!0,name:"to",type:"address"},{indexed:!1,name:"indirectId",type:"bytes32"},{indexed:!1,name:"value",type:"uint256"}],name:"IcapTransfer",type:"event"}]},function(e,t){e.exports={version:"0.17.0-alpha"}},,,,,,,,,,,,,,,,,,function(e,t,n){var r=n(306);"undefined"!=typeof window&&void 0===window.Web3&&(window.Web3=r),e.exports=r},function(e,t,n){var r=n(8),a=n(14),o=function(){this._inputFormatter=r.formatInputInt,this._outputFormatter=r.formatOutputAddress};o.prototype=new a({}),o.prototype.constructor=o,o.prototype.isType=function(e){return!!e.match(/address(\[([0-9]*)\])?/)},o.prototype.staticPartLength=function(e){return 32*this.staticArrayLength(e)},e.exports=o},function(e,t,n){var r=n(8),a=n(14),o=function(){this._inputFormatter=r.formatInputBool,this._outputFormatter=r.formatOutputBool};o.prototype=new a({}),o.prototype.constructor=o,o.prototype.isType=function(e){return!!e.match(/^bool(\[([0-9]*)\])*$/)},o.prototype.staticPartLength=function(e){return 32*this.staticArrayLength(e)},e.exports=o},function(e,t,n){var r=n(8),a=n(14),o=function(){this._inputFormatter=r.formatInputBytes,this._outputFormatter=r.formatOutputBytes};o.prototype=new a({}),o.prototype.constructor=o,o.prototype.isType=function(e){return!!e.match(/^bytes([0-9]{1,})(\[([0-9]*)\])*$/)},o.prototype.staticPartLength=function(e){var t=e.match(/^bytes([0-9]*)/);return parseInt(t[1])*this.staticArrayLength(e)},e.exports=o},function(e,t,n){var r=n(8),a=n(14),o=function(){this._inputFormatter=r.formatInputDynamicBytes,this._outputFormatter=r.formatOutputDynamicBytes};o.prototype=new a({}),o.prototype.constructor=o,o.prototype.isType=function(e){return!!e.match(/^bytes(\[([0-9]*)\])*$/)},o.prototype.staticPartLength=function(e){return 32*this.staticArrayLength(e)},o.prototype.isDynamicType=function(){return!0},e.exports=o},function(e,t,n){var r=n(8),a=n(14),o=function(){this._inputFormatter=r.formatInputInt,this._outputFormatter=r.formatOutputInt};o.prototype=new a({}),o.prototype.constructor=o,o.prototype.isType=function(e){return!!e.match(/^int([0-9]*)?(\[([0-9]*)\])*$/)},o.prototype.staticPartLength=function(e){return 32*this.staticArrayLength(e)},e.exports=o},function(e,t,n){var r=n(8),a=n(14),o=function(){this._inputFormatter=r.formatInputReal,this._outputFormatter=r.formatOutputReal};o.prototype=new a({}),o.prototype.constructor=o,o.prototype.isType=function(e){return!!e.match(/real([0-9]*)?(\[([0-9]*)\])?/)},o.prototype.staticPartLength=function(e){return 32*this.staticArrayLength(e)},e.exports=o},function(e,t,n){var r=n(8),a=n(14),o=function(){this._inputFormatter=r.formatInputString,this._outputFormatter=r.formatOutputString};o.prototype=new a({}),o.prototype.constructor=o,o.prototype.isType=function(e){return!!e.match(/^string(\[([0-9]*)\])*$/)},o.prototype.staticPartLength=function(e){return 32*this.staticArrayLength(e)},o.prototype.isDynamicType=function(){return!0},e.exports=o},function(e,t,n){var r=n(8),a=n(14),o=function(){this._inputFormatter=r.formatInputInt,this._outputFormatter=r.formatOutputUInt};o.prototype=new a({}),o.prototype.constructor=o,o.prototype.isType=function(e){return!!e.match(/^uint([0-9]*)?(\[([0-9]*)\])*$/)},o.prototype.staticPartLength=function(e){return 32*this.staticArrayLength(e)},e.exports=o},function(e,t,n){var r=n(8),a=n(14),o=function(){this._inputFormatter=r.formatInputReal,this._outputFormatter=r.formatOutputUReal};o.prototype=new a({}),o.prototype.constructor=o,o.prototype.isType=function(e){return!!e.match(/^ureal([0-9]*)?(\[([0-9]*)\])*$/)},o.prototype.staticPartLength=function(e){return 32*this.staticArrayLength(e)},e.exports=o},function(e,t,n){"use strict";"undefined"==typeof XMLHttpRequest?t.XMLHttpRequest={}:t.XMLHttpRequest=XMLHttpRequest},function(e,t,n){function r(e){this._requestManager=new a(e),this.currentProvider=e,this.eth=new s(this),this.db=new i(this),this.shh=new c(this),this.net=new u(this),this.personal=new d(this),this.settings=new l,this.version={api:f.version},this.providers={HttpProvider:g,IpcProvider:v},this._extend=m(this),this._extend({properties:w()})}var a=n(320),o=n(68),s=n(315),i=n(314),c=n(318),u=n(316),d=n(317),l=n(321),f=n(277),p=n(5),h=n(43),m=n(310),b=n(308),y=n(45),g=n(312),v=n(313),x=n(46);r.providers={HttpProvider:g,IpcProvider:v},r.prototype.setProvider=function(e){this._requestManager.setProvider(e),this.currentProvider=e},r.prototype.reset=function(e){this._requestManager.reset(e),this.settings=new l},r.prototype.BigNumber=x,r.prototype.toHex=p.toHex,r.prototype.toAscii=p.toAscii,r.prototype.toUtf8=p.toUtf8,r.prototype.fromAscii=p.fromAscii,r.prototype.fromUtf8=p.fromUtf8,r.prototype.toDecimal=p.toDecimal,r.prototype.fromDecimal=p.fromDecimal,r.prototype.toBigNumber=p.toBigNumber,r.prototype.toWei=p.toWei,r.prototype.fromWei=p.fromWei,r.prototype.isAddress=p.isAddress,r.prototype.isChecksumAddress=p.isChecksumAddress,r.prototype.toChecksumAddress=p.toChecksumAddress,r.prototype.isIBAN=p.isIBAN,r.prototype.sha3=function(e,t){return"0x"+h(e,t)},r.prototype.fromICAP=function(e){return new o(e).address()};var w=function(){return[new y({name:"version.node",getter:"web3_clientVersion"}),new y({name:"version.network",getter:"net_version",inputFormatter:p.toDecimal}),new y({name:"version.ethereum",getter:"eth_protocolVersion",inputFormatter:p.toDecimal}),new y({name:"version.whisper",getter:"shh_version",inputFormatter:p.toDecimal})]};r.prototype.isConnected=function(){return this.currentProvider&&this.currentProvider.isConnected()},r.prototype.createBatch=function(){return new b(this)},e.exports=r},function(e,t,n){var r=n(43),a=n(134),o=n(15),s=n(5),i=n(67),c=n(69),u=function(e,t,n){this._requestManager=e,this._json=t,this._address=n};u.prototype.encode=function(e){e=e||{};var t={};return["fromBlock","toBlock"].filter(function(t){return void 0!==e[t]}).forEach(function(n){t[n]=o.inputBlockNumberFormatter(e[n])}),t.address=this._address,t},u.prototype.decode=function(e){e.data=e.data||"",e.topics=e.topics||[];var t=e.topics[0].slice(2),n=this._json.filter(function(e){return t===r(s.transformToFullName(e))})[0];return n?new a(this._requestManager,n,this._address).decode(e):(console.warn("cannot find event for log"),e)},u.prototype.execute=function(e,t){s.isFunction(arguments[arguments.length-1])&&(t=arguments[arguments.length-1],1===arguments.length&&(e=null));var n=this.encode(e),r=this.decode.bind(this);return new i(this._requestManager,n,c.eth(),r,t)},u.prototype.attachToContract=function(e){var t=this.execute.bind(this);e.allEvents=t},e.exports=u},function(e,t,n){var r=n(135),a=n(44),o=function(e){this.requestManager=e._requestManager,this.requests=[]};o.prototype.add=function(e){this.requests.push(e)},o.prototype.execute=function(){var e=this.requests;this.requestManager.sendBatch(e,function(t,n){n=n||[],e.map(function(e,t){return n[t]||{}}).forEach(function(t,n){if(e[n].callback){if(!r.isValidResponse(t))return e[n].callback(a.InvalidResponse(t));e[n].callback(null,e[n].format?e[n].format(t.result):t.result)}})})},e.exports=o},function(e,t,n){var r=n(5),a=n(93),o=n(134),s=n(311),i=n(307),c=function(e,t){return e.filter(function(e){return"constructor"===e.type&&e.inputs.length===t.length}).map(function(e){return e.inputs.map(function(e){return e.type})}).map(function(e){return a.encodeParams(e,t)})[0]||""},u=function(e){e.abi.filter(function(e){return"function"===e.type}).map(function(t){return new s(e._eth,t,e.address)}).forEach(function(t){t.attachToContract(e)})},d=function(e){var t=e.abi.filter(function(e){return"event"===e.type});new i(e._eth._requestManager,t,e.address).attachToContract(e),t.map(function(t){return new o(e._eth._requestManager,t,e.address)}).forEach(function(t){t.attachToContract(e)})},l=function(e,t){var n=0,r=!1,a=e._eth.filter("latest",function(o){if(!o&&!r)if(++n>50){if(a.stopWatching(),r=!0,!t)throw new Error("Contract transaction couldn't be found after 50 blocks");t(new Error("Contract transaction couldn't be found after 50 blocks"))}else e._eth.getTransactionReceipt(e.transactionHash,function(n,o){o&&!r&&e._eth.getCode(o.contractAddress,function(n,s){if(!r&&s)if(a.stopWatching(),r=!0,s.length>3)e.address=o.contractAddress,u(e),d(e),t&&t(null,e);else{if(!t)throw new Error("The contract code couldn't be stored, please check your gas amount.");t(new Error("The contract code couldn't be stored, please check your gas amount."))}})})})},f=function(e,t){this.eth=e,this.abi=t,this.new=function(){var e,t=new p(this.eth,this.abi),n={},a=Array.prototype.slice.call(arguments);r.isFunction(a[a.length-1])&&(e=a.pop());var o=a[a.length-1];r.isObject(o)&&!r.isArray(o)&&(n=a.pop());var s=c(this.abi,a);if(n.data+=s,e)this.eth.sendTransaction(n,function(n,r){n?e(n):(t.transactionHash=r,e(null,t),l(t,e))});else{var i=this.eth.sendTransaction(n);t.transactionHash=i,l(t)}return t},this.new.getData=this.getData.bind(this)};f.prototype.at=function(e,t){var n=new p(this.eth,this.abi,e);return u(n),d(n),t&&t(null,n),n},f.prototype.getData=function(){var e={},t=Array.prototype.slice.call(arguments),n=t[t.length-1];r.isObject(n)&&!r.isArray(n)&&(e=t.pop());var a=c(this.abi,t);return e.data+=a,e.data};var p=function(e,t,n){this._eth=e,this.transactionHash=null,this.address=n,this.abi=t};e.exports=f},function(e,t,n){var r=n(15),a=n(5),o=n(37),s=n(45),i=function(e){var t=function(t){var n;t.property?(e[t.property]||(e[t.property]={}),n=e[t.property]):n=e,t.methods&&t.methods.forEach(function(t){t.attachToObject(n),t.setRequestManager(e._requestManager)}),t.properties&&t.properties.forEach(function(t){t.attachToObject(n),t.setRequestManager(e._requestManager)})};return t.formatters=r,t.utils=a,t.Method=o,t.Property=s,t};e.exports=i},function(e,t,n){var r=n(93),a=n(5),o=n(15),s=n(43),i=function(e,t,n){this._eth=e,this._inputTypes=t.inputs.map(function(e){return e.type}),this._outputTypes=t.outputs.map(function(e){return e.type}),this._constant=t.constant,this._name=a.transformToFullName(t),this._address=n};i.prototype.extractCallback=function(e){if(a.isFunction(e[e.length-1]))return e.pop()},i.prototype.extractDefaultBlock=function(e){if(e.length>this._inputTypes.length&&!a.isObject(e[e.length-1]))return o.inputDefaultBlockNumberFormatter(e.pop())},i.prototype.toPayload=function(e){var t={};return e.length>this._inputTypes.length&&a.isObject(e[e.length-1])&&(t=e[e.length-1]),t.to=this._address,t.data="0x"+this.signature()+r.encodeParams(this._inputTypes,e),t},i.prototype.signature=function(){return s(this._name).slice(0,8)},i.prototype.unpackOutput=function(e){if(e){e=e.length>=2?e.slice(2):e;var t=r.decodeParams(this._outputTypes,e);return 1===t.length?t[0]:t}},i.prototype.call=function(){var e=Array.prototype.slice.call(arguments).filter(function(e){return void 0!==e}),t=this.extractCallback(e),n=this.extractDefaultBlock(e),r=this.toPayload(e);if(!t){var a=this._eth.call(r,n);return this.unpackOutput(a)}var o=this;this._eth.call(r,n,function(e,n){t(e,o.unpackOutput(n))})},i.prototype.sendTransaction=function(){var e=Array.prototype.slice.call(arguments).filter(function(e){return void 0!==e}),t=this.extractCallback(e),n=this.toPayload(e);if(!t)return this._eth.sendTransaction(n);this._eth.sendTransaction(n,t)},i.prototype.estimateGas=function(){var e=Array.prototype.slice.call(arguments),t=this.extractCallback(e),n=this.toPayload(e);if(!t)return this._eth.estimateGas(n);this._eth.estimateGas(n,t)},i.prototype.getData=function(){var e=Array.prototype.slice.call(arguments);return this.toPayload(e).data},i.prototype.displayName=function(){return a.extractDisplayName(this._name)},i.prototype.typeName=function(){return a.extractTypeName(this._name)},i.prototype.request=function(){var e=Array.prototype.slice.call(arguments),t=this.extractCallback(e),n=this.toPayload(e),r=this.unpackOutput.bind(this);return{method:this._constant?"eth_call":"eth_sendTransaction",callback:t,params:[n],format:r}},i.prototype.execute=function(){return this._constant?this.call.apply(this,Array.prototype.slice.call(arguments)):this.sendTransaction.apply(this,Array.prototype.slice.call(arguments))},i.prototype.attachToContract=function(e){var t=this.execute.bind(this);t.request=this.request.bind(this),t.call=this.call.bind(this),t.sendTransaction=this.sendTransaction.bind(this),t.estimateGas=this.estimateGas.bind(this),t.getData=this.getData.bind(this);var n=this.displayName();e[n]||(e[n]=t),e[n][this.typeName()]=t},e.exports=i},function(e,t,n){"use strict";var r,a=n(44);r="undefined"!=typeof window&&window.XMLHttpRequest?window.XMLHttpRequest:n(305).XMLHttpRequest;var o=function(e){this.host=e||"http://localhost:8545"};o.prototype.prepareRequest=function(e){var t=new r;return t.open("POST",this.host,e),t.setRequestHeader("Content-Type","application/json"),t},o.prototype.send=function(e){var t=this.prepareRequest(!1);try{t.send(JSON.stringify(e))}catch(e){throw a.InvalidConnection(this.host)}var n=t.responseText;try{n=JSON.parse(n)}catch(e){throw a.InvalidResponse(t.responseText)}return n},o.prototype.sendAsync=function(e,t){var n=this.prepareRequest(!0);n.onreadystatechange=function(){if(4===n.readyState){var e=n.responseText,r=null;try{e=JSON.parse(e)}catch(e){r=a.InvalidResponse(n.responseText)}t(r,e)}};try{n.send(JSON.stringify(e))}catch(e){t(a.InvalidConnection(this.host))}},o.prototype.isConnected=function(){try{return this.send({id:9999999999,jsonrpc:"2.0",method:"net_listening",params:[]}),!0}catch(e){return!1}},e.exports=o},function(e,t,n){"use strict";var r=n(5),a=n(44),o=function(e,t){var n=this;this.responseCallbacks={},this.path=e,this.connection=t.connect({path:this.path}),this.connection.on("error",function(e){console.error("IPC Connection Error",e),n._timeout()}),this.connection.on("end",function(){n._timeout()}),this.connection.on("data",function(e){n._parseResponse(e.toString()).forEach(function(e){var t=null;r.isArray(e)?e.forEach(function(e){n.responseCallbacks[e.id]&&(t=e.id)}):t=e.id,n.responseCallbacks[t]&&(n.responseCallbacks[t](null,e),delete n.responseCallbacks[t])})})};o.prototype._parseResponse=function(e){var t=this,n=[];return e.replace(/\}[\n\r]?\{/g,"}|--|{").replace(/\}\][\n\r]?\[\{/g,"}]|--|[{").replace(/\}[\n\r]?\[\{/g,"}|--|[{").replace(/\}\][\n\r]?\{/g,"}]|--|{").split("|--|").forEach(function(e){t.lastChunk&&(e=t.lastChunk+e);var r=null;try{r=JSON.parse(e)}catch(n){return t.lastChunk=e,clearTimeout(t.lastChunkTimeout),void(t.lastChunkTimeout=setTimeout(function(){throw t._timeout(),a.InvalidResponse(e)},15e3))}clearTimeout(t.lastChunkTimeout),t.lastChunk=null,r&&n.push(r)}),n},o.prototype._addResponseCallback=function(e,t){var n=e.id||e[0].id,r=e.method||e[0].method;this.responseCallbacks[n]=t,this.responseCallbacks[n].method=r},o.prototype._timeout=function(){for(var e in this.responseCallbacks)this.responseCallbacks.hasOwnProperty(e)&&(this.responseCallbacks[e](a.InvalidConnection("on IPC")),delete this.responseCallbacks[e])},o.prototype.isConnected=function(){var e=this;return e.connection.writable||e.connection.connect({path:e.path}),!!this.connection.writable},o.prototype.send=function(e){if(this.connection.writeSync){var t;this.connection.writable||this.connection.connect({path:this.path});var n=this.connection.writeSync(JSON.stringify(e));try{t=JSON.parse(n)}catch(e){throw a.InvalidResponse(n)}return t}throw new Error('You tried to send "'+e.method+'" synchronously. Synchronous requests are not supported by the IPC provider.')},o.prototype.sendAsync=function(e,t){this.connection.writable||this.connection.connect({path:this.path}),this.connection.write(JSON.stringify(e)),this._addResponseCallback(e,t)},e.exports=o},function(e,t,n){var r=n(37),a=function(e){this._requestManager=e._requestManager;var t=this;o().forEach(function(n){n.attachToObject(t),n.setRequestManager(e._requestManager)})},o=function(){return[new r({name:"putString",call:"db_putString",params:3}),new r({name:"getString",call:"db_getString",params:2}),new r({name:"putHex",call:"db_putHex",params:3}),new r({name:"getHex",call:"db_getHex",params:2})]};e.exports=a},function(e,t,n){"use strict";function r(e){this._requestManager=e._requestManager;var t=this;w().forEach(function(e){e.attachToObject(t),e.setRequestManager(t._requestManager)}),_().forEach(function(e){e.attachToObject(t),e.setRequestManager(t._requestManager)}),this.iban=h,this.sendIBANTransaction=m.bind(null,this)}var a=n(15),o=n(5),s=n(37),i=n(45),c=n(66),u=n(309),d=n(69),l=n(67),f=n(322),p=n(319),h=n(68),m=n(323),b=function(e){return o.isString(e[0])&&0===e[0].indexOf("0x")?"eth_getBlockByHash":"eth_getBlockByNumber"},y=function(e){return o.isString(e[0])&&0===e[0].indexOf("0x")?"eth_getTransactionByBlockHashAndIndex":"eth_getTransactionByBlockNumberAndIndex"},g=function(e){return o.isString(e[0])&&0===e[0].indexOf("0x")?"eth_getUncleByBlockHashAndIndex":"eth_getUncleByBlockNumberAndIndex"},v=function(e){return o.isString(e[0])&&0===e[0].indexOf("0x")?"eth_getBlockTransactionCountByHash":"eth_getBlockTransactionCountByNumber"},x=function(e){return o.isString(e[0])&&0===e[0].indexOf("0x")?"eth_getUncleCountByBlockHash":"eth_getUncleCountByBlockNumber"};Object.defineProperty(r.prototype,"defaultBlock",{get:function(){return c.defaultBlock},set:function(e){return c.defaultBlock=e,e}}),Object.defineProperty(r.prototype,"defaultAccount",{get:function(){return c.defaultAccount},set:function(e){return c.defaultAccount=e,e}});var w=function(){var e=new s({name:"getBalance",call:"eth_getBalance",params:2,inputFormatter:[a.inputAddressFormatter,a.inputDefaultBlockNumberFormatter],outputFormatter:a.outputBigNumberFormatter}),t=new s({name:"getStorageAt",call:"eth_getStorageAt",params:3,inputFormatter:[null,o.toHex,a.inputDefaultBlockNumberFormatter]}),n=new s({name:"getCode",call:"eth_getCode",params:2,inputFormatter:[a.inputAddressFormatter,a.inputDefaultBlockNumberFormatter]}),r=new s({name:"getBlock",call:b,params:2,inputFormatter:[a.inputBlockNumberFormatter,function(e){return!!e}],outputFormatter:a.outputBlockFormatter}),i=new s({name:"getUncle",call:g,params:2,inputFormatter:[a.inputBlockNumberFormatter,o.toHex],outputFormatter:a.outputBlockFormatter}),c=new s({name:"getCompilers",call:"eth_getCompilers",params:0}),u=new s({name:"getBlockTransactionCount",call:v,params:1,inputFormatter:[a.inputBlockNumberFormatter],outputFormatter:o.toDecimal}),d=new s({name:"getBlockUncleCount",call:x,params:1,inputFormatter:[a.inputBlockNumberFormatter],outputFormatter:o.toDecimal}),l=new s({name:"getTransaction",call:"eth_getTransactionByHash",params:1,outputFormatter:a.outputTransactionFormatter}),f=new s({name:"getTransactionFromBlock",call:y,params:2,inputFormatter:[a.inputBlockNumberFormatter,o.toHex],outputFormatter:a.outputTransactionFormatter}),p=new s({name:"getTransactionReceipt",call:"eth_getTransactionReceipt",params:1,outputFormatter:a.outputTransactionReceiptFormatter}),h=new s({name:"getTransactionCount",call:"eth_getTransactionCount",params:2,inputFormatter:[null,a.inputDefaultBlockNumberFormatter],outputFormatter:o.toDecimal}),m=new s({name:"sendRawTransaction",call:"eth_sendRawTransaction",params:1,inputFormatter:[null]}),w=new s({name:"sendTransaction",call:"eth_sendTransaction",params:1,inputFormatter:[a.inputTransactionFormatter]}),_=new s({name:"sign",call:"eth_sign",params:2,inputFormatter:[a.inputAddressFormatter,null]});return[e,t,n,r,i,c,u,d,l,f,p,h,new s({name:"call",call:"eth_call",params:2,inputFormatter:[a.inputCallFormatter,a.inputDefaultBlockNumberFormatter]}),new s({name:"estimateGas",call:"eth_estimateGas",params:1,inputFormatter:[a.inputCallFormatter],outputFormatter:o.toDecimal}),m,w,_,new s({name:"compile.solidity",call:"eth_compileSolidity",params:1}),new s({name:"compile.lll",call:"eth_compileLLL",params:1}),new s({name:"compile.serpent",call:"eth_compileSerpent",params:1}),new s({name:"submitWork",call:"eth_submitWork",params:3}),new s({name:"getWork",call:"eth_getWork",params:0})]},_=function(){return[new i({name:"coinbase",getter:"eth_coinbase"}),new i({name:"mining",getter:"eth_mining"}),new i({name:"hashrate",getter:"eth_hashrate",outputFormatter:o.toDecimal}),new i({name:"syncing",getter:"eth_syncing",outputFormatter:a.outputSyncingFormatter}),new i({name:"gasPrice",getter:"eth_gasPrice",outputFormatter:a.outputBigNumberFormatter}),new i({name:"accounts",getter:"eth_accounts"}),new i({name:"blockNumber",getter:"eth_blockNumber",outputFormatter:o.toDecimal}),new i({name:"protocolVersion",getter:"eth_protocolVersion"})]};r.prototype.contract=function(e){return new u(this,e)},r.prototype.filter=function(e,t){return new l(this._requestManager,e,d.eth(),a.outputLogFormatter,t)},r.prototype.namereg=function(){return this.contract(p.global.abi).at(p.global.address)},r.prototype.icapNamereg=function(){return this.contract(p.icap.abi).at(p.icap.address)},r.prototype.isSyncing=function(e){return new f(this._requestManager,e)},e.exports=r},function(e,t,n){var r=n(5),a=n(45),o=function(e){this._requestManager=e._requestManager;var t=this;s().forEach(function(n){n.attachToObject(t),n.setRequestManager(e._requestManager)})},s=function(){return[new a({name:"listening",getter:"net_listening"}),new a({name:"peerCount",getter:"net_peerCount",outputFormatter:r.toDecimal})]};e.exports=o},function(e,t,n){"use strict";function r(e){this._requestManager=e._requestManager;var t=this;i().forEach(function(e){e.attachToObject(t),e.setRequestManager(t._requestManager)}),c().forEach(function(e){e.attachToObject(t),e.setRequestManager(t._requestManager)})}var a=n(37),o=n(45),s=n(15),i=function(){return[new a({name:"newAccount",call:"personal_newAccount",params:1,inputFormatter:[null]}),new a({name:"unlockAccount",call:"personal_unlockAccount",params:3,inputFormatter:[s.inputAddressFormatter,null,null]}),new a({name:"unlockAccountAndSendTransaction",call:"personal_signAndSendTransaction",params:2,inputFormatter:[s.inputTransactionFormatter,null]}),new a({name:"lockAccount",call:"personal_lockAccount",params:1,inputFormatter:[s.inputAddressFormatter]})]},c=function(){return[new o({name:"listAccounts",getter:"personal_listAccounts"})]};e.exports=r},function(e,t,n){var r=n(37),a=n(15),o=n(67),s=n(69),i=function(e){this._requestManager=e._requestManager;var t=this;c().forEach(function(e){e.attachToObject(t),e.setRequestManager(t._requestManager)})};i.prototype.filter=function(e,t){return new o(this._requestManager,e,s.shh(),a.outputPostFormatter,t)};var c=function(){return[new r({name:"post",call:"shh_post",params:1,inputFormatter:[a.inputPostFormatter]}),new r({name:"newIdentity",call:"shh_newIdentity",params:0}),new r({name:"hasIdentity",call:"shh_hasIdentity",params:1}),new r({name:"newGroup",call:"shh_newGroup",params:0}),new r({name:"addToGroup",call:"shh_addToGroup",params:0})]};e.exports=i},function(e,t,n){var r=n(274),a=n(275);e.exports={global:{abi:r,address:"0xc6d9d2cd449a754c494264e1809c50e34d64562b"},icap:{abi:a,address:"0xa1a111bc074c9cfa781f0c38e63bd51c91b8af00"}}},function(e,t,n){var r=n(135),a=n(5),o=n(66),s=n(44),i=function(e){this.provider=e,this.polls={},this.timeout=null};i.prototype.send=function(e){if(!this.provider)return console.error(s.InvalidProvider()),null;var t=r.toPayload(e.method,e.params),n=this.provider.send(t);if(!r.isValidResponse(n))throw s.InvalidResponse(n);return n.result},i.prototype.sendAsync=function(e,t){if(!this.provider)return t(s.InvalidProvider());var n=r.toPayload(e.method,e.params);this.provider.sendAsync(n,function(e,n){return e?t(e):r.isValidResponse(n)?void t(null,n.result):t(s.InvalidResponse(n))})},i.prototype.sendBatch=function(e,t){if(!this.provider)return t(s.InvalidProvider());var n=r.toBatchPayload(e);this.provider.sendAsync(n,function(e,n){return e?t(e):a.isArray(n)?void t(e,n):t(s.InvalidResponse(n))})},i.prototype.setProvider=function(e){this.provider=e},i.prototype.startPolling=function(e,t,n,r){this.polls[t]={data:e,id:t,callback:n,uninstall:r},this.timeout||this.poll()},i.prototype.stopPolling=function(e){delete this.polls[e],0===Object.keys(this.polls).length&&this.timeout&&(clearTimeout(this.timeout),this.timeout=null)},i.prototype.reset=function(e){for(var t in this.polls)e&&t.indexOf("syncPoll_")!==-1||(this.polls[t].uninstall(),delete this.polls[t]);0===Object.keys(this.polls).length&&this.timeout&&(clearTimeout(this.timeout),this.timeout=null)},i.prototype.poll=function(){if(this.timeout=setTimeout(this.poll.bind(this),o.ETH_POLLING_TIMEOUT),0!==Object.keys(this.polls).length){if(!this.provider)return void console.error(s.InvalidProvider());var e=[],t=[];for(var n in this.polls)e.push(this.polls[n].data),t.push(n);if(0!==e.length){var i=r.toBatchPayload(e),c={};i.forEach(function(e,n){c[e.id]=t[n]});var u=this;this.provider.sendAsync(i,function(e,t){if(!e){if(!a.isArray(t))throw s.InvalidResponse(t);t.map(function(e){var t=c[e.id];return!!u.polls[t]&&(e.callback=u.polls[t].callback,e)}).filter(function(e){return!!e}).filter(function(e){var t=r.isValidResponse(e);return t||e.callback(s.InvalidResponse(e)),t}).forEach(function(e){e.callback(null,e.result)})}})}}},e.exports=i},function(e,t){var n=function(){this.defaultBlock="latest",this.defaultAccount=void 0};e.exports=n},function(e,t,n){var r=n(15),a=n(5),o=1,s=function(e){var t=function(t,n){if(t)return e.callbacks.forEach(function(e){e(t)});a.isObject(n)&&n.startingBlock&&(n=r.outputSyncingFormatter(n)),e.callbacks.forEach(function(t){e.lastSyncState!==n&&(!e.lastSyncState&&a.isObject(n)&&t(null,!0),setTimeout(function(){t(null,n)},0),e.lastSyncState=n)})};e.requestManager.startPolling({method:"eth_syncing",params:[]},e.pollId,t,e.stopWatching.bind(e))},i=function(e,t){return this.requestManager=e,this.pollId="syncPoll_"+o++,this.callbacks=[],this.addCallback(t),this.lastSyncState=!1,s(this),this};i.prototype.addCallback=function(e){return e&&this.callbacks.push(e),this},i.prototype.stopWatching=function(){this.requestManager.stopPolling(this.pollId),this.callbacks=[]},e.exports=i},function(e,t,n){var r=n(68),a=n(276),o=function(e,t,n,a,o){var c=new r(n);if(!c.isValid())throw new Error("invalid iban address");if(c.isDirect())return s(e,t,c.address(),a,o);if(!o){var u=e.icapNamereg().addr(c.institution());return i(e,t,u,a,c.client())}e.icapNamereg().addr(c.institution(),function(n,r){return i(e,t,r,a,c.client(),o)})},s=function(e,t,n,r,a){return e.sendTransaction({address:n,from:t,value:r},a)},i=function(e,t,n,r,o,s){var i=a;return e.contract(i).at(n).deposit(o,{from:t,value:r},s)};e.exports=o},,,,,,function(e,t,n){e.exports=n(138)}])});
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Octokat"] = factory();
	else
		root["Octokat"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 31);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Both of these internal methods are really small/simple and we are only
// working with arrays anyway
var filter = __webpack_require__(28);
var forEach = __webpack_require__(27);
var map = __webpack_require__(29

// require('underscore-plus')
);var plus = {
  camelize: function camelize(string) {
    if (string) {
      return string.replace(/[_-]+(\w)/g, function (m) {
        return m[1].toUpperCase();
      });
    } else {
      return '';
    }
  },
  uncamelize: function uncamelize(string) {
    if (!string) {
      return '';
    }
    return string.replace(/([A-Z])+/g, function (match) {
      var letter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      return '_' + letter.toLowerCase();
    });
  },
  dasherize: function dasherize(string) {
    if (!string) {
      return '';
    }

    string = string[0].toLowerCase() + string.slice(1);
    return string.replace(/([A-Z])|(_)/g, function (m, letter) {
      if (letter) {
        return '-' + letter.toLowerCase();
      } else {
        return '-';
      }
    });
  },


  // Just _.extend(target, source)
  extend: function extend(target, source) {
    if (source) {
      return Object.keys(source).map(function (key) {
        target[key] = source[key];
      });
    }
  },


  // Just _.forOwn(obj, iterator)
  forOwn: function forOwn(obj, iterator) {
    return Object.keys(obj).map(function (key) {
      return iterator(obj[key], key);
    });
  },


  filter: filter,
  forEach: forEach,
  map: map
};

module.exports = plus;
//# sourceMappingURL=plus.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (message) {
  if (console && console.warn) {
    console.warn("Octokat Deprecation: " + message);
  }
};
//# sourceMappingURL=deprecate.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Converts a dictionary to a query string.
// Internal helper method
var toQueryString = function toQueryString(options, omitQuestionMark) {
  // Returns '' if `options` is empty so this string can always be appended to a URL
  if (!options || options === {}) {
    return '';
  }

  var params = [];
  var object = options || {};
  for (var key in object) {
    var value = object[key];
    if (value) {
      params.push(key + '=' + encodeURIComponent(value));
    }
  }
  if (params.length) {
    if (omitQuestionMark) {
      return '&' + params.join('&');
    } else {
      return '?' + params.join('&');
    }
  } else {
    return '';
  }
};

module.exports = toQueryString;
//# sourceMappingURL=querystring.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var plus = __webpack_require__(0

// Daisy-Chainer
// ===============================
//
// Generates the functions so `octo.repos(...).issues.comments.fetch()` works.
// Constructs a URL for the verb methods (like `.fetch` and `.create`).

);module.exports = function () {
  function Chainer(_verbMethods) {
    _classCallCheck(this, Chainer);

    this._verbMethods = _verbMethods;
  }

  _createClass(Chainer, [{
    key: 'chain',
    value: function chain(path, name, contextTree, fn) {
      var _this = this;

      if (typeof fn === 'undefined' || fn === null) {
        fn = function fn() {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          if (!args.length) {
            throw new Error('BUG! must be called with at least one argument');
          }
          var separator = '/';
          // Special-case compare because its args turn into '...' instead of the usual '/'
          if (name === 'compare') {
            separator = '...';
          }
          return _this.chain(path + '/' + args.join(separator), name, contextTree);
        };
      }

      this._verbMethods.injectVerbMethods(path, fn);

      if (typeof fn === 'function' || (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) === 'object') {
        for (name in contextTree || {}) {
          (function (name) {
            // Delete the key if it already exists
            delete fn[plus.camelize(name)];

            return Object.defineProperty(fn, plus.camelize(name), {
              configurable: true,
              enumerable: true,
              get: function get() {
                return _this.chain(path + '/' + name, name, contextTree[name]);
              }
            });
          })(name);
        }
      }

      return fn;
    }
  }]);

  return Chainer;
}();
//# sourceMappingURL=chainer.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _module$exports;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Reuse these fields because there are 2 URL structures for accessing repositores:
// - `/repos/philschatz/octokat.js/...`
// - `/repositories/20044005/...`
var REPO_FIELDS = {
  'readme': false,
  'tarball': false,
  'zipball': false,
  'compare': false,
  'deployments': {
    'statuses': false
  },
  'hooks': {
    'tests': false
  },
  'assignees': false,
  'languages': false,
  'teams': false,
  'tags': false,
  'branches': false,
  'contributors': false,
  'subscribers': false,
  'subscription': false,
  'stargazers': false,
  'comments': false,
  'downloads': false,
  'forks': false,
  'milestones': {
    'labels': false
  },
  'labels': false,
  'releases': {
    'assets': false,
    'latest': false,
    'tags': false
  },
  'events': false,
  'notifications': false,
  'merges': false,
  'statuses': false,
  'pulls': {
    'merge': false,
    'comments': false,
    'commits': false,
    'files': false,
    'events': false,
    'labels': false,
    'requested_reviewers': false,
    'reviews': {
      'comments': false,
      'events': false,
      'dismissals': false
    }
  },
  'pages': {
    'builds': {
      'latest': false
    }
  },
  'commits': {
    'comments': false,
    'status': false,
    'statuses': false
  },
  'contents': false,
  'collaborators': {
    'permission': false
  },
  'projects': false,
  'issues': {
    'events': false,
    'comments': false,
    'labels': false
  },
  'git': {
    'refs': {
      'heads': false,
      'tags': false
    },
    'trees': false,
    'blobs': false,
    'commits': false
  },
  'stats': {
    'contributors': false,
    'commit_activity': false,
    'code_frequency': false,
    'participation': false,
    'punch_card': false
  },
  'traffic': {
    'popular': {
      'referrers': false,
      'paths': false
    },
    'views': false,
    'clones': false
  }
};

module.exports = (_module$exports = {
  'zen': false,
  'octocat': false,
  'organizations': false,
  'issues': false,
  'emojis': false,
  'markdown': false,
  'meta': false,
  'rate_limit': false,
  'feeds': false,
  'events': false,
  'repositories': false,
  'notifications': {
    'threads': {
      'subscription': false
    }
  },
  'gitignore': {
    'templates': false
  },
  'user': {
    'repos': false,
    'orgs': false,
    'followers': false,
    'following': false,
    'emails': false,
    'issues': false,
    'public_emails': false,
    'starred': false,
    'teams': false
  },
  'orgs': {
    'repos': false,
    'issues': false,
    'members': false,
    'events': false,
    'projects': false,
    'teams': false
  },
  'projects': {
    'columns': {
      'moves': false,
      'cards': {
        'moves': false
      }
    }
  },
  'teams': {
    'members': false,
    'memberships': false,
    'repos': false
  },
  'users': {
    'repos': false,
    'orgs': false,
    'gists': false,
    'followers': false,
    'following': false,
    'keys': false,
    'starred': false,
    'received_events': {
      'public': false
    },
    'events': {
      'public': false,
      'orgs': false
    },
    // Enterprise-only:
    'site_admin': false,
    'suspended': false
  },

  'search': {
    'repositories': false,
    'commits': false,
    'issues': false,
    'users': false,
    'code': false
  },
  'gists': {
    'public': false,
    'starred': false,
    'star': false,
    'comments': false,
    'forks': false
  },
  'repos': REPO_FIELDS
}, _defineProperty(_module$exports, 'repositories', REPO_FIELDS), _defineProperty(_module$exports, 'licenses', false), _defineProperty(_module$exports, 'authorizations', {
  'clients': false
}), _defineProperty(_module$exports, 'applications', {
  'tokens': false
}), _defineProperty(_module$exports, 'enterprise', {
  'settings': {
    'license': false
  },
  'stats': {
    'issues': false,
    'hooks': false,
    'milestones': false,
    'orgs': false,
    'comments': false,
    'pages': false,
    'users': false,
    'gists': false,
    'pulls': false,
    'repos': false,
    'all': false
  }
}), _defineProperty(_module$exports, 'staff', {
  'indexing_jobs': false
}), _defineProperty(_module$exports, 'setup', {
  'api': {
    'start': false, // POST
    'upgrade': false, // POST
    'configcheck': false, // GET
    'configure': false, // POST
    'settings': { // GET/PUT
      'authorized-keys': false // GET/POST/DELETE
    },
    'maintenance': false // GET/POST
  }
}), _module$exports);
//# sourceMappingURL=tree-options.js.map

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toQueryString = __webpack_require__(2

// new class SimpleVerbs
);module.exports = {
  verbs: {
    fetch: function fetch(path, query) {
      return { method: 'GET', path: '' + path + toQueryString(query) };
    },
    read: function read(path, query) {
      return { method: 'GET', path: '' + path + toQueryString(query), options: { isRaw: true } };
    },
    remove: function remove(path, data) {
      return { method: 'DELETE', path: path, data: data, options: { isBoolean: true } };
    },
    create: function create(path, data, contentType) {
      if (contentType) {
        return { method: 'POST', path: path, data: data, options: { isRaw: true, contentType: contentType } };
      } else {
        return { method: 'POST', path: path, data: data };
      }
    },
    update: function update(path, data) {
      return { method: 'PATCH', path: path, data: data };
    },
    add: function add(path, data) {
      return { method: 'PUT', path: path, data: data, options: { isBoolean: true } };
    },
    contains: function contains(path) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return { method: 'GET', path: path + '/' + args.join('/'), options: { isBoolean: true } };
    }
  }
};
//# sourceMappingURL=simple-verbs.js.map

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(0

// When `origFn` is not passed a callback as the last argument then return a
// Promise, or error if no Promise can be found (see `plugins/promise/*` for
// some strategies for loading a Promise implementation)
),
    filter = _require.filter,
    forOwn = _require.forOwn,
    extend = _require.extend;

var toPromise = function toPromise(orig) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var last = args[args.length - 1];
    if (typeof last === 'function') {
      // The last arg is a callback function
      args.pop();
      return orig.apply(undefined, args).then(function (v) {
        last(null, v);
      }).catch(function (err) {
        last(err);
      });
    } else if (typeof Promise !== 'undefined') {
      return orig.apply(undefined, args);
    } else {
      throw new Error('You must specify a callback or have a promise library loaded');
    }
  };
};

var VerbMethods = function () {
  function VerbMethods(plugins, _requester) {
    _classCallCheck(this, VerbMethods);

    this._requester = _requester;
    if (!this._requester) {
      throw new Error('Octokat BUG: request is required');
    }

    var promisePlugins = filter(plugins, function (_ref) {
      var promiseCreator = _ref.promiseCreator;
      return promiseCreator;
    });
    if (promisePlugins) {
      this._promisePlugin = promisePlugins[0];
    }

    this._syncVerbs = {};
    var iterable = filter(plugins, function (_ref2) {
      var verbs = _ref2.verbs;
      return verbs;
    });
    for (var i = 0; i < iterable.length; i++) {
      var plugin = iterable[i];
      extend(this._syncVerbs, plugin.verbs);
    }
    this._asyncVerbs = {};
    var iterable1 = filter(plugins, function (_ref3) {
      var asyncVerbs = _ref3.asyncVerbs;
      return asyncVerbs;
    });
    for (var j = 0; j < iterable1.length; j++) {
      var _plugin = iterable1[j];
      extend(this._asyncVerbs, _plugin.asyncVerbs);
    }
  }

  // Injects verb methods onto `obj`


  _createClass(VerbMethods, [{
    key: 'injectVerbMethods',
    value: function injectVerbMethods(path, obj) {
      var _this = this;

      if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function') {
        obj.url = path; // Mostly for testing
        forOwn(this._syncVerbs, function (verbFunc, verbName) {
          obj[verbName] = function () {
            var makeRequest = function makeRequest() {
              for (var _len2 = arguments.length, originalArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                originalArgs[_key2] = arguments[_key2];
              }

              var data = void 0,
                  method = void 0,
                  options = void 0;

              var _verbFunc = verbFunc.apply(undefined, [path].concat(originalArgs));

              method = _verbFunc.method;
              path = _verbFunc.path;
              data = _verbFunc.data;
              options = _verbFunc.options;

              return _this._requester.request(method, path, data, options);
            };
            return toPromise(makeRequest).apply(undefined, arguments);
          };
        });

        forOwn(this._asyncVerbs, function (verbFunc, verbName) {
          obj[verbName] = function () {
            var makeRequest = verbFunc(_this._requester, path // Curried function
            );return toPromise(makeRequest).apply(undefined, arguments);
          };
        });
      } else {
        // console.warn('BUG: Attempted to injectVerbMethods on a ' + (typeof obj));
      }

      return obj;
    }
  }]);

  return VerbMethods;
}();

exports.VerbMethods = VerbMethods;
exports.toPromise = toPromise;
//# sourceMappingURL=verb-methods.js.map

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var deprecate = __webpack_require__(1);
var OctokatBase = __webpack_require__(10);

var HypermediaPlugin = __webpack_require__(19);

var ALL_PLUGINS = [__webpack_require__(20), // re-chain methods when we detect an object (issue, comment, user, etc)
__webpack_require__(22), __webpack_require__(15), __webpack_require__(23), __webpack_require__(25), __webpack_require__(5), __webpack_require__(18), __webpack_require__(21),
// Run cacheHandler after PagedResults so the link headers are remembered
// but before hypermedia so the object is still serializable
__webpack_require__(16), __webpack_require__(24), HypermediaPlugin, __webpack_require__(17)];

var Octokat = function Octokat() {
  var clientOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (clientOptions.plugins == null) {
    clientOptions.plugins = ALL_PLUGINS;
  }

  if (clientOptions.disableHypermedia) {
    deprecate('Please use the clientOptions.plugins array and just do not include the hypermedia plugin');
    clientOptions.plugins = clientOptions.plugins.filter(function (plugin) {
      return plugin !== HypermediaPlugin;
    });
  }

  // HACK to propagate the Fetch implementation
  if (Octokat.Fetch) {
    OctokatBase.Fetch = Octokat.Fetch;
  }
  // the octokat instance
  var instance = new OctokatBase(clientOptions);
  return instance;
};

// module.exports = Octokat;
module.exports = Octokat;
//# sourceMappingURL=octokat.js.map

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = btoa;
//# sourceMappingURL=base64-browser.js.map

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (typeof window.fetch === 'function') {
  module.exports = window.fetch.bind(window);
} else {
  module.exports = function () {
    throw new Error('Octokat Error: window.fetch function not found. Either use the https://npmjs.com/package/whatwg-fetch polyfill or set Octokat.Fetch variable to be the fetch function');
  };
}
//# sourceMappingURL=fetch-browser.js.map

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var fetch = __webpack_require__(9);
var plus = __webpack_require__(0);
var deprecate = __webpack_require__(1);
var TREE_OPTIONS = __webpack_require__(4);
var Chainer = __webpack_require__(3);

var _require = __webpack_require__(6

// Use the following plugins by default (they should be neglegible additional code)
),
    VerbMethods = _require.VerbMethods,
    toPromise = _require.toPromise;

var SimpleVerbsPlugin = __webpack_require__(5);

var Requester = __webpack_require__(26);
var applyHypermedia = __webpack_require__(14

// Checks if a response is a Buffer or not
);var isBuffer = function isBuffer(data) {
  if (typeof global['Buffer'] !== 'undefined') {
    return global['Buffer'].isBuffer(data);
  } else {
    // If `global` is not defined then we are not running inside Node so
    // the object could never be a Buffer.
    return false;
  }
};

var uncamelizeObj = function uncamelizeObj(obj) {
  if (Array.isArray(obj)) {
    return obj.map(function (i) {
      return uncamelizeObj(i);
    });
  } else if (obj === Object(obj)) {
    var o = {};
    var iterable = Object.keys(obj);
    for (var j = 0; j < iterable.length; j++) {
      var key = iterable[j];
      var value = obj[key];
      o[plus.uncamelize(key)] = uncamelizeObj(value);
    }
    return o;
  } else {
    return obj;
  }
};

var OctokatBase = function OctokatBase() {
  var clientOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var plugins = clientOptions.plugins || [SimpleVerbsPlugin];

  // TODO remove disableHypermedia
  var disableHypermedia = clientOptions.disableHypermedia;
  // set defaults

  if (typeof disableHypermedia === 'undefined' || disableHypermedia === null) {
    disableHypermedia = false;
  }

  // the octokat instance
  var instance = {};

  var fetchImpl = OctokatBase.Fetch || fetch;

  var request = function request(method, path, data) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { raw: false, isBase64: false, isBoolean: false };
    var cb = arguments[4];

    // replacer = new Replacer(request)

    // Use a slightly convoluted syntax so browserify does not include the
    // NodeJS Buffer in the browser version.
    // data is a Buffer when uploading a release asset file
    if (data && !isBuffer(data)) {
      data = uncamelizeObj(data);
    }

    // For each request, convert the JSON into Objects
    var requester = new Requester(instance, clientOptions, plugins, fetchImpl);

    return requester.request(method, path, data, options).then(function (val) {
      if ((options || {}).raw) {
        return val;
      }

      if (!disableHypermedia) {
        var context = {
          data: val,
          plugins: plugins,
          requester: requester,
          instance: instance,
          clientOptions: clientOptions
        };
        return instance._parseWithContextPromise(path, context);
      } else {
        return val;
      }
    });
  };

  var verbMethods = new VerbMethods(plugins, { request: request });
  new Chainer(verbMethods).chain('', null, TREE_OPTIONS, instance

  // Special case for `me`
  );instance.me = instance.user;

  instance.parse = function (data) {
    // The signature of toPromise has cb as the 1st arg
    var context = {
      requester: { request: request },
      plugins: plugins,
      data: data,
      instance: instance,
      clientOptions: clientOptions
    };
    return instance._parseWithContextPromise('', context);
  };

  // If not callback is provided then return a promise
  instance.parse = toPromise(instance.parse);

  instance._parseWithContextPromise = function (path, context) {
    var data = context.data;

    if (data) {
      context.url = data.url || path;
    }

    var responseMiddlewareAsyncs = plus.map(plus.filter(plugins, function (_ref) {
      var responseMiddlewareAsync = _ref.responseMiddlewareAsync;
      return responseMiddlewareAsync;
    }), function (plugin) {
      return plugin.responseMiddlewareAsync.bind(plugin);
    });

    var prev = Promise.resolve(context);
    responseMiddlewareAsyncs.forEach(function (p) {
      prev = prev.then(p);
    });
    return prev.then(function (val) {
      return val.data;
    });
  };

  // TODO remove this deprectaion too
  instance._fromUrlWithDefault = function (path, defaultFn) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    path = applyHypermedia.apply(undefined, [path].concat(args));
    verbMethods.injectVerbMethods(path, defaultFn);
    return defaultFn;
  };

  instance.fromUrl = function (path) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var defaultFn = function defaultFn() {
      deprecate('call ....fetch() explicitly instead of ...()');
      return defaultFn.fetch.apply(defaultFn, arguments);
    };

    return instance._fromUrlWithDefault.apply(instance, [path, defaultFn].concat(args));
  };

  instance._fromUrlCurried = function (path, defaultFn) {
    var fn = function fn() {
      for (var _len3 = arguments.length, templateArgs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        templateArgs[_key3] = arguments[_key3];
      }

      // This conditional logic is for the deprecated .nextPage() call
      if (defaultFn && templateArgs.length === 0) {
        return defaultFn.apply(fn);
      } else {
        return instance.fromUrl.apply(instance, [path].concat(templateArgs));
      }
    };

    if (!/\{/.test(path)) {
      verbMethods.injectVerbMethods(path, fn);
    }
    return fn;
  };

  // Add the GitHub Status API https://status.github.com/api
  instance.status = instance.fromUrl('https://status.github.com/api/status.json');
  instance.status.api = instance.fromUrl('https://status.github.com/api.json');
  instance.status.lastMessage = instance.fromUrl('https://status.github.com/api/last-message.json');
  instance.status.messages = instance.fromUrl('https://status.github.com/api/messages.json');

  return instance;
};

module.exports = OctokatBase;
//# sourceMappingURL=base.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(30)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Generated by CoffeeScript 1.12.6
(function () {
  module.exports = {
    'repos': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/(repos(\/[^\/]+){2}|repositories\/([0-9]+))$/,
    'gists': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/gists\/[^\/]+$/,
    'issues': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/(repos(\/[^\/]+){2}|repositories\/([0-9]+))\/(issues|pulls)\/[^\/]+$/,
    'users': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/users\/[^\/]+$/,
    'orgs': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/orgs\/[^\/]+$/,
    'teams': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/teams\/[^\/]+$/,
    'repos.comments': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/repos\/[^\/]+\/[^\/]+\/comments\/[^\/]+$/
  };
}).call(undefined);

//# sourceMappingURL=object-matcher.js.map
//# sourceMappingURL=object-matcher.js.map

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Generated by CoffeeScript 1.12.6
(function () {
  module.exports = {
    'application/vnd.github.drax-preview+json': /^(https?:\/\/[^\/]+)?(\/api\/v3)?(\/licenses|\/licenses\/([^\/]+)|\/repos\/([^\/]+)\/([^\/]+))$/,
    'application/vnd.github.v3.star+json': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/users\/([^\/]+)\/starred$/,
    'application/vnd.github.cloak-preview+json': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/search\/commits$/,
    'application/vnd.github.black-cat-preview+json': /^(https?:\/\/[^\/]+)?(\/api\/v3)?\/repos(\/[^\/]+){2}\/pulls\/[0-9]+\/(|requested_reviewers|reviews(\/[0-9]+)?|reviews(\/[0-9]+)\/(comments|events|dismissals))$/,
    'application/vnd.github.inertia-preview+json': /^(https?:\/\/[^\/]+)?(\/api\/v3)?(\/repos(\/[^\/]+){2}\/projects|\/orgs\/([^\/]+)\/projects|\/projects\/([0-9]+|[0-9]+\/columns|columns|columns\/[0-9]+|columns\/[0-9]+\/moves|columns\/[0-9]+\/cards|columns\/cards\/[0-9]+|columns\/cards\/[0-9]+\/moves))$/
  };
}).call(undefined);

//# sourceMappingURL=preview-headers.js.map
//# sourceMappingURL=preview-headers.js.map

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Generated by CoffeeScript 1.12.6
(function () {
  module.exports = /^(https:\/\/status.github.com\/api\/(status.json|last-message.json|messages.json)$)|(https?:\/\/[^\/]+)?(\/api\/v3)?\/(zen|octocat|users|organizations|issues|gists|emojis|markdown|meta|rate_limit|feeds|events|repositories(\/\d+)?|notifications|notifications\/threads(\/[^\/]+)|notifications\/threads(\/[^\/]+)\/subscription|gitignore\/templates(\/[^\/]+)?|user(\/\d+)?|user(\/\d+)?\/(|repos|orgs|followers|following(\/[^\/]+)?|emails(\/[^\/]+)?|issues|public_emails|starred|starred(\/[^\/]+){2}|teams)|orgs\/[^\/]+|orgs\/[^\/]+\/(repos|issues|members|events|teams|projects)|projects\/[0-9]+|projects\/[0-9]+\/columns|projects\/columns\/[0-9]+|projects\/columns\/[0-9]+\/moves|projects\/columns\/[0-9]+\/cards|projects\/columns\/cards\/[0-9]+|projects\/columns\/cards\/[0-9]+\/moves|teams\/[^\/]+|teams\/[^\/]+\/(members(\/[^\/]+)?|memberships\/[^\/]+|repos|repos(\/[^\/]+){2})|users\/[^\/]+|users\/[^\/]+\/(repos|orgs|gists|followers|following(\/[^\/]+){0,2}|keys|starred|received_events(\/public)?|events(\/public)?|events\/orgs\/[^\/]+)|search\/(repositories|commits|issues|users|code)|gists\/(public|starred|([a-f0-9]{20,32}|[0-9]+)|([a-f0-9]{20,32}|[0-9]+)\/forks|([a-f0-9]{20,32}|[0-9]+)\/comments(\/[0-9]+)?|([a-f0-9]{20,32}|[0-9]+)\/star)|repos(\/[^\/]+){2}|(repos(\/[^\/]+){2}|repositories\/([0-9]+))\/(readme|tarball(\/[^\/]+)?|zipball(\/[^\/]+)?|compare\/([^\.{3}]+)\.{3}([^\.{3}]+)|deployments(\/[0-9]+)?|deployments\/[0-9]+\/statuses(\/[0-9]+)?|hooks|hooks\/[^\/]+|hooks\/[^\/]+\/tests|assignees|languages|teams|tags|branches(\/[^\/]+){0,2}|contributors|subscribers|subscription|stargazers|comments(\/[0-9]+)?|downloads(\/[0-9]+)?|forks|milestones|milestones\/[0-9]+|milestones\/[0-9]+\/labels|labels(\/[^\/]+)?|releases|releases\/([0-9]+)|releases\/([0-9]+)\/assets|releases\/latest|releases\/tags\/([^\/]+)|releases\/assets\/([0-9]+)|events|notifications|merges|statuses\/[a-f0-9]{40}|pages|pages\/builds|pages\/builds\/latest|commits|commits\/[a-f0-9]{40}|commits\/[a-f0-9]{40}\/(comments|status|statuses)?|contents\/|contents(\/[^\/]+)*|collaborators(\/[^\/]+)?|collaborators\/([^\/]+)\/permission|projects|(issues|pulls)|(issues|pulls)\/(events|events\/[0-9]+|comments(\/[0-9]+)?|[0-9]+|[0-9]+\/events|[0-9]+\/comments|[0-9]+\/labels(\/[^\/]+)?)|pulls\/[0-9]+\/(files|commits|merge|requested_reviewers|reviews(\/[0-9]+)?|reviews(\/[0-9]+)\/(comments|events|dismissals))|git\/(refs|refs\/(.+|heads(\/[^\/]+)?|tags(\/[^\/]+)?)|trees(\/[^\/]+)?|blobs(\/[a-f0-9]{40}$)?|commits(\/[a-f0-9]{40}$)?)|stats\/(contributors|commit_activity|code_frequency|participation|punch_card)|traffic\/(popular\/(referrers|paths)|views|clones))|licenses|licenses\/([^\/]+)|authorizations|authorizations\/((\d+)|clients\/([^\/]{20})|clients\/([^\/]{20})\/([^\/]+))|applications\/([^\/]{20})\/tokens|applications\/([^\/]{20})\/tokens\/([^\/]+)|enterprise\/(settings\/license|stats\/(issues|hooks|milestones|orgs|comments|pages|users|gists|pulls|repos|all))|staff\/indexing_jobs|users\/[^\/]+\/(site_admin|suspended)|setup\/api\/(start|upgrade|configcheck|configure|settings(authorized-keys)?|maintenance))(\?.*)?$/;
}).call(undefined);

//# sourceMappingURL=url-validator.js.map
//# sourceMappingURL=url-validator.js.map

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toQueryString = __webpack_require__(2);
var deprecate = __webpack_require__(1);

module.exports = function (url) {
  // Deprecated interface. Use an Object to specify the args in the template.
  // the order of fields in the template should not matter.
  var m = void 0;
  if ((arguments.length <= 1 ? 0 : arguments.length - 1) === 0) {
    var templateParams = {};
  } else {
    if ((arguments.length <= 1 ? 0 : arguments.length - 1) > 1) {
      deprecate('When filling in a template URL pass all the field to fill in 1 object instead of comma-separated args');
    }

    var templateParams = arguments.length <= 1 ? undefined : arguments[1];
  }

  // url can contain {name} or {/name} in the URL.
  // for every arg passed in, replace {...} with that arg
  // and remove the rest (they may or may not be optional)
  var i = 0;
  while (m = /(\{[^\}]+\})/.exec(url)) {
    // `match` is something like `{/foo}` or `{?foo,bar}` or `{foo}` (last one means it is required)
    var match = m[1];
    var param = '';
    // replace it
    switch (match[1]) {
      case '/':
        var fieldName = match.slice(2, match.length - 1 // omit the braces and the slash
        );var fieldValue = templateParams[fieldName];
        if (fieldValue) {
          if (/\//.test(fieldValue)) {
            throw new Error('Octokat Error: this field must not contain slashes: ' + fieldName);
          }
          param = '/' + fieldValue;
        }
        break;
      case '+':
        fieldName = match.slice(2, match.length - 1 // omit the braces and the `+`
        );fieldValue = templateParams[fieldName];
        if (fieldValue) {
          param = fieldValue;
        }
        break;
      case '?':
        // Strip off the "{?" and the trailing "}"
        // For example, the URL is `/assets{?name,label}`
        //   which turns into `/assets?name=foo.zip`
        // Used to upload releases via the repo releases API.
        //
        // When match contains `,` or
        // `args.length is 1` and args[0] is object match the args to those in the template
        var optionalNames = match.slice(2, -2 + 1).split(',' // omit the braces and the `?` before splitting
        );var optionalParams = {};
        for (var j = 0; j < optionalNames.length; j++) {
          fieldName = optionalNames[j];
          optionalParams[fieldName] = templateParams[fieldName];
        }
        param = toQueryString(optionalParams);
        break;
      case '&':
        optionalNames = match.slice(2, -2 + 1).split(',' // omit the braces and the `?` before splitting
        );optionalParams = {};
        for (var k = 0; k < optionalNames.length; k++) {
          fieldName = optionalNames[k];
          optionalParams[fieldName] = templateParams[fieldName];
        }
        param = toQueryString(optionalParams, true // true means omitQuestionMark
        );break;

      default:
        // This is a required field. ie `{repoName}`
        fieldName = match.slice(1, match.length - 1 // omit the braces
        );if (templateParams[fieldName]) {
          param = templateParams[fieldName];
        } else {
          throw new Error('Octokat Error: Required parameter is missing: ' + fieldName);
        }
    }

    url = url.replace(match, param);
    i++;
  }

  return url;
};
//# sourceMappingURL=hypermedia.js.map

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var base64encode = __webpack_require__(8);

module.exports = new (function () {
  function Authorization() {
    _classCallCheck(this, Authorization);
  }

  _createClass(Authorization, [{
    key: 'requestMiddlewareAsync',
    value: function requestMiddlewareAsync(input) {
      if (input.headers == null) {
        input.headers = {};
      }
      var headers = input.headers,
          _input$clientOptions = input.clientOptions,
          token = _input$clientOptions.token,
          username = _input$clientOptions.username,
          password = _input$clientOptions.password;

      if (token || username && password) {
        if (token) {
          var auth = 'token ' + token;
        } else {
          var auth = 'Basic ' + base64encode(username + ':' + password);
        }
        input.headers['Authorization'] = auth;
      }
      return Promise.resolve(input);
    }
  }]);

  return Authorization;
}())();
//# sourceMappingURL=authorization.js.map

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = new (function () {
  function CacheHandler() {
    _classCallCheck(this, CacheHandler);

    this._cachedETags = {};
  }

  // Default cacheHandler methods


  _createClass(CacheHandler, [{
    key: 'get',
    value: function get(method, path) {
      return this._cachedETags[method + ' ' + path];
    }
  }, {
    key: 'add',
    value: function add(method, path, eTag, data, status) {
      return this._cachedETags[method + ' ' + path] = { eTag: eTag, data: data, status: status };
    }
  }, {
    key: 'requestMiddlewareAsync',
    value: function requestMiddlewareAsync(input) {
      var clientOptions = input.clientOptions,
          method = input.method,
          path = input.path;

      if (input.headers == null) {
        input.headers = {};
      }
      var cacheHandler = clientOptions.cacheHandler || this;
      // Send the ETag if re-requesting a URL
      if (cacheHandler.get(method, path)) {
        input.headers['If-None-Match'] = cacheHandler.get(method, path).eTag;
      } else {
        // The browser will sneak in a 'If-Modified-Since' header if the GET has been requested before
        // but for some reason the cached response does not seem to be available
        // in the jqXHR object.
        // So, the first time a URL is requested set this date to 0 so we always get a response the 1st time
        // a URL is requested.
        input.headers['If-Modified-Since'] = 'Thu, 01 Jan 1970 00:00:00 GMT';
      }

      return Promise.resolve(input);
    }
  }, {
    key: 'responseMiddlewareAsync',
    value: function responseMiddlewareAsync(input, cb) {
      var clientOptions = input.clientOptions,
          request = input.request,
          status = input.status,
          jqXHR = input.jqXHR,
          data = input.data;

      if (!jqXHR) {
        return Promise.resolve(input);
      } // The plugins are all used in `octo.parse()` which does not have a jqXHR

      // Since this can be called via `octo.parse`, skip caching when there is no jqXHR
      if (jqXHR) {
        var method = request.method,
            path = request.path; // This is also not defined when octo.parse is called

        var cacheHandler = clientOptions.cacheHandler || this;
        if (status === 304 || status === 0) {
          var ref = cacheHandler.get(method, path);
          if (ref) {
            var eTag;

            // Set a flag on the object so users know this is a cached response
            // if (typeof data !== 'string') {
            //   data.__IS_CACHED = eTag || true
            // }
            data = ref.data;
            status = ref.status;
            eTag = ref.eTag;
          } else {
            throw new Error('ERROR: Bug in Octokat cacheHandler for path \'' + method + ' ' + path + '\'. It had an eTag but not the cached response.');
          }
        } else {
          // Cache the response to reuse later
          if (method === 'GET' && jqXHR.headers.get('ETag')) {
            var eTag = jqXHR.headers.get('ETag');
            cacheHandler.add(method, path, eTag, data, jqXHR.status);
          }
        }

        input.data = data;
        input.status = status;
        return Promise.resolve(input);
      }
    }
  }]);

  return CacheHandler;
}())();
//# sourceMappingURL=cache-handler.js.map

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var plus = __webpack_require__(0);

module.exports = new (function () {
  function CamelCase() {
    _classCallCheck(this, CamelCase);
  }

  _createClass(CamelCase, [{
    key: 'responseMiddlewareAsync',
    value: function responseMiddlewareAsync(input) {
      var data = input.data;

      data = this.replace(data);
      input.data = data; // or throw new Error('BUG! Expected JSON data to exist')
      return Promise.resolve(input);
    }
  }, {
    key: 'replace',
    value: function replace(data) {
      if (Array.isArray(data)) {
        return this._replaceArray(data);
      } else if (typeof data === 'function') {
        return data;
      } else if (data instanceof Date) {
        return data;
      } else if (data === Object(data)) {
        return this._replaceObject(data);
      } else {
        return data;
      }
    }
  }, {
    key: '_replaceObject',
    value: function _replaceObject(orig) {
      var acc = {};
      var iterable = Object.keys(orig);
      for (var i = 0; i < iterable.length; i++) {
        var key = iterable[i];
        var value = orig[key];
        this._replaceKeyValue(acc, key, value);
      }

      return acc;
    }
  }, {
    key: '_replaceArray',
    value: function _replaceArray(orig) {
      var _this = this;

      var arr = orig.map(function (item) {
        return _this.replace(item);
      });
      // Convert the nextPage methods for paged results
      var iterable = Object.keys(orig);
      for (var i = 0; i < iterable.length; i++) {
        var key = iterable[i];
        var value = orig[key];
        this._replaceKeyValue(arr, key, value);
      }
      return arr;
    }

    // Convert things that end in `_url` to methods which return a Promise

  }, {
    key: '_replaceKeyValue',
    value: function _replaceKeyValue(acc, key, value) {
      return acc[plus.camelize(key)] = this.replace(value);
    }
  }]);

  return CamelCase;
}())();
//# sourceMappingURL=camel-case.js.map

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toQueryString = __webpack_require__(2);

var pushAll = function pushAll(target, source) {
  if (!Array.isArray(source)) {
    throw new Error('Octokat Error: Calling fetchAll on a request that does not yield an array');
  }
  return target.push.apply(target, source);
};

var getMore = function getMore(fetchable, requester, acc) {
  var nextPagePromise = fetchNextPage(fetchable, requester);
  if (nextPagePromise) {
    return nextPagePromise.then(function (results) {
      pushAll(acc, results.items
      // TODO: handle `items.next_page = string/function`, `items.nextPage = string/function`
      );return getMore(results, requester, acc);
    });
  } else {
    return acc;
  }
};

// TODO: HACK to handle camelCase and hypermedia plugins
var fetchNextPage = function fetchNextPage(obj, requester) {
  if (typeof obj.next_page_url === 'string') {
    return requester.request('GET', obj.next_page_url, null, null);
  } else if (obj.next_page) {
    return obj.next_page.fetch();
  } else if (typeof obj.nextPageUrl === 'string') {
    return requester.request('GET', obj.nextPageUrl, null, null);
  } else if (obj.nextPage) {
    return obj.nextPage.fetch();
  } else {
    return false;
  }
};

// new class FetchAll
module.exports = {
  asyncVerbs: {
    fetchAll: function fetchAll(requester, path) {
      return function (query) {
        // TODO: Pass in the instance so we can just call fromUrl maybe? and we don't rely on hypermedia to create nextPage
        return requester.request('GET', '' + path + toQueryString(query), null, null).then(function (results) {
          var acc = [];
          pushAll(acc, results.items
          // TODO: handle `items.next_page = string/function`, `items.nextPage = string/function`
          );return getMore(results, requester, acc);
        });
      };
    }
  }
};
//# sourceMappingURL=fetch-all.js.map

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var deprecate = __webpack_require__(1);

module.exports = new (function () {
  function HyperMedia() {
    _classCallCheck(this, HyperMedia);
  }

  _createClass(HyperMedia, [{
    key: 'replace',
    value: function replace(instance, data) {
      if (Array.isArray(data)) {
        return this._replaceArray(instance, data);
      } else if (typeof data === 'function') {
        return data;
      } else if (data instanceof Date) {
        return data;
      } else if (data === Object(data)) {
        return this._replaceObject(instance, data);
      } else {
        return data;
      }
    }
  }, {
    key: '_replaceObject',
    value: function _replaceObject(instance, orig) {
      var acc = {};
      var iterable = Object.keys(orig);
      for (var i = 0; i < iterable.length; i++) {
        var key = iterable[i];
        var value = orig[key];
        this._replaceKeyValue(instance, acc, key, value);
      }

      return acc;
    }
  }, {
    key: '_replaceArray',
    value: function _replaceArray(instance, orig) {
      var _this = this;

      var arr = orig.map(function (item) {
        return _this.replace(instance, item);
      });
      // Convert the nextPage methods for paged results
      var iterable = Object.keys(orig);
      for (var i = 0; i < iterable.length; i++) {
        var key = iterable[i];
        var value = orig[key];
        this._replaceKeyValue(instance, arr, key, value);
      }
      return arr;
    }

    // Convert things that end in `_url` to methods which return a Promise

  }, {
    key: '_replaceKeyValue',
    value: function _replaceKeyValue(instance, acc, key, value) {
      if (/_url$/.test(key)) {
        if (/^upload_url$/.test(key)) {
          // POST https://<upload_url>/repos/:owner/:repo/releases/:id/assets?name=foo.zip
          var defaultFn = function defaultFn() {
            // TODO: Maybe always set isRaw=true when contentType is provided
            deprecate('call .upload({name, label}).create(data, contentType)' + ' instead of .upload(name, data, contentType)');
            return defaultFn.create.apply(defaultFn, arguments);
          };

          var fn = function fn() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return instance._fromUrlWithDefault.apply(instance, [value, defaultFn].concat(args))();
          };
        } else {
          var defaultFn = function defaultFn() {
            deprecate('instead of directly calling methods like .nextPage(), use .nextPage.fetch()');
            return this.fetch();
          };
          var fn = instance._fromUrlCurried(value, defaultFn);
        }

        var newKey = key.substring(0, key.length - '_url'.length);
        acc[newKey] = fn;
        // add a camelCase URL field for retrieving non-templated URLs
        // like `avatarUrl` and `htmlUrl`
        if (!/\{/.test(value)) {
          return acc[key] = value;
        }
      } else if (/_at$/.test(key)) {
        // Ignore null dates so we do not get `Wed Dec 31 1969`
        return acc[key] = value ? new Date(value) : null;
      } else {
        return acc[key] = this.replace(instance, value);
      }
    }
  }, {
    key: 'responseMiddlewareAsync',
    value: function responseMiddlewareAsync(input) {
      var instance = input.instance,
          data = input.data;

      data = this.replace(instance, data);
      input.data = data; // or throw new Error('BUG! Expected JSON data to exist')
      return Promise.resolve(input);
    }
  }]);

  return HyperMedia;
}())();
//# sourceMappingURL=hypermedia.js.map

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OBJECT_MATCHER = __webpack_require__(11);
var TREE_OPTIONS = __webpack_require__(4);

var _require = __webpack_require__(6),
    VerbMethods = _require.VerbMethods;

var Chainer = __webpack_require__(3);

module.exports = new (function () {
  function ObjectChainer() {
    _classCallCheck(this, ObjectChainer);
  }

  _createClass(ObjectChainer, [{
    key: 'chainChildren',
    value: function chainChildren(chainer, url, obj) {
      return function () {
        var result = [];
        for (var key in OBJECT_MATCHER) {
          var re = OBJECT_MATCHER[key];
          var item = void 0;
          if (re.test(obj.url)) {
            var context = TREE_OPTIONS;
            var iterable = key.split('.');
            for (var i = 0; i < iterable.length; i++) {
              var k = iterable[i];
              context = context[k];
            }
            item = chainer.chain(url, k, context, obj);
          }
          result.push(item);
        }
        return result;
      }();
    }
  }, {
    key: 'responseMiddlewareAsync',
    value: function responseMiddlewareAsync(input) {
      var plugins = input.plugins,
          requester = input.requester,
          data = input.data,
          url = input.url;
      // unless data
      //    throw new Error('BUG! Expected JSON data to exist')

      var verbMethods = new VerbMethods(plugins, requester);
      var chainer = new Chainer(verbMethods);
      if (url) {
        chainer.chain(url, true, {}, data);
        this.chainChildren(chainer, url, data);
      } else {
        chainer.chain('', null, {}, data
        // For the paged results, rechain all children in the array
        );if (Array.isArray(data)) {
          for (var i = 0; i < data.length; i++) {
            var datum = data[i];
            this.chainChildren(chainer, datum.url, datum);
          }
        }
      }

      return Promise.resolve(input);
    }
  }]);

  return ObjectChainer;
}())();
//# sourceMappingURL=object-chainer.js.map

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = new (function () {
  function Pagination() {
    _classCallCheck(this, Pagination);
  }

  _createClass(Pagination, [{
    key: 'responseMiddlewareAsync',
    value: function responseMiddlewareAsync(input) {
      var jqXHR = input.jqXHR,
          data = input.data;

      if (!jqXHR) {
        return Promise.resolve(input);
      } // The plugins are all used in `octo.parse()` which does not have a jqXHR

      // Only JSON responses have next/prev/first/last link headers
      // Add them to data so the resolved value is iterable

      if (Array.isArray(data)) {
        data = { items: data.slice() // Convert to object so we can add the next/prev/first/last link headers

          // Parse the Link headers
          // of the form `<http://a.com>; rel="next", <https://b.com?a=b&c=d>; rel="previous"`
        };var linksHeader = jqXHR.headers.get('Link');
        if (linksHeader) {
          linksHeader.split(',').forEach(function (part) {
            var _part$match = part.match(/<([^>]+)>; rel="([^"]+)"/
            // Add the pagination functions on the JSON since Promises resolve one value
            // Name the functions `nextPage`, `previousPage`, `firstPage`, `lastPage`
            ),
                _part$match2 = _slicedToArray(_part$match, 3),
                unusedField = _part$match2[0],
                href = _part$match2[1],
                rel = _part$match2[2];

            data[rel + '_page_url'] = href;
          });
        }
        input.data = data; // or throw new Error('BUG! Expected JSON data to exist')
      }
      return Promise.resolve(input);
    }
  }]);

  return Pagination;
}())();
//# sourceMappingURL=pagination.js.map

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URL_VALIDATOR = __webpack_require__(13);

module.exports = new (function () {
  function PathValidator() {
    _classCallCheck(this, PathValidator);
  }

  _createClass(PathValidator, [{
    key: 'requestMiddlewareAsync',
    value: function requestMiddlewareAsync(input) {
      var path = input.path;

      if (!URL_VALIDATOR.test(path)) {
        var err = 'Octokat BUG: Invalid Path. If this is actually a valid path then please update the URL_VALIDATOR. path=' + path;
        console.warn(err);
      }
      return Promise.resolve(input);
    }
  }]);

  return PathValidator;
}())();
//# sourceMappingURL=path-validator.js.map

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PREVIEW_HEADERS = __webpack_require__(12);

var DEFAULT_HEADER = function DEFAULT_HEADER(url) {
  for (var key in PREVIEW_HEADERS) {
    var val = PREVIEW_HEADERS[key];
    if (val.test(url)) {
      return key;
    }
  }
};

// Use the preview API header if one of the routes match the preview APIs
module.exports = new (function () {
  function PreviewApis() {
    _classCallCheck(this, PreviewApis);
  }

  _createClass(PreviewApis, [{
    key: 'requestMiddlewareAsync',
    value: function requestMiddlewareAsync(input) {
      var path = input.path;

      var acceptHeader = DEFAULT_HEADER(path);
      if (acceptHeader) {
        input.headers['Accept'] = acceptHeader;
      }

      return Promise.resolve(input);
    }
  }]);

  return PreviewApis;
}())();
//# sourceMappingURL=preview-apis.js.map

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var toQueryString = __webpack_require__(2);

module.exports = new (function () {
  function ReadBinary() {
    _classCallCheck(this, ReadBinary);

    this.verbs = {
      readBinary: function readBinary(path, query) {
        return { method: 'GET', path: '' + path + toQueryString(query), options: { isRaw: true, isBase64: true } };
      }
    };
  }

  _createClass(ReadBinary, [{
    key: 'requestMiddlewareAsync',
    value: function requestMiddlewareAsync(input) {
      var options = input.options;

      if (options) {
        var isBase64 = options.isBase64;

        if (isBase64) {
          input.headers['Accept'] = 'application/vnd.github.raw';
          input.mimeType = 'text/plain; charset=x-user-defined';
        }
      }
      return Promise.resolve(input);
    }
  }, {
    key: 'responseMiddlewareAsync',
    value: function responseMiddlewareAsync(input) {
      var options = input.options,
          data = input.data;

      if (options) {
        var isBase64 = options.isBase64;
        // Convert the response to a Base64 encoded string

        if (isBase64) {
          // Convert raw data to binary chopping off the higher-order bytes in each char.
          // Useful for Base64 encoding.
          var converted = '';
          var iterable = __range__(0, data.length, false);
          for (var j = 0; j < iterable.length; j++) {
            var i = iterable[j];
            converted += String.fromCharCode(data.charCodeAt(i) & 0xff);
          }

          input.data = converted; // or throw new Error('BUG! Expected JSON data to exist')
        }
      }
      return Promise.resolve(input);
    }
  }]);

  return ReadBinary;
}())();

function __range__(left, right, inclusive) {
  var range = [];
  var ascending = left < right;
  var end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (var i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}
//# sourceMappingURL=read-binary.js.map

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = new (function () {
  function UsePostInsteadOfPatch() {
    _classCallCheck(this, UsePostInsteadOfPatch);
  }

  _createClass(UsePostInsteadOfPatch, [{
    key: 'requestMiddlewareAsync',
    value: function requestMiddlewareAsync(input, cb) {
      var usePostInsteadOfPatch = input.clientOptions.usePostInsteadOfPatch,
          method = input.method;

      if (usePostInsteadOfPatch && method === 'PATCH') {
        input.method = 'POST';
      }
      return Promise.resolve(input);
    }
  }]);

  return UsePostInsteadOfPatch;
}())();
//# sourceMappingURL=use-post-instead-of-patch.js.map

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(0

// Request Function
// ===============================
//
// Generates the actual HTTP requests to GitHub.
// Handles ETag caching, authentication headers, boolean requests, and paged results

// # Construct the request function.
// It contains all the auth credentials passed in to the client constructor

),
    filter = _require.filter,
    map = _require.map;

var EVENT_ID = 0; // counter for the emitter so it is easier to match up requests

module.exports = function () {
  function Requester(_instance) {
    var _clientOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var plugins = arguments[2];
    var fetchImpl = arguments[3];

    _classCallCheck(this, Requester);

    // Provide an option to override the default URL
    this._instance = _instance;
    this._clientOptions = _clientOptions;
    if (this._clientOptions.rootURL == null) {
      this._clientOptions.rootURL = 'https://api.github.com';
    }
    if (this._clientOptions.useETags == null) {
      this._clientOptions.useETags = true;
    }
    if (this._clientOptions.usePostInsteadOfPatch == null) {
      this._clientOptions.usePostInsteadOfPatch = false;
    }
    if (this._clientOptions.userAgent == null) {
      if (typeof window === 'undefined' || window === null) {
        // Set the `User-Agent` because it is required and NodeJS
        // does not send one by default.
        // See http://developer.github.com/v3/#user-agent-required
        this._clientOptions.userAgent = 'octokat.js';
      }
    }

    // These are updated whenever a request is made (optional)
    if (typeof this._clientOptions.emitter === 'function') {
      this._emit = this._clientOptions.emitter;
    }

    this._pluginMiddlewareAsync = map(filter(plugins, function (_ref) {
      var requestMiddlewareAsync = _ref.requestMiddlewareAsync;
      return requestMiddlewareAsync;
    }), function (plugin) {
      return plugin.requestMiddlewareAsync.bind(plugin);
    });
    this._plugins = plugins;
    this._fetchImpl = fetchImpl;
  }

  // HTTP Request Abstraction
  // =======
  //


  _createClass(Requester, [{
    key: 'request',
    value: function request(method, path, data) {
      var _this = this;

      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { isRaw: false, isBase64: false, isBoolean: false, contentType: 'application/json' };
      var cb = arguments[4];

      if (typeof options === 'undefined' || options === null) {
        options = {};
      }
      if (options.isRaw == null) {
        options.isRaw = false;
      }
      if (options.isBase64 == null) {
        options.isBase64 = false;
      }
      if (options.isBoolean == null) {
        options.isBoolean = false;
      }
      if (options.contentType == null) {
        options.contentType = 'application/json';
      }

      // console.log method, path, data, options, typeof cb

      // Only prefix the path when it does not begin with http.
      // This is so pagination works (which provides absolute URLs).
      if (!/^http/.test(path)) {
        path = '' + this._clientOptions.rootURL + path;
      }

      var headers = {
        'Accept': this._clientOptions.acceptHeader || 'application/json',
        'User-Agent': this._clientOptions.userAgent || 'octokat.js'
      };

      var acc = { method: method, path: path, headers: headers, options: options, clientOptions: this._clientOptions

        // To use async.waterfall we need to pass in the initial data (`acc`)
        // so we create an initial function that just takes a callback
      };var initial = Promise.resolve(acc);

      var prev = initial;
      this._pluginMiddlewareAsync.forEach(function (p) {
        prev = prev.then(p);
      });
      return prev.then(function (acc) {
        var _acc = acc;
        method = _acc.method;
        headers = _acc.headers;


        if (options.isRaw) {
          headers['Accept'] = 'application/vnd.github.raw';
        }

        var fetchArgs = {
          // Be sure to **not** blow the cache with a random number
          // (GitHub will respond with 5xx or CORS errors)
          method: method,
          headers: headers,
          body: !options.isRaw && data && JSON.stringify(data) || data
        };

        var eventId = ++EVENT_ID;
        __guardFunc__(_this._emit, function (f) {
          return f('start', eventId, { method: method, path: path, data: data, options: options });
        });

        return _this._fetchImpl(path, fetchArgs).then(function (response) {
          var jqXHR = response;

          // Fire listeners when the request completes or fails
          if (_this._emit) {
            if (response.headers.get('X-RateLimit-Limit')) {
              var rateLimit = parseFloat(response.headers.get('X-RateLimit-Limit'));
              var rateLimitRemaining = parseFloat(response.headers.get('X-RateLimit-Remaining'));
              var rateLimitReset = parseFloat(response.headers.get('X-RateLimit-Reset')
              // Reset time is in seconds, not milliseconds
              // if rateLimitReset
              //   rateLimitReset = new Date(rateLimitReset * 1000)

              );var emitterRate = {
                remaining: rateLimitRemaining,
                limit: rateLimit,
                reset: rateLimitReset
              };

              if (response.headers.get('X-OAuth-Scopes')) {
                emitterRate.scopes = response.headers.get('X-OAuth-Scopes').split(', ');
              }
            }
            _this._emit('end', eventId, { method: method, path: path, data: data, options: options }, response.status, emitterRate);
          }

          // Return the result and Base64 encode it if `options.isBase64` flag is set.

          // Respond with the redirect URL (for archive links)
          // TODO: implement a `followRedirects` plugin
          if (response.status === 302) {
            return response.headers.get('Location');
          } else if (options.isBoolean && response.status === 204) {
            // If the request is a boolean yes/no question GitHub will indicate
            // via the HTTP Status of 204 (No Content) or 404 instead of a 200.
            return true;
          } else if (options.isBoolean && response.status === 404) {
            return false;
            // } else if (options.isBoolean) {
            //   throw new Error(`Octokat Bug? got a response to a boolean question that was not 204 or 404.  ${fetchArgs.method} ${path} Status: ${response.status}`)
          } else if (response.status >= 200 && response.status < 300 || response.status === 304 || response.status === 302 || response.status === 0) {
            // If it was a boolean question and the server responded with 204 ignore.
            var dataPromise = void 0;

            // If the status was 304 then let the cache handler pick it up. leave data blank
            if (response.status === 304) {
              dataPromise = Promise.resolve(null);
            } else {
              // TODO: use a blob if we are expecting a binary

              var contentType = response.headers.get('content-type') || '';

              // Use .indexOf instead of .startsWith because PhantomJS does not support .startsWith
              if (contentType.indexOf('application/json') === 0) {
                dataPromise = response.json();
              } else {
                // Other contentTypes:
                // - 'text/plain'
                // - 'application/octocat-stream'
                // - 'application/vnd.github.raw'
                dataPromise = response.text();
              }
            }

            return dataPromise.then(function (data) {
              acc = {
                clientOptions: _this._clientOptions,
                plugins: _this._plugins,
                data: data,
                options: options,
                jqXHR: jqXHR, // for cacheHandler
                status: response.status, // cacheHandler changes this
                request: acc, // Include the request data for plugins like cacheHandler
                requester: _this, // for Hypermedia to generate verb methods
                instance: _this._instance // for Hypermedia to be able to call `.fromUrl`
              };
              return _this._instance._parseWithContextPromise('', acc);
            });
          } else {
            return response.text().then(function (text) {
              return Promise.reject(new Error(text + ' ' + fetchArgs.method + ' ' + path + ' Status: ' + response.status));
            });
          }
        });
      });
    }
  }]);

  return Requester;
}();

function __guardFunc__(func, transform) {
  return typeof func === 'function' ? transform(func) : undefined;
}
//# sourceMappingURL=requester.js.map

/***/ }),
/* 27 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;


/***/ }),
/* 28 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;


/***/ }),
/* 29 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ }),
/* 30 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);


/***/ })
/******/ ]);
});
//# sourceMappingURL=octokat.js.map
function addLibraries(repo, parentDir, inputFileContent, srcFiles, cb) {
	let updatedFileContent = inputFileContent;
	let usingLibrariesFound = 0;
	findUsingLibraryFor(updatedFileContent, function(usingLibraries) {
		let usingLibrariesIterator = 0;
		for (let k = 0; k < usingLibraries.length; k++) {
			let usingLibraryName = usingLibraries[k];
			for (let j = 0; j < srcFiles.length; j++) {
				readSolFile(srcFiles[j], function(fileContent) {
					usingLibrariesIterator++;
					if (fileContent.indexOf("library " + usingLibraryName) > -1) {
						if (importedSrcFiles.indexOf(srcFiles[j]) === -1) {
							updatedFileContent = fileContent + updatedFileContent;
							srcFiles.splice(j,1);
							importedSrcFiles.push(srcFiles[j]);
							usingLibrariesFound++;
						}
						//break;
					}

					if (usingLibrariesIterator == usingLibraries.length * srcFiles.length) {
						if (usingLibraries.length > usingLibrariesFound) {
							if (parentDir.lastIndexOf("/") > -1) {
								parentDir = parentDir.substring(0, parentDir.lastIndexOf("/"));
								getSolFilesRecursively(repo, parentDir, function(srcFiles) {
									addLibraries(repo, parentDir, inputFileContent, srcFiles, cb);
								});
								return;
							}
						}

						cb(updatedFileContent);
					}
				});
			}
		}
	});
}
function findAllImportPaths(repo, dir, content, cb) {
	const subStr = "import ";
	let allImports = [];
	let regex = new RegExp(subStr,"gi");
	var importsCount = (content.match(regex) || []).length;
	let importsIterator = 0;
	while ( (result = regex.exec(content)) ) {
		let startImport = result.index;
		let endImport = startImport + content.substr(startImport).indexOf(";") + 1;
		let fullImportStatement = content.substring(startImport, endImport);
		let dependencyPath = fullImportStatement.split("\"").length > 1 ? fullImportStatement.split("\"")[1]: fullImportStatement.split("'")[1];
		let alias = fullImportStatement.split(" as ").length > 1?fullImportStatement.split(" as ")[1].split(";")[0]:null;
		let contractName;

		importObj = {
			"startIndex": startImport, 
			"endIndex": endImport, 
			"dependencyPath": dependencyPath, 
			"fullImportStatement": fullImportStatement,
			"alias": alias,
			"contractName": null
		};

		if (alias) {
			alias = alias.replace(/\s/g,'');
			var fileExists = fs.existsSync(dependencyPath, fs.F_OK);
			if (fileExists) {
				importsIterator++;
				let fileContent = fs.readFileSync(dependencyPath, "utf8");
				if (fileContent.indexOf("contract ") > -1) {
					importObj.contractName = fileContent.substring((fileContent.indexOf("contract ") + ("contract ").length), fileContent.indexOf("{")).replace(/\s/g,'');
				}
				allImports.push(importObj);
			} else {
				findFilebyName(repo, dir.substring(0, dir.lastIndexOf("/")), basename(dependencyPath), function(fileContent) {
					importsIterator++;
					if (fileContent.indexOf("contract ") > -1) {
						importObj.contractName = fileContent.substring((fileContent.indexOf("contract ") + ("contract ").length), fileContent.indexOf("{")).replace(/\s/g,'');
					}
					allImports.push(importObj);

					if (importsIterator == importsCount) cb(allImports);
				});
			}
		} else {
			importsIterator++;
			allImports.push(importObj);
		}
	}
	if (importsIterator == importsCount) cb(allImports);
}

function findFilebyName(repo, dir, fileName, cb) {
	getSolFilesRecursively(repo, dir, function(srcFiles) {		
		for (var j = 0; j < srcFiles.length; j++) {
			if (basename(srcFiles[j]) == fileName) {
				repo.contents(srcFiles[j]).read().then((fileContent) => {
					cb(fileContent);
					return;
				});
			}
		}

		dir = dir.substring(0, dir.lastIndexOf("/"));
		findFilebyName(repo, dir, fileName, cb);
	});
}

function findFilebyNameAndReplace(repo, dir, fileName, updatedFileContent, importStatement, cb) {
	getSolFilesRecursively(repo, dir, function(srcFiles) {
		var importIsReplacedBefore = false;
		for (var j = 0; j < srcFiles.length; j++) {
			if (basename(srcFiles[j]) == fileName) {
				if (importedSrcFiles.indexOf(srcFiles[j]) === -1) {
					repo.contents(srcFiles[j]).read().then((fileContent) => {
						updatedFileContent = updatedFileContent.replace(importStatement, fileContent);
						importedSrcFiles.push(srcFiles[j]);
						cb(updatedFileContent);
						return;
					});
				} else {
					importIsReplacedBefore = true;
				}
				break;
			}
		}

		if (importIsReplacedBefore) {
			updatedFileContent = updatedFileContent.replace(importStatement, "");
			cb(updatedFileContent);
		} else {
			if (dir.indexOf("/") > -1) {
				dir = dir.substring(0, dir.lastIndexOf("/"));
				findFilebyNameAndReplace(repo, dir, fileName, updatedFileContent, importStatement, cb);
			} else {
				updatedFileContent = updatedFileContent.replace(importStatement, "");
				cb(updatedFileContent);
			}
		}
	});
}
function findUsingLibraryFor(content, cb) {
	const subStr = "using ";
	let usingLibraries = [];
	let regex = new RegExp(subStr,"gi");
	while ( (result = regex.exec(content)) ) {
		let startUsingLibraryFor = result.index;
		let endUsingLibraryFor = startUsingLibraryFor + content.substr(startUsingLibraryFor).indexOf(";") + 1;
		let dependencyPath = content.substring(startUsingLibraryFor, endUsingLibraryFor);
		dependencyPath = dependencyPath.split(subStr)[1].split("for")[0].replace(/\s/g,'');
		usingLibraries.indexOf(dependencyPath) === -1 ? usingLibraries.push(dependencyPath) : console.log("This item already exists");
	}
	cb(usingLibraries);
}
function generateFlatSol(path, cb) {
	octo.repos('OpenZeppelin', 'zeppelin-solidity').fetch((err, repo) => {
	  if (err) console.error(err);
	  var dir = parentDir;
	  repo.contents(path).read().then((inputFileContent) => {
		  generateFlatFile(repo, dir, path, inputFileContent, function(outputFileContent) {
		  	cb(outputFileContent);
		  });
	  });
	});
}

function generateFlatFile(repo, dir, path, inputFileContent, cb) {
	var srcFiles = [];
	getSolFilesRecursively(repo, dir.substring(0, dir.lastIndexOf("/")), function(srcFiles) {
		allSrcFiles = srcFiles;
		getAllSolFilesCallBack(repo, inputFileContent, dir, path, srcFiles, cb);
	});
}

function getAllSolFilesCallBack(repo, inputFileContent, dir, path, srcFiles, cb) {
	addLibraries(repo, parentDir, inputFileContent, allSrcFiles, function(intermediateFileContent) {
		replaceAllImportsRecursively(repo, intermediateFileContent, dir, function(outputFileContent) {
			outputFileContent = removeDoubledSolidityVersion(outputFileContent);
			cb(outputFileContent);
		});
	});
}

function getSolFilesRecursively(repo, dir, cb) {
    var srcFiles = [];
    repo.contents(dir).read().then((contents) => {
        var folderIndices = [];
        for (let i = 0; i < contents.items.length; i++) {
            if (contents.items[i].path.endsWith(".sol")) srcFiles.push(contents.items[i].path);
            else folderIndices.push(i);
        }

        if (folderIndices.length == 0) cb(srcFiles);

        var folderIndicesIterator = 0;
        for (let i = 0; i < folderIndices.length; i++) {
            getSolFilesRecursively(repo, contents.items[folderIndices[i]].path, function(_srcFiles) {
                for (let i = 0; i < _srcFiles.length; i++) {
                    srcFiles.push(_srcFiles[i]);
                }
                folderIndicesIterator++;

                if (folderIndicesIterator == folderIndices.length) {
                    cb(srcFiles);
                }
            });
        }
    });
}
// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

var dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


var basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};
var octo = new Octokat({token: "f420c9fe858004b4e28f8d7565bc006b5c4e975d"});

var parentDir = 'contracts/crowdsale/';

$(function() {
	generateFlatSol('contracts/crowdsale/Crowdsale.sol', function(content) {
		$("#crowdsale_flat_src").text(content);
		console.log(unescape(content));
	});

	generateFlatSol('contracts/crowdsale/CappedCrowdsale.sol', function(content) {
		$("#capped_crowdsale_flat_src").text(content);
		console.log(unescape(content));
	});
});
function readSolFile(path, cb) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", path, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                cb(allText);
            }
        }
    }
    rawFile.send(null);
}
function removeDoubledSolidityVersion(content) {
	const subStr = "pragma solidity";
	//1st pragma solidity declaration
	let firstIndex = content.indexOf(subStr);
	let lastIndex = firstIndex + content.substr(firstIndex).indexOf(";") + 1;
	let contentPart = content.substr(lastIndex);
	let contentFiltered = contentPart;
	//remove other pragma solidity declarations
	let regex = new RegExp(subStr,"gi");
	while ( (result = regex.exec(contentPart)) ) {
		let start = result.index;
		let end = start + contentPart.substr(start).indexOf(";") + 1;
		if (start != firstIndex) contentFiltered = contentFiltered.replace(contentPart.substring(start, end), "");
	}
	let finalContent = content.substr(0, lastIndex) + contentFiltered;
	
	return removeTabs(finalContent);
}
function removeTabs(content) {
	content = content.replace(/[\r\n]+/g, '\n'); //removes tabs
	return content;
}
function replaceAllImportsInCurrentLayer(repo, i, importObjs, updatedFileContent, dir, cb) {
	if (i < importObjs.length) {
		var importObj = importObjs[i];

		//replace contracts aliases
		if (importObj.contractName) {
			updatedFileContent = updatedFileContent.replace(importObj.alias + ".", importObj.contractName + ".");
		}
		
		importObj = updateImportObjectLocationInTarget(importObj, updatedFileContent);
		var importStatement = updatedFileContent.substring(importObj.startIndex, importObj.endIndex);

		octo.repos('OpenZeppelin', 'zeppelin-solidity').fetch((err, repo) => {
			repo.contents(dir + importObj.dependencyPath).read().then((importedFileContent) => {        // `.fetch` is used for getting JSON
				replaceRelativeImportPaths(repo, importedFileContent, dirname(importObj.dependencyPath) + "/", function(importedFileContentUpdated) {
					if (importedSrcFiles.indexOf(basename(dir + importObj.dependencyPath)) === -1) {
						importedSrcFiles.push(basename(dir + importObj.dependencyPath));
						updatedFileContent = updatedFileContent.replace(importStatement, importedFileContentUpdated);
					}
					else updatedFileContent = updatedFileContent.replace(importStatement, "");

					i++;
					replaceAllImportsInCurrentLayer(repo, i, importObjs, updatedFileContent, dir, cb);
				});
			}).catch((err) => {
				console.log("!!!" + importObj.dependencyPath + " SOURCE FILE NOT FOUND. TRY TO FIND IT RECURSIVELY!!!");
				findFilebyNameAndReplace(repo, dir.substring(0, dir.lastIndexOf("/")), basename(importObj.dependencyPath), updatedFileContent, importStatement, function(_updatedFileContent) {
					i++;
					replaceAllImportsInCurrentLayer(repo, i, importObjs, _updatedFileContent, dir, cb);
				});
			});
		});
	} else cb(updatedFileContent);
}

function replaceAllImportsRecursively(repo, fileContent, dir, cb) {
	let updatedFileContent = fileContent;
	findAllImportPaths(repo, dir, updatedFileContent, function(_importObjs) {
		if (!_importObjs) return cb(updatedFileContent);
		if (_importObjs.length == 0) return cb(updatedFileContent);

		replaceAllImportsInCurrentLayer(repo, 0, _importObjs, updatedFileContent, dir, function(_updatedFileContent) {
			replaceAllImportsRecursively(repo, _updatedFileContent, dir, cb);
		});
	});
};

function replaceRelativeImportPaths(repo, fileContent, curDir, cb) {
	let updatedFileContent = fileContent;
	findAllImportPaths(repo, curDir, fileContent, function(importObjs) {
		if (!importObjs) return cb(updatedFileContent);
		if (importObjs.length == 0) return cb(updatedFileContent);

		for (let j = 0; j < importObjs.length; j++) {
			let importObj = importObjs[j];

			importObj = updateImportObjectLocationInTarget(importObj, updatedFileContent);
			let importStatement = updatedFileContent.substring(importObj.startIndex, importObj.endIndex);
			
			let newPath;
			if (importObj.dependencyPath.indexOf("../") == 0) {
				newPath = curDir + importObj.dependencyPath;
			}
			else if (importObj.dependencyPath.indexOf("./") == 0) {
				newPath = curDir + importObj.dependencyPath;
			}
			else {
				newPath = importObj.dependencyPath;
			}
			let importStatementNew = importStatement.replace(importObj.dependencyPath, newPath);
			updatedFileContent = updatedFileContent.replace(importStatement, importStatementNew);
		}
		cb(updatedFileContent);
	});
}
function updateImportObjectLocationInTarget(importObj, content) {
	let startIndexNew = content.indexOf(importObj.fullImportStatement);
	let endIndexNew = startIndexNew - importObj.startIndex + importObj.endIndex;
	importObj.startIndex = startIndexNew;
	importObj.endIndex = endIndexNew;
	return importObj;
}

var allSrcFiles = [];
var importedSrcFiles = [];
