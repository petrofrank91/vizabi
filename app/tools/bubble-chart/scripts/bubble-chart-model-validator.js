gapminder.bubbleChartModelValidator = function () {
	
	var isMissingIndicators = function (model) {
       var xIndicator = model.get("xIndicator");
       var yIndicator = model.get("yIndicator");
       var sizeIndicator = model.get("sizeIndicator");
       var dataPath = model.get("dataPath");

       if (xIndicator && yIndicator && sizeIndicator && dataPath) {
           return true;
       }
        else {
           return false;
       }
    };	

    var isAnyBubblesOutOfScope = function () {
    		// make a call to bubble chart data helper to figure this out
    };

	return {
		isMissingIndicators: isMissingIndicators,
		isAnyBubblesOutOfScope: isAnyBubblesOutOfScope
	};
};