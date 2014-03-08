define(['chart-grid-x-axis', 'chart-grid-scale'], function(xAxis, scale) {
	var xAxisGrid = function() {

		var g;
		var axis;
		var availableWidth = 440;
		var availableHeight = 880;

		var init = function(svg, state) {
			g = svg.append("g");
			vizState = state;
		};

		var render = function(w, h) {
			if (w) availableWidth = w;
			if (h) availableHeight = h;
			
			// if (axis) {
			// 	axis.remove();
			// }

			setAxisScale();
			createXAxis();

			return g.node().getBBox();
		};

		var getGroup = function() {
			return g;
		};

		var setAxisGridG = function() {
			axis.attr("class", "axis x grid");
			axis.selectAll(".tick").selectAll("text").remove();

			g = axis;
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
				.tickSize(-availableHeight, 0)
				.tickPadding(5)
				.orient("bottom");

			if (vizState.get("xAxisTickValues")) {
				svgAxis.tickValues(vizState.get("xAxisTickValues"));
			}

			axis = g
				.attr("stroke", "lightgrey")
				.classed("print", !vizState.get("isInteractive"))
				.call(svgAxis);
		};

		var createYAxis = function() {
			ySvgAxis = d3.svg.axis()
				.scale(scale.get("y"))
				.orient("left")
				.tickSize(-availableWidth, 0);

			if (vizState.get("yAxisTickValues")) {
				ySvgAxis.tickValues(vizState.get("yAxisTickValues"));
			}

			axis = g
				.attr("stroke", "lightgrey")
				.classed("print", !vizState.get("isInteractive"))
				.call(ySvgAxis);
		};

		return {
			render: render,
			getGroup: getGroup,
			init: init
		};
	};

	return xAxisGrid;
});