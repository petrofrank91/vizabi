gapminder.data.lineChartDataHelper = function (fileFormat, entityName, fileName, dataPathUri) {

    var dataCube;
    var indicators;
    var entityMeta;
    var yAxisName;
    var xAxisName;
    var yAxisInfo;
    var xAxisInfo;
    var dataHelperModel;
    var dataSetInfo;
    var renderCallback;
    var chartFooter;
    var regionsList;
    var timeUnit;
    var skeleton;

    var colorScale = d3.scale.category20();
    var colors = {
        America: {
            fill: "#80EC00",
            stroke: "#038000"
        },
        Europe: {
            fill: "#FFE800",
            stroke: "#CF6112"
        },
        Africa: {
            fill: "#00D6EA",
            stroke: "#07579C"
        },
        Asia: {
            fill: "#FF5973",
            stroke: "#960570"
        },
        bra: {
            fill: "#80EC00",
            stroke: "#038000"
        },
        ind: {
            fill: "#FF5973",
            stroke: "#960570"
        },
        ind_kind: {
            fill: "#FF5973",
            stroke: "#960570"
        },
        bra_kind: {
            fill: "#80EC00",
            stroke: "#038000"
        },
        rest: {
            fill: "#D6CBBA",
            stroke: "#D6CBBA"
        },
        IND: {
            fill: "#FF5973",
            stroke: "#960570"
        },
        BRA: {
            fill: "#FFFF00",
            stroke: "#000000"
        },
        AME: {
            fill: "#80EC00",
            stroke: "#038000"
        },
        EUR: {
            fill: "#FFE800",
            stroke: "#CF6112"
        },
        AFR: {
            fill: "#00D6EA",
            stroke: "#07579C"
        },
        ASI: {
            fill: "#FF5973",
            stroke: "#960570"
        }
    };


    var initialize = function (callback, args) {
        var options = {dataFormat: fileFormat, entity: entityName, fileName: fileName, dataPath: dataPathUri};

        dataCube = new gapminder.dataCube();
        dataCube.initialize(options, function (skeletonObj) {
            skeleton = skeletonObj;
            callback(args[0], args[1], args[2], args[3]);
        });
    };

    var get = function (indicator, entity, year, appModel, category) {
        var prevYear = Math.floor(year);
        var nextYear = Math.round(year);
        var fraction = year - Math.floor(year);
        var entityIndicator = indicators[timeUnit][category][indicator]["years"][entity];

        if (entityIndicator && entityIndicator["trends"][prevYear] && entityIndicator["trends"][nextYear]) {
            return interpolateValueBetweenYears(entityIndicator["trends"][prevYear].v, entityIndicator["trends"][nextYear].v, fraction);
        }
    };

    var validateState = function (model, changedState, callback, isValid) {
        dataHelperModel = model;
        renderCallback = callback;
        var fileName = model.get("fileName");
        var entity = model.get("entity");
        var dataPath = model.get("dataPath");

        if (!isValid) {
            setValidStateParams(model, changedState, loadNestedData);
        }
        else {
            loadNestedData(model, changedState);
        }
    };

    var loadNestedData = function (model, changedState) {
        var dataPath = model.get("dataPath");
        var indicatorsToLoad = getIndicatorsToLoad(model, dataPath, changedState);

        dataCube.loadNestedData(model, changedState, dataIsReady, indicatorsToLoad);
    };

    var getEntityLayerObject = function () {
        var entities = [];
        $.each(entityMeta, function (index, geoName) {
            var entity = {id: index, max: get(dataHelperModel.get("yIndicator"), index, getMaxYear(), dataHelperModel, geoName[0].parent)};
            entities.push(entity);
        });

        return entities;
    };

    var dataIsReady = function (entityObj, indicatorsObj, chartInfo, regions) {
        indicators = $.extend(true, indicators, indicatorsObj);
        setTimeUnit();

        entityMeta = $.extend(true, entityMeta, entityObj);
        if (regions) {
            regionsList = regions;
        }

        setDatasetAndChartInfo(chartInfo);
        setAxesNameAndInfo();

        renderCallback();
    };

    var setTimeUnit = function () {
        for (var unit in indicators) {
            if (indicators.hasOwnProperty(unit)) {
                timeUnit = unit;
            }
        }
    };

    var setValidStateParams = function (model, changedState, setValidModelCallback) {
        var dataFormat = model.get("fileFormat");
        var dataPath = model.get("dataPath");

        console.warn("State is invalid. Loading indicators from " + dataPath + "indicators.csv");

        changedState = $.extend(true, changedState, model.setIndicatorForInvalidState(changedState, skeleton.indicators[0].id, skeleton.indicators[1].id, skeleton.indicators[2].id));
        loadNestedData(model, changedState);
    };

    var getRangeOfIndicators = function (indicator, isMax) {
        var index = 0;
        var indicatorName = dataHelperModel.get(indicator);
        var rangeOfIndicators = [];

        if (isMax) {
            index = 1;
        }

        for (var entity in indicators[timeUnit]) {
            if (indicators[timeUnit].hasOwnProperty(entity)) {
                for (var ind in indicators[timeUnit][entity]) {
                    if (ind === indicatorName) {
                        rangeOfIndicators.push(indicators[timeUnit][entity][ind]["scope"]["value"][index]);
                    }
                }
            }
        }

        var rangeValue;
        if (isMax) {
            rangeValue = Math.max.apply(Math, rangeOfIndicators);
        }
        else {
            rangeValue = Math.min.apply(Math, rangeOfIndicators);
        }

        return rangeValue;

    };

    var getTimeRange = function (isMax) {
        var index = 0;
        var rangeOfIndicators = [];

        if (isMax) {
            index = 1;
        }

        for (var entity in indicators[timeUnit]) {
            if (indicators[timeUnit].hasOwnProperty(entity)) {
                for (var indicatorName in indicators[timeUnit][entity]) {
                    if (indicators[timeUnit][entity].hasOwnProperty(indicatorName)) {
                        rangeOfIndicators.push(indicators[timeUnit][entity][indicatorName]["scope"]["time"][index]);
                    }
                }
            }
        }

        return Math.max.apply(Math, rangeOfIndicators);
    };

    var getDataObject = function (indicator, year) {
        var currentEntities = {};
        var category = dataHelperModel.get("entity") || dataHelperModel.get("category");

        $.each(entityMeta, function (index, geoName) {
            var entityCategory = geoName[0].parent;
            var minYear = getMinTimeForEntity(indicator, category, index);

            currentEntities[index] = [];

            for (var i = minYear; i < year; i++) {
                if (category.indexOf(entityCategory) >= 0) {
                    var o = {};
                    o.id = index;
                    o.y = get(dataHelperModel.get("yIndicator"), index, i, dataHelperModel, entityCategory);
                    o.x = i;
                    o.color = getColor(index, "fill", entityCategory);
                    o.year = i;
                    o.category = entityCategory;

                    if (o.x && o.y) {
                        currentEntities[index].push(o);
                    }
                }
            }
        });

        return currentEntities;
    };


    var getEntityMeta = function () {
        return entityMeta;
    };

    var getNestedData = function () {
        return indicators;
    };

    var getMaxOfXIndicator = function () {
        return getRangeOfIndicators("xIndicator", true);
    };

    var getMinOfXIndicator = function () {
        return getRangeOfIndicators("xIndicator", false);
    };

    var getMaxOfYIndicator = function () {
        return getRangeOfIndicators("yIndicator", true);
    };

    var getMinOfYIndicator = function () {
        return getRangeOfIndicators("yIndicator", false);
    };

    var getMinOfSizeIndicator = function () {
        return getRangeOfIndicators("sizeIndicator", false);
    };

    var getMaxOfSizeIndicator = function () {
        return getRangeOfIndicators("sizeIndicator", true);
    };

    var getMinYear = function () {
        return getTimeRange(false);
    };

    var getMaxYear = function () {
        return getTimeRange(true);
    };

    var getChartInfo = function () {
        return dataSetInfo;
    };

    var getChartFooter = function () {
        return chartFooter;
    };

    var getAxisNames = function () {
        return [xAxisName, yAxisName];
    };

    var getAxisInfo = function () {
        return [xAxisInfo, yAxisInfo];
    };

    var getColor = function (id, type, category) {
        //var region = entityMeta[category][id][0].region;
        var region = entityMeta[id][0].region;
        if (colors[region]) {
            return colors[region][type];
        }
        else if (regionsList.length > 0) {
            return colorScale(regionsList.indexOf(region));
        }
        else {
            return "#FF5973";
        }
    };

    var interpolateValueBetweenYears = function (prevNumber, nextNumber, fraction) {
        return prevNumber + (nextNumber - prevNumber) * fraction;
    };

    var getName = function (id, category) {
        //return entityMeta[category][id][0].name;
        return entityMeta[id][0].name;
    };

    var setDatasetAndChartInfo = function (chartInfo) {
        if (chartInfo) {
            dataSetInfo = chartInfo[0];
            chartFooter = chartInfo[1];
        }
    };

    var setAxesNameAndInfo = function () {
        var xIndicator = dataHelperModel.get("xIndicator");
        var yIndicator = dataHelperModel.get("yIndicator");

        for (var entity in indicators[timeUnit]) {
            if (indicators[timeUnit].hasOwnProperty(entity)) {
                for (var indicatorName in indicators[timeUnit][entity]) {
                    if (indicators[timeUnit][entity].hasOwnProperty(indicatorName) && indicatorName == xIndicator) {
                        xAxisInfo = indicators[timeUnit][entity][indicatorName]["info"].info;
                        xAxisName = indicators[timeUnit][entity][indicatorName]["info"].name;
                    }
                    else if (indicators[timeUnit][entity].hasOwnProperty(indicatorName) && indicatorName == yIndicator) {
                        yAxisInfo = indicators[timeUnit][entity][indicatorName]["info"].info;
                        yAxisName = indicators[timeUnit][entity][indicatorName]["info"].name;
                    }
                }
            }
        }

    };

    var getDataForYear = function (indicator, entity, year, category) {
        return indicators[timeUnit][category][indicator]["years"][entity]["trends"][year].v;
    };

    var getIndicatorsToLoad = function (model) {
        var dataPath = model.get("dataPath");
        var entity = model.get("entity");
        var indicatorsToLoad = {};
        var categories = model.get("category");
        var indicators = [model.get("yIndicator")];
        var skeletonCategories = skeleton.categories;

        if (categories.length === 0) {
            categories.push(entity);
        }

        for (var i = 0; i < categories.length; i++) {
            indicatorsToLoad[categories[i]] = [];
            if (skeletonCategories && skeletonCategories.length > 0) {
                for (var j = 0; j < skeletonCategories.length; j++) {
                    if (categories[i] === skeletonCategories[j].id) {
                        var loadedIndicators = skeletonCategories[j].things;
                        if (loadedIndicators.length > 0) {
                            for (k = 0; k < indicators.length; k++) {
                                var indicatorLoaded = false;
                                for (var m = 0; m < loadedIndicators.length; m++) {
                                    if (loadedIndicators[m] === indicators[k]) {
                                        indicatorLoaded = true;
                                    }
                                }

                                if (!indicatorLoaded) {
                                    indicatorsToLoad[categories[i]].push(indicators[k]);
                                }
                            }
                        }
                        else {
                            for (var k = 0; k < indicators.length; k++) {
                                indicatorsToLoad[categories[i]].push(indicators[k]);
                            }
                        }
                    }
                }
            }
            else {
                for (var k = 0; k < indicators.length; k++) {
                    indicatorsToLoad[categories[i]].push(indicators[k]);
                }
            }
        }


        for (var category in indicatorsToLoad) {
            if (indicatorsToLoad.hasOwnProperty(category)) {
                if (indicatorsToLoad[category].length === 0) {
                    delete indicatorsToLoad[category];
                }
            }
        }

        return indicatorsToLoad;
    };


    var getMinValueForEntity = function (indicator, category, entity) {
        if (indicators["yearly"][category][indicator]["years"][entity]["scope"]) {
            return indicators["yearly"][category][indicator]["years"][entity]["scope"]["value"][0];
        }
    };

    var getMinTimeForEntity = function (indicator, category, entity) {
        if (indicators["yearly"][category][indicator]["years"][entity]["scope"]) {
            return indicators["yearly"][category][indicator]["years"][entity]["scope"]["time"][0];
        }
    };

    var getMaxValueForEntity = function (indicator, category, entity) {
        if (indicators["yearly"][category][indicator]["years"][entity]["scope"]) {
            return indicators["yearly"][category][indicator]["years"][entity]["scope"]["value"][1];
        }
    };

    var getMaxTimeForEntity = function (indicator, category, entity) {
        if (indicators["yearly"][category][indicator]["years"][entity]["scope"]) {
            return indicators["yearly"][category][indicator]["years"][entity]["scope"]["time"][1];
        }
    };


    return {
        initialize: initialize,
        get: get,
        getEntityMeta: getEntityMeta,
        getNestedData: getNestedData,
        getMaxOfXIndicator: getMaxOfXIndicator,
        getMinOfXIndicator: getMinOfXIndicator,
        getMaxOfYIndicator: getMaxOfYIndicator,
        getMinOfYIndicator: getMinOfYIndicator,
        getMinOfSizeIndicator: getMinOfSizeIndicator,
        getMaxOfSizeIndicator: getMaxOfSizeIndicator,
        getMinYear: getMinYear,
        getMaxYear: getMaxYear,
        getChartInfo: getChartInfo,
        getChartFooter: getChartFooter,
        getAxisNames: getAxisNames,
        getAxisInfo: getAxisInfo,
        getEntityLayerObject: getEntityLayerObject,
        getDataObject: getDataObject,
        getColor: getColor,
        getName: getName,
        getDataForYear: getDataForYear,
        getMinValueForEntity: getMinValueForEntity,
        getMinTimeForEntity: getMinTimeForEntity,
        getMaxValueForEntity: getMaxValueForEntity,
        getMaxTimeForEntity: getMaxTimeForEntity,
        validateState: validateState
    };
};