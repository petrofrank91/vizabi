define([
        'jed',
        'i18n-manager/loader'
    ],
    function(Jed, loader) {
        'use strict';

        var i18n = function() {
            this.data = { 'dev': { "" : {} } }
            this.domain = 'dev';

            this.translator = new Jed({
                domain: this.domain,
                locale_data: this.data,
                missing_key_callback: function(key) {
                    return key;
                }
            });
        };

        i18n.prototype = {
            translate: function() {
                var args = Array.prototype.slice.call(arguments);
                if (args.length === 2) { // singular
                    return this.translator.translate(args[1])
                        .onDomain(this.domain)
                        .withContext(args[0])
                        .fetch();
                } else if (args.length >= 4) { // plural form
                    return this.translator.translate(args[1])
                        .onDomain(this.domain)
                        .withContext(args[0])
                        .ifPlural(args[3], args[2])
                        .fetch(args.slice(4, args.length));
                }
            },

            setDomain: function(lc) {
                this.domain = lc;
            },

            load: function(lc, id, callback) {
                var context = this;
                loader.load(lc, id, function(d) {
                    context.data[lc] = d;
                    if (typeof callback === 'function') {
                        callback();
                    }
                });
            }
        };

        return i18n;
    }
);
