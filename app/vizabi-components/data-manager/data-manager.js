define([
        'd3'
    ],
    function(d3) {
        var dataManager = {};
        var waffleUrl = 'http://oven.gapminder.org:9990/waffle/lang/';

        dataManager.getIMShapes = function(o, callback) {
            var url = waffleUrl + 'en/shapes/income-mountain/' +
                o.item + '/' + o.start + '/' + o.end;

            d3.json(url, function(json) {
                if (typeof callback === 'function') {
                    callback(json);
                }
            });
        }

        dataManager.getIMRaw = function(o, callback) {
            var url = waffleUrl + 'en/raw/income-mountain/' +
                o.item + '/' + o.start + '/' + o.end;

            d3.json(url, function(json) {
                if (typeof callback === 'function') {
                    callback(json);
                }
            });
        }

        dataManager.getThing = function(thing, lang, callback) {
            var url = waffleUrl + lang + '/thing/' + thing;
            d3.json(url, function(json) {
                if (typeof callback === 'function') {
                    callback(json);
                }
            });
        }

        dataManager.getCategoryThings = function(category, lang, callback) {
            var url = waffleUrl + lang + '/category/' + category + '/things';
            d3.json(url, function(json) {
                if (typeof callback === 'function') {
                    callback(json);
                }
            });
        }

        dataManager.getAvailability = function(toolName, lang, callback) {
            if (toolName === 'income-mountain') {
                var url = waffleUrl + lang + '/income-mountain/available';
                d3.json(url, function(json) {
                    if (typeof callback === 'function') {
                        callback(json);
                    }
                });
            }
        }

        return dataManager;
    }
)