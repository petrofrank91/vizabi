gapminder.data.readerSingleCSV = function() {
    var indicators = {};
    var entityMeta = {};
    var loadedIndicators = [];
    var readIsCompletedCallback;
    var csvDataPath;
    var csvFileName;
    var entitiesData = [];
    var timeUnit = "yearly";
    var dataLoadQueue;
    var skeleton = {
        indicators: [],
        categories: []
    };

    var initialize = function(indicatorsTemplate, model, dataPath, indicatorsToLoad, callback, changedState, language, fileName) {
        indicators = indicatorsTemplate;
        readIsCompletedCallback = callback;
        csvDataPath = dataPath;
        csvFileName = fileName;
        dataLoadQueue = new queue();
    };

    var loadEntities = function(indicatorsToLoad) {

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
        console.log(csvDataPath);
        d3.csv(csvDataPath + csvFileName + ".csv", function (error, rows) {
            console.log("Loading entity ", entity, " ...");

            for (var i = 0; i < rows.length; i++) {
                entitiesData.push({
                    id: rows[i][entity],
                    name: rows[i][entity],
                    region: rows[i]["region"],
                    parent: entity
                });
            }

            entityMeta = d3.nest().key(function(d) {
                return d.id;
            }).map(entitiesData);

            callback();
        });
    };

    var loadIndicatorData = function(indicatorsToLoad) {

        for (var entity in indicatorsToLoad) {
            if (indicatorsToLoad.hasOwnProperty(entity)) {

                indicatorsToLoad[entity].forEach(function(indicator) {
                    (function(entity, indicator) {
                        dataLoadQueue.defer(function(callback) {
                            loadCSVFile(indicator, entity, callback);
                        });
                    })(entity, indicator);
                });
            }
        }

        dataLoadQueue.await(indicatorsLoaded);
    };

    var loadCSVFile = function(indicator, entity, callback) {
        d3.csv(csvDataPath + csvFileName + ".csv", function(error, rows) {
            console.log("loading ", csvFileName, ".csv");
            var indicatorValues = loadIndicator(entity, indicator, rows).indValues ;
            var years = loadIndicator(entity, indicator, rows).years;

            setSkeletonInfo(entity, indicator);
            updateEntityScope(entity,indicator);
            updateDataScope(indicator, entity, indicatorValues, years);

            callback(null, indicators);
        });
    };

    var loadIndicator = function (entity, indicator, rows) {
        var indicatorValues = [];
        var years = [];

        indicators[timeUnit][entity][indicator]["info"]["name"] = indicator;
        indicators[timeUnit][entity][indicator]["info"]["id"] = indicator;

        for (var i = 0; i < rows.length; i++) {
            if (rows[i].hasOwnProperty(entity)) {
                indicators[timeUnit][entity][indicator]["years"][rows[i][entity]] = {};
                indicators[timeUnit][entity][indicator]["years"][rows[i][entity]]["trends"] = {};
                indicators[timeUnit][entity][indicator]["years"][rows[i][entity]]["trends"][rows[i]["year"]] = {};
                indicators[timeUnit][entity][indicator]["years"][rows[i][entity]]["trends"][rows[i]["year"]]["n"] = [];
                indicators[timeUnit][entity][indicator]["years"][rows[i][entity]]["trends"][rows[i]["year"]]["v"] = parseFloat(rows[i][indicator]);
                indicatorValues.push(parseFloat(rows[i][indicator]));
                years.push(rows[i]["year"]);
            }
        }

        return {
            indValues : indicatorValues,
            yearValues: years
        };
    };

    var setSkeletonInfo = function(categoryId, indicator) {
        for (var i = 0; i < skeleton.categories.length; i++) {
            if (skeleton.categories[i].id === categoryId) {
                skeleton.categories[i].things.push(indicator);
            }
        }
    };

    var loadSkeleton = function(path, setSkeletonCallback, fileName, entity) {
        d3.csv(path + fileName + ".csv", function(error, rows) {
            var row = rows[0];
            for (var column in row) {
                if (row.hasOwnProperty(column)) {
                    var isNotRegionOrYearColumn = column !== "year" && column !== "region";
                    if (isNotRegionOrYearColumn && column !== entity) {
                        var indicator = {};
                        indicator["id"] = column;
                        indicator["info"] = {};
                        indicator["info"]["name"] = column;
                        indicator["categories"] = [];
                        indicator["categories"] = entity;

                        skeleton.indicators.push(indicator);
                    } else if (isNotRegionOrYearColumn && column === entity) {
                        var category = {};
                        category["id"] = column;
                        category["name"] = column;
                        category["about"] = "";
                        category["count"] = rows.length - 1;
                        category["things"] = [];
                        
                        skeleton.categories.push(category);
                    }
                }
            }

            setSkeletonCallback(skeleton);
        });
    };

    var updateDataScope = function(indicator, entity, indicatorValues, years) {
        if (indicators[timeUnit][entity][indicator]["scope"]["time"]) {
            indicators[timeUnit][entity][indicator]["scope"].value = [Math.min.apply(Math, indicatorValues),
                Math.max.apply(Math, indicatorValues)];
            indicators[timeUnit][entity][indicator]["scope"].time = [Math.min.apply(Math, years), Math.max.apply(Math, years)];
        }
    };

    var indicatorsLoaded = function()  {
        if (typeof readIsCompletedCallback === 'function') {
            readIsCompletedCallback(loadedIndicators, indicators, entityMeta, {}, [], timeUnit);
        }
    };

    var updateEntityScope = function (category, indicator) {
        var entitiesForIndicators = indicators[timeUnit][category][indicator]["years"];

        for (var entity in entitiesForIndicators) {
            if (entitiesForIndicators.hasOwnProperty(entity) && !$.isEmptyObject(entitiesForIndicators[entity]["trends"])) {

                var yearKeys = Object.keys(entitiesForIndicators[entity]["trends"]);
                var yearsForEntity = (yearKeys).map(function(year) {
                    return parseInt(year,10);
                });

                var minYear = Math.min.apply(Math,yearsForEntity);
                var maxYear = Math.max.apply(Math,yearsForEntity);

                indicators[timeUnit][category][indicator]["years"][entity]["scope"] = {};
                indicators[timeUnit][category][indicator]["years"][entity]["scope"]["time"] = {};
                indicators[timeUnit][category][indicator]["years"][entity]["scope"]["value"] = {};

                indicators[timeUnit][category][indicator]["years"][entity]["scope"]["time"]["0"] = minYear;
                indicators[timeUnit][category][indicator]["years"][entity]["scope"]["time"]["1"] = maxYear;
                indicators[timeUnit][category][indicator]["years"][entity]["scope"]["value"]["0"] = indicators[timeUnit][category][indicator]["years"][entity]["trends"][minYear].v;
                indicators[timeUnit][category][indicator]["years"][entity]["scope"]["value"]["1"] = indicators[timeUnit][category][indicator]["years"][entity]["trends"][maxYear].v;
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