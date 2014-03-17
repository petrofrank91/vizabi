define([
		'chart-grid-scale'
	],
	function(scale) {
		function xAxis() {
			var g;
			
			var axis;
			var axisText;
			var axisGrid;
			
			var vizState;

			var availableWidth = 880;
			var availableHeight = 500;

			var init = function(svg, state) {
				g = svg.append("g");
				axis = svg.append('g').attr('id', 'x axis');
				// 'stroke' in the 2 lines below should be CSS
				axisText = svg.append('g').classed('x axistext', true).attr('stroke', 'lightgrey');
				axisGrid = svg.append('g').classed('x axisgrid', true).attr('stroke', 'lightgrey');
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

			var  makeAxis = function() {
				var axisMaker = d3.svg.axis()
					.scale(scale.get("x"))
					.tickFormat(function(d) {
						return "$" + d;
					})
					.ticks(10, d3.format(",d"))
					.tickSize(-availableHeight, 0)
					.orient("bottom");
				
				if (vizState.get("xAxisTickValues")) {
					axisMaker.tickValues(vizState.get("xAxisTickValues"));
				}
				
				// stroke below should be css
				axis.attr("stroke", "lightgrey").attr('id', 'axisNodes').call(axisMaker);
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
