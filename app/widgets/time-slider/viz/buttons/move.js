define([
        'd3'
    ],
    function() {
        'use strict';

        var movePath = 'm22.881718,10.764284c-0.475458,-5.471561 -5.19836,-9.764284 -10.792168,-9.764284c-5.605913,0 -10.58994,4.309327 -11.048798,9.799001c-0.040752,0.315464 0.006039,0.636966 0.006039,0.964504l0,8.97638c0,4.928179 5.512316,10.285027 10.857103,14.280397c4.802883,-3.368973 11.000465,-9.352219 11.000465,-14.280397l0,-8.97638c0,-0.338104 0.02264,-0.670172 -0.022642,-0.999221z';

        var button;

        function init(group) {
            button = group.append('g')
                .attr('class', 'button move')
                .data([{x: 0, y: 0}]);
        }

        function draw() {
            // Miterlimit?
            button.append('path')
                .attr('d', movePath);

            button.append('rect')
                .attr('x', 8.146993)
                .attr('y', 9.002818)
                .attr('width', 2.985586)
                .attr('height', 12.574781);

            button.append('rect')
                .attr('x', 12.77933)
                .attr('y', 9.002818)
                .attr('width', 2.985586)
                .attr('height', 12.574781);
        }

        function get() {
            return button;
        }

        return {
            init: init,
            draw: draw,
            get: get
        };
    }
);
