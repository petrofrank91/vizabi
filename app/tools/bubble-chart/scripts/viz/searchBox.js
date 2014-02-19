define([], function() {
	var search = function() {

		var g;

		var init = function(svg) {
			g = svg.append("g")
				.attr("class", "search");
		};

		var render = function() {
			g.append("rect")
				.attr("width", "100")
				.attr("height", "20")
				.attr("opacity", "0.2");

			return g.node().getBBox();
		};

		return {
			init: init,
			render: render
		};
	};

	return search;
});