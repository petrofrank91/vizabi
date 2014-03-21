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
            _self.events.bind('changed:state', function(state) {
                _self.setState(state);
                _self.render();
                console.log(state.year);
                components.timeslider.update();
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

            console.log("trying to bind time swiper");

            var wrapper = components.wrapper;
            var wrapperJq = $(wrapper.node());
            var width = wrapperJq.width();

            var speedPersis;
           
            console.log(components.wrapper);
            console.log($(wrapper.node()));

            wrapperJq.swipe( {
                //Generic swipe handler for all directions
            swipeStatus:function(event, phase, direction, distance, duration, fingers) {

                var speed = distance / duration;
                console.log(speed);

                //var interval;
                if (phase=="move"){
                    
                    //event.stopPropagation()

                    var step = 12 / speed;
                    var change = distance/step;

                    //var change = distance / max_width;
                    if(direction === "right") {

                        var new_year = state.year + change;
                        if(new_year > 2100) new_year = 2100;

                        _self.events.trigger('changed:state', { year: new_year });

                        // var newpos = init + change;
                        // circle.setPos(newpos);
                        // circle.update();
                    }
                    if(direction === "left") {
                        var new_year = state.year - change;
                        if(new_year < 1800) new_year = 1800;

                        _self.events.trigger('changed:state', { year: new_year });
                        // var newpos = init - change;
                        // circle.setPos(newpos);
                        // circle.update();
                    }
                }
                else if (phase=="end") {

                    console.log(speed);
                    speedPersis = speed;

                    var i = setInterval(function() {

                        var friction = 0.1;
                        speedPersis = speedPersis - friction;
                        console.log(speedPersis);

                        if(speedPersis <= 0) {
                            clearInterval(i);
                        }

                    }, 200);

                }

            },
            tap: function(event) {
               // d3.select(event.target).click();
            },
            threshold:10,
            fingers:'all'
          });
        }

        return {
            init: init,
            timeslider: bindTimeslider
        };
    }
);
