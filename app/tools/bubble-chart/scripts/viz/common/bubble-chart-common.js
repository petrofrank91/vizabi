define(['bubble-chart-components'], function(components) {

	var bubbleChartCommon = function() {
		var paddingRight;
		var paddingTop;

		var getXTransform = function() {
			var gridXTransform = components.get().xAxis.getAxisGrid().attr("transform");

			if (gridXTransform) {
				paddingRight = parseInt(gridXTransform.substring(gridXTransform.indexOf("(") + 1,
					gridXTransform.indexOf(",")));
			}

		};

		var getYTransform = function() {
			var gridYTransform = components.get().yAxis.getAxisGrid().attr("transform");
			if (gridYTransform) {
				paddingTop = parseInt(gridYTransform.substring(gridXTransform.indexOf(",") + 1,
					gridXTransform.indexOf(")")));
			}
		};

		var getPaddingRight = function() {
			getXTransform();

			return paddingRight;
		};

		var getPaddingTop = function() {
			getYTransform();

			return paddingTop;
		};

		var fitWithinLabelConstraints = function(bbox, x, y) {
			var coordinates = {
				x: x,
				y: y
			};
			var padding = 5;

			var minX = bbox.width / 2 + padding;
			var maxX = availableWidth - (bbox.width / 2) - padding;
			var minY = bbox.height / 2 + padding;
			var maxY = availableHeight - (bbox.height / 2) - padding;

			if (x < minX) {
				coordinates.x = minX;
			}
			if (x > maxX) {
				coordinates.x = maxX;
			}
			if (y < minY) {
				coordinates.y = minY;
			}
			if (y > maxY) {
				coordinates.y = maxY;
			}

			return coordinates;
		};


		return {
			getPaddingTop: getPaddingTop,
			getPaddingRight: getPaddingRight,
			fitWithinLabelConstraints: fitWithinLabelConstraints
		};
	};

	return bubbleChartCommon;


});