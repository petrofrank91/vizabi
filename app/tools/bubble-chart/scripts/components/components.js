define([
	'chart-grid-xLabel',
	 'chart-grid-xAxis',
	 'chart-grid-yLabel',
	 'chart-grid-yAxis',
	 'bubble-chart-year-label',
	 'bubble-chart-search-box'
	 ], function(xLabel, xAxis, yLabel, yAxis, yearLabel, searchBox) {

		var components = {
			chart: undefined,
			yearLabel: undefined,
			xLabel: undefined,
			yLabel: undefined,
			xAxis: undefined,
			yAxis: undefined,
			searchBox: undefined,
			scatterContainer: undefined,
			linkLayer: undefined,
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
			components.searchBox.init(svg);
			components.searchBox.render();

			components.scatterContainer = components.chart.append("g")
				.attr("class", "scatterContainer");

			components.linkLayer = components.chart.append("g")
				.attr("class", "linkLayer");

			components.labelLayer = components.chart.append("g")
				.attr("class", "labelLayer");

		};

		var get = function () {
			return components;
		};

		return {
			init: init,
			get: get
		};

	});