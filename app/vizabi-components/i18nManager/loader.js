define([
        'd3',   // using d3 because we use d3 everywhere else!
        'paths'
    ],
    function(d3, paths) {
        'use strict';

        function loadFile(lang, id, callback, p) {
            if (p.length) {
                var path = p[0].url + lang + '/' + id + '.json';
                d3.json(path, function(error, json) {
                    if (error) {
                        if (p.length > 1) {
                            loadFile(lang, id, callback, p.slice(1, p.length));
                        }
                        
                        return;
                    }

                    if (typeof callback === 'function') {
                        callback(json);
                    }
                });
            }

            return;
        }

        function load(lang, id, callback) {
            loadFile(lang, id, callback, paths);
        }

        return {
            load: load
        };
    }
);
