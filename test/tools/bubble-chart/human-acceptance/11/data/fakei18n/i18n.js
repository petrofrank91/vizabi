gapminder.fakeI18n = function () {

    var getCountryNames = function (languageCode, setEntityCallback, callback, model, indicatorsToLoad, entity) {
        var meta = [];
        var entitiesMeta = [];

        var regions = {};

        (function(entity) {
            d3.csv("data/fakei18n/regions.csv", function (error, rows) {
                for (var i=0; i < rows.length; i++) {
                    regions[rows[i].code] = rows[i].region;
                }

                (function(entity) {
                    d3.csv("data/fakei18n/unstates_" + languageCode +".csv", function (error, rows) {

                        for (var i=0; i < rows.length; i++) {
                            meta.push({id: rows[i].code ,  region: regions[rows[i].code], name:rows[i][languageCode], parent: entity});
                        }

                        entitiesMeta = d3.nest().key(function(d){ return d.id; }).map(meta);
                        setEntityCallback(entitiesMeta, callback, model, indicatorsToLoad, entity);

                    });
                })(entity);
            });
        })(entity);


    };

    return {
        getCountryNames: getCountryNames
    };
};
