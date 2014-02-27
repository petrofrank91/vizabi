define([
        'd3',
        'entities',
        'i18n-manager/i18n-manager',
        'layout-manager',
        'bubble-map/data/data',
        'bubble-map/components/components',
        'bubble-map/layouts/layout',
        'bubble-map/bind/bind'
    ],
    function(d3, entities, t, layoutManager, data, components, layout, bind) {
        'use strict';

        var state = {
            year: 2000,
            geo: [],
            indicator: 'pop'
        };

        var defaultMeasures = {
            width: 900,
            height: 500
        };

        var currentMeasures = {
            width: '100%',
            height: '100%'
        };

        var d;

        function initComponents(svg, i18n) {
            components.init(svg, i18n, state);
        }

        function initLayoutManager(svg) {
            layoutManager.init(svg, defaultMeasures, currentMeasures);
            layoutManager.divScale();
        }

        function initLayout() {
            layout.init(components);
        }

        function initData() {
            d = new data();
            d.init(state);

            d.map(function() {
                components.map.setMapData(d.cache.map);
                components.map.draw();
            });
        }

        function initBind(context) {
            bind.init(context);
        }

        function makeBubblesData(context) {
            var data = [];

            for (var i = 0; i < state.geo.length; i++) {
                var geo = entities.get(state.geo[i]);

                var value = d.getValue(context.indicator, geo.region);
                var bubSize = d.getBubbleSize(value, context.bubValue);

                data.push({
                    id: geo.id,
                    region: geo.region,
                    radius: bubSize,
                    lat: geo.latitude,
                    long: geo.longitude,
                    coord: components.map.position(geo.latitude, geo.longitude),
                    color: context.gradient ?
                        'url(#' + geo.region + ')' :
                        entities.get_color(geo.region, 'fill'),
                    text: ((value / context.divider).toFixed(1))
                });
            }

            return data;
        }


        function loadIndicator(context) {            
            d.load(context.indicator, function() {
                context.render.apply(context);
            });
        }

        var bubbleMap = function() {
            this.svg = undefined;
            this.i18n = undefined;

            this.gradient = false;
            this.border = false;
            
            this.bubValue = 0;
            this.divider = 0;

            this.indicator = undefined;
        };

        bubbleMap.prototype = {
            init: function(div, st, i18n) {
                div = d3.select(div).append('div')
                    .attr('class', 'vizabi-bubble-map');

                this.svg = div.append('svg');

                this.setState(st);
                this.seti18n(i18n);

                this.divider = 1000000000;
                this.bubValue = 400000;

                initComponents(this.svg, this.i18n);
                initData();

                initLayoutManager(this.svg);
                initLayout();
                
                initBind(this);

                this.setIndicator(state.indicator);
            },

            setState: function(s) {
                state.year = s.year || state.year;
                state.geo = s.geo || stage.geo;
                state.indicator = s.indicator || state.indicator;
            },

            seti18n: function(i18n) {
                if (typeof i18n === 'function') {
                    this.i18n = i18n;
                } else {
                    this.i18n = new t();
                }
            },

            setminValue: function(x) {
                this.bubValue = x || this.bubValue;
            },

            setDivider: function(x) {
                this.divider = x || this.divider;
            },

            setGradColors: function(id, from, to) {
                gradient['#' + id] = {
                    id: id,
                    from: from,
                    to: to
                };
            },

            setIndicator: function(indicator) {
                this.indicator = indicator;
                loadIndicator(this);
            },

            render: function() {
                components.bubbles.setData(makeBubblesData(this));
                components.bubbles.draw();
            }
        };

        return bubbleMap;
    }
);
