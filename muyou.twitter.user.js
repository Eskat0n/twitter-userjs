// ==UserScript==
// @match http://twitter.com/*
// @match https://twitter.com/*
// ==/UserScript==

// mutabor v0.1
window.mutabor=(function(){var c=[];var a=function(h,e){if(!h.querySelector){return false}var i=h.cloneNode(true);var f=document.createElement("div");var g=document.createElement("div");g.id="temp"+new Date().getTime()+Math.round(Math.random()*1000);f.appendChild(g);g.appendChild(i);return !!f.querySelector("#"+g.id+" > "+e)};var b=function(i,h){var e={};for(var g in i){if(i.hasOwnProperty(g)){e[g]=i[g]}}for(var f in h){if(h.hasOwnProperty(f)){e[f]=h[f]}}return e};var d=function(g,e,h){var f=function(i){var k=i.srcElement||i.target;if(e){var j=k.querySelector?k.querySelector(e):null;if(a(k,e)){h(k,i)}else{if(j){h(j,i)}}}else{h(k,i)}};document.addEventListener(g,f);c.push({type:g,handler:f});return b(window.mutabor,{now:function(){Array.prototype.slice.apply(document.querySelectorAll(e)).forEach(h);return window.mutabor}})};return{insert:function(e,f){if(!f){f=e;e=null}return d("DOMNodeInserted",e,function(i,h){var g=h.relatedNode;if(f(i,h)===false){if(g){g.removeChild(i)}}})},remove:function(e,f){if(!f){f=e;e=null}return d("DOMNodeRemoved",e,f)},attribute:function(){throw"DOMAttrModified is not supported in WebKit so this interceptor is not implemented"},text:function(){throw"DOMCharacterDataModifiedis not supported in WebKit so this interceptor is not implemented"},on:function(e){var f=Array.prototype.slice.call(arguments,1);this[e].apply(this,f)},reset:function(){c.forEach(function(e){document.removeEventListener(e.type,e.handler)});c=[]},toString:function(){return"mutabor version 0.1"}}})();

// IIFE hack to avoid errors for return statement outside of the function
(function () {

    var util = {
        applyClick: function (element) {
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

            return element.dispatchEvent(event);
        },

        applyCss: function (element, styles) {
            for (var selector in styles)
                if (styles.hasOwnProperty(selector))
                    util.toArray(element.querySelectorAll(selector)).forEach(function (e) {
                        for (var prop in styles[selector])
                            if (styles[selector].hasOwnProperty(prop))
                                e.styles[prop] = styles[selector][prop];
                    });
        },

        toArray: function (value) {
            return Array.prototype.slice.apply(value);
        }
    };

    var ui = {
        menu: {
            createItem: function (text, anchor, callback) {
                var menuItem = document.createElement('LI');
                var menuLink = document.createElement('A');

                menuLink.setAttribute('href', '#');
                menuLink.innerHTML = text;
                menuLink.addEventListener('click', function (event) {
                    callback.call(event.srcElement, event);
                    return false;
                });

                menuItem.appendChild(menuLink);
                return anchor.parentNode.insertBefore(menuItem, anchor);
            },

            createDelimeter: function (anchor) {
                var delimeter = document.createElement('LI');
                delimeter.className = 'divider';

                return anchor.parentNode.insertBefore(delimeter, anchor);
            }
        },

        createPopup: function (params) {
            var dialogWrapper = document.querySelector('.twttr-dialog-wrapper');

            var content;

            dialogWrapper.style.display = 'block';
            dialogWrapper.innerHTML =
                '<div class="twttr-dialog-container" style="top: 0px; width: ' + (params.width || 500) + 'px; height: auto; visibility: visible;">' +
                    '<div class="twttr-dialog">' +
                        '<div class="twttr-dialog-header js-twttr-dialog-draggable">' +
                            '<h3>' + params.title + '</h3> <div class="twttr-dialog-close"><b>×</b></div>' +
                        '</div>' +
                        '<div class="twttr-dialog-inside">' + content + '</div>' +
                    '</div>' +
                '</div>';

            dialogWrapper.querySelector('.twttr-dialog-close').addEventListener('click', function () {
                dialogWrapper.innerHTML = '';
                dialogWrapper.style.display = 'none';

                return false;
            });
        }
    };

    var settings = {
        _key: 'muyou.userjs.settings',
        _data: {},

        save: function () {
            localStorage[this._key] = JSON.stringify(this._data);
        },

        restore: function () {
            this._data = JSON.parse(localStorage[this._key] || '{}');
        },

        get autoshow() {
            return this._data.autoshow;
        },

        set autoshow(value) {
            this._data.autoshow = !!value;
            this.save();
        }
    };

    settings.restore();

    // Column swapping
    (function () {

        mutabor.insert('.dashboard', function (element) {
            element.style.float = 'right';
        }).now();

        mutabor.insert('.content-main', function (element) {
            element.style.float = 'left';
        }).now();

    })();

    // Tweets autoshow
    (function () {

        mutabor.insert('div.new-tweets-bar', function (element) {
            util.applyClick(element);
        });

    })();

    // Create menu
    (function () {

        var lastMenuDelimeter = util.toArray(document.querySelectorAll('li.me ul.dropdown-menu li.divider')).pop();

        ui.menu.createDelimeter(lastMenuDelimeter);
        ui.menu.createItem('UserJs Settings', lastMenuDelimeter, function () {
            ui.createPopup({
                title: 'UserJs Settings'
            });
        });

    })();

})();