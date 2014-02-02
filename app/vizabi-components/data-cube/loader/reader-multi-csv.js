define(['queue-async'], function (queue) {

    var readerMultiCSV = function () {

        var datasetInfo;
        var chartFooter = "";
        var indicators = {};
        var readIsCompleteCallback;
        var csvDataPath;
        var entityMeta;
        var dataIsReadyCallback;
        var indicatorsToLoad;
        var regions = [];
        var timeUnit;
        var entitiesData = [];
        var skeleton = {
            indicators: [],
            categories: []
        };
        var dataLoadQueue;

        var initialize = function (indicatorsTemplate, model, dataPath, indicatorsToLoadObj, dataReadyCallback, changedState, language) {
            readIsCompleteCallback = dataReadyCallback;
            csvDataPath = dataPath;
            indicatorsToLoad = indicatorsToLoadObj;
            dataIsReadyCallback = dataReadyCallback;
            indicators = indicatorsTemplate;
            dataLoadQueue = new queue();

            if (changedState.dataPath) {
                dataLoadQueue
                    .defer(function (callback) {
                        loadDataSetInfo(callback);
                    })
                    .defer(function (callback) {
                        loadChartNotes(callback);
                    });
            }
        };

        var loadDataSetInfo = function (callback) {
            d3.csv(csvDataPath + "dataset.csv", function (dataError, dataRows) {
                datasetInfo = dataRows[0].info;
                callback();
            });
        };

        var loadChartNotes = function (callback) {
            d3.csv(csvDataPath + "notes.csv", function (notesError, notesRows) {
                notesRows.map(function (noteRow) {
                    chartFooter += noteRow.text + "," + noteRow.link + "\n";
                });

                callback();
            });
        };

        var loadIndicators = function (indicatorsToLoad) {
            for (var category in indicatorsToLoad) {
                if (indicatorsToLoad.hasOwnProperty(category)) {
                    indicatorsToLoad[category].forEach(function (indicator) {
                        (function (entity, indicator) {
                            dataLoadQueue.defer(function (callback) {
                                loadIndicatorsFromFile(indicator, entity, callback);
                            });
                        })(category, indicator);
                    });
                }
            }

            dataLoadQueue.await(indicatorsLoaded);
        };

        var indicatorsLoaded = function () {
            if (typeof readIsCompleteCallback === 'function') {
                readIsCompleteCallback(skeleton, indicators, entityMeta, [datasetInfo, chartFooter], regions, timeUnit);
            }
        };

        var loadIndicatorsFromFile = function (indicator, category, callback) {
            d3.csv(csvDataPath + indicator + "__" + category + ".csv", function (error, rows) {

                d3.csv(csvDataPath + "indicators.csv", function (indError, indRows) {
                    var indicatorValues,
                        years;

                    setIndicatorInfo(category, indicator, indRows);

                    var isTimeDownFormat = rows[0].time;
                    if (isTimeDownFormat) {
                        indicatorValues = loadIndicatorInTimeDownFormat(rows, category, indicator).indValue;
                        years = loadIndicatorInTimeDownFormat(rows, category, indicator).yearValues;
                    }
                    else {

                        indicatorValues = loadIndicatorInTimeRightFormat(rows, category, indicator).indValue;
                        years = loadIndicatorInTimeRightFormat(rows, category, indicator).yearValues;
                    }

                    updateEntityScopeData(category, indicator);
                    setSkeletonInfo(category, indicator);
                    updateDataScope(indicator, category, indicatorValues, years);

                    indicatorsToLoad[category].splice(indicatorsToLoad[category].indexOf(indicator), 1);
                    callback();
                });
            });
        };


        var loadIndicatorInTimeDownFormat = function (rows, category, indicator) {
            var indicatorValues = [];
            var years = [];

            for (var i = 0; i < rows.length; i++) {
                if (rows[i].id) {
                    indicators[timeUnit][category][indicator]["years"][rows[i].id] = {};
                    indicators[timeUnit][category][indicator]["years"][rows[i].id]["trends"] = {};
                }
            }

            for (var j = 0; j < rows.length; j++) {
                var indValue = parseFloat(rows[j].value);
                var note = rows[j].note;
                if (!isNaN(indValue)) {
                    indicators[timeUnit][category][indicator]["years"][rows[j].id]["trends"][rows[j].time] = {};
                    indicators[timeUnit][category][indicator]["years"][rows[j].id]["trends"][rows[j].time]["n"] = note;
                    indicators[timeUnit][category][indicator]["years"][rows[j].id]["trends"][rows[j].time]["v"] = indValue;
                    indicatorValues.push(indValue);
                    years.push(rows[j].time);
                }
            }

            return {
                indValue: indicatorValues,
                yearValues: years
            };
        };

        var loadIndicatorInTimeRightFormat = function (rows, category, indicator) {
            var indicatorValues = [];
            var years = [];

            for (var k = 0; k < rows.length; k++) {
                indicators[timeUnit][category][indicator]["years"][rows[k].id] = {};
                indicators[timeUnit][category][indicator]["years"][rows[k].id]["trends"] = {};
                for (var column in rows[k]) {
                    if (rows[k].hasOwnProperty(column)) {
                        if (column && rows[k][column] && column !== "name" && column !== "id" && column.indexOf("note") === -1) {
                            var value = parseFloat(rows[k][column]);
                            if (!isNaN(value)) {
                                indicators[timeUnit][category][indicator]["years"][rows[k].id]["trends"][column] = {};
                                indicators[timeUnit][category][indicator]["years"][rows[k].id]["trends"][column]["n"] = [];
                                indicators[timeUnit][category][indicator]["years"][rows[k].id]["trends"][column]["v"] = value;
                                indicatorValues.push(parseFloat(rows[k][column]));
                                years.push(column);
                            }
                        } else if (column.indexOf("note") >= 0) {
                            var yearValue = column.substring(0, column.indexOf("_note"));
                            indicators[timeUnit][category][indicator]["years"][rows[k].id]["trends"][column][yearValue] = column;
                        }
                    }
                }
            }

            return {
                indValue: indicatorValues,
                yearValues: years
            };
        };

        var updateEntityScopeData = function (category, indicator) {
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

        var setSkeletonInfo = function (categoryId, indicator) {
            for (var i = 0; i < skeleton.categories.length; i++) {
                if (skeleton.categories[i].id === categoryId) {
                    skeleton.categories[i].things.push(indicator);
                }
            }
        };

        var loadCategoryFromFile = function (category, callback) {
            d3.csv(csvDataPath + "categories.csv", function (catError, catRows) {
                var parentHeader;
                for (var i = 0; i < catRows.length; i++) {
                    if (catRows[i].id === category) {
                        parentHeader = catRows[i].parent;
                    }
                }

                d3.csv(csvDataPath + category + ".csv", function (error, rows) {
                    loadCategory(category, rows, parentHeader, callback);
                });
            });
        };

        var loadCategories = function (indicatorsToLoad) {
            for (var category in indicatorsToLoad) {
                if (indicatorsToLoad.hasOwnProperty(category)) {
                    (function (category) {
                        dataLoadQueue.defer(function (callback) {
                            loadCategoryFromFile(category, callback);
                        });
                    })(category);
                }
            }
        };

        var loadCategory = function (category, rows, parentHeader, callback) {
            console.log("Loading Category ", category, " ...");

            var regionsList = [];
            for (var i = 0; i < skeleton.categories.length; i++) {
                if (skeleton.categories[i].id === category) {
                    skeleton.categories[i].count = rows.length;
                }
            }

            for (var i = 0; i < rows.length; i++) {
                entitiesData.push({
                    id: rows[i]["id"],
                    name: rows[i]["name"],
                    region: rows[i][parentHeader],
                    parent: category
                });
                regionsList.push(rows[i][parentHeader]);
            }

            entityMeta = d3.nest().key(function (d) {
                return d.id;
            }).map(entitiesData);

            $.each(regionsList, function (i, region) {
                if ($.inArray(region, regions) === -1) {
                    regions.push(region);
                }
            });

            callback();
        };

        var setIndicatorInfo = function (category, indicator, indicatorRows) {
            timeUnit = indicatorRows[1].time || "yearly";

            for (var i = 0; i < indicatorRows.length; i++) {
                if (indicatorRows[i].id === indicator) {
                    indicators[timeUnit][category][indicator]["info"]["id"] = indicatorRows[i].id;
                    indicators[timeUnit][category][indicator]["info"]["name"] = indicatorRows[i].name;
                    indicators[timeUnit][category][indicator]["info"]["info"] = indicatorRows[i].info;
                    indicators[timeUnit][category][indicator]["info"]["data"] = indicatorRows[i].data;
                    indicators[timeUnit][category][indicator]["info"]["unit"] = indicatorRows[i].unit;
                    indicators[timeUnit][category][indicator]["info"]["note"] = indicatorRows[i].note;
                }
            }
        };


        var updateDataScope = function (indicator, category, indicatorValues, years) {
            if (indicators[timeUnit][category][indicator]["scope"]["time"]) {
                indicators[timeUnit][category][indicator]["scope"].value = [Math.min.apply(Math, indicatorValues),
                    Math.max.apply(Math, indicatorValues)
                ];
                indicators[timeUnit][category][indicator]["scope"].time = [Math.min.apply(Math, years), Math.max.apply(Math, years)];
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
            d3.csv(csvDataPath + "indicators.csv", function (error, rows) {
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

            d3.csv(csvDataPath + "categories.csv", function (error, rows) {
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
            loadSkeleton: loadSkeleton,
            loadCategory: loadCategories,
            loadIndicators: loadIndicators
        };
    };

    return readerMultiCSV;

});