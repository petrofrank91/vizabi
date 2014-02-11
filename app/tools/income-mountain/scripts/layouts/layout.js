define([
    ],
    function() {
        var lname = 'default';

        function init(layoutManager, components, layoutName) {
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
                top: ['header.top'],
                right: ['stage.width', -10]
            });

            addComponent(lname, {
                id: 'axis',
                g: components.axis.getGroup(),
                left: ['header.left'],
                right: ['timeslider.right', 10],
                bottom: ['stage.height', -10],
                render: components.axis.render
            });

            addComponent(lname, {
                id: 'labels',
                g: components.labels.getGroup(),
                top: ['header.bottom', 10],
                left: ['header.left'],
                render: components.labels.render
            });

            addComponent(lname, {
                g: components.mountains.getGroup(),
                id: 'mountains',
                top: ['timeslider.bottom', 5],
                left: ['axis.left'],
                right: ['axis.right'],
                bottom: ['axis.top'],
                render: components.mountains.render
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