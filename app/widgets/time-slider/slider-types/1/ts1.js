define([
        'd3',
        'widgets/time-slider/slider-types/1/viz'
    ],
    function(d3, viz) {
        'use strict';

        var properties = {
            interval: 10,
            precision: 5,
            lapse: 0.1
        };

        var range = {
            start: 1800,
            end: 2100
        };

        var isDragging = false;

        var moveDisplacement = 0;
        var moveCallback;
        var timeout;
        var state;

        var drag = d3.behavior.drag()
            .origin(Object)
            .on('dragstart', ondrag)
            .on('drag', ondrag)
            .on('dragend', ondrag);

        var isPlaying = false;

        var timeslider = function() {
            this.type = 'timeslider-1';
        };

        timeslider.prototype = {
            init: function(svg, s) {
                state = s;
                initViz(svg);
                setTimelineRange();
                bindDragEvent();
                slide();
            },

            setRange: function(s, e) {
                s = s || range.start;
                e = e || range.end;
                range.start = s;
                range.end = e;
                viz.setYearRange(s, e);
                viz.reloadTimeline();
            },

            setAxisValues: function(v) {
                viz.setAxisValues(v);
            },

            onplay: function(callback) {
                viz.play.get().on('click', function() {
                    isPlaying = true;
                    toggle(viz.play.get());
                    toggle(viz.pause.get());
                    clearInterval(timeout);

                    timeout = setInterval(function() {
                        play(callback);
                    }, properties.interval);
                });
            },

            onpause: function(callback) {
                viz.pause.get().on('click', function() {
                    isPlaying = false;
                    toggle(viz.play.get());
                    toggle(viz.pause.get());
                    clearInterval(timeout);

                    if (typeof callback === 'function') {
                        callback(state.year);
                    }
                });
            },

            onmove: function(callback) {
                moveCallback = callback;
            },

            getGroup: function() {
                return viz.getGroup();
            },

            update: function() {
                validateYear();
                slide();
                update();
            },

            viz: viz
        };

        function initViz(svg) {
            viz.init(svg);
            viz.writeYear(state.year.toPrecision(properties.precision));
        }

        function setTimelineRange() {
            viz.timeline.setStart(range.start);
            viz.timeline.setEnd(range.end);
        }

        function bindDragEvent() {
            var moveButton = d3.select(viz.move.get().node());
            moveButton.call(drag);
            moveDisplacement = viz.timeline.properties.rangeStart -
                moveButton.data()[0].x;
        }

        function toggle(button) {
            if (button.attr('visibility') === 'hidden') {
                button.attr('visibility', 'visible');
            } else {
                button.attr('visibility', 'hidden');
            }
        }

        function slide() {
            var x = viz.timeline.scale.get()(state.year) - moveDisplacement;

            var moveButton = d3.select(viz.move.get().node());
            moveButton.data([{x: x, y: 47}]);
            moveButton.attr('transform', 'translate(' + x + ',47)');
        }

        function update() {
            viz.writeYear(state.year);
        }

        function play(callback) {
            if (isPlaying) {
                if (state.year + properties.lapse <= range.end) {
                    state.year += properties.lapse;
                    state.year = +state.year.toPrecision(properties.precision);
                } else {
                    state.year = range.end;
                    isPlaying = false;
                }
            } else {
                toggle(viz.play.get());
                toggle(viz.pause.get());
                clearInterval(timeout);
            }

            slide();
            update();

            if (typeof callback === 'function') {
                callback(state.year);
            }
        }

        function ondrag(d) {
            if (d3.event.type === 'dragstart') {
                isDragging = true;
                isPlaying = false;
            } else if (d3.event.type === 'drag') {
                var startingPoint = viz.timeline.properties.rangeStart -
                    moveDisplacement;
                var endingPoint = viz.timeline.properties.rangeEnd -
                    moveDisplacement;

                d.x = Math.max(startingPoint,
                    Math.min(d3.event.x, endingPoint));

                d3.select(this)
                    .attr('transform', 'translate(' + d.x + ',' + d.y + ')');

                state.year = viz.timeline.scale.get()
                    .invert(d.x + moveDisplacement);

                    update();

                if (typeof moveCallback === 'function') {
                    moveCallback(state.year);
                }
            } else if (d3.event.type === 'dragend') {
                isDragging = false;
                
                state.year = viz.timeline.scale.get()
                    .invert(d.x + moveDisplacement);
                state.year = +state.year.toPrecision(properties.precision);
                
                slide();
                update();

                if (typeof moveCallback === 'function') {
                    moveCallback(state.year);
                }
            }
        }

        function validateYear() {
            if (state.year < range.start) state.year = range.start;
            else if (state.year > range.end) state.year = range.end;
        }

        return timeslider;
    }
);
