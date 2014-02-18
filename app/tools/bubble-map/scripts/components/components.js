define([
        'd3',
        'widgets/text/text',
        'widgets/time-slider/slider-types/1/ts1',
        'bubble-map/viz/bubbles',
        'bubble-map/viz/map'
    ],
    function(d3, text, timeslider, bubbles, map) {
         var components = {
            header: undefined,
            timeslider: undefined,
            bubbles: bubbles,
            map: map
        };

        components.init = function(svg, i18n, state, properties) {
            //header start
            components.header = new text();
            components.header.init(
                svg,
                i18n.translate('bubbleMap', 'Billions of people per region'),
                'header',
                32
            );

            // timeslider start
            components.timeslider = new timeslider();
            components.timeslider.init(svg, state);

            // map
            components.map.init(svg);

            // bubbles
            components.bubbles = new bubbles();
            components.bubbles.init(svg, components.map);
        }

        return components;
    }
);
