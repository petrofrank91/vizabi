define([
        'd3'
    ],
    function(d3) {
        'use strict';

        var startScale = 18.25; // $0.05/day
        var endScale = 730000;
        var width = 880;

        // Ideally, I wouldn't have a 'get'. But I will solve this later.
        var scale = {
            get: function() {
                return d3.scale.log()
                    .domain([startScale, endScale])
                    .range([0, width])
                    .clamp(true);
            },

            setStart: function(start) {
                startScale = start;
            },

            setEnd: function(end) {
                endScale = end;
            },

            setWidth: function(w) {
                width = w;
            },

            toString: function() {
                return 'start: ' + startScale +
                    ' end: ' + endScale +
                    ' width ' + width;
            }
        };

        return scale;
    }
);
