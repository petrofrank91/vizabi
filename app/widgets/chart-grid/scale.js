define(['d3'], function (d3) {

	var scale = function () {

		var xScale = null;
		var yScale = null;
		var domain;
		var range;

		var init = function (axis, type, domainVal, rangeVal) {
				domain = domainVal;
				range = rangeVal;
				
				if (type === "log" && axis === "x") {
					xScale = log();
				} 
				else if (type === "log" && axis === "y") {
					yScale = log();
				}
				else if (type === "linear" && axis === "x") {
					xScale = linear();	
				} 
				else if (type === "log" && axis === "y") {
					yScale = log();
				}
		};

		var log = function () {
			 return d3.scale.log().domain(domain).range(range);
		};

		var linear = function () {
			return  d3.scale.log().domain(domain).range(range);
		};

		var get = function (axis) {
			if (axis === "x") {
				return xScale;
			}
			return yScale;
		};

		return {
			init: init,
			get: get
		};
	};

	return scale();
});