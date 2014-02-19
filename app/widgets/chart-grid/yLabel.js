define([], function() {

	var yLabel = function() {
		var vizState;
		var g;
		var text;

		var init = function(svg, state) {
			g = svg.append("text")
				.attr("class", "axisLabel");
			vizState = state;
		};

		var createLabelText = function() {
			var text = vizState.getDataHelper().getAxisNames()[1];

			if (!text) {
				text = vizState.get("yIndicator");
			}
		};

		var createLabel = function() {
			g
				.attr("text-anchor", "middle")
				.attr("font-size", "30px")
				.text(text)
				.append("svg:title")
				.text(function() {
					return vizState.getDataHelper().getAxisInfo()[1];
				});
		};

		var render = function() {
			createLabelText();
			createLabel();

			return g.node().getBBox();

		};

		return {
			render: render,
			init: init
		};
	};

    return yLabel;
});