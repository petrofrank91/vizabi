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
                g: components.get().header.getGroup(),
                top: 1,
                left: 1
            });

            addComponent(lname, {
                id: 'timeslider',
                g: components.get().timeslider.getGroup(),
                top: ['header.top'],
                right: ['stage.width', { padding: -10 } ]
            });

            addComponent(lname, {
                id: 'axis',
                g: components.get().axis.getGroup(),
                left: ['header.left'],
                right: ['timeslider.right', { padding: 10 } ],
                bottom: ['stage.height', { padding: -10 } ],
                render: components.get().axis.render
            });

            addComponent(lname, {
                id: 'labels',
                g: components.get().labels.getGroup(),
                top: ['header.bottom', { padding: 10 } ],
                left: ['header.left'],
                render: components.get().labels.render
            });

            addComponent(lname, {
                g: components.get().mountains.getGroup(),
                id: 'mountains',
                top: ['timeslider.bottom', { padding: 5 } ],
                left: ['axis.left'],
                right: ['axis.right'],
                bottom: ['axis.top'],
                render: components.get().mountains.render
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