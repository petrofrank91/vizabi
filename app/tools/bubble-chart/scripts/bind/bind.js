define([
        'jquery',
        'bubble-chart-components',
        'touchSwipe'
    ],
    function($, components) {
        var state = { year: undefined };

        // Needed for redrawing
        var _model;
        var _chartScales;
        var _availableFrame;
        var __vizChart;
        var __vizBubble;
        var _modelBindCallback;

        var init = function(_vizBubble, _vizChart, model, chartScales, availableFrame, modelBindCallback) {
            state.year = model.get('year');
            _model = model;
            _chartScales = chartScales;
            _availableFrame = availableFrame;
            __vizChart = _vizChart;
            __vizBubble = _vizBubble;
            _modelBindCallback = modelBindCallback;
        }

        var updateBubbleChart = function() {
            _model.set(state, function() {
                __vizChart.updateLayout(_model);
                __vizBubble.update(_model, _chartScales, _availableFrame);
                if (_modelBindCallback) {
                    _modelBindCallback(_model.getAttributes());
                }
                components.get().bubblesContainer.render();
            });
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

            state = _model.getAttributes();;

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
                                state = { year: x };
                                updateBubbleChart();
                                components.get().yearLabel.update();
                            }
                        }
                        if (direction === 'left') {
                            var new_year = state.year - change;
                            
                            if (new_year < 1800) {
                                new_year = 1800;
                            }
                            
                            for (var x = state.year; x >= new_year; x--) {
                                state = { year: x };
                                updateBubbleChart();
                                components.get().yearLabel.update();
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
            bindTouchTimeslider();
        }

        return {
            init: init,
            updateBubbleChart: updateBubbleChart,
            all: all
        }
    }
);
