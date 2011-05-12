// ==UserScript==
// @match http://twitter.com/*
// @match https://twitter.com/*
// ==/UserScript==

var Settings = function () {
    this.autoshow = localStorage['muyou.autoshow'] != 'false';
    this.filters = [];

    var filters = localStorage['muyou.filters'];
    if (filters) this.filters = eval(filters);
};
Settings.prototype = {
    _join: function (array) {
        var aggregate = '';
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            if (i != 0) aggregate += ',';
            aggregate += '"' + item.replace('"', '\\"') + '"';
        }
        return aggregate;
    },
    set: function (key, val) {
        localStorage['muyou.' + key] = val.toString();
        this[key] = val;
    },
    setFilters: function (filters) {
        this.filters = filters;

        var serializedFilters = '[';
        for (var i = 0; i < filters.length; i++) {
            var filter = filters[i];
            serializedFilters += '{"nick":"' + filter.nick + '","words":[' + this._join(filter.words) + ']}';
        }
        serializedFilters += ']';

        localStorage['muyou.filters'] = serializedFilters;
    }
};

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

var filter = function (element) {
    //'stream-item'
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

    filter(event.srcElement);
};

// init global nav panel settings
var showSettings = function () {

};

var globalNav = document.querySelectorAll('#global-nav ul')[0];

var settingsLink = document.createElement('A');
settingsLink.setAttribute('href', '#');
settingsLink.innerText = 'Settings';
settingsLink.onclick = showSettings;

var settingsItem = document.createElement('LI');
settingsItem.className = 'global-nav-settings';
settingsItem.appendChild(settingsLink);

globalNav.appendChild(settingsItem);
// end init

document.addEventListener("DOMNodeInserted", onNodeInserted);

