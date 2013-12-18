gapminder.data.readerMultipleJSON = function () {
    var indicators = {};
    var entityMeta = {};
    var loadedIndicators = [];
    var readIsCompletedCallback;
    var timeUnit = "yearly";
    var entitiesData = [];
    var skeleton = {indicators: [], categories: []};
    var jsonPath;
    var dataLoadQueue;

    var initialize =  function (indicatorsTemplate, model, dataPath, indicatorsToLoad, callback, changedState, language, fileName, timeUnitToken) {
        readIsCompletedCallback = callback;
        indicators = indicatorsTemplate;
        jsonPath = dataPath;
        dataLoadQueue = new queue();
    };

    var loadEntities = function (indicatorsToLoad) {
        for (var entity in indicatorsToLoad) {
            if (indicatorsToLoad.hasOwnProperty(entity)) {
                (function(entity) {
                    dataLoadQueue.defer(function(callback) {
                        loadEntity(entity, callback);
                    });
                })(entity);
            }
        }

    };

    var loadEntity = function (entity, callback) {
        console.log(jsonPath);
        d3.json(jsonPath + "entities/" + entity + ".json" , function(errorEntity, entityJson) {

            var countries = entityJson.countries;
            for (var i=0; i < countries.length; i++)
            {
                entitiesData.push({id: countries[i].name, region: countries[i].region , name:countries[i].name, parent: entity});
            }

            entityMeta = d3.nest().key(function(d){ return d.id; }).map(entitiesData);
            callback();
        });
    };

    var loadIndicatorData = function(indicatorsToLoad) {
        for (var entity in indicatorsToLoad) {
            if (indicatorsToLoad.hasOwnProperty(entity)) {
                indicatorsToLoad[entity].forEach(function(indicator) {
                    (function(entity){
                        dataLoadQueue.defer(function(callback) {
                            loadJSONFile(indicator, entity, callback);
                        });
                    })(entity);
                });
            }
        }

        dataLoadQueue.await(indicatorsLoaded);
    };

    var loadJSONFile = function(indicator, entityName, callback) {
        d3.json(jsonPath + "indicators/" + indicator + "_" + entityName + ".json", function (errorIndicator, json) {
            if (errorIndicator) {
                console.log("There was a problem rendering", indicator, ".json file");
            }

            var data = json.trends;
            for (var entity in data) {
                if (data.hasOwnProperty(entity)) {
                    indicators[timeUnit][entityName][json.info.measure_id]["info"]["name"] = json.info.measure_name;
                    indicators[timeUnit][entityName][json.info.measure_id]["info"]["id"] = json.info.measure_id;

                    for (var entityObj in data) {
                        if (data.hasOwnProperty(entityObj)) {
                            loadIndicator(entityName, json, entityObj);
                            updateEntityScope(entityName, json, entityObj);
                        }
                    }
                }
            }

            setSkeletonInfo(entity, indicator);
            updateDataScope(indicator, entityName);

            callback(null,indicators);
        });
    };

    var loadIndicator = function (entityName, json, entityObj) {
        var data = json.trends;

        indicators[timeUnit][entityName][json.info.measure_id]["years"][entityObj] = {};
        indicators[timeUnit][entityName][json.info.measure_id]["years"][entityObj]["trends"] = {};
        for (var year in data[entityObj]) {
            if (data[entityObj].hasOwnProperty(year)) {
                indicators[timeUnit][entityName][json.info.measure_id]["years"][entityObj]["trends"][year] = {};
                indicators[timeUnit][entityName][json.info.measure_id]["years"][entityObj]["trends"][year].v =  data[entityObj][year];
                indicators[timeUnit][entityName][json.info.measure_id]["years"][entityObj]["trends"][year].n =  [];
            }
        }
    };


    var updateEntityScope = function (entityName, json, entityObj) {
        var yearKeys = Object.keys(indicators[timeUnit][entityName][json.info.measure_id]["years"][entityObj]["trends"]);
        var years = (yearKeys).map(function(year) {
            return parseInt(year,10);
        });

        var minYear = Math.min.apply(Math,years);
        var maxYear = Math.max.apply(Math,years);
        indicators[timeUnit][entityName][json.info.measure_id]["years"][entityObj]["scope"] = {};
        indicators[timeUnit][entityName][json.info.measure_id]["years"][entityObj]["scope"]["time"] = {};
        indicators[timeUnit][entityName][json.info.measure_id]["years"][entityObj]["scope"]["value"] = {};

        indicators[timeUnit][entityName][json.info.measure_id]["years"][entityObj]["scope"]["time"]["0"] = minYear;
        indicators[timeUnit][entityName][json.info.measure_id]["years"][entityObj]["scope"]["time"]["1"] = maxYear;
        indicators[timeUnit][entityName][json.info.measure_id]["years"][entityObj]["scope"]["value"]["0"] = indicators[timeUnit][entityName][json.info.measure_id]["years"][entityObj]["trends"][minYear].v;
        indicators[timeUnit][entityName][json.info.measure_id]["years"][entityObj]["scope"]["value"]["1"] = indicators[timeUnit][entityName][json.info.measure_id]["years"][entityObj]["trends"][maxYear].v;
    };

    var updateDataScope = function (indicator, entity) {
        if (indicators[timeUnit][entity][indicator]["scope"]["time"]) {
            var indicatorValuesAndYears = getIndicatorValuesAndCorrespondingYears(indicators[timeUnit][entity][indicator]["years"]);

            var indicatorValues = indicatorValuesAndYears[0];
            var indicatorValueMin = Math.min.apply(Math, indicatorValues);
            var indicatorValueMax = Math.max.apply(Math, indicatorValues);
            indicators[timeUnit][entity][indicator]["scope"].value =[indicatorValueMin,
                indicatorValueMax];

            var indicatorYears = indicatorValuesAndYears[1];
            var minYear = Math.min.apply(Math, indicatorYears);
            var maxYear = Math.max.apply(Math, indicatorYears);
            indicators[timeUnit][entity][indicator]["scope"].time = [minYear, maxYear];
        }
    };

    var getIndicatorValuesAndCorrespondingYears = function(indicatorObject) {
        var indicatorValues = [];
        var yearsValues = [];

        for (var entity in indicatorObject) {
            if (indicatorObject.hasOwnProperty(entity)) {
                for (var yearValue in indicatorObject[entity]["trends"]) {
                    if (indicatorObject[entity]["trends"].hasOwnProperty(yearValue)) {
                        var indicatorForEntity  = indicatorObject[entity]["trends"];
                        indicatorValues.push(indicatorForEntity[yearValue].v);
                        yearsValues.push(yearValue);
                    }
                }
            }
        }

        return [indicatorValues, yearsValues];
    };


    var indicatorsLoaded = function(err, results) {
        if (typeof readIsCompletedCallback === 'function') {
            readIsCompletedCallback(loadedIndicators, indicators,entityMeta, {}, [], timeUnit);

        }
    };

    var loadSkeleton = function(path, setSkeletonCallback) {
        var q = new queue();
        q.defer(function(callback) {
            loadSkeletonIndicator(path, callback);
        })
            .defer(function(callback) {
                loadSkeletonCategory(path, callback);
            })
            .await(function() {
                setSkeletonCallback(skeleton);
            });

    };

    var loadSkeletonIndicator = function (path, callback) {
        d3.json(path + "skeleton.json", function(error, data) {
            skeleton.indicators = data.indicators;
            callback();
        });
    };

    var loadSkeletonCategory = function (path, callback) {
        d3.json(path + "skeleton.json", function(error, data) {
            skeleton.indicators = data.indicators;
            callback();
        });
    };

    var setSkeletonInfo = function(categoryId, indicator) {
        for (var i = 0; i < skeleton.categories.length; i++) {
            if (skeleton.categories[i].id === categoryId) {
                skeleton.categories[i].things.push(indicator);
            }
        }
    };

    return {
        initialize: initialize,
        loadSkeleton: loadSkeleton,
        loadCategory: loadEntities,
        loadIndicators: loadIndicatorData
    };
};