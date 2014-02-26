define([
	'chart-grid-x-label',
	 'chart-grid-y-label',
	 'bubble-chart-year-label',
	 'bubble-chart-search-box',
	 'bubble-chart-bubbles',
	 'bubble-chart-bubble-label',
	 'bubble-chart-container',
	 'chart-grid-x-axis-text',
	 'chart-grid-x-axis-grid',
	 'chart-grid-y-axis-text',
	 'chart-grid-y-axis-grid',
	 ], function(xLabel, yLabel, yearLabel, searchBox, bubbles, bubbleLabels, chartContainer, xAxisText, xAxisGrid, yAxisText, yAxisGrid) {

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
			labelLayer: undefined
		};


		var init = function (svg, state, stateChanged) {
			components.chart = new chartContainer();
			components.chart.init(svg);
			components.chart.render();
			
			var chartCountainerG = components.chart.getGroup();

			// components.yearLabel = new yearLabel();
			// components.yearLabel.init(chartCountainerG, state);
			// components.yearLabel.render();

			components.xLabel = new xLabel();
			components.xLabel.init(chartCountainerG, state);
			components.xLabel.render();

			components.yLabel = new yLabel();
			components.yLabel.init(chartCountainerG, state);
			components.yLabel.render();

			components.xAxisGrid = new xAxisGrid();
			components.xAxisGrid.init(chartCountainerG, state);
			components.xAxisGrid.render();

			components.xAxisText = new xAxisText();
			components.xAxisText.render();

			components.yAxisGrid = new yAxisGrid();
			components.yAxisGrid.init(chartCountainerG, state);
			components.yAxisGrid.render();

			components.yAxisText = new yAxisText();
			components.yAxisText.render();

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