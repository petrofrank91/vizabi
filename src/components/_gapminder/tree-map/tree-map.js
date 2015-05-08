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
					_this.update();
				},
				//"change:items": function(evt) {
				//    console.log("Event triggered - change:items");
				//},
				"change:entities:show": function(evt) {
					_this.update();
				},
				//"readyOnce": function(evt) {
				//    console.log("Event triggered - change:items - all models are ready for the first time");
				//},
				"ready": function (evt) {
					_this.resize();
					_this.update();
				}
			};

			//contructor is the same as any component
			this._super(config, context);

			this.xScale = null;
			this.yScale = null;
			this.cScale = d3.scale.category20c();

		},

		/**
		 * Executes after the template is loaded and rendered.
		 * Ideally, it contains HTML instantiations related to template
		 * At this point, this.element and this.placeholder are available as d3 objects
		 */
		domReady: function () {
			this.graph = this.element.select('.vzb-tm-graph');
			this.cells = this.graph.select('.vzb-tm-cells');

			var _this = this;
			this.on("resize", function () {
				_this.resize();
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

			var _this = this;

			var treemap = d3.layout.treemap()
				.size([this.width, this.height])
				.value(function (d) {
					return d.size;
				});

			var time = this.model.time;
			var currTime = time.value;
			var duration = (time.playing) ? time.speed : 0;

			var items = this.model.marker.label.getItems({
				time: currTime
			});

			var svg = d3.select(".vzb-tree-map").append("svg")
				.attr("width", this.width)
				.attr("height", this.height)
				.append("g")
				.attr("transform", "translate(-.5,-.5)");

			var cell = svg.data(items).selectAll("g")
				.data(treemap.nodes).enter()
				.append("g")
				.attr("class", "cell")
				.attr("transform", function (d) {
					return "translate(" + d.x + "," + d.y + ")";
				});

			cell.append("rect")
				.attr("width", function (d) {
					return d.dx;
				})
				.attr("height", function (d) {
					return d.dy;
				})
				.style("fill", function (d) {
					return _this.model.marker.color.getValue(d);
				});

			cell.append("text")
				.attr("x", function (d) {
					return d.dx / 2;
				})
				.attr("y", function (d) {
					return d.dy / 2;
				})
				.attr("dy", ".35em")
				.attr("text-anchor", "middle")
				.text(function (d) {
					return _this.model.marker.label.getValue(d) + ' (' + _this.model.marker.size.getValue(d) + ')';
				});

			/*

			 var _this = this;
			 var time = this.model.time;
			 var currTime = time.value;
			 var duration = (time.playing) ? time.speed : 0;

			 var items = this.model.marker.label.getItems({
			 time: currTime
			 });

			 this.entityCells = this.cells.selectAll('.vzb-tm-cell')
			 .data(items);

			 //exit selection
			 this.entityCells.exit().remove();

			 var n = 0;
			 //enter selection -- init cell
			 var cell = this.entityCells.enter()
			 .append("g")
			 .attr("class", "vzb-tm-cell")
			 .attr("transform", function(d) {
			 n=n+40;
			 return "translate(" + n + "," + n + ")";
			 });

			 cell.append("rect")
			 .attr("width", function(d) { return n; })
			 .attr("height", function(d) { return n; })
			 .style("fill", function(d) {
			 return _this.model.marker.color.getValue(d);
			 });

			 cell.append("text")
			 //.attr("x", function(d) { return 40 / 2; })
			 //.attr("y", function(d) { return 40 / 2; })
			 .attr("dy", ".35em")
			 .attr("text-anchor", "middle")
			 .text(function(d) {

			 //console.log(_this.model.marker.size.getValue(d));

			 return _this.model.marker.label.getValue(d);
			 });

			 */

		},

		/**
		 * Executes everytime the container or vizabi is resized
		 * Ideally,it contains only operations related to size
		 */
		resize: function () {
			//this.height = parseInt(this.element.style("height"));
			this.height = 270;
			this.width = parseInt(this.element.style("width"));
		}


	});

	return TreeMap;

});