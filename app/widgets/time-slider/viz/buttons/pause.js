define([
        'd3'
    ],
    function() {
        'use strict';

        var bar1Path = 'm17.071117,27.009705c0,0.817007 -0.661329,1.479578 -1.47958,1.479578l-1.728666,0c-0.818252,0 -1.479578,-0.662571 -1.479578,-1.479578l0,-15.991412c0,-0.817004 0.661326,-1.479578 1.479578,-1.479578l1.728666,0c0.817009,0 1.47958,0.662574 1.47958,1.479578l0,15.991412z';

        var bar2Path = 'm25.644701,27.009705c0,0.817007 -0.662569,1.479578 -1.479576,1.479578l-1.728666,0c-0.818253,0 -1.47958,-0.662571 -1.47958,-1.479578l0,-15.991412c0,-0.817004 0.660082,-1.479578 1.47958,-1.479578l1.728666,0c0.817007,0 1.479576,0.662574 1.479576,1.479578l0,15.991412z';

        var button;

        function init(group) {
            button = group.append('g')
                .attr('class', 'vizabi-timeslider-button-pause');
        }

        function draw() {
            button.append('circle')
                .attr('r', 18.032)
                .attr('cx', 19.032)
                .attr('cy', 19.032);

            button.append('path')
                .attr('d', bar1Path);

            button.append('path')
                .attr('d', bar2Path);
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
