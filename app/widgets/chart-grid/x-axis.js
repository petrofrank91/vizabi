define([
		'chart-grid-scale'
	],
	function(scale) {
		function xAxis() {
			var g;
			
			var axis;
			var axisText;
			var axisGrid;

			var showFullGrid = false; // if false, shows only the tick
			var tickPixels = 4;	// number of extra pixels that the tick is drawn with

			var vizState;

			var availableWidth = 880;
			var availableHeight = 500;

			var init = function(svg, state) {
				var wrapper = svg.append('g').attr('id', 'x axis');

				g = wrapper.append("g").attr('id', 'blank-axis-builder');

				axis = wrapper.append('g').attr('class', 'axis');
				axisText = wrapper.append('g').attr('class', 'axisText');
				axisGrid = wrapper.append('g').attr('class', 'axisGrid');

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

				setXScale();
				makeAxis();
			
				breakdownAxes();
				
				if (showFullGrid) moveTick();

				return axis.node().getBBox();
			};

			function findXDomain() {
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

				return xDomain;
			};

			var setXScale = function(w) {
				scale.init("x", vizState.get("xAxisScale"), findXDomain(), [0, availableWidth]);
			};

			var makeAxis = function() {
				var tickPixelsSize = showFullGrid ? -(availableHeight + tickPixels) : tickPixels;

				var axisMaker = d3.svg.axis()
					.scale(scale.get("x"))
					.tickFormat(function(d) {
						return "$" + d;
					})
					.ticks(10, d3.format(",d"))
					.tickSize(tickPixelsSize, 0)
					.orient("bottom");
				
				if (vizState.get("xAxisTickValues")) {
					axisMaker.tickValues(vizState.get("xAxisTickValues"));
				}
				
				axis.attr('id', 'axisNodes').call(axisMaker);
			};

			var breakdownAxes = function() {
				axis.selectAll('.tick').each(function(d) {
					axisText.node().appendChild(this.cloneNode(true));
					axisGrid.node().appendChild(this.cloneNode(true));
				});

				axisGrid.selectAll('text').remove();
				axisText.selectAll('line').remove();
				axis.selectAll('.tick').remove();
			};

			var moveTick = function() {
				axisGrid.selectAll('line').attr('transform', 'translate(0,' + tickPixels + ')');
			};

			var getGroup = function() {
				return g;
			};

			var getAxisText = function() {
				return axisText;
			};

			var bboxAxisText = function() {
				return axisText.node().getBBox();
			};

			var getAxisGrid = function() {
				return axisGrid;
			};

			var bboxAxisGrid = function() {
				return axisGrid.node().getBBox();
			};

			var getAxis = function() {
				return axis;
			};

			var getWidth = function () {
				return availableWidth;
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
				getWidth : getWidth
			};
		};

		return xAxis;
	}
);
