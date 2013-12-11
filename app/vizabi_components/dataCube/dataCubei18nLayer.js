gapminder.data.i18nHelper = function () {

    var updatedEntitiesReadyCallback;
    var entityMeta;
    var languageCode;

    var updateLanguage = function(language, callback, model, indicatorsToLoad, entity) {
        languageCode = language;
        updatedEntitiesReadyCallback = callback;
        var fakei18n = new gapminder.fakeI18n();
        fakei18n.getCountryNames(language, setEntitiesFromi18n, callback, model, indicatorsToLoad, entity);
    };

    var setEntitiesFromi18n = function (entitiesMetaObj, callback, model, indicatorsToLoad, entity) {
        entityMeta = entitiesMetaObj;

        updatedEntitiesReadyCallback(entitiesMetaObj, languageCode);
    };

    return {
        updateLanguage: updateLanguage
    };
};