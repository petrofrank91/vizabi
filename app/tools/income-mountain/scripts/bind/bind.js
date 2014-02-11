define([
        'd3',
        'income-mountain/components/components'
    ],
    function (d3, components) {
        'use strict';

        var state;

        var labels;
        var mountains;
        var timeslider;

        var highlighted = [];

        function init(s) {
            state = s;
            labels = components.get().labels.getGroup();
            mountains = components.get().mountains.getGroup();
            timeslider = components.get().timeslider.getGroup();
        }

        function deleteGeo(geo) {
            state.geo.splice(state.geo.indexOf(geo), 1);
            // raise event that a country was deleted instead of splice
        }

        function mouseoverHighlight(overGeo) {
            mountains.select('#' + overGeo).attr('class', 'mountains bold');
            labels.select('#' + overGeo).select('text')
                .attr('class', 'text bold');
            labels.select('#' + overGeo).select('g')
                .attr('class', 'delete bold');

            for (var i = 0; i < state.geo.length; i++) {
                var geo = state.geo[i];

                if (geo !== overGeo) {
                    var mountain = mountains.select('#' + geo);
                    var label = labels.select('#' + geo);

                    if (mountain.attr('class') === 'mountains bold') {
                        mountain.attr('class', 'mountains');
                        label.select('text').attr('class', 'text');
                        label.select('g').attr('class', 'delete');
                    } else {
                        mountain.attr('class', 'mountains shadow');
                        label.select('text').attr('class', 'text shadow');
                        label.select('g').attr('class', 'delete shadow');
                    }
                }
            }
        }

        function mouseoutHighlight() {
            highlights();
        }

        function fullHighlight(geo) {
            if (highlighted.indexOf(geo) === -1) {
                highlighted.push(geo);
            } else {
                highlighted.splice(highlighted.indexOf(geo), 1);
            }

            highlights();
        }

        function highlights() {
            if (!highlighted.length) {
                resetHighlights();
            } else {
                for (var i = 0; i < state.geo.length; i++) {
                    var geo = state.geo[i];
                    var label = labels.select('#' + geo);
                    var mountain = mountains.select('#' + geo);
                    
                    if (highlighted.indexOf(geo) !== -1) {
                        label.select('text').attr('class', 'text bold');
                        label.select('g').attr('class', 'delete bold');
                        mountain.attr('class', 'mountains bold');
                    } else {
                        label.select('text').attr('class', 'text shadow');
                        label.select('g').attr('class', 'delete shadow');
                        mountain.attr('class', 'mountains shadow');
                    }
                }
            }
        }

        function resetHighlights() {
            labels.selectAll('g').each(function() {
                d3.select(this).select('text').attr('class', 'text');
                d3.select(this).select('g').attr('class', 'delete');
            });

            mountains.selectAll('g').attr('class', 'mountains');
        }

        function bindLabels() {
            for (var i = 0; i < state.geo.length; i++) {
                var geo = state.geo[i];
                labels.select('#' + geo)
                    .each(function() {
                        (function(element, id) {
                            var label = d3.select(element);

                            label.select('.delete')
                                .on('click', function() {
                                    deleteGeo(id);
                                })
                                .on('mouseover', function() {
                                    mouseoverHighlight(id);
                                })
                                .on('mouseout', function() {
                                    mouseoutHighlight();
                                });

                            label.select('.text')
                                .on('click', function() {
                                    fullHighlight(id);
                                })
                                .on('mouseover', function() {
                                    mouseoverHighlight(id);
                                })
                                .on('mouseout', function() {
                                    mouseoutHighlight();
                                });
                        })(this, geo);
                    });
            }
        }

        function bindMountains() {
            for (var i = 0; i < state.geo.length; i++) {
                var geo = state.geo[i];

                mountains.select('#' + geo)
                    .each(function() {
                        (function(element, id) {
                            d3.select(element)
                                .on('click', function() {
                                    fullHighlight(id);
                                })
                                .on('mouseover', function() {
                                    mouseoverHighlight(id);
                                })
                                .on('mouseout', function() {
                                    mouseoutHighlight();
                                });
                        })(this, geo);
                    });
            }
        }

        function bindTimeslider() {
            var timeslider = components.get().timeslider;
            var mountains = components.get().mountains;
            var labels = components.get().labels;

            var action = function() {
                mountains.render();
                labels.render();
                all();
            };

            //timeslider.linkState(state);
            //timeslider.setRange?
            timeslider.onplay(action);
            timeslider.onpause(action);
            timeslider.onmove(action);
        }

        function all() {
            bindLabels();
            bindMountains();
            bindTimeslider();
            highlights();
        }

        return {
            init: init,
            all: all,
            labels: bindLabels,
            mountains: bindMountains,
            timeslider: bindTimeslider
        };
    }
);