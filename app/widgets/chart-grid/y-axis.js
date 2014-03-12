define([
		'chart-grid-scale'
	],
	function(scale) {
		function yAxis() {
			var g;
			var axis;
			var axisText;
			var axisGrid;
			var vizState;
			var availableWidth = 880;
			var availableHeight = 500;

			var init = function(svg, state) {
				g = svg.append("g");
				axis = svg.append('g').attr('id', 'axis');
				axisText = svg.append('g').classed('y axistext', true).attr('stroke', 'lightgrey');//css
				axisGrid = svg.append('g').classed('y axisgrid', true).attr('stroke', 'lightgrey');//css
				vizState = state;
			};

			var render = function(w, h) {
				if (w) availableWidth = w;
				if (h) availableHeight = h;

				if (axis) {
					axis.selectAll('g').remove();
					axis.select('path').remove();
					axisText.selectAll('g').remove();
					axisGrid.selectAll('g').remove();
				}

				setYScale();
				makeAxis();
				breakdownAxes();
				addAxisPadding();

				return axis.node().getBBox();
			};

			var findYDomain = function() {
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

				return yDomain;
			};

			var setYScale = function() {
				scale.init("y", vizState.get("yAxisScale"), findYDomain(), [availableHeight, 0]);
			};

			var makeAxis = function () {
				var domainInvert = findYDomain().reverse();
				var localScale = d3.scale.linear().domain(domainInvert).range([0, availableHeight]);

				var axisMaker = d3.svg.axis()
					.scale(localScale)
					.orient("left")
					.tickSize(-availableWidth, 0);

				if (vizState.get("yAxisTickValues")) {
					axisMaker.tickValues(vizState.get("yAxisTickValues"));
				}

				axis.attr("stroke", "lightgrey").attr('id', 'axisNodes').call(axisMaker);//css
			};

			var breakdownAxes = function () {
				axis.selectAll('.tick').each(function(d) {
					axisText.node().appendChild(this.cloneNode(true));
					axisGrid.node().appendChild(this.cloneNode(true));
				});

				axisGrid.selectAll('text').remove();
				axisText.selectAll('line').remove();
				axis.selectAll('.tick').remove();
			};

			var addAxisPadding = function () {
				var maxTextWidth = 0;

				axisText.selectAll('text').each(function() {
					var element = d3.select(this);
					maxTextWidth = Math.max(element.node().getBBox().width, maxTextWidth);
				});

				axisText.selectAll('text').each(function() {
					var element = d3.select(this);
					element.attr('x', maxTextWidth);
				});
			}

			var getGroup = function() {
				return g;
			};

			var getAxisText = function() {
				return axisText;
			}

			var bboxAxisText = function() {
				return axisText.node().getBBox();
			}

			var getAxisGrid = function() {
				return axisGrid;
			};

			var bboxAxisGrid = function() {
				return axisGrid.node().getBBox();
			};

			var getAxis = function() {
				return axis;
			};

			var getHeight = function () {
				return availableHeight;
			};

			return {
				render: render,
				getGroup: getGroup,
				getAxis: getAxis,
				getAxisText: getAxisText,
				measureAxisText: bboxAxisText,
				getAxisGrid: getAxisGrid,
				measureAxisGrid: bboxAxisGrid,
				init: init,
				getHeight: getHeight
			};
		};

		return yAxis;
	}
);
