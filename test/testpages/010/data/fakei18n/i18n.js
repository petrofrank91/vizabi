gapminder.fakeI18n = function () {

    var getCountryNames = function (languageCode, setEntityCallback, callback, model, indicatorsToLoad, entity) {
        var entities = [];
        var meta = [];
        var entitiesMeta = [];

        d3.csv("data/fakei18n/unstates.csv", function (error, rows) {
            for (var i=0; i < rows.length; i++) {
                meta.push({id: rows[i].code, region: rows[i].region , name:rows[i][languageCode], parent: entity});
            }

            entitiesMeta = d3.nest().key(function(d){ return d.id; }).map(meta);
            setEntityCallback(entitiesMeta, callback, model, indicatorsToLoad, entity);
        });
    };

    return {
        getCountryNames: getCountryNames
    };
};
