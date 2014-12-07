define([
    'd3',
    'base/component'
], function(d3, Component) {

    var _this = null;
//
//    // Various accessors that specify the dimensions of data to visualize
//    function mean(d, indicator) {
//        // TODO figure out where should the data pre-processing go
//        if(indicator==null) return d.mean;
//        return d[indicator];
//    }
//
//    function stdev(d, indicator) {
//        // TODO figure out where should the data pre-processing go
//        if(indicator==null) return Math.sqrt(d.variance);
//        return d[indicator];
//    }
//
//    function peak(d, indicator) {
//        // TODO figure out where should the data pre-processing go
//        if(indicator==null) return d.pop;
//        return d[indicator];
//    }
//
//    function key(d) {
//        return d.name;
//    }
//
//    function color(d) {
//        return d.region;
//    }

    //constants
    var DISTRIBUTIONS_NORMAL = "normal distribution",
        DISTRIBUTIONS_LOGNORMAL = "lognormal distribution";

    // this function returns PDF values for a specified distribution
    // TODO this is in fact a universal utility function and thus it can go somewhere else
    function pdf(x, mu, sigma, type) {
        if (type==null) type = DISTRIBUTIONS_NORMAL;
        switch(type){
            case DISTRIBUTIONS_NORMAL:
            return Math.exp(
                - 0.5 * Math.log(2 * Math.PI)
                - Math.log(sigma)
                - Math.pow(x - mu, 2) / (2 * sigma * sigma)
                );

            case DISTRIBUTIONS_LOGNORMAL:
            return Math.exp(
                - 0.5 * Math.log(2 * Math.PI) - Math.log(x)
                - Math.log(sigma)
                - Math.pow(Math.log(x) - mu, 2) / (2 * sigma * sigma)
                );
        }
    };

    function log(d){console.log(d)};

    function populateDistributionsInto(d){
        // we need to generate the distributions based on mu, sigma and scale
        // we span a uniform range of 'points' across the entire X scale,
        // resolution: 1 point per pixel. If width not defined assume it equal 500px
        var rangeFrom = Math.log(_this.xScale.domain()[0]);
        var rangeTo = Math.log(_this.xScale.domain()[1]);
        var rangeStep = (rangeTo - rangeFrom)/500;//(width?500:width);

        var peak = _this.model.marker.axis_y.getValue(d);
        var mean = _this.model.marker.axis_x.getValue(d);
        var stdev = _this.model.marker.size.getValue(d);
        
        d.points = d3.range(rangeFrom, rangeTo, rangeStep)
            .map(function(dX){
                // get Y value for every X
                return {x: Math.exp(dX),
                        y0: 0, // the initial base of areas is at zero
                        y:peak * pdf(Math.exp(dX), Math.log(mean), stdev, DISTRIBUTIONS_LOGNORMAL)}
            });
        return d;
    }



    var MountainChart = Component.extend({

        /**
        * Initializes the chart
        * @param config component configuration
        * @param context component context (parent)
        */
        init: function(config, context) {
            
            //TODO: remove global
            _this = this;
            this.name = 'mountain-chart';
            this.template = 'components/_examples/' + this.name + '/' + this.name;
            
            //define expected models for this component
            this.model_expects = ["time", "entities", "marker", "data"];
            
            this._super(config, context);

            this.xScale = null;
            this.yScale = null;
            this.rScale = null;
            this.cScale = d3.scale.category10();
            
            this.xAxis = d3.svg.axis();
            
            this.isDataPreprocessed = false;
            this.timeUpdatedOnce = false;
            this.sizeUpdatedOnce = false;
            
            
            // define path generator
            this.area = d3.svg.area()
                .x(function(d) { return _this.xScale(d.x) })
                .y0(function(d) { return _this.yScale(d.y0) })
                .y1(function(d) { return _this.yScale(d.y0+d.y) });

            this.stack = d3.layout.stack()
                //.order("inside-out")
                .values(function(d) {return d.points; });

            // define sorting order: lower peaks to front for easier selection
            this.order = function order(a, b) {
                return peak(b) - peak(a);
            }
        },

        /**
         * POST RENDER
         * Executes right after the template is in place
         */
        domReady: function() {
            var _this = this;
            
            // reference elements
            this.graph = this.element.select('.vzb-bc-graph');
            this.xAxisEl = this.graph.select('.vzb-bc-axis-x');
            this.xTitleEl = this.graph.select('.vzb-bc-axis-x-title');
            this.yearEl = this.graph.select('.vzb-bc-year');
            this.mountainContainer = this.graph.select('.vzb-bc-mountains');
            this.mountains = null;
            this.tooltip = this.element.select('.vzb-tooltip');

            //model events
            this.model.on({
                "change": function(evt) {
                    console.log("Changed!", evt);
                },
                "load_start": function(evt) {
                    console.log("Started to load!", evt);
                },
                "load_end":  function() {
                    console.log("Finished loading!");
                    _this.updateShow();
                    _this.redrawDataPoints();
                },
                "ready": function() {
                    console.log("Model ready!");
//TODO: put here the following and remove it from "load_end" and from redrawDataPoints()
//                    _this.preprocessData();
//                    _this.updateShow();
//                    _this.updateTime();
//                    _this.redrawDataPoints();
                }
            });
            
            this.model.time.on({
                'change:value': function() {
                    _this.updateTime();
                    _this.redrawDataPoints();
                }
            });

            //component events
            this.on("resize", function() {
                console.log("Ops! Gotta resize...");
                _this.updateSize();
                _this.redrawDataPoints();
            })

            
            
        },
        
        
        preprocessData: function(){
            this.model.marker.label.getItems().forEach(function(d) {
                d["geo.region"] = d["geo.region"] || "world";
            });
            this.isDataPreprocessed = true;
        },
        
        
        /*
         * Updates the component as soon as the model/models change
         */
        modelReady: function(evt) {
            if (!this.isDataPreprocessed) this.preprocessData();
        },

        
        
        /*
         * UPDATE SHOW:
         * Ideally should only update when show parameters change or data changes
         */
        updateShow: function() {

            //scales
            this.yScale = this.model.marker.axis_y.getDomain();
            this.xScale = this.model.marker.axis_x.getDomain();
            this.rScale = this.model.marker.size.getDomain();

            var _this = this;
            this.xAxis.tickFormat(function(d) {
                return _this.model.marker.axis_x.getTick(d);
            });

            
            //TODO remove magic constant
            this.yScale
                .domain([0, 10]);
            this.xScale
                .domain(this.model.marker.axis_x.scale == "log" ? [0.01,1000] : [0,20]);
        },
        

        /*
         * UPDATE TIME:
         * Ideally should only update when time or data changes
         */
        updateTime: function() {
            var _this = this;

            this.time = parseInt(d3.time.format(this.model.time.formatInput)(this.model.time.value), 10);
            this.data = this.model.marker.label.getItems({ time: this.time });
            this.stackingIsOn = this.model.marker.stack;
            
            this.yearEl.text(this.time);


            this.mountains = this.mountainContainer.selectAll('.vzb-bc-bubble')
                .data(function(){
                    var result = _this.data
                        .map(function(dd){return populateDistributionsInto(dd)});

                a = result;
                    return _this.stackingIsOn?_this.stack(result):result;
                });
            
            this.timeUpdatedOnce = true;
        },



        /*
         * RESIZE:
         * Executed whenever the container is resized
         */
        updateSize: function() {
            var margin;
            var tick_spacing;
            var padding = 2;

            switch (this.getLayoutProfile()) {
                case "small":
                    margin = {top: 30, right: 20, left: 20, bottom: 40};
                    tick_spacing = 60;
                    break;
                case "medium":
                    margin = {top: 30, right: 30, left: 30, bottom: 40};
                    tick_spacing = 80;
                    break;
                case "large":
                    margin = {top: 30, right: 30, left: 30, bottom: 40};
                    tick_spacing = 100;
                    break;
            };

            var height = parseInt(this.element.style("height"), 10) - margin.top - margin.bottom;
            var width = parseInt(this.element.style("width"), 10) - margin.left - margin.right;

            //graph group is shifted according to margins (while svg element is at 100 by 100%)
            this.graph
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            //year is centered
            this.yearEl
                .attr("x", "50%")
                .attr("y", "50%")
                .attr("transform", "translate(" + (-margin.left) + ", " + (-margin.top) + ")");

            //update scales to the new range
            if (this.model.marker.axis_y.scale !== "ordinal") {
                this.yScale.range([height, 0]).nice();
            } else {
                this.yScale.rangePoints([height, 0], padding).range();
            }
            if (this.model.marker.axis_x.scale !== "ordinal") {
                this.xScale.range([0, width]).nice();
            } else {
                this.xScale.rangePoints([0, width], padding).range();
            }

            //axis is updated
            this.xAxis.scale(this.xScale)
                .orient("bottom")
                .tickSize(6, 0)
                //TODO: ticks() not working in log scale. why?
                .ticks(Math.max(width / tick_spacing, 2))
                .tickValues([0.1, 1, 10, 100])
                .tickFormat(function(d) {
                    if(d==0.1)return "$/day";
                    // throw away all ticks except of the few
                    if(d==0.1||d==1||d==10||d==100)return d;
                    return "";
                });


            this.xAxisEl
                .attr("transform", "translate(0," + height + ")")
                .call(this.xAxis);

            this.sizeUpdatedOnce = true;            
        },


        
        /*
         * REDRAW DATA POINTS:
         * Here plotting happens
         */
        redrawDataPoints: function() {                
            var _this = this;
            if(!this.timeUpdatedOnce) this.updateTime();
            if(!this.sizeUpdatedOnce) this.updateSize();

            //exit selection
            this.mountains.exit().remove();

            //enter selection -- init circles
            this.mountains.enter().append("path")
                .attr("class", "vzb-bc-mountain");

            //update selection
            //var speed = this.model.time.speed;

            this.mountains
                .style("fill", function(d) {
                    return _this.model.marker.color.getValue(d);
                })
                //.transition().duration(speed).ease("linear")
                .attr("d", function(d) { return _this.area(d.points); })
                .sort(this.order);

            /* TOOLTIP */
            //TODO: improve tooltip
            this.mountains.on("mousemove", function(d, i) {
                    var mouse = d3.mouse(_this.graph.node()).map(function(d) {
                        return parseInt(d);
                    });

                    //position tooltip
                    _this.tooltip.classed("vzb-hidden", false)
                        .attr("style", "left:" + (mouse[0] + 50) + "px;top:" + (mouse[1] + 50) + "px")
                        .html(_this.model.marker.label.getValue(d));

                })
                .on("mouseout", function(d, i) {
                    _this.tooltip.classed("vzb-hidden", true);
                })
                .on("click", function(d, i) {
                    _this.model.entities.selectEntity(d);
                });
        }

    });





    return MountainChart;
});
