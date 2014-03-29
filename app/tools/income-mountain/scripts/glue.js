define([
        'd3',
        'layout-manager',
        'income-mountain/data/data',
        'income-mountain/components/components',
        'income-mountain/layouts/layout',
        'income-mountain/bind/bind',
        'entities',
        'i18n'
    ],
    function(d3, lm, data, components, layouts, bind, entities) {

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
            startYear: 1800,
            endYear: 2018,
            language: 'dev'
        };

        var _i18n;

        var drawable;  // Data used for drawing
        var reload = false;

        function init(divId, state, properties, t) {
            initSVG(divId);
            setState(state);
            setProperties(properties);
            seti18n(t);

            initComponents();
            initLayoutManager();
            initLayouts();
            initData();

            bind.init(getState(), draw);
            bind.all();

            components.get().mountains.setDrawLoader(draw);
        }

        function initSVG(divId) {
            if (!divId) {
                console.error('Supply a div id or else I cant render!');
                return;
            }

            div = d3.select(divId).append('div')
                .attr('class', 'vizabi-income-mountain');
            svg = div.append('svg').attr('id', 'rofitilou');
        }

        function getState() {
            return state;
        }

        function setState(s) {
            if (!s) return;
            state.year = +s.year || state.year;
            state.geo = setGeo(s.geo) || state.geo;
            state.stack = s.stack;
        }

        function getProperties() {
            return properties;
        }

        function setProperties(p) {
            if (!p) return;
            properties.startYear = p.startYear || properties.startYear;
            properties.finalYear = p.finalYear || properties.finalYear;
            properties.language = p.language || properties.language;
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
                _i18n = fn;
            } else {
                _i18n = i18n.instance();
                if (properties.language !== 'dev') {
                    setLanguage(properties.language);
                }
            }
        }

        function setLanguage(lang, callback) {
            var id = 0; // Income Mountain pofile id
            _i18n.setLanguage(lang, id, function() {
                var header = components.get().header;
                header.setText(_i18n.translate('incMountain', 'People by income'));
                if (typeof callback === 'function') {
                    callback();
                }
            });
        }

        function initLayoutManager() {
            lm.init(svg, defaultMeasures, currentMeasures);
            lm.divScale();
        }

        function initComponents() {
            components.init(div, svg, _i18n, state, properties, data, loadData);
        }

        function initLayouts() {
            layouts.init(components);
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

        function loadData(numberNewGeos) {
            var len = numberNewGeos;
            
            if (len) {
                data.load(function() {
                    if (!--len) {
                        drawable = data.get();
                        components.get().labels.render();
                        components.get().mountains.render();
                        bind.all();
                    }
                });
            } else {
                drawable = data.get();
                components.get().labels.render();
                components.get().mountains.render();
                bind.all();
            }
        }

        function draw(mheight) {
            properties.mheight = mheight || properties.mheight;

            var mountains = components.get().mountains;
            var d = [];

            mountains.clear();

            if (bind.checkReload()) drawable = data.get();
            bind.clearReload();

            for (var i = 0; i < state.geo.length; i++) {
                var geo = state.geo[i];
                var year = Math.floor(state.year);
                var drawableData = drawable[geo][year] || [];

                d.push({
                    id: geo,
                    data: drawableData,
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
            setLanguage: setLanguage,
            setGeo: setGeo,
            draw: draw,
            data: data
        };
    }
);
