define([], function () {

    var readerMultipleCSV = function () {
        var indicators = {};
        var entityMeta = {};
        var loadedIndicators = [];
        var readIsCompletedCallback;
        var csvDataPath;
        var timeUnit = "yearly";
        var entitiesData = [];
        var skeleton = {
            indicators: [],
            categories: []
        };

        var dataLoadQueue;

        var initialize = function (indicatorsTemplate, model, dataPath, indicatorsToLoad, callback) {
            readIsCompletedCallback = callback;
            csvDataPath = dataPath;
            indicators = indicatorsTemplate;
            dataLoadQueue = new queue();
        };

        var loadEntities = function (indicatorsToLoad) {
            for (var entity in indicatorsToLoad) {
                if (indicatorsToLoad.hasOwnProperty(entity)) {
                    (function (entity) {
                        dataLoadQueue.defer(function (callback) {
                            loadEntity(entity, callback);
                        });
                    })(entity);
                }
            }
        };


        var loadEntity = function (entity, callback) {
            d3.csv(csvDataPath + "entities/" + entity + ".csv", function (error, rows) {
                console.log("Loading Category ", entity, " ...");
                loadedIndicators[entity] = [];

                for (var i = 0; i < rows.length; i++) {
                    entitiesData.push({
                        id: rows[i]["name"],
                        name: rows[i]["name"],
                        region: rows[i]["region"],
                        parent: entity
                    });
                }

                entityMeta = d3.nest().key(function (d) {
                    return d.id;
                }).map(entitiesData);

                callback();
            });
        };

        var loadIndicatorData = function (indicatorsToLoad) {
            for (var entity in indicatorsToLoad) {
                if (indicatorsToLoad.hasOwnProperty(entity)) {

                    indicatorsToLoad[entity].forEach(function (indicator) {
                        (function (entity, indicator) {
                            dataLoadQueue.defer(function (callback) {
                                loadCSVFile(indicator, entity, callback);
                            });
                        })(entity, indicator);
                    });

                }
            }

            dataLoadQueue.await(indicatorsLoaded);
        };

        var loadCSVFile = function (indicator, entity, callback) {
            d3.csv(csvDataPath + "indicators/" + indicator + "_" + entity + ".csv", function (error, rows) {
                var indicatorValues = loadIndicators(rows, entity, indicator).indValues;
                var years = loadIndicators(rows, entity, indicator).yearValues;

                setSkeletonInfo(entity, indicator);
                updateDataScope(indicator, entity, indicatorValues, years);
                updateEntityScope(entity, indicator);

                callback(null, indicators);
            });
        };

        var loadIndicators = function (rows, entity, indicator) {
            indicators[timeUnit][entity][indicator]["info"]["name"] = indicator;
            indicators[timeUnit][entity][indicator]["info"]["id"] = indicator;

            var indicatorValues = [];
            var years = [];

            for (var i = 0; i < rows.length; i++) {
                var rowEntity = rows[i][entity];
                indicators[timeUnit][entity][indicator]["years"][rowEntity] = {};
                indicators[timeUnit][entity][indicator]["years"][rowEntity]["trends"] = {};

                for (var field in rows[i]) {
                    if (rows[i].hasOwnProperty(field)) {
                        if (rows[i][field] && field !== entity) {
                            indicators[timeUnit][entity][indicator]["years"][rowEntity]["trends"][field] = {};
                            indicators[timeUnit][entity][indicator]["years"][rowEntity]["trends"][field]["n"] = [];
                            indicators[timeUnit][entity][indicator]["years"][rowEntity]["trends"][field]["v"] = parseFloat(rows[i][field]);
                            indicatorValues.push(parseFloat(rows[i][field]));
                            years.push(field);
                        }
                    }
                }
            }

            return {
                indValues: indicatorValues,
                yearValues: years
            };
        };

        var setSkeletonInfo = function (categoryId, indicator) {
            for (var i = 0; i < skeleton.categories.length; i++) {
                if (skeleton.categories[i].id === categoryId) {
                    skeleton.categories[i].things.push(indicator);
                }
            }
        };

        var indicatorsLoaded = function () {
            if (typeof readIsCompletedCallback === 'function') {
                readIsCompletedCallback(loadedIndicators, indicators, entityMeta, {}, [], timeUnit);
            }
        };

        var updateDataScope = function (indicator, entity, indicatorValues, years) {
            if (indicators[timeUnit][entity][indicator]["scope"]["time"]) {

                indicators[timeUnit][entity][indicator]["scope"].value = [Math.min.apply(Math, indicatorValues),
                    Math.max.apply(Math, indicatorValues)
                ];
                indicators[timeUnit][entity][indicator]["scope"].time = [Math.min.apply(Math, years), Math.max.apply(Math, years)];
            }
        };


        var updateEntityScope = function (category, indicator) {
            var entitiesForIndicators = indicators[timeUnit][category][indicator]["years"];

            for (var entity in entitiesForIndicators) {
                if (entitiesForIndicators.hasOwnProperty(entity) && !$.isEmptyObject(entitiesForIndicators[entity]["trends"])) {

                    var yearKeys = Object.keys(entitiesForIndicators[entity]["trends"]);
                    var yearsForEntity = (yearKeys).map(function (year) {
                        return parseInt(year, 10);
                    });

                    var minYear = Math.min.apply(Math, yearsForEntity);
                    var maxYear = Math.max.apply(Math, yearsForEntity);

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

        var loadSkeleton = function (path, setSkeletonCallback) {
            var q = new queue();
            q.defer(function (callback) {
                loadSkeletonIndicator(path, callback);
            })
                .defer(function (callback) {
                    loadSkeletonCategory(path, callback);
                })
                .await(function () {
                    setSkeletonCallback(skeleton);
                });

        };

        var loadSkeletonIndicator = function (path, callback) {
            csvDataPath = path;
            d3.csv(csvDataPath + "indicators/indicators.csv", function (error, rows) {
                if (rows[0].availability) {
                    rows.forEach(function (rowObject) {
                        var indicator = {};
                        indicator["id"] = rowObject.id;
                        indicator["info"] = {};
                        indicator["info"]["name"] = rowObject.name;
                        indicator["categories"] = [];
                        indicator["categories"] = rowObject["availability"].split(" ");

                        skeleton.indicators.push(indicator);
                    });
                }

                callback();
            });
        };

        var loadSkeletonCategory = function (path, callback) {

            d3.csv(csvDataPath + "entities/entities.csv", function (error, rows) {
                rows.forEach(function (rowObject) {
                    var category = {};
                    category["id"] = rowObject.id;
                    category["name"] = rowObject.name;
                    category["about"] = rowObject.info;
                    category["count"] = 0;
                    category["things"] = [];

                    skeleton.categories.push(category);
                });

                callback();
            });
        };

        return {
            initialize: initialize,
            loadCategory: loadEntities,
            loadIndicators: loadIndicatorData,
            loadSkeleton: loadSkeleton
        };
    };

});