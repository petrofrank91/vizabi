define([
        'bubble-map/components/components',
    ],
    function(components) {
        'use strict';

        var _self;

        function init(context) {
            _self = context;

            listenState();
            listenLanguage();
            listenMap();
            listenData();
            
            bindTimeslider();
        }

        function listenState() {
            _self.events.bind('changed:state', function(state) {
                _self.setState(state);
                _self.render();
            });
        }

        function listenLanguage() {
            _self.events.bind('changed:language', function(lang) {
                var header = components.header;
                header.setText(_self.i18n.translate('bubbleMap',
                    'Billions of people per region'));
            });
        }

        function listenMap() {
            _self.events.bind('loaded:map', function(data) {
                components.map.setMapData(data);
                components.map.draw();
                components.map.ready = true;
            });
        }

        function listenData() {
            _self.events.bind('loaded:data', function(indicator) {
                if (!components.map.ready) {
                    var action = function() {
                        _self.indicator = indicator;
                        _self.render();
                        _self.events.unbind('loaded:map', action);
                    };

                    _self.events.bind('loaded:map', action);
                }
            });
        }

        function bindTimeslider() {
            var timeslider = components.timeslider;
            var bubbles = components.bubbles;

            var action = function(year) {
                _self.events.trigger('changed:state', { year: year });
            };

            timeslider.onplay(action);
            timeslider.onpause(action);
            timeslider.onmove(action);
        }

        return {
            init: init,
            timeslider: bindTimeslider
        };
    }
);
