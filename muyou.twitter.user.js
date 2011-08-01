// ==UserScript==
// @match http://twitter.com/*
// @match https://twitter.com/*
// @match http://api.twitter.com/*
// @match https://api.twitter.com/*
// ==/UserScript==

// Redirect to api.twitter.com if on twitter.com since there are no other way to query Twitter API due to crossdomain policy

/*
 * Bootstrap
 */

var tw = {};
tw.__enable = true;

if (location.hostname == 'twitter.com') {
	location.href = '//api.twitter.com' + location.pathname;
	tw.__enable = false;
}

// Dissallow UserJS execution on receiver.html page
if (location.pathname == '/receiver.html')
	tw.__enable = false;

/*
 * Infrastructure code
 */

tw.__features = {};

tw.Feature = function (name, options) {
    this.name = name;
    this.__load = options.load;
    this.startup = options.startup;
    this.teardown = options.teardown;

    var isEnabled = localStorage['muyou.feature.' + name];
    if (isEnabled === undefined)
        this.isEnabled = true;
};
tw.Feature.prototype = {
    load: function () {
        if (!isEnabled)
            return;

        if (this.__load)
            this.__load();
        this.startup();
    },
    enable: function () {
        if (!isEnabled)
            return;

        isEnabled = true;
        this.startup();
    },
    disable: function () {
        if (!isEnabled)
            return;

        isEnabled = true;
        this.teardown();
    },
    get isEnabled () {
        var featureState = localStorage['muyou.feature.' + this.name];
        return featureState === 'enabled';
    },
    set isEnabled (value) {
        localStorage['muyou.feature.' + name] = value ? 'enabled' : 'disabled';
    }
};

tw.feature = function (name, options) {
    tw.__features[name] = new tw.Feature(name, options);
};

tw.loadFeatures = function () {
    for (var name in tw.__features)
        tw.__features[name].load();
};

/*
 * Filtering implementation
 */

tw.filter = function (type, selector) {

};

/*
 * Utility code
 */

/*
 * Actual UserJS code
 */

var get = function (url, callback) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.setRequestHeader('X-Phx', true);
	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == 200)
			callback.call(request, request.responseText);
	};
	request.send(null);
};
var getJson = function (url, callback) {
	get(url, function (data) {
		callback.call(this, eval(data));
	});
};

var initialized = false;

var toggleAutoshow = function () {
    if (settings.autoshow)
        this.innerText = 'Autoshow [OFF]';
    else
        this.innerText = 'Autoshow [ON]';

    settings.set('autoshow', !settings.autoshow);

    return false;
};

var initialize = function (tabsPanel, globalNav) {
    if (initialized) return;

    var autoshowLink = document.createElement('A');
    autoshowLink.className = 'tab-text';
    autoshowLink.setAttribute('href', '#');
    autoshowLink.innerText = settings.autoshow ? 'Autoshow [ON]' : 'Autoshow [OFF]';
    autoshowLink.onclick = toggleAutoshow;

    var autoshowItem = document.createElement('LI');
    autoshowItem.className = 'stream-tab autoshow';
    autoshowItem.appendChild(autoshowLink);

    tabsPanel.appendChild(autoshowItem);

    initialized = true;
};

var applyClick = function (element) {
    var event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

    return element.dispatchEvent(event);
};

var onTweetTextAreaKeydown = function (event) {
    var current = this.parentNode;
    while (current.tagName != 'DIV' || current.className != 'tweet-box')
        current = current.parentNode;

    var tweetButton = current.querySelector('a.tweet-button.button');

    if (event.ctrlKey && event.which == 13) {
        applyClick(tweetButton);

        event.srcElement.style.width = '482px';
        event.srcElement.style.height = '56px';
    }
};

var filter = function (element) {
    //'stream-item'
};

var messagesMenuItem = document.querySelector('#global-nav-messages a');
var messagesCount = document.createElement('SPAN');
messagesMenuItem.appendChild(messagesCount);

setInterval(function () {
	getJson('/1/direct_messages.json?include_entities=true', function (data) {
		messagesCount.innerHTML = '&nbsp;(' + data.length + ')';	
	});
}, 30*1000);

var onNodeInserted = function (event) {
    if (!initialized)
        if (event.srcElement.querySelectorAll) {
            var tabsPanel = event.srcElement.querySelector('ul.stream-tabs');

            if (tabsPanel)
                initialize(tabsPanel);
        }
    if (event.srcElement.querySelectorAll) {
        var textArea = event.srcElement.querySelector('textarea.twitter-anywhere-tweet-box-editor');

        if (textArea) {
            textArea.addEventListener('keydown', onTweetTextAreaKeydown);

            var tweet = localStorage['muyou.tweet'];
            if (tweet) {
                textArea.value = tweet;
                localStorage.removeItem('muyou.tweet');
            }
        }
    }

    if (event.srcElement && event.srcElement.tagName == 'TEXTAREA' && event.srcElement.className == 'twitter-anywhere-tweet-box-editor')
    	event.srcElement.addEventListener('keydown', onTweetTextAreaKeydown);

    if (settings.autoshow && event.srcElement.id && event.srcElement.id == 'new-tweets-bar')
        applyClick(event.srcElement);

    filter(event.srcElement);
};

var onPageUnloaded = function () {
    localStorage.removeItem('muyou.tweet');

    var textAreas = document.querySelectorAll('textarea.twitter-anywhere-tweet-box-editor');
    if (textAreas.length > 0)
        localStorage['muyou.tweet'] = '';

    for (var i = 0; i < textAreas.length; i++) {
        var value = textAreas[i].value;

        if (value && value !== '')
            localStorage['muyou.tweet'] += value;
    }
};

var showSettings = function () {

};

// init global nav panel settings
var globalNav = document.querySelector('#global-nav ul');

var settingsLink = document.createElement('A');
settingsLink.setAttribute('href', '#');
settingsLink.innerText = 'Settings';
settingsLink.onclick = showSettings;

var settingsItem = document.createElement('LI');
settingsItem.className = 'global-nav-settings';
settingsItem.appendChild(settingsLink);

globalNav.appendChild(settingsItem);
// end init

document.addEventListener('DOMNodeInserted', onNodeInserted);
window.addEventListener('unload', onPageUnloaded);

