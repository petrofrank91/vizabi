define([
        'd3',
        'widgets/time-slider/scale/year'
    ],
    function(d3, scale) {
        'use strict';

        var properties = {
            start: 1800,
            end: 2100,
            rangeStart: 60,
            rangeEnd: 250,
            timeFormat: '%Y',
        };

        function setStart(x) {
            properties.start = x;
            scale.setStart(x);
        }

        function setEnd(x) {
            properties.end = x;
            scale.setEnd(x);
        }

        function setRangeStart(x) {
            properties.rangeStart = x;
            scale.setRangeStart(x);
        }

        function setRangeEnd(x) {
            properties.rangeEnd = x;
            scale.setRangeEnd(x);
        }

        function setFormat(f) {
            properties.timeFormat = f;
        }

        function values() {
            var start = properties.start;
            var end = properties.end;

            return [
                start,
                start + (end - start) / 2,
                end
            ];
        }

        function axis(val) {
            var v = val ? val : values();

            return d3.svg.axis().scale(scale.get())
                .tickValues(v)
                .tickSize(15, 0, 2)
                .tickPadding(11)
                .tickSubdivide(1)
                .tickFormat(function(d) { return d; });
        }

        return {
            properties: properties,
            setStart: setStart,
            setEnd: setEnd,
            setRangeStart: setRangeStart,
            setRangeEnd: setRangeEnd,
            setFormat: setFormat,
            values: values,
            scale: scale,
            axis: axis
        };
    }
);
