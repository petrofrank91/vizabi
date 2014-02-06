define(['bubble-chart-model-validator'], function (bubbleChartModelValidator) {

    var bubbleChartModel = function () {

        var dataHelper;
        var validator;

    var stateAttributes = {
        s: {},
        opacity: 0.5,
        speed: 0.1,
        zoom: {},
        trails: "none",
        tSpeed: 300,
        action: "multi",
        enableHistory: true,
        year: undefined,
        xIndicator: undefined,
        yIndicator: undefined,
        sizeIndicator: undefined,
        entity: undefined,
        fraction: undefined,
        prevYear: undefined,
        nextYear: undefined,
        dataPath: undefined,
        fileFormat: undefined,
        fileName: undefined,
        minXValue: undefined,
        maxXValue: undefined,
        minYValue: undefined,
        maxYValue: undefined,
        updatedMinXValue: undefined,
        updatedMaxXValue: undefined,
        updatedMinYValue: undefined,
        updatedMaxYValue: undefined,
        xAxisScale: "linear",
        yAxisScale: "linear",
        isInteractive: false,
        xAxisTickValues: undefined,
        yAxisTickValues: undefined,
        language: undefined,
        minFontSize: undefined,
        maxFontSize: undefined,
        minBubbleSize: undefined,
        maxBubbleSize: undefined,
        positions: {},
        editMode: false,
        category: [],
        autoZoom: false
    };


        var initialize = function (args) {
            validator = new bubbleChartModelValidator();
            validator.initialize(get("fileFormat"), get("entity"),
                get("fileName"), get("dataPath"), args);
        };

        var setInit = function (changedState, modelAndDataReadyCallback) {
            console.log("BUBBLE MODEL SET STATE: ", changedState);

            var changedStateAttr = {};
            var dataNeedsToBeLoaded = false;
            for (var attr in changedState) {
                if (changedState.hasOwnProperty(attr) && (stateAttributes[attr]) !== changedState[attr]) {
                    stateAttributes[attr] = changedState[attr];
                    changedStateAttr[attr] = changedState[attr];

                    if (attr.indexOf("Indicator") >= 0 || attr.indexOf("language") || attr.indexOf("dataPath") || attr.indexOf("entity") || attr.indexOf("category")) {
                        dataNeedsToBeLoaded = true;
                    }
                    if (attr === "year") {
                        updateFraction();
                    }
                }
            }

            console.log("What changed: ", changedStateAttr);
            initialize([this, dataNeedsToBeLoaded, changedStateAttr, modelAndDataReadyCallback]);
        };


        var set = function (changedState, modelAndDataReadyCallback) {
            console.log("BUBBLE MODEL SET STATE: ", changedState);

            var changedStateAttr = {};
            var dataNeedsToBeLoaded = false;
            for (var attr in changedState) {
                if (changedState.hasOwnProperty(attr) && (stateAttributes[attr]) !== changedState[attr]) {
                    stateAttributes[attr] = changedState[attr];
                    changedStateAttr[attr] = changedState[attr];

                    if (attr.indexOf("Indicator") >= 0 || attr.indexOf("language") || attr.indexOf("dataPath") || attr.indexOf("entity") || attr.indexOf("category")) {
                        dataNeedsToBeLoaded = true;
                    }
                    if (attr === "year") {
                        updateFraction();
                    }
                }
            }

            console.log("What changed: ", changedStateAttr);
            validator.validate(this, dataNeedsToBeLoaded, changedStateAttr, modelAndDataReadyCallback);
        };


        var get = function (state) {
            return stateAttributes[state];
        };

        var updateFraction = function () {
            var year = stateAttributes.year;

            stateAttributes.fraction = year - Math.floor(year);
            stateAttributes.prevYear = Math.floor(year);
            stateAttributes.nextYear = Math.ceil(year);
        };

        var getDataHelper = function () {
            return validator.getDataHelper();
        };

        var getAttributes = function () {
            return stateAttributes;
        };

        var setIndicatorsForMissingIndicatorsState = function (changedState, x, y, size) {
            stateAttributes.xIndicator = x;
            stateAttributes.yIndicator = y;
            stateAttributes.sizeIndicator = size;

            return {
                xIndicator: x,
                yIndicator: y,
                sizeIndicator: size
            };
        };

    var setUpdatedMiXValue = function (minX) {
        if  (typeof minX === 'number') {
            stateAttributes.updatedMinXValue = minX;
        }
    };

    var setUpdatedMaxXValue = function (maxX) {
        if  (typeof maxX === 'number') {
            stateAttributes.updatedMaxXValue = maxX;
        }
    };

    var setUpdatedMinYValue = function (minY) {
        if  (typeof minY === 'number') {
            stateAttributes.updatedMinYValue = minY;
        }
    };

    var setUpdatedMaxYValue = function (maxY) {
        if  (typeof maxY === 'number') {
            stateAttributes.updatedMaxYValue = maxY;
        }
    };

    var setMinXValue = function (value) {
        stateAttributes.minXValue = value;
    };

    var setMaxXValue = function (value) {
        stateAttributes.maxXValue = value;
    };

    var setMinYValue = function (value) {
        stateAttributes.minYValue = value;
    };

    var setMaxYValue = function (value) {
        stateAttributes.maxYValue = value;
    };


    return {
        set: set,
        get: get,
        getDataHelper: getDataHelper,
        getAttributes: getAttributes,
        setIndicatorForInvalidState: setIndicatorsForMissingIndicatorsState,
        initialize: initialize,
        setInit: setInit,
        setUpdatedMiXValue: setUpdatedMiXValue,
        setUpdatedMaxXValue: setUpdatedMaxXValue,
        setUpdatedMinYValue: setUpdatedMinYValue,
        setUpdatedMaxYValue: setUpdatedMaxYValue,
        setMinXValue: setMinXValue,
        setMaxXValue: setMaxXValue,
        setMinYValue: setMinYValue,
        setMaxYValue: setMaxYValue
    };

    };

    return bubbleChartModel;
});
