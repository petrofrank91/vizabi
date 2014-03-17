define([], function() {
	var search = function() {

		var g;
		var width = 100;
		var height = 20;

		var init = function(svg) {
			g = svg.append("g")
				.attr("class", "search");
		};

		var render = function() {
			g.append("rect")
				.attr("width", width)
				.attr("height", height)
				.attr("opacity", "0.2");

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

	return search;
});