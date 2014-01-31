gapminder.viz.incomeMountain = function incomeMountain(svg, drawFunc) {
    'use strict';

    var group;

    var height = 440;
    var width = 900;

    var errMsg = {
        missingSVG: 'Income Mountain needs an svg to render itself!',
        missingData: 'No data provided'
    }

    if (!svg) {
        console.error(missingSVG);
        return false;
    }

    group = svg.append('g').attr('class', 'mountains');

    var mouseOverFunc;
    var mouseOutFunc;

    // Maps a gdp into a x position in the svg
    var scaleGDP = d3.scale.log()
        .domain([36.5, 365000]) // gdp values
        .range([0, width])      // x positions to be mapped
        .clamp(true);           // squeeze outside values to the extremities

    function renderMountain(mountain_info) {
        if (!mountain_info || !mountain_info.data) {
            console.error(errMsg.missingData);
            return false;
        }

        var name = mountain_info.name;
        var color = mountain_info.color || '#FF9900';
        var data = [mountain_info.data];

        var shape = group.append('g')
            .attr('id', name + '-income-mountain')
            .selectAll('.mountains_still')
            .data(mountain_info.data, function (d) {
                return d;
            });

        shape.enter().append('path').attr('class', 'mountains_still')
            .attr('id', name)
            .attr('fill', color)
            .attr('d', area);

        shape.on('mouseover', function () {
            onMouseOver(this);
        })
            .on('mouseout', function () {
                onMouseOut(this);
            });
    };

    function clear() {
        group.selectAll('g').remove();
    };

    function area(points) {
        return d3.svg.area()
            .interpolate('basis')
            .x(function (d) {
                return scaleGDP(Math.exp(d.x));
            })
            .y0(function (d) {
                return height - d.y0;
            })
            .y1(function (d) {
                return height - (d.y0 + d.y);
            })
            (points);
    };

    function render(w, h) {
        if (w) {
            setWidth(w);
            scaleGDP.range([0, w]);
        }

        if (h) {
            setHeight(h);
        }

        if (typeof drawFunc === 'function') {
            drawFunc();
        }

        return group.node().getBBox(); // Retirar isso daqui!
    }

    function setWidth(w) {
        width = w;
    }

    function setHeight(h) {
        height = h;
    }

    function getHeight() {
        return height;
    }

    function onMouseOver(param) {
        if (typeof mouseOverFunc === "function") mouseOverFunc(param);
    }

    function setOnMouseOver(callback) {
        if (typeof callback === "function") mouseOverFunc = callback;
    }

    function onMouseOut(param) {
        if (typeof mouseOutFunc === "function") mouseOutFunc(param);
    }

    function setOnMouseOut(callback) {
        if (typeof callback === "function") mouseOutFunc = callback;
    }

    return {
        g: group,
        x: scaleGDP,
        renderMountain: renderMountain,
        render: render,
        clear: clear,
        setWidth: setWidth,
        setHeight: setHeight,
        getHeight: getHeight,
        onMouseOver: setOnMouseOver,
        onMouseOut: setOnMouseOut
    };
};

// General ToDo's
// --------------
// * Methods for changing GDP range
// * Why some mountain are shown bigger than others with same height?
