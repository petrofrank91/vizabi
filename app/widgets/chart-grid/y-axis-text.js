define(['chart-grid-y-axis'], function(yAxis) {
	var yAxisText = function() {

		var g;

		var render = function() {
			g = yAxis.setAxisTextG();

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

	return yAxisText;
});