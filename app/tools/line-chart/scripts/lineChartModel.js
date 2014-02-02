gapminder.lineChartModel = function () {

    var dataHelper;

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
        xAxisScale: "linear",
        yAxisScale: "linear",
        isInteractive: false,
        xAxisTickValues: undefined,
        yAxisTickValues: undefined,
        language: undefined,
        positions: {},
        editMode: false,
        category: []
    };


    var initialize = function (callback, args) {
        dataHelper = new gapminder.data.lineChartDataHelper(get("fileFormat"), get("entity"), get("fileName"), get("dataPath"));
        dataHelper.initialize(callback, args);
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
        initialize(processWithCallback, [this, dataNeedsToBeLoaded, changedStateAttr, modelAndDataReadyCallback]);
        //processWithCallback(this, dataNeedsToBeLoaded, changedStateAttr, modelAndDataReadyCallback);
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
        //if (modelIsNotSet) {modelIsNotSet=false; initialize();}
        processWithCallback(this, dataNeedsToBeLoaded, changedStateAttr, modelAndDataReadyCallback);
    };

    var processWithCallback = function (model, dataNeedsToBeLoaded, changedStateAttributes, modelAndDataIsReadyCallback) {
        var isStateValid = isValidState();

        if (dataNeedsToBeLoaded && typeof modelAndDataIsReadyCallback === 'function') {
            //dataHelper.load(model, changedStateAttributes, modelAndDataIsReadyCallback, isStateValid);
            dataHelper.validateState(model, changedStateAttributes, modelAndDataIsReadyCallback, isStateValid);
        }
        else if (typeof modelAndDataIsReadyCallback === 'function') {
            modelAndDataIsReadyCallback();
        }
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
        return dataHelper;
    };

    var getAttributes = function () {
        return stateAttributes;
    };

    var isValidState = function () {
        var xIndicator = get("xIndicator");
        var yIndicator = get("yIndicator");
        var dataPath = get("dataPath");

        if ((xIndicator || yIndicator) && dataPath) {
            return true;
        }
        else {
            return false;
        }
    };


    var setIndicatorForInvalidState = function (changedState, x, y, size) {
        stateAttributes.xIndicator = x;
        stateAttributes.yIndicator = y;
        stateAttributes.sizeIndicator = size;

        return {xIndicator: x, yIndicator: y, sizeIndicator: size};
    };

    //initialize();

    return {
        set: set,
        get: get,
        getDataHelper: getDataHelper,
        getAttributes: getAttributes,
        setIndicatorForInvalidState: setIndicatorForInvalidState,
        initialize: initialize,
        setInit: setInit
    };

};







