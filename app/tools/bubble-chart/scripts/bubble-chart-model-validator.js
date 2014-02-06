gapminder.bubbleChartModelValidator = function () {	
	  var dataHelper;
    var bubbleChartModel;
    var readyToRenderCallback;

    var initialize = function (fileFormat, entity, fileName, dataPath, args) {
        dataHelper = new gapminder.data.bubbleChartDataHelper(fileFormat, entity, 
          fileName, dataPath);
        dataHelper.initialize(validateAndProcessCallback, args);
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
        if (bubbleChartModel.get("minXValue") &&  bubbleChartModel.get("maxXValue")
            || (bubbleChartModel.get("minYValue") &&  bubbleChartModel.get("maxYValue"))) {
            if (bubbleChartModel.get("autoZoom")) {
                  var xIndicator = bubbleChartModel.get("xIndicator");
                  var xScope = dataHelper.getScopeOfIndicatorForCurrentYear(xIndicator, bubbleChartModel);

                  var yIndicator = bubbleChartModel.get("yIndicator");
                  var yScope = dataHelper.getScopeOfIndicatorForCurrentYear(yIndicator, bubbleChartModel);

                  var minXValue = bubbleChartModel.get("minXValue");
                  var maxXValue = bubbleChartModel.get("maxXValue");

                  var minYValue = bubbleChartModel.get("minYValue");
                  var maxYValue = bubbleChartModel.get("maxYValue");

                  if  (xScope.min < minXValue) {
                      bubbleChartModel.setUpdatedMiXValue(xScope.min);
                      //bubbleChartModel.setMinXValue(xScope.min);
                  }
                  if (xScope.max < maxXValue) {
                      bubbleChartModel.setUpdatedMaxXValue(xScope.max);
                      //bubbleChartModel.setMaxXValue(xScope.max);
                  }
                  if (yScope.min < minYValue) {
                      bubbleChartModel.setUpdatedMinYValue(yScope.min);
                      //bubbleChartModel.setMinYValue(yScope.min);
                  }
                  if (yScope.max < maxYValue) {
                      bubbleChartModel.setUpdatedMaxYValue(yScope.max);
                      //bubbleChartModel.setMaxYValue(yScope.max);
                  }
            }
        }
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
        }
        dataHelper.loadData(model,changedState, modelIsValidAndProcessWithCallback);
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
          isAnyBubblesOutOfScope();
          readyToRenderCallback();
      }
    };

    var validateAndProcessCallback = function (model, dataNeedsToBeLoaded, changedStateAttributes, modelAndDataIsReadyCallback) {
        if (dataNeedsToBeLoaded && typeof modelAndDataIsReadyCallback === 'function') {
            validateState(model, changedStateAttributes, modelAndDataIsReadyCallback, dataHelper);
        }
        else if (typeof modelAndDataIsReadyCallback === 'function' ) {
            modelAndDataIsReadyCallback();
        }
    };

    var getDataHelper = function () {
        return dataHelper;
    };


    return {
  	  isMissingIndicators: isMissingIndicators,
  	  isAnyBubblesOutOfScope: isAnyBubblesOutOfScope,
      validateState: validateState,
      validate: validateAndProcessCallback,
      getDataHelper: getDataHelper,
      initialize: initialize
	  };
};