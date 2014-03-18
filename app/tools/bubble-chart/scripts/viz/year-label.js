define([], function() {

	var yearLabel = function() {

		var g;
		var vizState;

		var init = function(svg, state) {
			g = svg.append("g").attr("class", "yearLabel")
			vizState = state;
			addGaussianBlur(svg);
		};

		var addGaussianBlur = function(svg) {
			var filter = svg
				.append('defs')
				.append('filter')
				.attr('id', 'blur')
				.attr('x', 0)
				.attr('y', 0);

			filter.append('feGaussianBlur')
				.attr('in', 'SourceGraphic')
				.attr('stdDeviation', 1);
		}

		var render = function() {
			g
				.append("text")
				.text(Math.floor(vizState.get("year")))
				.attr('y', 300)
				// The two lines below should be replaced by CSS
				.attr('font-size', '300px')
				.attr('opacity', 0.2)
				.attr('filter', 'url(#blur)');
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