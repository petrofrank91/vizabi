define([
        'd3'
    ],
    function() {
        'use strict';

        var text = function() {
            this.g = undefined;
            this.h = undefined;
            this.text = undefined;
            this.clazz = undefined;
        };

        text.prototype = {
            init: function(svg, text, c, y) {
                this.g = svg.append('g');
                this.h = this.g.append('text').attr('class', c).text(text);
                this.text = text;
                this.clazz = c;
                this.setY(y);
            },

            setText: function(t) {
                this.h.text(t);
                this.text = t;
            },

            setY: function(y) {
                this.h.attr('y', y);
            },

            getGroup: function() {
                return this.g;
            },
        };

        return text;
    }
);
