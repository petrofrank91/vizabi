define(['chart-grid-x-axis'], function(xAxis) {
	var xAxisGrid = function() {

		var g;

		var init = function(svg, state) {
			g = svg.append("g");
			xAxis.init(g, state);
		};


		var render = function() {
			xAxis.render();
			g = xAxis.setAxisGridG();

			return g.node().getBBox();
		};

		var getGroup = function() {
			return g;
		};

		return {
			init: init,
			render: render,
			getGroup: getGroup
		};
	};

	return xAxisGrid;
});