define([
        'bubble-map/components/components'
    ],
    function(components) {
        'use strict';

        var self;

        function init(context) {
            self = context;
            bindAll();
        }

        function bindTimeslider() {
            var timeslider = components.timeslider;
            var bubbles = components.bubbles;

            var action = function() {
                self.render();
            };

            timeslider.onplay(action);
            timeslider.onpause(action);
            timeslider.onmove(action);
        }

        function bindAll() {
            bindTimeslider();
        }

        return {
            init: init,
            all: bindAll,
            timeslider: bindTimeslider
        };
    }
);
