gapminder.bubbleChartModelValidator = function () {
	
	var dataHelper;
    var bubbleChartModel;
    var readyToRenderCallback;

    var initialize = function () {
        //dataHelper = new gapminder.data.bubbleChartDataHelper();
    };

    var isMissingIndicators = function (model) {
       bubbleChartModel = model;
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
        var xIndicator = bubbleChartModel.get("xIndicator");
        var xScope = dataHelper.getScopeOfIndicatorForCurrentYear(xIndicator, bubbleChartModel);

        var yIndicator = bubbleChartModel.get("yIndicator");
        var yScope = dataHelper.getScopeOfIndicatorForCurrentYear(yIndicator, bubbleChartModel);

        var minXValue = bubbleChartModel.get("minXValue");
        var maxXValue = bubbleChartModel.get("maxXValue");

        var minYValue = bubbleChartModel.get("minYValue");
        var maxYValue = bubbleChartModel.get("maxYValue");

        return  ((xScope.min < minXValue || xScope.max > maxXValue)
                && (yScope.min < minYValue || yScope.max > maxYValue));
    };


    var validateState = function(model, changedState , callback, dataHelperObj) {
        dataHelper = dataHelperObj;
        bubbleChartModel = model;
        readyToRenderCallback = callback;
        var isStateValid = isMissingIndicators(model);


        var fileName = model.get("fileName");
        var entity = model.get("entity");
        var dataPath = model.get("dataPath");

        if (!isStateValid) {
            setValidState(model, changedState);
            //loadNestedData(model, changedState);
        }
        //else {
        dataHelper.loadData(model,changedState, modelIsValidAndProcessWithCallback);
        //}
    };

    var setValidState = function (model, changedState) {
        var dataPath = model.get("dataPath");
        var skeleton = dataHelper.getSkeleton();
        console.warn("State is invalid. Loading indicators from " + dataPath + "indicators.csv");

        changedState = Object.extend(true, changedState,
            model.setIndicatorForInvalidState(changedState, skeleton.indicators[0].id, skeleton.indicators[1].id, skeleton.indicators[2].id));

    };

    var modelIsValidAndProcessWithCallback = function () {
      if (typeof readyToRenderCallback === "function") {
          readyToRenderCallback();
      }
    };


    initialize();

    return {
		isMissingIndicators: isMissingIndicators,
		isAnyBubblesOutOfScope: isAnyBubblesOutOfScope,
        validateState: validateState
	};
};