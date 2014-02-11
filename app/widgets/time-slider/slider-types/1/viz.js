define([
        'd3',
        'widgets/time-slider/viz/buttons/play',
        'widgets/time-slider/viz/buttons/pause',
        'widgets/time-slider/viz/buttons/move',
        'widgets/time-slider/viz/timelines/timeline',
        'widgets/text/text'
    ],
    function(d3, play, pause, move, timeline, text) {
        'use strict';

        var g;

        var timelineAxis;

        var textYear;

        function init(svg) {
            g = svg.append('g').attr('class', 'vizabi-timeslider-1');

            loadTimeline();
            placeTimeline();

            loadButtons();
            placeButtons();

            loadText();            
            placeText();
            
            hide();
            
            moveButtonStart();
        }

        function loadButtons() {
            play.init(g);
            play.draw();

            pause.init(g);
            pause.draw();

            move.init(g);
            move.draw();
        }

        function loadTimeline() {
            timelineAxis = g.append('g')
                .attr('class', 'vizabi-timeslider-timeline')
                .call(timeline.axis());
        }

        function loadText() {
            textYear = new text();
            textYear.init(g, 'Year', 'text', 36);
        }

        function translate(el, x, y) {
            x = x || 0;
            y = y || 0;

            el.attr('transform', 'translate(' + x + ',' + y + ')');

            return el;
        }

        function placeButtons() {
            translate(play.get(), 0, 42);
            translate(pause.get(), 0, 42);
            translate(move.get(), 48, 47);
        }

        function placeTimeline() {
            translate(timelineAxis, 0, 60);
        }

        function placeText() {
            translate(textYear.getGroup(), 110, 0);
        }

        function hide() {
            pause.get().attr('visibility', 'hidden');
        }

        function writeYear(x) {
            textYear.setText(Math.floor(x));
        }

        function moveButtonStart() {
            move.get().data([{x: 48, y: 47}]);
        }

        function getGroup() {
            return g;
        }

        return {
            init: init,
            writeYear: writeYear,
            play: play,
            pause: pause,
            move: move,
            timeline: timeline,
            timelineAxis: timelineAxis,
            text: text,
            getGroup: getGroup
        };
    }
);
