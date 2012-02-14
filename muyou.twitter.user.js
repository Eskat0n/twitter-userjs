// ==UserScript==
// @match http://twitter.com/*
// @match https://twitter.com/*
// @match http://api.twitter.com/*
// @match https://api.twitter.com/*
// ==/UserScript==

// IIFE hack to avoid errors for return statement outside of the function
(function () {

	document.querySelector('.dashboard').style.float = 'right';
	document.querySelector('.content-main').style.float = 'left';

})();