define([
        'zepto',
        'sprintf',
        'i18n-manager/paths'
    ],
    function($, sprintf, paths) {
        'use strict';

        function loadFile(o, p, callback) {
            $.ajax({
                type: 'GET',
                url: sprintf(p[0].url, o),
                dataType: 'json',
                success: function() {
                    // Raise event (i18n loaded)
                    $(document.body).trigger('i18n:success');
                    // Execute callback
                    if (typeof callback === 'function') {
                        callback(json);
                    }
                },
                error: function() {
                    if (p.length > 1) {
                        loadFile(o, p.slice(1, p.length), callback);
                    }
                }
            });
        }

        function load(l, f, callback) {
            loadFile({ lang: l, filename: f }, paths, callback);
        }

        return {
            load: load
        };
    }
);
