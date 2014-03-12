define([
	'chart-grid-x-label',
	 'chart-grid-y-label',
	 'bubble-chart-year-label',
	 'bubble-chart-search-box',
	 'bubble-chart-bubbles',
	 'bubble-chart-bubble-label',
	 'bubble-chart-container',
	 'chart-grid-x-axis',
	 'chart-grid-y-axis'
	 ], function(xLabel, yLabel, yearLabel, searchBox, bubbles, bubbleLabels, chartContainer, xAxis, yAxis) {
		var components = {
			chart: undefined,
			yearLabel: undefined,
			xLabel: undefined,
			yLabel: undefined,
			xAxisText: undefined,
			xAxisGrid:undefined,
			yAxisText: undefined,
			yAxisGrid:undefined,
			searchBox: undefined,
			bubblesContainer: undefined,
			labelLayer: undefined,
			chartG: undefined
		};

		var init = function (svg, state, stateChanged) {
			components.chart = new chartContainer();
			components.chart.init(svg);
			components.chart.render();
			
			var chartCountainerG = components.chart.getGroup().append('g');
			components.chartG = chartCountainerG;
			// components.yearLabel = new yearLabel();
			// components.yearLabel.init(chartCountainerG, state);
			// components.yearLabel.render();

			components.yLabel = new yLabel();
			components.yLabel.init(chartCountainerG, state);
			components.yLabel.render();

			components.yAxis = new yAxis();
			components.yAxis.init(chartCountainerG, state);
			components.yAxis.render();

			components.searchBox = new searchBox();
			components.searchBox.init(chartCountainerG);
			components.searchBox.render();

			components.xAxis = new xAxis();
			components.xAxis.init(chartCountainerG, state);
			components.xAxis.render();

			components.xLabel = new xLabel();
			components.xLabel.init(chartCountainerG, state);
			components.xLabel.render();

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