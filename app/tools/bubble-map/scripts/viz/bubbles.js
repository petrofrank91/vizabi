define([
        'd3'
    ],
    function(d3, components) {
        var map; // map reference (components.map)

        var bubbles = function() {
            this.border = true;
            this.gradient = true;
            this.data = [];
            this.g = undefined;
        };

        bubbles.prototype = {
            init: function(svg, m) {
                this.g = svg.append('g').attr('class', 'bubbles');
                map = m;
            },

            gradient: function(colors) {
                var keys = Object.keys(colors);

                for (var i = 0; i < keys.length; i++) {
                    var color = colors[keys[i]];

                    var grad = svg.append('defs').append('linearGradient')
                        .attr('id', color.id);

                    grad.attr('x1', '0%').attr('y1', '0%')
                        .attr('x2', '100%').attr('y2', '100%')
                        .attr('spreadMethod', 'pad');

                    grad.append('stop').attr('offset', '0%')
                        .attr('stop-color', color.start)
                        .attr('stop-opacity', 1);

                    grad.append('stop').attr('offset', '30%')
                        .attr('stop-color', color.end)
                        .attr('stop-opacity', 1);
                }
            },

            draw: function() {
                this.g.selectAll('circle').remove();
                this.g.selectAll('text').remove();

                var shape = this.g.selectAll('.bubbles')
                    .data(this.data).enter();

                var circle = shape.append('circle')
                    .attr('id', function(d) { return d.id; })
                    .attr('fill', function(d) { return d.color; })
                    .attr('r', function(d) { return d.radius; })
                    .attr('cx', function(d) { return d.coord[0]; })
                    .attr('cy', function(d) { return d.coord[1]; })
                    .attr('shape-rendering', 'geometricPrecision');

                var text = shape.append('text')
                    .attr('x', function(d) { return d.coord[0]; })
                    .attr('y', function(d) { return d.coord[1] + d.radius + 32; })
                    .text(function(d) { return d.text; });

                if (this.border) {
                    circle.attr('class', 'border');
                }
            },

            render: function(w, h) {
                for (var i = 0; i < this.data.length; i++) {
                    var lat = this.data[i].lat;
                    var lon = this.data[i].long;

                    this.data[i].coord = map.position(lat, lon);
                }

                this.draw();

                return this.g.node().getBBox();
            },

            setData: function(d) {
                this.data = d;
            },

            getGroup: function() {
                return this.g;
            }
        }

        return bubbles;
    }
);
