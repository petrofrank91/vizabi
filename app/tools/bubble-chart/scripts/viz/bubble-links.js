define([], function() {

	var bubbleLayer = function () {

		var g;

		var init = function (svg, state) {
			g = svg.append("g").attr("class", "linkLayer")
			vizState = state;
		};

		var render = function () {

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


	return bubbleLayer;
});