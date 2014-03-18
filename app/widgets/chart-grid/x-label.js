define(['d3'], function(d3) {

	var label = function() {
		var vizState;
		var g;
		var text;


		var init = function(svg, state) {
			g = svg.append("g")
				.attr("class", "axisLabel");
			vizState = state;
		};

		var createLabelText = function() {
			text = vizState.getDataHelper().getAxisNames()[0];
			if (!text) {
				text = vizState.get("xIndicator");
			}
		};

		var createLabel = function() {
			g
				.append("text")
				.attr("y", "30")
				.attr("font-size", "30px")
				.text(text);
				//.append("title")
				//.text(function() {
				//	return vizState.getDataHelper().getAxisInfo()[0];
				//});
		};

		var render = function() {
			createLabelText();
			createLabel();

			return g.node().getBBox();
		};

		var getGroup = function() {
			return g;
		};

		return {
			render: render,
			init: init,
			getGroup: getGroup
		};

	};

	return label;
});