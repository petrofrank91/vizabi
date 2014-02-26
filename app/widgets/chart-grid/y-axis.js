define(['d3', 'chart-grid-scale'], function(d3, scale) {

	var yAxis = function() {
		var vizState;
		var g;
		var availableWidth;
		var availableHeight;

		var init = function(svg, state)  {
			g = svg;
			vizState = state;

			availableWidth = ($(window).width());
			availableHeight = ($(window).height());
		};

		var setAxisScale = function() {
			var yDomain = [];
			if (vizState.get("minYValue") !== undefined && vizState.get("maxYValue") !== undefined) {
				var updatedMinY = vizState.get("updatedMinYValue");
				var minY = vizState.get("minYValue");

				if (updatedMinY && updatedMinY < minY) {
					yDomain[0] = updatedMinY;
				} else {
					yDomain[0] = minY;
				}

				var maxY = vizState.get("maxYValue");
				var updatedMaxY = vizState.get("updatedMaxYValue");

				if (updatedMaxY && updatedMaxY > maxY) {
					yDomain[1] = updatedMaxY;
				} else {
					yDomain[1] = maxY;
				}
			} else {
				yDomain = [vizState.getDataHelper().getMinOfYIndicator(), vizState.getDataHelper().getMaxOfYIndicator()];
			}

			// if (zoomScale) {
			// 	yDomain[0] /= zoomScale;
			// 	yDomain[1] /= zoomScale;
			// }

			if (vizState.get("yAxisScale") === "log") {
				scale.init("y", vizState.get("yAxisScale"), yDomain, [availableHeight, 0])
			} else {
				scale.init("y", vizState.get("xAxisScale"), yDomain, [0, availableWidth]);
			}
		};

		var createYAxis = function() {
			ySvgAxis = d3.svg.axis()
				.scale(scale.get("y"))
				.orient("left")
				.ticks(10)
				.tickSize(-availableWidth, 0, 0)
				.tickPadding(5);

			if (vizState.get("yAxisTickValues")) {
				ySvgAxis.tickValues(vizState.get("yAxisTickValues"));
			}

			g
				.attr("stroke", "lightgrey")
				.classed("print", !vizState.get("isInteractive"))
				.call(ySvgAxis);
		};

		var render = function() {
			setAxisScale();
			createYAxis();
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
			xAxisTextG = d3.select(g[0][0]);

			xAxisTextG.attr("class", ".axis .y .text");


			xAxisTextG.selectAll(".tick").selectAll("line").remove();

			return xAxisTextG;
		};

		var setAxisGridG = function() {
			var xAxisGridG = clone(g[0][0]);
			
			xAxisGridG.attr("class", ".axis .y .line");
			xAxisGridG.selectAll(".tick").selectAll("text").remove();

			return xAxisGridG;
		};

		var removeRestOfChartTicks = function () {
			g.selectAll(".tick").filter(function() {
				return d3.select(d3.select(this).node().parentNode).attr("class") === g.attr("class");
			})
			.remove();
		};

		return {
			render: render,
			init: init,
			getGroup: getGroup,
			setAxisTextG: setAxisTextG,
			setAxisGridG: setAxisGridG,
			removeRestOfChartTicks: removeRestOfChartTicks
		};
	};

	return yAxis();

});