//FIXME: refactor hardcoded dates
//FIXME: remove date formatting from here

define([
    'lodash',
    'd3',
    'base/tool'
], function(_, d3, Tool) {

    var EntityPicker = Tool.extend({
            /**
             * Initialized the tool
             * @param config tool configurations, such as placeholder div
             * @param options tool options, such as state, data, etc
             */
            init: function(config, options) {

                this.name = 'entity-picker';
                this.template = "tools/_examples/entity-picker/entity-picker";

                this.components = [{
                    component: '_gapminder/entity-picker',
                    placeholder: '.vzb-tool-entity-picker',
                    model: ["state.time", "state.entities", "state.indicator"]
                }, {
                    component: '_gapminder/buttonlist',
                    placeholder: '.vzb-tool-buttonlist',
                    model: ['state', 'data', 'language'],
                    buttons: ['select','more-options']
                }];

                this._super(config, options);

            },

            /**
             * Validating the tool model
             * @param model the current tool model to be validated
             */
            toolModelValidation: function(model) {

                var state = model.state;
                var data = model.data;

                //don't validate anything if data hasn't been loaded
                if (!data.getItems() || data.getItems().length < 1) {
                    return;
                }

                var dateMin = data.getLimits('time').min,
                    dateMax = data.getLimits('time').max;

                if (state.time.start < dateMin) {
                    state.time.start = dateMin;
                }
                if (state.time.end > dateMax) {
                    state.time.end = dateMax;
                }
            },

            /**
             * Returns the query (or queries) to be performed by this tool
             * @param model the tool model will be received
             */
            getQuery: function(model) {
                var state = model.state,
                    time_start = d3.time.format('%Y')(state.time.start),
                    time_end = d3.time.format('%Y')(state.time.end),
                    entities = model.state.entities,
                    dim = entities.show.dim;

                var query = {};
                query ['select'] = _.union([dim, dim + '.name', 'time', dim + '.region', model.state.indicators])
                query['where'] = {};
                query['where'][dim] = entities.selected;
                query['where'][dim + '.cateogry'] = entities.show.filter[dim + '.cat'];
                query['where'][dim + '.region'] = entities.show.filter[dim + '.region'];
                query['where']['time'] = [time_start + "-" + time_end];

                var query_all = {};
                query_all['select'] = [dim, dim + '.name', dim + '.region', dim + '.category'];
                query_all['where'] = {};
                query_all['where'][dim]= ['*'];
                query_all['where'][dim + '.category'] = ['*'];

                return [query, query_all];
            }
    });

return EntityPicker;
});