define([], function() {
	var search = function() {
		var g;
		
		var width = 100;
		var height = 30;

		var text;

		var magnifier;
		var magnifierPath = 'm280,278a153,153 0 1,0-2,2l170,170m-91-117 110,110-26,26-110-110';

		var picker = undefined;

		var init = function(svg, geopicker, t) {
			g = svg.append("g")
				.attr("class", "searchBox");
			picker = geopicker;
			text = t || '';
		};

		var setText = function(t) {
			text = t;
			g.selectAll('rect').remove();
			g.selectAll('path').remove();
			g.selectAll('text').remove();
			render();
		}

		// from wikicommons
		var magnifyingGlass = function() {
			magnifier = g.append('path')
				.attr('d', magnifierPath)
				.attr('class', 'magnifier')
				.attr('fill', 'none')
				.attr('transform', 'scale(0.05,0.05)');
		}

		var render = function() {
			magnifyingGlass();

			g.append('text')
				.attr('x', 30)
				.attr('y', 20)
				.attr('class', 'text')
				.text(text.toUpperCase());

			g.append('rect')
				.attr('width', 225)
				.attr('height', 33)
				.attr('fill', 'rgba(0,0,0,0)');

			g.on('click', function() {
				picker.show();
			});

			return g.node().getBBox();
		};

		var getGroup = function() {
			return g;
		};

		return {
			init: init,
			setText: setText,
			render: render,
			getGroup: getGroup
		};
	};

	return search;
});