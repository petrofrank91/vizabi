define([
	'chart-grid-x-label',
	 'chart-grid-x-axis',
	 'chart-grid-y-label',
	 'chart-grid-y-axis',
	 'bubble-chart-year-label',
	 'bubble-chart-search-box',
	 'bubble-chart-bubbles',
	 'bubble-chart-bubble-label'
	 ], function(xLabel, xAxis, yLabel, yAxis, yearLabel, searchBox, bubbles, bubbleLabels) {

		var components = {
			chart: undefined,
			yearLabel: undefined,
			xLabel: undefined,
			yLabel: undefined,
			xAxis: undefined,
			yAxis: undefined,
			searchBox: undefined,
			bubblesContainer: undefined,
			//linkLayer: undefined,
			labelLayer: undefined
		};


		var init = function (svg, state) {
			components.chart = svg.append("g");

			components.yearLabel = new yearLabel();
			components.yearLabel.init(components.chart, state);
			components.yearLabel.render();

			components.xLabel = new xLabel();
			components.xLabel.init(components.chart, state);
			components.xLabel.render();

			components.yLabel = new yLabel();
			components.yLabel.init(components.chart, state);
			components.yLabel.render();

			components.xAxis = new xAxis();
			components.xAxis.init(components.chart, state);
			components.xAxis.render();

			components.yAxis = new yAxis();
			components.yAxis.init(components.chart, state);
			components.yAxis.render();

			components.searchBox = new searchBox();
			components.searchBox.init(components.chart);
			components.searchBox.render();

			components.bubblesContainer = new bubbles();
			components.bubblesContainer.init(components.chart, state);
			components.bubblesContainer.render();

			components.labelLayer = new bubbleLabels();
			components.labelLayer.init(svg, state);
			components.labelLayer.render();

			// components.labelLayer = components.chart.append("g")
			// 	.attr("class", "labelLayer");

		};

		var get = function () {
			return components;
		};

		return {
			init: init,
			get: get
		};

	});