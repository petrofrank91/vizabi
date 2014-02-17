define([],
	function() {

		var svg;
		var div;

		var components = {
			chart: undefined,
			yearLabel: undefined,
			xLabel: undefined,
			yLabel: undefined,
			xAxis: undefined,
			yAxis: undefined,
			search: undefined,
			scatterContainer: undefined,
			linkLayer: undefined,
			labelLayer: undefined
		};


		var init = function (svg) {

			components.chart = svg.append("g");

			components.yearLabel = components.chart.append("g");

			components.xLabel = components.chart.append("g");

			components.yLabel = components.chart.append("g");

			components.xAxis = components.chart.append("g")
				.attr("class", "axis x");

			components.yAxis= components.chart.append("g")
				.attr("class", "axis y");

			components.search = components.chart.append("g");
			
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