define([],
    function() {
        'use strict';

        // Path strings follow sprintf lib format
        var paths = [
            {
                id: 'cms',
                desc: 'Gapminder CMS',
                url: 'http://stage.cms.gapminder.org/api/poFile/%(filename)s?lang=%(lang)s'
            },
            {
                id: 'local',
                desc: 'Local storage',
                url: '../../../data/i18n/%(lang)s/%(filename)s'
            }
        ];

        return paths;
    }
);
