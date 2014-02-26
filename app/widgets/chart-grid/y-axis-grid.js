define(['chart-grid-y-axis'], function(yAxis) {
	var xAxisText = function() {

		var g;

		var render = function() {
			g = yAxis.setAxisLineG();

			return g.node().getBBox();
		};

		var getAxisTick = function() {
			g.append(function () {
				return yAxis.getAxisLineG().node();
			});
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