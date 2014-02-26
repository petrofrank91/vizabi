define(['chart-grid-y-axis'], function(yAxis) {
	var yAxisText = function() {

		var g;

		var init = function(svg, state) {
			g = svg.append("g");
			yAxis.init(g, state);
		};


		var render = function() {
			yAxis.render();
			g = yAxis.setAxisTextG();

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

	return yAxisText;
});