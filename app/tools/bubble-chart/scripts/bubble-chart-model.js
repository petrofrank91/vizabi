gapminder.bubbleChartModel =  function () {

    var dataHelper;
    var validator;

    var stateAttributes = {
        s : {},
        opacity : 0.5,
        speed : 0.1,
        zoom : {},
        trails : "none",
        tSpeed : 300,
        action : "multi",
        enableHistory : true,
        year: undefined,
        xIndicator : undefined,
        yIndicator : undefined,
        sizeIndicator : undefined,
        entity: undefined,
        fraction : undefined,
        prevYear : undefined,
        nextYear : undefined,
        dataPath: undefined,
        fileFormat: undefined,
        fileName: undefined,
        minXValue: undefined,
        maxXValue: undefined,
        minYValue: undefined,
        maxYValue: undefined,
        xAxisScale: "linear",
        yAxisScale:"linear",
        isInteractive: false,
        xAxisTickValues: undefined,
        yAxisTickValues: undefined,
        language: undefined,
        minFontSize :undefined,
        maxFontSize: undefined,
        minBubbleSize: undefined,
        maxBubbleSize: undefined,
        positions : {},
        editMode: false,
        category: []
    };


    var initialize = function(callback, args) {
        dataHelper = new gapminder.data.bubbleChartDataHelper(get("fileFormat"), get("entity"), get("fileName"), get("dataPath"));
        dataHelper.initialize(callback, args);
        validator = new gapminder.bubbleChartModelValidator();
    };

    var setInit = function(changedState, modelAndDataReadyCallback) {
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

        console.log("What changed: ",  changedStateAttr);
        initialize(checkIfDataNeedsToBeLoaded, [this, dataNeedsToBeLoaded, changedStateAttr, modelAndDataReadyCallback]);
    };


    var set = function(changedState, modelAndDataReadyCallback) {
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

        console.log("What changed: ",  changedStateAttr);
        checkIfDataNeedsToBeLoaded(this, dataNeedsToBeLoaded, changedStateAttr, modelAndDataReadyCallback);
    };


    var checkIfDataNeedsToBeLoaded = function (model, dataNeedsToBeLoaded, changedStateAttributes, modelAndDataIsReadyCallback) {

        //console.log("JUST SO YOU KNOW ..." + validator.isAnyBubblesOutOfScope(model));

        if (dataNeedsToBeLoaded && typeof modelAndDataIsReadyCallback === 'function') {
            // Wrong place
            //dataHelper.validateState(model, changedStateAttributes, modelAndDataIsReadyCallback, isStateValid);
            validator.validateState(model, changedStateAttributes, modelAndDataIsReadyCallback, dataHelper);

        }
        else if (typeof modelAndDataIsReadyCallback === 'function' ) {
            modelAndDataIsReadyCallback();
        }
    };


    var get = function (state) {
        return stateAttributes[state];
    };

    var updateFraction = function() {
        var year = stateAttributes.year;

        stateAttributes.fraction = year - Math.floor(year);
        stateAttributes.prevYear = Math.floor(year);
        stateAttributes.nextYear = Math.ceil(year);
    };

    var getDataHelper = function () {
        return dataHelper;
    };

    var getAttributes = function() {
        return stateAttributes;
    };

    var setIndicatorsForMissingIndicatorsState = function (changedState, x, y, size) {
        stateAttributes.xIndicator = x;
        stateAttributes.yIndicator = y;
        stateAttributes.sizeIndicator = size;

        return {xIndicator: x, yIndicator: y, sizeIndicator:size};
    };

    //initialize();

    return {
        set: set,
        get: get,
        getDataHelper: getDataHelper,
        getAttributes: getAttributes,
        setIndicatorForInvalidState: setIndicatorsForMissingIndicatorsState,
        initialize: initialize,
        setInit: setInit
    };

};







