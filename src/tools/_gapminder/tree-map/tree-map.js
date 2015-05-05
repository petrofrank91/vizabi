//Tree Map
define([
	'base/tool'
], function (Tool) {

	var TreeMap = Tool.extend({

		/**
		 * Initializes the tool (Tree Map).
		 * Executed once before any template is rendered.
		 * @param {Object} config Initial config, with name and placeholder
		 * @param {Object} options Options such as state, data, etc
		 */
		init: function (config, options) {

			this.name = "tree-map";
			this.template = "tools/_gapminder/tree-map/tree-map";

			//specifying components
			this.components = [{
				component: '_gapminder/buttonlist',
				placeholder: '.vzb-tool-buttonlist',
				model: ['state', 'ui', 'language'],  //pass this model to this component
				buttons: ['fullscreen']
			},
				{
					component: '_gapminder/timeslider',
					placeholder: '.vzb-tool-timeslider',
					model: ['state.time']  //pass this model to this component
				},
				{
					component: '_gapminder/tree-map',
					placeholder: '.vzb-tool-viz',
					model: ["state.time", "state.entities", "state.marker", "language"]  //pass this model to this component
				}];

			//you may add default options
			this.default_options = {
				state: {
					_type_: "model",
					_defs_: {
						//timespan of the visualization
						time: {
							_type_: "model",
							_defs_: {
								//step: 1,
								//speed: 300,
								value: 2012,
								start: 1900,
								end: 2012,
								unit: "year",
								formatInput: "%Y"

							}
						},
						//entities we want to show
						entities: {
							_type_: "model",
							_defs_: {
								show: {
									_type_: "model",
									_defs_: {
										dim: {
											_type_: "string",
											_defs_: "geo"
										},
										filter: {
											_type_: "object",
											_defs_: {
												"geo": ["*"],
												"geo.category": ["country"]
											}
										}
									}
								}
							}
						},
						//how we show it
						marker: {
							_type_: "model",
							_defs_: {
								dimensions: {
									_type_: "array",
									_defs_: ["entities", "time"]
								},
								label: {
									_type_: "hook",
									_defs_: {
										use: {
											_type_: "string",
											_defs_: "property",
											_opts_: ["property", "indicator", "value"]
										},
										value: {
											_type_: "string",
											_defs_: "geo.name"
										}
									}
								},
								size: {
									_type_: "hook",
									_defs_: {
										use: {
											_type_: "string",
											_defs_: "indicator"
										},
										value: {
											_type_: "string",
											_defs_: "pop"
										},
										scale: {
											_type_: "string",
											_defs_: "log"
										}
									}
								},
								color: {
									_type_: "hook",
									_defs_: {
										use: {
											_type_: "string",
											_defs_: "indicator"
										},
										value: {
											_type_: "string",
											_defs_: "lex"
										},
										scale: {
											_type_: "string",
											_defs_: "linear"
										}
									}
								}
							}
						}
					}
				}
			};

			//constructor is the same as any tool
			this._super(config, options);
		},

		/**
		 * Validating the tool model
		 * @param model the current tool model to be validated
		 */
		toolModelValidation: function (model) {

			/* Example of model validation for time and data */

			var time = this.model.state.time,
				marker = this.model.state.marker.label;

			//don't validate anything if data hasn't been loaded
			if (!marker.getItems() || marker.getItems().length < 1) {
				return;
			}

			var dateMin = marker.getLimits('time').min,
				dateMax = marker.getLimits('time').max;

			if (time.start < dateMin) {
				time.start = dateMin;
			}
			if (time.end > dateMax) {
				time.end = dateMax;
			}

			/* End of example */
		}
	});

	return TreeMap;
});