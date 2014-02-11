define([
        'd3',
        'layout-manager/_layout-manager',
        'income-mountain/data/_data',
        'income-mountain/components/_components',
        'income-mountain/layouts/_layouts',
        'income-mountain/_events',
        'income-mountain/_i18n',
        'income-mountain/bind/_bind',
        'entities'
    ],
    function(d3, lm, data, components, layouts, events, i18n, bind, entities) {
        'use strict';

        var div;
        var svg;

        var defaultMeasures = {
            width: 900,
            height: 500
        };

        var currentMeasures = {
            width: '100%',
            height: '100%'
        };

        var state = {
            year: 2000.1,
            stack: false,
            geo: []
        };

        var properties = {
            maxHeight: 0,
            mheight: 440,
            startYear: 1820,
            finalYear: 2010
        };

        var drawable;  // Data used for drawing

        function init(divId, state, i18n) {
            initProperties(divId);
            setState(state);
            seti18n(i18n);

            initComponents();
            initLayoutManager();
            initLayouts();
            initData();

            bind.init(getState());
            bind.all();

            components.get().mountains.setDrawLoader(draw);
        }

        function initProperties(divId) {
            if (!divId) {
                console.error('Supply a div id or else I cant render!');
                return;
            }

            div = d3.select(divId);
            svg = div.append('svg').attr('id', 'rofitilou');
        }

        function getState() {
            return state;
        }

        function setState(s) {
            state.year = +s.year || state.year;
            state.geo = setGeo(s.geo) || state.geo;
            state.stack = s.stack;
        }

        function setGeo(geos) {
            if (!geos) return;

            var array;

            if (typeof geos === 'string') {
                array = geos.split(',');
            } else {
                array = geos;
            }

            // Filters duplicates
            return array.filter(function(e, pos, self) {
                return self.indexOf(e) === pos;
            });
        }

        function setMeasures(measures) {
            currentMeasures.width = measures.width || currentMeasures.width;
            currentMeasures.height = measures.height || currentMeasures.height;

            svg.attr('height', currentMeasures.height)
                .attr('width', currentMeasures.width);
        }

        function seti18n(fn) {
            if (typeof fn === 'function') {
                i18n = fn;
            }
        }

        function initLayoutManager() {
            lm.init(svg, defaultMeasures, currentMeasures);
            lm.divScale();
        }

        function initComponents() {
            components.init(svg, state, properties);
        }

        function initEvents() {
            events.init();
        }

        function initLayouts() {
            layouts.init(lm, components.get());
        }

        function initData() {
            var len = state.geo.length;

            data.init(state, properties, function() {
                if (!--len) {
                    drawable = data.get();
                    components.get().labels.render();
                    components.get().mountains.render();
                    bind.all();
                }
            });
        }

        function draw(mheight) {
            properties.mheight = mheight || properties.mheight;

            var mountains = components.get().mountains;
            var d = [];

            mountains.clear();

            for (var i = 0; i < state.geo.length; i++) {
                var geo = state.geo[i];
                var year = Math.floor(state.year);

                d.push({
                    id: geo,
                    data: drawable[geo][year],
                    name: entities.get_name(geo),
                    color: entities.get_color(geo),
                    maxHeight: drawable[geo].geoMaxHeight
                });
            }

            d = data.prepare(d);

            for (var j = 0; j < d.length; j++) {
                mountains.draw({
                    id: d[j].id,
                    data: [d[j].data],
                    name: d[j].name,
                    color: d[j].color,
                });
            }

            bind.all();
        }

        return {
            init: init,
            getState: getState,
            setState: setState,
            setMeasures: setMeasures,
            seti18n: seti18n,
            setGeo: setGeo,
            draw: draw,
            data: data
        };
    }
);
