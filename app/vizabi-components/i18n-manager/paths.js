define([],
    function() {
        'use strict';
        var paths = [
            {
                id: 'cms',
                desc: 'Gapminder CMS',
                url: 'http://stage.cms.gapminder.org/api/poFile/'
            },
            {
                id: 'local',
                desc: 'Local storage',
                url: '../../../data/i18n/'
            }
        ];

        return paths;
    }
);
