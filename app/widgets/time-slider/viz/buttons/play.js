define([
        'd3'
    ],
    function() {
        'use strict';

        var trianglePath = 'm16.104044,9.928802c-0.298447,-0.136328 -0.72585,-0.38319 -1.063597,-0.394244c-0.729534,0.046671 -1.408713,0.637422 -1.408713,1.375551l0,16.248697c0,0.731989 0.670582,1.316599 1.390289,1.36941c0.346345,-0.006142 0.693916,-0.20756 1.007102,-0.40284l13.194235,-8.11084c0.622681,-0.404068 0.655842,-1.509418 0.01351,-1.968756l-13.132826,-8.116979z';

        var button;

        function init(group) {
            button = group.append('g')
                .attr('class', 'button play');
        }

        function draw() {
            button.append('circle')
                .attr('r', 18.032)
                .attr('cx', 19.032)
                .attr('cy', 19.032);

            button.append('path')
                .attr('d', trianglePath);
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
