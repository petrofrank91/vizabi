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
        var timelineg;
        var buttonsg;

        var timelineAxis;
        var axisValues;

        var textYear;

        function init(svg) {
            g = svg.append('g').attr('class', 'timeslider-1');
            timelineg = g.append('g').attr('id', 'timeline');
            buttonsg = g.append('g').attr('id', 'buttons');

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
            play.init(buttonsg);
            play.draw();

            pause.init(buttonsg);
            pause.draw();

            move.init(buttonsg);
            move.draw();
        }

        function loadTimeline(v) {
            axisValues = v || axisValues;
            timelineAxis = timelineg.append('g')
                .attr('class', 'timeslider1-timeline')
                .call(timeline.axis(axisValues));
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

        function reloadTimeline() {
            timelineAxis.remove();
            loadTimeline();
            placeTimeline();
        }

        function setAxisValues(v) {
            axisValues = v;
            reloadTimeline();
        }

        function setYearRange(s, e) {
            timeline.setStart(s);
            timeline.setEnd(e);
            reloadTimeline();
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
            reloadTimeline: reloadTimeline,
            setAxisValues: setAxisValues,
            setYearRange: setYearRange,
            getGroup: getGroup
        };
    }
);
