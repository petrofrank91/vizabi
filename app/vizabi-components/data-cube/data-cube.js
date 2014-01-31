define(['loader-factory', 'i18n-helper', 'util'], function (loaderFactory, i18nHelper, util) {

    var dataCube = function () {
        var timeUnit;
        var indicators = {};
        var entityMeta = {};
        var skeleton = {};

        var dataHelperModel;

        var loader;
        var _i18nHelper;

        var regionsList = [];

        var dataIsReadyCallback;

        var initialize = function (options, callback) {
            loader = loaderFactory(options.dataFormat);
            _i18nHelper = new i18nHelper();

            loadSkeleton(options.dataPath, function (skeletonObj) {
                skeleton = skeletonObj;
                callback(skeleton);
            }, options.fileName, options.entity);
        };

        var dataIsReady = function (skeletonObj, indicatorsObj, entitiesObj, chartInfo, regions, timeUnitVal) {
            skeleton = util.extend(true, skeleton, skeletonObj);
            indicators = util.extend(true, indicators, indicatorsObj);
            entityMeta = util.extend(true, entityMeta, entitiesObj);

            timeUnit = timeUnitVal;

            if (regions) {
                regionsList = regions;
            }

            interpolateDataValues();
            dataIsReadyCallback(entityMeta, indicators, chartInfo, regions, timeUnit);
        };

        var loadSkeleton = function (dataPath, loadCallback, fileName, entity) {
            skeleton = loader.loadSkeleton(dataPath, function (skeletonObj) {
                skeleton = skeletonObj;
                loadCallback(skeleton);
            }, fileName, entity);
        };

        var loadNestedData = function (model, changedState, callback, indicatorsToLoad) {
            var dataPath = changedState.dataPath || model.get("dataPath");
            var entity = changedState.entity || model.get("entity");
            var fileName = model.get("fileName");
            var language = changedState.language;
            var category = model.get("category");

            dataHelperModel = model;
            dataIsReadyCallback = callback;

            createNestedObjectTemplate(indicatorsToLoad);

            if (!util.isEmptyObject(indicatorsToLoad)) {
                loader.initialize(indicators, model, dataPath, indicatorsToLoad, dataIsReady, changedState, language, fileName);

                loader.loadCategory(indicatorsToLoad);
                loader.loadIndicators(indicatorsToLoad);
            }
            else {
                dataIsReadyCallback();
            }

        };

        // TODO: Problem here. Datacube does not already know what is written in file to create the nested object (for now, it shifts to default)
        var createNestedObjectTemplate = function (indicatorsToLoad) {
            var defaultTimeUnit = "yearly";
            for (var entity in indicatorsToLoad) {
                if (indicatorsToLoad.hasOwnProperty(entity)) {
                    if (!indicators.hasOwnProperty(defaultTimeUnit)) {
                        indicators[defaultTimeUnit] = {};

                    }
                    if (!indicators[defaultTimeUnit].hasOwnProperty(defaultTimeUnit)) {
                        indicators[defaultTimeUnit][entity] = {};
                    }
                    for (var indicator in indicatorsToLoad[entity]) {
                        if (indicatorsToLoad[entity].hasOwnProperty(indicator)) {
                            var indicatorName = indicatorsToLoad[entity][indicator];
                            indicators[defaultTimeUnit][entity][indicatorName] = {};
                            indicators[defaultTimeUnit][entity][indicatorName]["info"] = {};
                            indicators[defaultTimeUnit][entity][indicatorName]["years"] = {};
                            indicators[defaultTimeUnit][entity][indicatorName]["scope"] = {};
                            indicators[defaultTimeUnit][entity][indicatorName]["scope"]["time"] = {};
                            indicators[defaultTimeUnit][entity][indicatorName]["scope"]["value"] = {};
                        }
                    }
                }
            }
        };


        var languageUpdated = function (entitiesMetaObj, language) {
            entityMeta = util.extend(true, entityMeta, entitiesMetaObj);

            console.log("%cUpdating Bubble Labels with Language Code " + language + "...", "color: #bada55");
            dataIsReadyCallback(entityMeta, indicators);
        };

        var interpolateDataValues = function () {
            for (var category in indicators[timeUnit]) {
                if (indicators[timeUnit].hasOwnProperty(category)) {
                    for (var indicatorName in indicators[timeUnit][category]) {
                        if (indicators[timeUnit][category].hasOwnProperty(indicatorName)) {
                            for (var countryName in indicators[timeUnit][category][indicatorName]["years"]) {
                                if (indicators[timeUnit][category][indicatorName]["years"].hasOwnProperty(countryName)) {
                                    var curEntityIndiValue = indicators[timeUnit][category][indicatorName]["years"][countryName]["trends"];
                                    var yearData = [];
                                    var yearValue = [];
                                    for (var year in curEntityIndiValue) {
                                        if (curEntityIndiValue.hasOwnProperty(year)) {
                                            yearData.push(parseInt(year));
                                            yearValue.push(curEntityIndiValue[year].v);
                                        }
                                    }

                                    for (var s = 0; s < yearData.length; s++) {
                                        for (var bb = yearData[s] + 1; bb <= yearData[s + 1] - 1; bb++) {
                                            curEntityIndiValue[bb] = {};
                                            curEntityIndiValue[bb].n = [];
                                            curEntityIndiValue[bb].v = curEntityIndiValue[yearData[s]].v + (curEntityIndiValue[yearData[s + 1]].v - curEntityIndiValue[yearData[s]].v) * (bb - yearData[s]) / (yearData[s + 1] - yearData[s]);
                                        }

                                    }
                                    indicators[timeUnit][category][indicatorName]["years"][countryName]["trends"] = curEntityIndiValue;
                                }
                            }
                        }
                    }
                }
            }
        };

        var getNestedData = function () {
            return indicators;
        };

        var getSkeleton = function () {
            return skeleton;
        };


        return {
            initialize: initialize,
            loadNestedData: loadNestedData,
            getNestedData: getNestedData,
            loadSkeleton: loadSkeleton,
            getSkeleton: getSkeleton
        };
    };

    return dataCube;

});




