define(['d3', 'chart-grid-scale'], function(d3, scale) {

	var axis = function() {
		var vizState;
		var g;
		var availableWidth;
		var availableHeight;

		var init = function(svg, state)  {
			g = svg
				.append("g")
				.attr("class", "axis x");

			vizState = state;
			availableWidth = ($(window).width());
			availableHeight = ($(window).height());
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

			if (vizState.get("xAxisScale") === "log") {
				// xScale = d3.scale.log().domain(xDomain).range([0, availableWidth]);
				scale.init("x", vizState.get("xAxisScale"),xDomain,[0, availableWidth]);
				//xScale = scale.get();
			} else {
				//xScale = d3.scale.linear().domain(xDomain).range([0, availableWidth]);

			}
		};

		var createXAxis = function() {
			var svgAxis = d3.svg.axis()
				.scale(scale.get("x"))
				.tickFormat(function(d) {
					return "$" + d;
				})
				.ticks(10)
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

		var render = function() {
			setAxisScale();
			createXAxis();

			return g.node().getBBox();
		};

		return {
			init: init,
			render: render,
		};
	};

	return axis;

});