define([
        'd3',
        'jquery',
        'income-mountain/components/components',
        'touchSwipe'
    ],
    function (d3, $, components) {
        'use strict';

        var state;

        var pickerButton;
        var labels;
        var mountains;
        var timeslider;

        var drawFn;

        var highlighted = [];

        function init(s, draw) {
            state = s;
            pickerButton = components.get().pickerButton.getGroup();
            labels = components.get().labels.getGroup();
            mountains = components.get().mountains.getGroup();
            timeslider = components.get().timeslider.getGroup();
            drawFn = draw;
        }

        function bindPickerButton() {
            pickerButton.on('click', function() {
                // open picker
                components.get().geoPicker.show();
            })
        }

        function deleteGeo(geo) {
            state.geo.splice(state.geo.indexOf(geo), 1);
            // raise event that a country was deleted instead of splice
        }

        function mouseoverHighlight(overGeo) {
            mountains.select('#' + overGeo).attr('class', 'mountains bold');
            labels.select('#' + overGeo).select('text')
                .attr('class', 'text bold');
            labels.select('#' + overGeo).select('g')
                .attr('class', 'delete bold');

            for (var i = 0; i < state.geo.length; i++) {
                var geo = state.geo[i];

                if (geo !== overGeo) {
                    var mountain = mountains.select('#' + geo);
                    var label = labels.select('#' + geo);

                    if (mountain.attr('class') === 'mountains bold') {
                        mountain.attr('class', 'mountains');
                        label.select('text').attr('class', 'text');
                        label.select('g').attr('class', 'delete');
                    } else {
                        mountain.attr('class', 'mountains shadow');
                        label.select('text').attr('class', 'text shadow');
                        label.select('g').attr('class', 'delete shadow');
                    }
                }
            }
        }

        function mouseoutHighlight() {
            highlights();
        }

        function fullHighlight(geo) {
            if (highlighted.indexOf(geo) === -1) {
                highlighted.push(geo);
            } else {
                highlighted.splice(highlighted.indexOf(geo), 1);
            }

            highlights();
        }

        function highlights() {
            if (!highlighted.length) {
                resetHighlights();
            } else {
                for (var i = 0; i < state.geo.length; i++) {
                    var geo = state.geo[i];
                    var label = labels.select('#' + geo);
                    var mountain = mountains.select('#' + geo);
                    
                    if (highlighted.indexOf(geo) !== -1) {
                        label.select('text').attr('class', 'text bold');
                        label.select('g').attr('class', 'delete bold');
                        mountain.attr('class', 'mountains bold');
                    } else {
                        label.select('text').attr('class', 'text shadow');
                        label.select('g').attr('class', 'delete shadow');
                        mountain.attr('class', 'mountains shadow');
                    }
                }
            }
        }

        function resetHighlights() {
            labels.selectAll('g').each(function() {
                d3.select(this).select('text').attr('class', 'text');
                d3.select(this).select('g').attr('class', 'delete');
            });

            mountains.selectAll('g').attr('class', 'mountains');
        }

        function bindLabels() {
            for (var i = 0; i < state.geo.length; i++) {
                var geo = state.geo[i];
                labels.select('#' + geo)
                    .each(function() {
                        (function(element, id) {
                            var label = d3.select(element);

                            label.select('.delete')
                                .on('click', function() {
                                    deleteGeo(id);
                                })
                                .on('mouseover', function() {
                                    mouseoverHighlight(id);
                                })
                                .on('mouseout', function() {
                                    mouseoutHighlight();
                                });

                            label.select('.text')
                                .on('click', function() {
                                    fullHighlight(id);
                                })
                                .on('mouseover', function() {
                                    mouseoverHighlight(id);
                                })
                                .on('mouseout', function() {
                                    mouseoutHighlight();
                                });
                        })(this, geo);
                    });
            }
        }

        function bindMountains() {
            for (var i = 0; i < state.geo.length; i++) {
                var geo = state.geo[i];

                mountains.select('#' + geo)
                    .each(function() {
                        (function(element, id) {
                            d3.select(element)
                                .on('click', function() {
                                    fullHighlight(id);
                                })
                                .on('mouseover', function() {
                                    mouseoverHighlight(id);
                                })
                                .on('mouseout', function() {
                                    mouseoutHighlight();
                                });
                        })(this, geo);
                    });
            }
        }

        function bindTimeslider() {
            var timeslider = components.get().timeslider;
            var mountains = components.get().mountains;
            var labels = components.get().labels;

            var action = function() {
                mountains.render();
                labels.render();
                all();
            };

            //timeslider.setRange?
            timeslider.onplay(action);
            timeslider.onpause(action);
            timeslider.onmove(action);
        }

        function bindTouchTimeslider() {
            var wrapper = components.get().wrapper;
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
                                state.year = x;
                                components.get().timeslider.update();
                                drawFn();
                            }
                        }
                        if (direction === 'left') {
                            var new_year = state.year - change;
                            
                            if (new_year < 1800) {
                                new_year = 1800;
                            }
                            
                            for (var x = state.year; x >= new_year; x--) {
                                state.year = x;
                                components.get().timeslider.update();
                                drawFn();
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

        function all() {
            bindPickerButton();
            bindLabels();
            bindMountains();
            bindTimeslider();
            bindTouchTimeslider();
            highlights();
        }

        return {
            init: init,
            all: all,
            labels: bindLabels,
            mountains: bindMountains,
            timeslider: bindTimeslider,
            touchTimeslider: bindTouchTimeslider
        };
    }
);