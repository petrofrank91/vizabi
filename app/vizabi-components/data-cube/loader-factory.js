define(['reader-multiple-json', 'reader-single-csv', 'reader-multiple-csv', 'reader-multi-csv'], function (readerMultipleJSON, readerSingleCSV, readerMultipleCSV, readerMultiCSV) {

    var loaderFactory = function (dataFormat) {
        var reader;

        var getReaderObject = function (dataFormat) {
            switch (dataFormat) {
                case "multipleJSON":
                    reader = new readerMultipleJSON();
                    break;
                case "singleCSV":
                    reader = new readerSingleCSV();
                    break;
                case "multipleCSV":
                    reader = new readerMultipleCSV();
                    break;
                case "multiCSV":
                    reader = new readerMultiCSV();
                    break;
                default:
            }

            return reader;
        };

        var initialize = function (indicators, model, dataPath, indicatorsToLoad, dataIsReady, changedState, language, fileName, timeUnit) {
            reader.initialize(indicators, model, dataPath, indicatorsToLoad, dataIsReady, changedState, language, fileName, timeUnit);
        };

        var loadSkeleton = function (path, loadCallback, fileName, entity) {
            reader.loadSkeleton(path, loadCallback, fileName, entity);
        };

        var loadCategory = function (indicatorsToLoad) {
            reader.loadCategory(indicatorsToLoad);
        };

        var loadIndicators = function (indicatorsToLoad, callback) {
            reader.loadIndicators(indicatorsToLoad, callback);
        };


        getReaderObject(dataFormat);

        return {
            getReader: getReaderObject,
            initialize: initialize,
            loadSkeleton: loadSkeleton,
            loadCategory: loadCategory,
            loadIndicators: loadIndicators
        };
    };

    return loaderFactory;

});