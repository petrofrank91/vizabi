define(["layout-manager"], function(layoutManager) {

	var layout = function() {
		var lname = "default";
		var components;

		var init = function(c, name) {
			components = c;
			lname = name || lname;

			startLayout();
			defaultComponents();
			layoutManager.update();
		};

		var startLayout = function() {
			layoutManager.addLayout(lname);
		};

		var defaultComponents = function() {
			addComponent(lname, {
				id: 'yLabel',
				g: components.get().yLabel.getGroup(),
				top: 1,
				left: 1
			});

			addComponent(lname, {
				id: 'chart',
				g: components.get().chart.getGroup(),
				top: 1,
				left: 1,
				bottom: ['stage.height', { padding: -10 }],
				right: ['stage.width', { padding: -10 }]
			});
			
			addComponent(lname, {
				id: 'yearLabel',
				g: components.get().yearLabel.getGroup(),
				xcenter: ['stage.width', { percentage: '50%' }],
				ycenter: ['stage.height', { percentage: '50%' }]
			});

			addComponent(lname, {
				id: 'axisCaller',
				g: components.get().yAxis.getGroup(),
				top: ['yLabel.bottom'],
				left: ['chart.left'],
				bottom: ['chart.bottom', { padding: -30 }],
				right: ['chart.right', { padding: -20 }],
				render: components.get().yAxis.render
			});

			addComponent(lname, {
				id: 'yAxisText',
				g: components.get().yAxis.getAxisText(),
				top: ['yLabel.bottom'],
				left: ['chart.left'],
				render: components.get().yAxis.measureAxisText
			});

			addComponent(lname, {
				id: 'yAxis',
				g: components.get().yAxis.getAxis(),
				top: ['yLabel.bottom'],
				left: ['yAxisText.right', { padding: 8 }],
				render: components.get().yAxis.measureAxis
			});

			addComponent(lname, {
				id: 'yAxisGrid',
				g: components.get().yAxis.getAxisGrid(),
				top: ['yLabel.bottom'],
				left: ['yAxis.left'],
				right: ['chart.right'],
				render: components.get().yAxis.measureAxisGrid
			});

			addComponent(lname, {
				id: 'searchBox',
				g: components.get().searchBox.getGroup(),
				top: ['yLabel.bottom', { padding: 10 }],
				left: ['yAxis.right', { padding: 10 }]
			});

			addComponent(lname, {
				id: 'x-axisCaller',
				g: components.get().xAxis.getGroup(),
				top: ['yAxis.top'],
				left: ['yAxis.right'],
				bottom: ['chart.bottom', { padding: -20 }],
				right: ['chart.right'],
				render: components.get().xAxis.render
			});

			addComponent(lname, {
				id: 'xAxis',
				g: components.get().xAxis.getAxis(),
				top: ['yAxis.bottom'],
				left: ['yAxis.right'],
				right: ['chart.right'],
				render: components.get().xAxis.measureAxis
			});

			addComponent(lname, {
				id: 'xAxisText',
				g: components.get().xAxis.getAxisText(),
				top: ['xAxis.top', { padding: 5 }],
				left: ['xAxis.left'],
				right: ['xAxis.right'],
				render: components.get().xAxis.measureAxisText
			});

			addComponent(lname, {
				id: 'xAxisGrid',
				g: components.get().xAxis.getAxisGrid(),
				top: ['xAxis.bottom'],
				left: ['xAxis.left'],
				right: ['xAxis.right'],
				render: components.get().xAxis.measureAxisGrid
			});

			addComponent(lname, {
				id: 'xLabel',
				g: components.get().xLabel.getGroup(),
				bottom: ['xAxisText.top', { padding: -5 }],
				right: ['xAxisText.right', { padding: -5 }]
			});

			addComponent(lname, {
				id: 'bubblesContainer',
				g: components.get().bubblesContainer.getGroup(),
				top: ['yAxis.top'],
				left: ['yAxis.right'],
				bottom: ['yAxis.bottom'],
				right: ['xAxis.right'],
				render: components.get().bubblesContainer.render
			});
		};

		var addComponent = function(name, o) {
			layoutManager.addComponent(name, o);
		};


		return {
			init: init,
			startLayout: startLayout,
			addComponent: addComponent
		};
	};
	return layout;

});