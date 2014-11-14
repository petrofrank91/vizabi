//FIXME: refactor hardcoded dates
//FIXME: remove date formatting from here

define([
    'lodash',
    'd3',
    'base/tool'
], function(_, d3, Tool) {

    var bubbleChart = Tool.extend({
        /**
         * Initialized the tool
         * @param config tool configurations, such as placeholder div
         * @param options tool options, such as state, data, etc
         */
        init: function(config, options) {

            this.name = 'bubble-chart';
            this.template = "tools/_examples/bubble-chart/bubble-chart";

            //instantiating components
            this.components = [{
                component: '_gapminder/header',
                placeholder: '.vzb-tool-title'
            }, {
                component: '_examples/bubble-chart',
                placeholder: '.vzb-tool-viz', //div to render
                model: ["state.show", "data", "state.time"]
            }, {
                component: '_gapminder/timeslider',
                placeholder: '.vzb-tool-timeslider', //div to render
                model: ["state.time"]
            }, {
                component: '_gapminder/buttonlist',
                placeholder: '.vzb-tool-buttonlist'
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
            if(!data.getItems() || data.getItems().length < 1) {
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
            
            fillGaps = model.data.fillGaps;
            
            //TODO: preprocessing should go somewhere else, when the data is loaded
            //it should be called only once, and i haven't yet found the right place
            if(!state.show.dataIsProcessed){
                var items = data.getItems();
           
                var indicator = model.state.show.indicator;
                var nested = d3.nest()
                    .key(function(d){return d["geo.name"]})
                    .rollup(function(leaves){
                        var collect = [];
                        var times = _.uniq(leaves.map(function(d){return d.time})).sort(d3.ascending);
                          
                        times.forEach(function(t){
                            var merged = {};
                            merged.name = leaves[0]["geo.name"]; 
                            merged.category = leaves[0]["geo.category"][0];
                            merged.region = merged.name.split("-")[0]; 
                            merged.time = new Date(t); 
                            merged.time.setHours(0); 

                            leaves.filter(function(l){return l.time == t})
                            .forEach(function(dd){
                                indicator.forEach(function(ind) { 
                                    if(dd[ind])merged[ind] = +dd[ind];
                                });
                            });
                            
                            collect.push(merged);
                        
                        });
                        
                        return fillGaps(collect,indicator);
                    })
                    .entries(items.filter(function(d){
                        return state.show.geo_category.indexOf(d["geo.category"][0]) >= 0;
                    }));
                
                //                var remapped = [];
//                
//                nested = d3.nest()
//                    .key(function(d){return d["geo.name"]})
//                    .key(function(d){return d["time"]})
//                    .rollup(function(leaves){
//                        var merged;
//                        leaves.forEach(function(l){
//                            merged = _.merge({},merged,l);
//                        });
//                        remapped.push(merged);
//                        return merged;
//                    })
//                    .entries(items.filter(function(d){
//                        return state.show.geo_category.indexOf(d["geo.category"][0]) >= 0;
//                    }));
//                
//                
//                remapped.forEach(function(d){
//                    d.name = d["geo.name"]; 
//                    d.category = d["geo.category"][0];
//                    d.region = d.name.split("-")[0];
//                    indicator.forEach(function(ind) { 
//                        d[ind] = d[ind]? +d[ind]: null; 
//                    });
//                });
                

                //var entities = _.uniq(remapped.map(function(d){return d.name}));
                
                test = nested;
                data.setItems("nested", nested);
                //data.setItems("entities", entities);
                state.show.dataIsProcessed = true;
            }
            
            
            
            
        },

        /**
         * Returns the query (or queries) to be performed by this tool
         * @param model the tool model will be received
         */
        getQuery: function(model) {
            var state = model.state;
            // FIXME why not using same as imput format here?
            var time_start = d3.time.format(state.time.format)(state.time.start);
            var time_end = d3.time.format(state.time.format)(state.time.end);
            
            return [{
                "from": "data",
                //FIXME not sure if we need union here. barchart doesn't have it
                "select": _.union(["geo", "geo.name", "time", "geo.region", state.show.indicator]),
                "where": {
                    "geo": state.show.geo,
                    //FIXME: if we select geo_category here wi are not able 
                    //to switch it later using options dropdown
                    "geo.category": "*",//state.show.geo_category,
                    //FIXME: suggest transition to the below format
                    // why would you compile it to a string and then parce back?
                    //"timeFormat": state.time.format,
                    "time": "*" [time_start + "-" + time_end]
                    //"time": [state.time.start, state.time.end]
                }
            }];
        }
    });

    return bubbleChart;
});
