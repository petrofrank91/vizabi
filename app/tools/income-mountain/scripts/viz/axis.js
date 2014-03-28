define([
        'd3',
        'income-mountain/scale/scale'
    ],
    function(d3, scale) {
        'use strict';
        
        var g;

        var a;
        var axisWidth = 880;

        var dollarTicks = [365, 3650, 36500]; // $1, $10, $100
        var dollarText = i18n.translate('', ' / day');
        var dollarSign = i18n.translate('', '$');

        function init(svg) {
            g = svg.append('g').attr('class', 'axis');
        }

        function axis() {
            var axisConfig = d3.svg.axis().scale(scale.get())
                .tickValues(dollarTicks)
                .tickSize(5, 0, 2)
                .tickPadding(3.5)
                .tickFormat(function(d) {
                    return dollarSign + '' + (d/365) + '' + dollarText;
                });

            a = g.append('g').call(axisConfig);
        }

        function render(w) {
            if (a) a.remove();
            
            if (w) {
                setWidth(w);
                scale.setWidth(w);
            }

            axis();

            return a.node().getBBox();
        }

        function setWidth(w) {
            axisWidth = w;
        }

        function getGroup() {
            return g;
        }

        return {
            getGroup: getGroup,
            init: init,
            render: render
        }
    }
);
