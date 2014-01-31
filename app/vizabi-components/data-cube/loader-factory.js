gapminder.dataCube.loaderFacotry = function (dataFormat) {
    var reader;

    var getReaderObject = function (dataFormat) {
        switch (dataFormat) {
            case "multipleJSON":
                reader = new gapminder.data.readerMultipleJSON();
                break;
            case "singleCSV":
                reader = new gapminder.data.readerSingleCSV();
                break;
            case "multipleCSV":
                reader = new gapminder.data.readerMultipleCSV();
                break;
            case "multiCSV":
                reader = new gapminder.data.readerMultiCSV();
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