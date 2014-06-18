define([
        'd3'
    ],
    function(d3) {
        var cache = {
            definitions: {
                indicators: {},
                categories: {}
            },
            stats: {}
        };

        var dataManager = {};
        dataManager.cache = cache;
        var waffleUrl = CONFIG.OVEN_URL;

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

        dataManager.getIndicator = function(indicator, lang, callback) {
            var url = waffleUrl + lang + '/indicator/' + indicator;
            d3.json(url, function(json) {
                cache.definitions.indicators[indicator] = json;
                if (typeof callback === 'function') {
                    callback(json);
                }
            });
        }

        dataManager.getCategory = function(category, lang, callback) {
            var url = waffleUrl + lang + '/category/' + category;
            d3.json(url, function(json) {
                cache.definitions.categories[category] = json;
                if (typeof callback === 'function') {
                    callback(json);
                }
            });
        }

        dataManager.getStats = function(indicator, callback) {
            var url = waffleUrl + 'en/indicator/' + indicator + '/stats';
            d3.json(url, function(json) {
                cache.stats[indicator] = json;
                if (typeof callback === 'function') {
                    callback(json);
                }
            });
        }

        dataManager.retrieve = function(indicator, item, year) {
            if (cache.stats[indicator] && cache.stats[indicator][item.toLowerCase()]
                && cache.stats[indicator][item.toLowerCase()][year]) {
                return cache.stats[indicator][item.toLowerCase()][year].v;
            } else {
                return undefined;
            }
        }

        return dataManager;
    }
)