define([
        'layout-manager'
    ],
    function(layoutManager) {
        var lname = 'default';
        var components;

        function init(c, name) {
            components = c;
            lname = name || lname;

            startLayout(lname);
            defaultComponents();
            layoutManager.update();
        }

        function startLayout(name) {
            layoutManager.addLayout(name);
        }

        function defaultComponents() {
            addComponent(lname, {
                id: 'header',
                g: components.header.getGroup(),
                top: 1,
                left: 1
            });

            addComponent(lname, {
                id: 'timeslider',
                g: components.timeslider.getGroup(),
                bottom: ['stage.height'],
                left: ['header.left', 200],
                render: components.timeslider.render
            });

            addComponent(lname, {
                g: components.map.getGroup(),
                id: 'map',
                top: ['header.bottom'],
                bottom: ['stage.height'],
                left: ['header.left'],
                right: ['stage.width'],
                render: components.map.render
            });

            addComponent(lname, {
                id: 'bubbles',
                g: components.bubbles.getGroup(),
                top: ['map.top'],
                bottom: ['map.bottom'],
                left: ['map.left'],
                right: ['map.right'],
                render: function() {
                    components.bubbles.render.bind(components.bubbles);
                    return components.bubbles.render();
                }
            });

        }

        function addComponent(name, o) {
            layoutManager.addComponent(name, o);
        }

        return {
            init: init,
            startLayout: startLayout,
            addComponent: addComponent
        };
    }
);