define([
        'd3',
        'income-mountain/scale/scale'
    ],
    function(d3, scale) {
        'use strict';

        // svg group
        var g;

        // temp draw func
        var drawLoader;

        // mountain height and width
        var mheight = 440;
        var mwidth = 880;

        function init(svg) {
            g = svg.append('g').attr('class', 'vizabi-im-mountains');
        }

        // Draws ONE mountain. Data and information about the mountain to be
        // drawn must be passed to this function. It expects an object with the
        // following properties: { data: array, name: string, color: string }
        function draw(mountain) {
            if (!mountain || !mountain.data) {
                console.error('missing data or element');
                return;
            }

            var shape = g.append('g')
                .attr('id', mountain.id)
                .selectAll('.mountains')
                .data(mountain.data, function(d) { return d; });

            shape.enter().append('path')
                .attr('id', mountain.name)
                .attr('fill', mountain.color)
                .attr('d', area);
        }

        // Removes all currently drawn mountains
        function clear() {
            g.selectAll('g').remove();
        }

        // Calculates the mountain area using d3's svg.area function. Made to
        // work with stacked mountains as well as non-stacked mountains.
        function area(d) {
            return d3.svg.area()
                .interpolate('basis')
                .x(function(d) { return scale.get()(Math.exp(d.x)); })
                .y0(function(d) { return mheight - d.y0; })
                .y1(function(d) { return mheight - (d.y0 + d.y); })
                (d);
        }

        function setDrawLoader(draw) {
            drawLoader = draw;
        }

        // Render function that changes the settings of the box where the
        // income mountains are supposed to be drawn on.
        function render(w, h) {
            if (w) {
                mwidth = w;
                scale.setWidth(w);
            }

            if (h) {
                mheight = h;
            }

            if (typeof drawLoader === 'function') {
                drawLoader(mheight);
            }

            return g.node().getBBox();
        }

        function getGroup() {
            return g;
        }

        return {
            getGroup: getGroup,
            init: init,
            clear: clear,
            draw: draw,
            render: render,
            setDrawLoader: setDrawLoader
        };
    }
);
