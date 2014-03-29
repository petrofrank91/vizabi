define([
        'd3',
        'jquery',
        'underscore',
        'widgets/text/text',
        'income-mountain/viz/picker-button',
        'widgets/time-slider/slider-types/1/ts1',
        'income-mountain/viz/labels',
        'income-mountain/viz/axis',
        'income-mountain/viz/incomeMountain',
        'smart-picker',
    ],
    function(d3, $, _, text, pickerButton, timeslider, labels, axis, mountains, smartPicker) {
        var svg;

        var components = {
            wrapper: undefined,
            header: undefined,
            pickerButton: pickerButton,
            timeslider: undefined,
            labels: labels,
            axis: axis,
            mountains: mountains,
            geoPicker: undefined 
        };

        function init(wrapperDiv, svg, _i18n, state, properties, d, update) {
            // header start
            components.header = new text();
            components.header.init(
                svg,
                _i18n.translate('incMountain', 'People by income'),
                'header',
                50
            );

            // picker start
            // components.pickerButton = new pickerButton();
            components.pickerButton.init(
                svg,
                i18n.translate('incMountain', 'Select a location')
            );

            // timeslider start
            components.timeslider = new timeslider();
            components.timeslider.init(svg, state);
            components.timeslider.setRange(properties.startYear,
                properties.endYear);
            components.timeslider.setAxisValues([1800, 1900, 2000]);

            // labels start
            components.labels.init(svg, state);
            components.labels.render();

            // axis start
            components.axis.init(svg);
            components.axis.render();

            // mountains start
            components.mountains.init(svg);

            components.wrapper = wrapperDiv;

            // geo picker
            components.geoPicker = new smartPicker("geoMult", "geo-mult", {
                width: 500,
                confirmButton: true,
                draggable: true,
                initialValue: state.geo,
                onSet: function(data) {
                    var selected = data.selected;
                    var countries = [];
                    var numNewGeos = 0;
                    var cache = d.getCached();

                    for (var i = 0, size = selected.length; i < size; i++) {
                        var country = selected[i];
                        
                        if (!cache[country.value]) {
                            numNewGeos++;
                        }

                        countries.push(country.value);
                    }

                    state.geo = countries;
                    update(numNewGeos);
                }
            });
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
