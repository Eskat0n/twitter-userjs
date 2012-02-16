// ==UserScript==
// @match http://twitter.com/*
// @match https://twitter.com/*
// @match http://api.twitter.com/*
// @match https://api.twitter.com/*
// ==/UserScript==

// mutabor v0.1
window.mutabor=(function(){var b=[];var a=function(g,d){if(!g.querySelector){return false}var h=g.cloneNode(true);var e=document.createElement("div");var f=document.createElement("div");f.id="temp"+new Date().getTime()+Math.round(Math.random()*1000);e.appendChild(f);f.appendChild(h);return !!e.querySelector("#"+f.id+" > "+d)};var c=function(f,d,g){var e=function(h){var j=h.srcElement||h.target;if(d){var i=taret.querySelector?j.querySelector(d):null;if(a(j,d)){g(j,h)}else{if(i){g(i,h)}}}else{g(j,h)}};document.addEventListener(f,e);b.push({type:f,handler:e})};return{insert:function(d,e){if(!e){e=d;d=null}c("DOMNodeInserted",d,function(h,g){var f=g.relatedNode;if(e(h,g)===false){if(f){f.removeChild(h)}}})},remove:function(d,e){if(!e){e=d;d=null}c("DOMNodeRemoved",d,function(g,f){e(g,f)})},attribute:function(d,e){throw"DOMAttrModified is not supported in WebKit so this interceptor is not implemented"},text:function(d,e){throw"DOMCharacterDataModifiedis not supported in WebKit so this interceptor is not implemented"},on:function(d){var e=Array.prototype.slice.call(arguments,1);this[d].apply(this,e)},reset:function(){b.forEach(function(d){document.removeEventListener(d.type,d.handler)});b=[]},toString:function(){return"mutabor version 0.1"}}})();

// IIFE hack to avoid errors for return statement outside of the function
(function () {

    mutabor.insert('.dashboard', function (element) {
        element.style.float = 'right';
    });

    mutabor.insert('.content-main', function (element) {
        element.style.float = 'left';
    });

})();