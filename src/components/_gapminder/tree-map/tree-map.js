//Tree Map
define([
	'd3',
	'base/component'
], function (d3, Component) {

	var TreeMap = Component.extend({

		/**
		 * Initializes the component (Tree Map).
		 * Executed once before any template is rendered.
		 * @param {Object} config The options passed to the component
		 * @param {Object} context The component's parent
		 */
		init: function (config, context) {
			this.name = 'tree-map';
			this.template = 'components/_gapminder/' + this.name + '/' + this.name;

			//determine which models this component expects
			//Obs: you may want to remove or add new ones
			this.model_expects = [{
				name: "time",
				type: "time"
			}, {
				name: "entities",
				type: "entities"
			}, {
				name: "marker",
				type: "model"
			}, {
				name: "language",
				type: "language"
			}];

			//specifying subcomponents
			//this.components = [];

			//model bindings
			var _this = this;
			this.model_binds = {
				"change:time": function (evt) {
					console.log("Event triggered - change:time");
				},
				//"change:items": function(evt) {
				//    console.log("Event triggered - change:items");
				//},
				//"readyOnce": function(evt) {
				//    console.log("Event triggered - change:items - all models are ready for the first time");
				//},
				"ready": function (evt) {
					_this.update();
				}
			};

			//contructor is the same as any component
			this._super(config, context);

			this.xScale = null;
			this.yScale = null;
			this.cScale = d3.scale.category20c();

			//this.xAxis = d3.svg.axisSmart();
			//this.yAxis = d3.svg.axisSmart();
		},

		/**
		 * Executes after the template is loaded and rendered.
		 * Ideally, it contains HTML instantiations related to template
		 * At this point, this.element and this.placeholder are available as d3 objects
		 */
		domReady: function () {
			this.graph = this.element.select('.vzb-tm-graph');
			//this.yAxisEl = this.graph.select('.vzb-bc-axis-y');
			//this.xAxisEl = this.graph.select('.vzb-bc-axis-x');
			//this.yTitleEl = this.graph.select('.vzb-bc-axis-y-title');
			this.bars = this.graph.select('.vzb-tm-bars');

			var _this = this;
			this.on("resize", function () {
				_this.update();
			});
		},

		/**
		 * Simple callback called when "ready" event is triggered
		 * Ideally, only operations related to changes in the model
		 * At this point, this.element is available as a d3 object
		 * See model_binds above
		 */
		update: function () {
			//E.g: var year = this.model.get('value');
			var _this = this;
			var time = this.model.time;
			var currTime = time.value;
			var duration = (time.playing) ? time.speed : 0;

			var items = this.model.marker.label.getItems({
				time: currTime
			});

			this.entityBars = this.bars.selectAll('.vzb-tm-bar')
				.data(items);

			//exit selection
			this.entityBars.exit().remove();

			//enter selection -- init circles
			this.entityBars.enter().append("rect")
				.attr("class", "vzb-tm-bar");

			//todo: get right sizes;
			this.bars.selectAll('.vzb-tm-bar')
				.attr("width", 30)
				.attr("fill", function (d) {
					return _this.model.marker.color.getValue(d);
				})
				.attr("x", function (d) {
					return 30;
					//return _this.xScale(_this.model.marker.axis_x.getValue(d));
				})
				.transition().duration(duration).ease("linear")
				.attr("y", function (d) {
					return 30;
					//return _this.yScale(_this.model.marker.axis_y.getValue(d));
				})
				.attr("height", function (d) {
					return 30;
					//return _this.height - _this.yScale(_this.model.marker.axis_y.getValue(d));
				});
		},

		/**
		 * Executes everytime the container or vizabi is resized
		 * Ideally,it contains only operations related to size
		 */
		resize: function () {
			//E.g: var height = this.placeholder.style('height');
		},


	});

	return TreeMap;

});