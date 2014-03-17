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
				.text(Math.floor(vizState.get("year")));
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



	return yearLabel;

});