define([
        'entities'
    ],
    function(entities) {
        var g;
        
        var state;

        var labelWidth = 300;
        var labelHeight = 200;

        var fontsize = 20;

        var labelDict = {};

        function init(svg, s, dict) {
            g = svg.append('g').attr('class', 'labels');
            state = s;
            labelDict = dict || {};
        }

        function setDict(dict) {
            labelDict = dict;
        }

        function draw() {
            g.selectAll('g').remove();

            for (var i = 0; i < state.geo.length; i++) {
                var geo = state.geo[i];

                // make entity return the whole obj
                var entity = {
                    name: labelDict[geo] ? labelDict[geo].name : entities.get_name(geo),
                    color: entities.get_color(geo)
                }

                var sgroup = g.append('g').attr('id', geo);

                var text = sgroup.append('text')
                    .attr('class', 'text')
                    .attr('y', fontsize + (30 * i))
                    .attr('fill', entity.color)
                    .text(entity.name);

                var box = sgroup.append('g')
                    .attr('class', 'delete');

                box.append('rect')
                    .attr('x', text.node().getBBox().width + 8) // arb value
                    .attr('y', (30 * i) + 6) // arb value
                    .attr('rx', '2px')
                    .attr('ry', '2px')
                    .attr('width', '14px')
                    .attr('height', '14px')
                    .attr('fill', entity.color);

                box.append('text')
                    .attr('x', text.node().getBBox().width + 14.9)
                    .attr('y', (30 * i) + 17.5)
                    .text('x');
            }

            return g.node().getBBox();
        }

        function getGroup() {
            return g;
        }

        return {
            init: init,
            setLabelDict: setDict,
            getGroup: getGroup,
            render: draw
        }
    }
);
