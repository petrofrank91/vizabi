define([
        'd3',
        'entities',
        'layout-manager',
        'bubble-map/data/data',
        'bubble-map/components/components',
        'bubble-map/layouts/layout',
        'bubble-map/bind/bind',
        'events',
        'i18n',
    ],
    function(d3, entities, layoutManager, data, components, layout, bind, events) {
        'use strict';

        var state = {
            year: 2000,
            geo: [],
            indicator: 'pop'
        };

        var properties = {
            language: 'dev'
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

        function initComponents(wrapperDiv, svg, _i18n) {
            components.init(wrapperDiv, svg, _i18n, state);
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
        }

        function initBind(context) {
            bind.init(context, state);
        }

        function initEvents(context) {
            context.events = events.instance();
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

        var bubbleMap = function() {
            this.svg = undefined;
            this.i18n = undefined;
            this.events = undefined;

            this.gradient = false;
            this.border = false;
            
            this.bubValue = 0;
            this.divider = 0;

            this.indicator = undefined;
        };

        bubbleMap.prototype = {
            init: function(div, st, prop, _i18n) {
                div = d3.select(div).append('div')
                    .attr('class', 'vizabi-bubble-map');

                this.svg = div.append('svg');

                initEvents(this);

                this.setState(st);
                this.setProperties(prop);
                this.seti18n(_i18n);

                this.divider = 1000000000;
                this.bubValue = 400000;

                initComponents(div, this.svg, this.i18n);
                initData();

                initLayoutManager(this.svg);
                initLayout();
                
                initBind(this);

                this.setIndicator(state.indicator);
                this.loadMap();
            },

            setState: function(s) {
                if (!s) return;
                state.year = s.year || state.year;
                state.geo = s.geo || state.geo;
                state.indicator = s.indicator || state.indicator;
            },

            setProperties: function(p) {
                if (!p) return;
                properties.language = p.language || properties.language;
            },

            seti18n: function(fn) {
                if (typeof i18n === 'function') {
                    this.i18n = fn;
                } else {
                    this.i18n = i18n.instance();
                    if (properties.language !== 'dev') {
                        this.setLanguage(properties.language);
                    }
                }
            },

            setLanguage: function(lang, callback) {
                var _this = this;
                var id = 0;
                this.i18n.setLanguage(lang, id, function() {
                    _this.events.trigger('changed:language', lang);
                    if (typeof callback === 'function') {
                        callback();
                    }
                });
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
                var _this = this;
                d.load(indicator, function() {
                    _this.events.trigger('loaded:data', indicator);
                });
            },

            loadMap: function() {
                var _this = this;
                components.map.ready = false;
                d.map(function() {
                    _this.events.trigger('loaded:map', d.cache.map);
                });
            },

            render: function() {
                components.bubbles.setData(makeBubblesData(this));
                components.bubbles.draw();
            },

            on: function(evt, callback) {
                this.events.bind(evt, callback);
            },

            trigger: function(evt, args) {
                this.events.trigger(evt, args);
            }
        };

        return bubbleMap;
    }
);
