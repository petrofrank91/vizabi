define([
        'jed',
        'loader'
    ],
    function(Jed, loader) {
        'use strict';

        var domain = '';
        var localeData = {};

        var translator = new Jed({
            domain: domain,
            locale_data: localeData
        });

        function i18n() {
            var args = Array.prototype.slice.call(arguments);

            if (args.length === 2) { // singular
                return translator.translate(args[1])
                    .onDomain(domain)
                    .withContext(args[0]);
            } else if (args.length >= 4) { // plural form
                return translator.translate(args[1])
                    .onDomain(domain)
                    .withContext(args[0])
                    .ifPlural(args[3], args[2])
                    .fetch(args.slice(4, args.length));
            }
        }

        i18n.setDomain = function(lc) {
            domain = lc;
        };

        i18n.loadLanguage = function(lc, id, callback) {
            loader.load(lc, id, function(d) {
                localeData[lc] = d;
                if (typeof callback === 'function') {
                    callback();
                }
            });
        };

        return i18n;
    }
);
