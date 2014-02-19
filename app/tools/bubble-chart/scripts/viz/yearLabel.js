define([], function() {

	var yearLabel = function() {

		var g;
		var vizState;
		var init = function(svg, state) {
			g = svg.append("g").attr("class", "year-label")
			vizState = state;
		};

		var render = function() {
			g
				.append("text")
				//.attr("x", xAxisContainer.node().getBBox().width / 2)
				//.attr("y", yAxisContainer.node().getBBox().height / 2)
				.text(Math.floor(vizState.get("year")));
		};

		return {
			init: init,
			render: render
		}

	};



	return yearLabel;

});