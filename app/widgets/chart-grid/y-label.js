define([], function() {

	var yLabel = function() {
		var vizState;
		var g;
		var text;

		var init = function(svg, state) {
			g = svg.append("g").attr("class", "axisLabel");
			vizState = state;
		};

		var createLabelText = function() {
			text = vizState.getDataHelper().getAxisNames()[1];

			if (!text) {
				text = vizState.get("yIndicator");
			}
		};

		var createLabel = function() {
			var font = g.append("text").text(text);
			var fontSize = font.attr('font-size') || font.style('font-size');
			font.attr('y', fontSize);
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

	return yLabel;
});