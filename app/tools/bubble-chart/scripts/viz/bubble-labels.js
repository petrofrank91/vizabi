define(['bubble-chart-events'], function(bubbleEvents) {
	var bubbleLinks = function() {

		var g;
		var vizState;
		var _bubbleEvents;

		var init = function(svg, state) {
			g = svg.append("g")
				.attr("class", "labelLayer");

			vizState = state;
			_bubbleEvents = new bubbleEvents();
		};

		var addLabelsData = function(selectedEntities, year) {
			var labelsData = [];

			for (var entityId in selectedEntities) {
				if (selectedEntities.hasOwnProperty(entityId)) {
					var entity = selectedEntities[entityId];
					var category = selectedEntities[entityId].category;

					var o = {};
					o.id = entityId;
					o.name = vizState.getDataHelper().getName(entityId, category);
					o.x = vizState.getDataHelper().get(vizState.get("xIndicator"), entityId, year, vizState, category);
					o.y = vizState.getDataHelper().get(vizState.get("yIndicator"), entityId, year, vizState, category);
					o.size = vizState.getDataHelper().get(vizState.get("sizeIndicator"), entityId, year, vizState, category);

					if ("labelPos" in entity) {
						o.labelPos = selectedEntities[entityId].labelPos;
					} else {
						o.labelPos = labelAngel + labelPositionInteractive;
					}

					if (o.x && o.y && o.size) {
						labelsData.push(o);
					}
				}
			}

			return labelsData;
		};

		var drawLabels = function() {
			var year = vizState.get("year");
			var trails = vizState.get("trails");

			var selected = vizState.get("s");
			var labelsData = addLabelsData(selected, year);

			var labels = g
				.select(".labelLayer")
				.selectAll(".labelNode")
				.data(labelsData, function(d) {
					return d.id;
				});

			var dragInteractive = d3.behavior.drag()
				.on("drag", _bubbleEvents.dragMove)
				.on("dragend", _bubbleEvents.dragEnd);

			var labelContainer = labels.enter()
				.append("g")
				.attr("class", "labelNode")
				.attr("cursor", "pointer")
				.call(dragInteractive);

			labelContainer.append("rect")
				.attr("cursor", "pointer")
				.attr("class", "labelBG");


			var labelText = labelContainer
				.append("text")
				.attr("class", "labelText")
				.attr("text-anchor", "middle")
				.attr("dominant-baseline", "central")
				.attr("font-family", "'Helvetica', sans-serif")
				.attr("x", "0")
				.attr("y", "0")
				.attr("font-size", "23px")
				.attr("pointer-events", "none")
				.text(function(d) {
					return d.name;
				});

			labels.each(function(d) {

				var bbox = d3.select(this).select(".labelText").node().getBBox();
				var width = bbox.width;
				var height = bbox.height;

				var paddingWidth = 8;
				var paddingHeight = 8;

				d3.select(this).select(".labelBG")
					.attr("width", width + paddingWidth)
					.attr("height", height + paddingHeight)
					.attr("x", -width / 2 - paddingWidth / 2)
					.attr("y", -height / 2 - paddingWidth / 2)
					.attr("fill", "#fff")
					.attr("stroke", "#999")
					.attr("stroke-width", "2px")
					.attr("ry", "5px")
					.attr("rx", "5px");


				var angle = -1 / 4 * Math.PI;
				var distanceFromPerimeter = 50;

				var labelPos = d.labelPos;
				angle = parseFloat(labelPos.split("_")[0]);
				distanceFromPerimeter = parseFloat(labelPos.split("_")[1]);

				var radius = bubbleSizeScale(d.size);
				var bubbleX = xScale(d.x);
				var bubbleY = yScale(d.y);

				var perimeterX = bubbleX + radius * Math.cos(angle);
				var perimeterY = bubbleY + radius * Math.sin(angle);

				var labelCoordinates = {};
				labelCoordinates.x = bubbleX + (distanceFromPerimeter + radius) * Math.cos(angle);
				labelCoordinates.y = bubbleY + (distanceFromPerimeter + radius) * Math.sin(angle);

				var preferredX = labelCoordinates.x;
				var preferredY = labelCoordinates.y;

				labelCoordinates = fitWithinLabelConstraints(bbox, preferredX, preferredY);

				d.linkStartX = perimeterX;
				d.linkStartY = perimeterY;
				d.linkEndX = labelCoordinates.x;
				d.linkEndY = labelCoordinates.y;

				//d3.select(this).attr("transform", "translate(" + labelCoordinates.x + "," + labelCoordinates.y + ")");
			});

			labels.exit().remove();

			var labelLinks = g
				.select(".linkLayer")
				.selectAll(".labelLink")
				.data(labelsData, function(d) {
					return d.id;
				});

			labelLinks.enter().append("svg:line")
				.attr("class", "labelLink")
				.attr("stroke", "#333")
				.attr("stroke-width", "1px");

			labelLinks
				.attr("x1", function(d) {
					return d.linkStartX;
				})
				.attr("y1", function(d) {
					return d.linkStartY;
				})
				.attr("x2", function(d) {
					return d.linkEndX;
				})
				.attr("y2", function(d) {
					return d.linkEndY;
				});

			labelLinks.exit().remove();
		};


		var render = function() {
			drawLabels();

			return g.node().getBBox();
		};

		return {
			init: init,
			render: render
		};
	};

	return bubbleLinks;
});