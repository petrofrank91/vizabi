gapminder.helper = {};

gapminder.helper.getStateFromURL = function() {
    var search = location.search.substring(1);
    var urlParams = {};

    if (search) {
        urlParams = JSON.parse(
            '{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
            function(key, value) {
                return key === "" ? value : decodeURIComponent(value);
            }
        );
    }

    return urlParams;
}
