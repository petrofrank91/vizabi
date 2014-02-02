define(['util', 'bubble-chart-datahelper'], function (util, bubbleChartDataHelper) {

    var bubbleChartModelValidator = function () {
        var dataHelper;
        var bubbleChartModel;
        var readyToRenderCallback;

        var initialize = function (fileFormat, entity, fileName, dataPath, args) {
            dataHelper = new bubbleChartDataHelper(fileFormat, entity,
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


        var validateState = function (model, changedState, callback, dataHelperObj) {
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
            dataHelper.loadData(model, changedState, modelIsValidAndProcessWithCallback);
        };

        var setValidState = function (model, changedState) {
            var dataPath = model.get("dataPath");
            var skeleton = dataHelper.getSkeleton();
            console.warn("State is invalid. Loading indicators from " + dataPath + "indicators.csv");

            changedState = util.extend(true, changedState,
                model.setIndicatorForInvalidState(changedState, skeleton.indicators[0].id, skeleton.indicators[1].id, skeleton.indicators[2].id));

        };

        var modelIsValidAndProcessWithCallback = function () {
            if (typeof readyToRenderCallback === "function") {
                readyToRenderCallback();
            }
        };

        var validateAndProcessCallback = function (model, dataNeedsToBeLoaded, changedStateAttributes, modelAndDataIsReadyCallback) {
            if (dataNeedsToBeLoaded && typeof modelAndDataIsReadyCallback === 'function') {
                validateState(model, changedStateAttributes, modelAndDataIsReadyCallback, dataHelper);
            }
            else if (typeof modelAndDataIsReadyCallback === 'function') {
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

    return bubbleChartModelValidator;

});