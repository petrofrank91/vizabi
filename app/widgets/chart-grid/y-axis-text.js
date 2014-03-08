define([
	'chart-grid-y-axis',
	'chart-grid-scale'
], function(yAxis, scale) {
	var yAxisText = function() {

		var g;
		var axis;
		var vizState;
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
			createYAxis();
			setAxisTextG();

			return g.node().getBBox();
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

			scale.init("y", vizState.get("yAxisScale"), yDomain, [availableHeight, 0]);
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

		var setAxisTextG = function() {
			axis.attr("class", "axis y text");
			var yAxisTextMaxWidth = d3.max(axis.selectAll("g").selectAll("text"), function () {
				return this.node().getBBox().width;
			});
			
			axis.selectAll("g").selectAll("text").each(function() {
				var textNode = d3.select(this);
				var currentVal = parseFloat(textNode.attr("x"));
				textNode.attr("x", currentVal + 8 + yAxisTextMaxWidth);
			});

			axis.selectAll(".tick").selectAll("line").remove();

			var axisPath = axis.select('.domain');

			axisPath.attr('transform', 'translate(' + (yAxisTextMaxWidth + 8) + ',0)');

			g =  axis;
		};


		var getGroup = function() {
			return g;
		};

		return {
			render: render,
			getGroup: getGroup,
			init: init
		};
	};

	return yAxisText;
});