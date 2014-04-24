// timeslider scale
define([
        'd3'
    ],
    function(d3) {
        'use strict';

        var properties = {
            start: 1800,
            end: 2100,
            rangeStart: 60,
            rangeEnd: 250
        };

        function get() {
            return d3.scale.linear()
                .domain([properties.start, properties.end])
                .range([properties.rangeStart, properties.rangeEnd])
                .clamp(true);
        }

        function setStart(x) {
            properties.start = x;
        }

        function setEnd(x) {
            properties.end = x;
        }

        function setRangeStart(x) {
            properties.rangeStart = x;
        }

        function setRangeEnd(x) {
            properties.rangeEnd = x;
        }

        function toString() {
            return 'start: ' + properties.start + ' end: ' + properties.end;
        }

        return {
            get: get,
            setStart: setStart,
            setEnd: setEnd,
            setRangeStart: setRangeStart,
            setRangeEnd: setRangeEnd,
            toString: toString
        };
    }
);
