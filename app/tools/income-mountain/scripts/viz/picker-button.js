define([
        'd3'
    ],
    function(d3) {
        var g;

        var triangle = "0,19 15,19, 7.5,30";
        var rtl = false;
        
        var text;

        function init(svg, t) {
            g = svg.append('g').attr('class', 'picker-button');
            text = t;

            create();
        }

        function setText(t) {
            text = t.toUpperCase();
        }

        function create() {
            var rectangle = g.append('rect').attr('class', 'rectangle')
                .attr('x', 1).attr('y', 8)
                .attr('rx', 5).attr('ry', 5)
                .attr('height', 32).attr('width', 30);

            var tx = g.append('text').attr('class', 'text')
                .attr('x', 10).attr('y', 30)
                .text(text.toUpperCase());

            var txWidth = tx.node().getBBox().width;

            rectangle.attr('width', txWidth + 35)

            var tri = g.append('polygon').attr('class', 'triangle')
                .attr('points', triangle);

            if (rtl) {
                tri.attr('transform', 'translate(' + (5) + ',0)');
            } else {
                tri.attr('transform', 'translate(' + (txWidth + 15) + ',0)');
            }

            return g.node().getBBox();
        }

        function redraw() {
            g.select('.rectangle').remove();
            g.select('.text').remove();
            g.select('.triangle').remove();
            create();
        }

        function getGroup() {
            return g;
        }

        return {
            init: init,
            setText: setText,
            getGroup: getGroup,
            redraw: redraw
        };
    }
);