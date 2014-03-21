define([
        'bubble-map/components/components',
        'jquery',
        'touchSwipe'
    ],
    function(components, $) {
        'use strict';

        var _self;
        var state;

        function init(context, s) {
            _self = context;
            state = s;

            listenState();
            listenLanguage();
            listenMap();
            listenData();
            
            bindTimeslider();
            bindTouchTimeslider();
        }

        function listenState() {
            _self.events.bind('changed:state', function(s) {
                _self.setState(s);
                components.timeslider.update();
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

        function bindTouchTimeslider() {
            var wrapper = components.wrapper;
            var wrapperJq = $(wrapper.node());
            var width = wrapperJq.width();

            var speed = 0;

            var lastMovement = {
                distance: 0,
                duration: 0,
                direction: 'none'
            }

            wrapperJq.swipe({
                threshold: 1,

                fingers: 'all',

                excludedElements: $.fn.swipe.defaults.excludedElements +
                    ", .timeslider-1",

                //Generic swipe handler for all directions
                swipeStatus: function(event, phase, direction, distance, duration, fingers) {
                    if (lastMovement.distance > distance) {
                        if (direction === 'right') {
                            direction = 'left';
                        } else if (direction === 'left') {
                            direction = 'right';
                        }
                    } else if (lastMovement.distance === distance) {
                        direction = lastMovement.direction;
                    }

                    speed = distance / (duration - lastMovement.duration);

                    if (phase === 'move') {
                        var change = distance * speed / 200;

                        // TODO: Analize if it is worthy to swap up/down to the last direction used
                        if (direction === 'right') {
                            var new_year = state.year + change;

                            if (new_year > 2100) {
                                new_year = 2100;
                            }

                            for (var x = state.year; x <= new_year; x++) {
                                _self.events.trigger('changed:state', { year: x });
                            }
                        }
                        if (direction === 'left') {
                            var new_year = state.year - change;
                            
                            if (new_year < 1800) {
                                new_year = 1800;
                            }
                            
                            for (var x = state.year; x >= new_year; x--) {
                                _self.events.trigger('changed:state', { year: x });
                            }
                        }
                    } else if (phase === 'end') {
                        var speedReduction = setInterval(function() {
                            var friction = 0.001;
                            speed -= Math.sqrt(friction * 15);

                            if (speed <= 0) {
                                clearInterval(speedReduction);
                            }
                        }, 200);
                    }

                    lastMovement.distance = distance;
                    lastMovement.duration = duration;
                    lastMovement.direction = direction;
                }
            });
        }

        return {
            init: init,
            timeslider: bindTimeslider
        };
    }
);
