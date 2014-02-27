define(['d3', 'chart-grid-scale'], function(d3, scale) {

	var axis = function() {
		var vizState;
		var g;
		var availableWidth = 800;
		var availableHeight = 350;
		var svg;

		var init = function(svg, state)  {
			g = svg;

			vizState = state;
			// availableWidth = ($(window).width());
			// availableHeight = ($(window).height());
		};

		var setAxisScale = function() {
			var xDomain = [];
			if (vizState.get("minXValue") !== undefined && vizState.get("maxXValue") !== undefined) {
				var updatedMinX = vizState.get("updatedMinXValue");
				var minX = vizState.get("minXValue");

				if (updatedMinX && updatedMinX < minX) {
					xDomain[0] = updatedMinX;
				} else {
					xDomain[0] = minX;
				}

				var maxX = vizState.get("maxXValue");
				var updatedMaxX = vizState.get("updatedMaxXValue");

				if (updatedMaxX && updatedMaxX > maxX) {
					xDomain[1] = updatedMaxX;
				} else {
					xDomain[1] = maxX;
				}

			} else {
				xDomain = [vizState.getDataHelper().getMinOfXIndicator(), vizState.getDataHelper().getMaxOfXIndicator()];
			}

			// if (zoomScale) {
			// 	xDomain[0] /= zoomScale;
			// 	xDomain[1] /= zoomScale;
			// }

			scale.init("x", vizState.get("xAxisScale"), xDomain, [0, availableWidth]);
		};

		var createXAxis = function() {
			var svgAxis = d3.svg.axis()
				.scale(scale.get("x"))
				.tickFormat(function(d) {
					return "$" + d;
				})
				.ticks(10, d3.format(",d"))
				.tickSize(-availableHeight, 0, 0)
				.tickPadding(5)
				.orient("bottom");

			if (vizState.get("xAxisTickValues")) {
				svgAxis.tickValues(vizState.get("xAxisTickValues"));
			}

			g
				.attr("stroke", "lightgrey")
				.classed("print", !vizState.get("isInteractive"))
				.call(svgAxis);
		};

		var render = function(w, h) {
			if (w) availableWidth = w;
			if (h) availableHeight = h;
			setAxisScale();
			createXAxis();
		};

		var getGroup = function() {
			return g;
		};

		var clone = function(selector) {
			var node = d3.select(selector).node();
			
			return d3.select(node.parentNode.insertBefore(node.cloneNode(true),
				node.nextSibling));
		};

		var setAxisTextG = function() {
			xAxisLabelG = d3.select(g[0][0]);

			xAxisLabelG.attr("class", "axis x text");
			xAxisLabelG.selectAll(".tick").selectAll("line").remove();

			return xAxisLabelG;
		};

		var setAxisGridG = function() {
			var xAxisTextG = clone(g[0][0]);
			
			xAxisTextG.attr("class", "axis x line");
			xAxisTextG.selectAll(".tick").selectAll("text").remove();

			return xAxisTextG;
		};

		var removeRestOfChartTicks = function() {
			g.selectAll(".tick").filter(function() {
				return d3.select(d3.select(this).node().parentNode).attr("class") === g.attr("class");
			})
			.remove();
		};

		return {
			init: init,
			render: render,
			getGroup: getGroup,
			setAxisTextG: setAxisTextG,
			setAxisGridG: setAxisGridG,
			removeRestOfChartTicks: removeRestOfChartTicks
		};
	};

	return axis();
});