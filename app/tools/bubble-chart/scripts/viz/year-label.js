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
				.text(Math.floor(vizState.get("year")))
				.attr('y', 300)
				// The two lines below should be replaced by CSS
				.attr('font-size', '300px')
				.attr('opacity', 0.2);
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