define(['d3', 'chart-grid-scale', 'bubble-chart-events'], function(d3, scale, bubbleEvents) {
	var bubbles = function() {

		var g;
		var vizState;
		var countryLayers;
		var isInteractive;
		var _bubbleEvents;
		var bubbleSizeScale;
		var fontSizeScale;


		var init = function(svg, state) {
			g = svg
				.append("g")
				.attr("class", "scatterContainer");
			vizState = state;
			isInteractive = vizState.get("isInteractive");
			_bubbleEvents = new bubbleEvents(state, svg);
		};


		var setScales = function() {
			if (!vizState.get("minBubbleSize") && !vizState.get("maxBubbleSize")) {
				//bubbleSizeScale = d3.scale.sqrt().domain([vizState.getDataHelper().getMinOfSizeIndicator(), vizState.getDataHelper().getMaxOfSizeIndicator()]).range([1, 30]);
				scale.init("bubble","sqrt",[vizState.getDataHelper().getMinOfSizeIndicator(), vizState.getDataHelper().getMaxOfSizeIndicator()],[1, 30]);
			} else {
				scale.init("bubble","sqrt", [vizState.getDataHelper().getMinOfSizeIndicator(), vizState.getDataHelper().getMaxOfSizeIndicator()],[vizState.get("minBubbleSize"), vizState.get("maxBubbleSize")]);
			}

			if (!vizState.get("minFontSize") && !vizState.get("maxFontSize")) {
				//fontSizeScale = d3.scale.sqrt().domain([0, 10e8]).range([7, 25]).exponent(0.5);
				scale.init("font", "sqrt", [0, 10e8], [7, 25]);
			} else {
				//fontSizeScale = d3.scale.sqrt().domain([0, 10e8]).range([vizState.get("minFontSize"), vizState.get("maxFontSize")]).exponent(0.5);
				scale.init("font","sqrt",[0, 10e8],[vizState.get("minFontSize"), vizState.get("maxFontSize")]);
			}
		};

		var createLayers = function() {
			countryLayers = vizState.getDataHelper().getEntityLayerObject();

			var entityLayers = g
				.selectAll(".entityLayer")
				.data(countryLayers, function(d) {
					return d.id;
				});

			var entityLayer = entityLayers
				.enter()
				.append("g")
				.attr("class", "entityLayer")
				.attr("name", function(d) {
					return d.id;
				})
				.attr("id", function(d) {
					return d.id;
				});

			entityLayers
				.sort(function(a, b) {
					return b.max - a.max;
				});

			entityLayers.exit()
				.remove();
		};


		var createBubbles = function() {
			var year = vizState.get("year");
			var s = vizState.get("s");
			var opacity = vizState.get("opacity");
			var trails = vizState.get("trails");
			var category = vizState.get("entity") || vizState.get("category");
			var currentEntities = vizState.getDataHelper().getDataObject(year);

			var bubbles = g.selectAll(".entityLayer")
				.data(countryLayers, function(d) {
					return d.id;
				})
				.selectAll(".currentEntity").data(function(d) {
					var id = d.id;
					return currentEntities[id];
				});

			bubbles.enter().append("circle")
				.attr("class", "currentEntity")
				.attr("name", function(d) {
					return d.id;
				})
				.attr("stroke-width", "0.8pt")
				.attr("stroke", function(d) {
					return vizState.getDataHelper().getColor(d.id, "stroke", d.category);
				})
				.attr("fill", function(d) {
					return vizState.getDataHelper().getColor(d.id, "fill", d.category);
				})
				.attr("pointer-events", "all")
				.attr("cursor", "pointer");


			if (isInteractive) {
				bubbles
					.on("click", _bubbleEvents.bubbleClickHandler)
					.on("mouseover", _bubbleEvents.bubbleOverHandler)
					.on("mouseout", _bubbleEvents.bubbleOutHandler);
			} else {
				bubbles.on("click", vizBubblePrint.bubbleClickHandlerPrint);
			}

			bubbles
				.attr("cx", function(d, i) {
					var xScale = scale.get("x")
					return xScale(d.x);
				})
				.attr("cy", function(d, i) {
					var yScale = scale.get("y")
					return yScale(d.y);
				})
				.attr("r", function(d, i) {
					var bubbleSizeScale = scale.get("bubble");
					return bubbleSizeScale(d.size);
				});

			bubbles.exit().remove();
		};

		var render = function() {
			setScales();
			createLayers();
			createBubbles();

			return g.node().getBBox();
		};

		return {
			init: init,
			render: render
		};
	};

	return bubbles;
});