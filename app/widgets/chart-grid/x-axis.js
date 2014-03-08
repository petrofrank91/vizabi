define(['d3', 'chart-grid-scale'], function(d3, scale) {

	var axis = function() {
		var vizState;
		var g;
		var availableWidth = 880;
		var availableHeight = 440;
		var axis;
		var xAxisLabelG;
		var xAxisTextG;
		var xScale;

		var init = function(_svg, state)  {
			g = _svg;
			vizState = state;
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

		var render = function(w, h) {
			if (w) availableWidth = w;
			if (h) availableHeight = h;

			if (axis) {
				axis.remove();
			}

			setAxisScale();
			createXAxis();
		};

		var getGroup = function() {
			return g;
		};

		var cloneAxis = function() {
			var node = axis.node();

			var i = node.parentNode.insertBefore(node.cloneNode(true),
				node.nextSibling);

			return d3.select(i);
		};

		var setAxisTextG = function() {
			// xAxisLabelG = d3.select(g[0][0]);

			// xAxisLabelG.attr("class", "axis x text");
			// xAxisLabelG.selectAll(".tick").selectAll("line").remove();

			// return xAxisLabelG;

			xAxisTextG = cloneAxis();

			xAxisTextG.attr("class", "axis x text");
			xAxisTextG.selectAll(".tick").selectAll("line").remove();
			xAxisTextG.select('path').remove();

			return xAxisTextG;
		};

		var setAxisGridG = function() {
			// xAxisTextG = cloneAxis();

			// xAxisTextG.attr("class", "axis x line");
			// xAxisTextG.selectAll(".tick").selectAll("text").remove();
			// xAxisTextG.select('path').remove();

			// return xAxisTextG;

			xAxisLabelG = d3.select(g[0][0]);

			xAxisLabelG.attr("class", "axis x line");
			xAxisLabelG.selectAll(".tick").selectAll("text").remove();

			return xAxisLabelG;
		};

		var removeRestOfChartTicks = function() {
			g.selectAll(".tick").filter(function() {
				return d3.select(d3.select(this).node().parentNode).attr("class") === g.attr("class");
			})
				.remove();
		};

		var getScale = function () {
			return xScale;
		};

		return {
			init: init,
			render: render,
			getGroup: getGroup,
			setAxisTextG: setAxisTextG,
			setAxisGridG: setAxisGridG,
			removeRestOfChartTicks: removeRestOfChartTicks,
			getScale: getScale
		};
	};

	return axis();
});