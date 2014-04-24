define([
        'd3',
        'entities',
        'projection'
    ],
    function(d3, entities) {
        var g;

        var mapData = {};

        var ready = false;
        
        var projection = d3.geo.equirectangular();
        var path = d3.geo.path().projection(projection);

        function init(svg, data) {
            g = svg.append('g').attr('class', 'map');
            projection.translate([320, 190]); // equiretangular w/2, h/2
        }

        function pos(lat, lon) {
            return projection([lon, lat]); // yes, this is inverted.
        }

        function draw() {
            if (mapData.features) {
                g.selectAll('path').remove();
                g.selectAll('path').data(mapData.features).enter().append('path')
                    .attr('d', function (d) { return path(d); })
                    .attr('fill', function(d) {
                        return entities.get_color(d.id, 'mist_light');
                    });
            }
        }

        function render(w, h) {
            projection.scale([(w/618) * 100, (h/299) * 100]);
            projection.translate([w / 2, h / 2]);

            draw();

            return g.node().getBBox();
        }

        function getGroup() {
            return g;
        }

        function setMapData(d) {
            mapData = d;
        }

        return {
            ready: ready,
            init: init,
            position: pos,
            setMapData: setMapData,
            draw: draw,
            render: render,
            getGroup: getGroup
        };
    }
)