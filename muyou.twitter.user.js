// ==UserScript==
// @match http://twitter.com/*
// @match https://twitter.com/*
// @match http://api.twitter.com/*
// @match https://api.twitter.com/*
// ==/UserScript==

// mutabor v0.1
window.mutabor=(function(){var c=[];var a=function(h,e){if(!h.querySelector){return false}var i=h.cloneNode(true);var f=document.createElement("div");var g=document.createElement("div");g.id="temp"+new Date().getTime()+Math.round(Math.random()*1000);f.appendChild(g);g.appendChild(i);return !!f.querySelector("#"+g.id+" > "+e)};var b=function(i,h){var e={};for(var g in i){if(i.hasOwnProperty(g)){e[g]=i[g]}}for(var f in h){if(h.hasOwnProperty(f)){e[f]=h[f]}}return e};var d=function(g,e,h){var f=function(i){var k=i.srcElement||i.target;if(e){var j=k.querySelector?k.querySelector(e):null;if(a(k,e)){h(k,i)}else{if(j){h(j,i)}}}else{h(k,i)}};document.addEventListener(g,f);c.push({type:g,handler:f});return b(window.mutabor,{now:function(){Array.prototype.slice.apply(document.querySelectorAll(e)).forEach(h);return window.mutabor}})};return{insert:function(e,f){if(!f){f=e;e=null}return d("DOMNodeInserted",e,function(i,h){var g=h.relatedNode;if(f(i,h)===false){if(g){g.removeChild(i)}}})},remove:function(e,f){if(!f){f=e;e=null}return d("DOMNodeRemoved",e,f)},attribute:function(){throw"DOMAttrModified is not supported in WebKit so this interceptor is not implemented"},text:function(){throw"DOMCharacterDataModifiedis not supported in WebKit so this interceptor is not implemented"},on:function(e){var f=Array.prototype.slice.call(arguments,1);this[e].apply(this,f)},reset:function(){c.forEach(function(e){document.removeEventListener(e.type,e.handler)});c=[]},toString:function(){return"mutabor version 0.1"}}})();

// IIFE hack to avoid errors for return statement outside of the function
(function () {

    mutabor.insert('.dashboard', function (element) {
        element.style.float = 'right';
    }).now();

    mutabor.insert('.content-main', function (element) {
        element.style.float = 'left';
    }).now();

})();