define([
	'chart-grid-x-label',
	 'chart-grid-x-axis',
	 'chart-grid-y-label',
	 'chart-grid-y-axis',
	 'bubble-chart-year-label',
	 'bubble-chart-search-box',
	 'bubble-chart-bubbles',
	 'bubble-chart-bubble-label',
	 'bubble-chart-container'
	 ], function(xLabel, xAxis, yLabel, yAxis, yearLabel, searchBox, bubbles, bubbleLabels, chartContainer) {

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


		var init = function (svg, state, stateChanged) {
			//components.chart = svg.append("g");
			components.chart = new chartContainer();
			components.chart.init(svg);
			components.chart.render();
			
			var chartCountainerG = components.chart.getGroup();

			components.yearLabel = new yearLabel();
			components.yearLabel.init(chartCountainerG, state);
			components.yearLabel.render();

			components.xLabel = new xLabel();
			components.xLabel.init(chartCountainerG, state);
			components.xLabel.render();

			components.yLabel = new yLabel();
			components.yLabel.init(chartCountainerG, state);
			components.yLabel.render();

			components.xAxis = new xAxis();
			components.xAxis.init(chartCountainerG, state);
			components.xAxis.render();

			components.yAxis = new yAxis();
			components.yAxis.init(chartCountainerG, state);
			components.yAxis.render();

			components.searchBox = new searchBox();
			components.searchBox.init(chartCountainerG);
			components.searchBox.render();

			components.bubblesContainer = new bubbles();
			components.bubblesContainer.init(chartCountainerG, state, stateChanged);
			components.bubblesContainer.render();

			components.labelLayer = new bubbleLabels();
			components.labelLayer.init(chartCountainerG, state);
			components.labelLayer.render();
		};

		var get = function () {
			return components;
		};

		return {
			init: init,
			get: get
		};

	});