// Emergency ToDo:
// ---------------
// * Make this generic!
//
// Axis
// ====
// Draws different types of axis
function axisGenerator(svg, i18n) {
    'use strict';

    var group;

    var width = 880;
    
    var axis;

    var errMsg = {
        missingSVG: 'Income Mountain needs an svg to render itself!',
        missingi18n: 'Please provide i18n object'
    };

    if (!svg) {
        console.error(errMsg.missingSVG);
        return false;
    }

    if (!i18n) {
        console.error(missingi18n);
        return false;
    }

    group = svg.append('g');

    // Maps a gdp into a x position in the svg
    var scale = d3.scale.log()
        .domain([36.5, 365000]) // gdp values
        .range([0, width])      // x positions to be mapped
        .clamp(true);           // squeeze outside values to the extremities

    function makeAxis() {
        var axisOpts = d3.svg.axis().scale(scale)
            .tickValues([365, 3650, 36500])
            .tickSize(5, 0, 2)
            .tickPadding(2.5)
            .tickFormat(function(d) {
                return d/365 + ' ' + i18n('incMountain', '$/day');
            });

        axis = group.append('g')
            .attr('class', 'axis_text')
            .call(axisOpts);
    };

    function renderAxis(w) {
        if (axis) {
            axis.remove();
        }

        if (w) {
            setWidth(w);
            scale.range([0, w]);
        }

        makeAxis();

        return axis.node().getBBox();
    }

    function setWidth(w) {
        width = w;   
    }

    makeAxis();

    return {
        g: group,
        render: renderAxis,
        setWidth: setWidth
    }
}
