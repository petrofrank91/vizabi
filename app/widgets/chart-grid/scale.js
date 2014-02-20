define(['d3'], function(d3) {

	var scale = function() {

		var xScale;
		var yScale;
		var bubbleSizeScale;
		var fontSizeScale;

		var domain;
		var range;

		var init = function(axis, type, domainVal, rangeVal) {
			domain = domainVal;
			range = rangeVal;

			if (type === "log" && axis === "x") {
				xScale = log();
			} else if (type === "log" && axis === "y") {
				yScale = log();
			} else if (type === "linear" && axis === "x") {
				xScale = linear();
			} else if (type === "log" && axis === "y") {
				yScale = log();
			} else if (type === "sqrt" && axis === "font") {
				fontSizeScale = linear();
			} else if (type === "sqrt" && axis === "bubble") {
				bubbleSizeScale = sqrt();
			}

		};

		var log = function() {
			return d3.scale.log().domain(domain).range(range);
		};

		var linear = function() {
			return d3.scale.log().domain(domain).range(range);
		};

		var sqrt = function() {
			return d3.scale.sqrt().domain(domain).range(range).exponent(0.5);
		}

		var get = function(axis) {
			var result;
			if (axis === "x") {
				result = xScale;
			} else if (axis === "y") {
				result = yScale;
			} else if (axis === "font") {
				result = fontSizeScale;
			} else if (axis === "bubble") {
				result = bubbleSizeScale;
			}

			return result;
		};

		return {
			init: init,
			get: get
		};
	};

	return scale();
});