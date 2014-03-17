define (['d3'], function (d3) {

	var chartContainer = function () {
		
		var g;
		var init = function (svg) {
			g = svg.append("g");
		};

		var render = function () {
			return g.node().getBBox();
		};

		var getGroup = function () {
			return g;
		};

		return {
			init: init,
			render: render, 
			getGroup: getGroup
		};
	};


	return chartContainer;
});