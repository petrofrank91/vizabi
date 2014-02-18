define([
        'd3',
        'widgets/text/text',
        'widgets/time-slider/slider-types/1/ts1',
        'income-mountain/viz/labels',
        'income-mountain/viz/axis',
        'income-mountain/viz/incomeMountain'
    ],
    function(d3, text, timeslider, labels, axis, mountains) {
        var svg;

        var components = {
            header: undefined,
            //picker: picker,
            timeslider: undefined,
            labels: labels,
            axis: axis,
            mountains: mountains
        };

        function init(svg, i18n, state, properties) {
            // header start
            components.header = new text();
            components.header.init(
                svg,
                i18n('incMountain', 'People by income'),
                'header',
                32
            );

            // picker start

            // timeslider start
            components.timeslider = new timeslider();
            components.timeslider.init(svg, state);

            // labels start
            components.labels.init(svg, state);
            components.labels.render();

            // axis start
            components.axis.init(svg);
            components.axis.render();

            // mountains start
            components.mountains.init(svg);
        }

        function get() {
            return components;
        }

        return {
            init: init,
            get: get
        }
    }
);
