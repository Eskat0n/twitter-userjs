// ==UserScript==
// @match http://twitter.com/*
// @match https://twitter.com/*
// ==/UserScript==

var Settings = function () {
    this.autoshow = localStorage['muyou.autoshow'] != 'false';
};
Settings.prototype = {
    set: function (key, val) {
        localStorage['muyou.' + key] = val.toString();
        this[key] = val;
    }
}

var settings = new Settings();
var initialized = false;

var toggleAutoshow = function () {
    if (settings.autoshow)
        this.innerText = 'Autoshow [OFF]';
    else
        this.innerText = 'Autoshow [ON]';

    settings.set('autoshow', !settings.autoshow);

    return false;
};

var initialize = function (tabsPanel) {
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

var onNodeInserted = function (event) {
    if (!initialized)
        if (event.srcElement.querySelectorAll) {
            var tabsPanel = event.srcElement.querySelectorAll('ul.stream-tabs')[0];
            if (tabsPanel)
                initialize(tabsPanel);
        }

    if (!settings.autoshow) return;

    if (event.srcElement.id && event.srcElement.id == 'new-tweets-bar')
        applyClick(event.srcElement);
};

document.addEventListener("DOMNodeInserted", onNodeInserted);

