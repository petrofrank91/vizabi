define(['chart-grid-x-axis'], function(xAxis) {
	var xAxisText = function() {

		var g;

		var render = function() {
			g = xAxis.setAxisLineG();

			return g.node().getBBox();
		};

		var getGroup = function() {
			return g;
		};

		return {
			render: render,
			getGroup: getGroup
		};
	};

	return xAxisText;
});