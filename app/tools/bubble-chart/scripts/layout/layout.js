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
				bottom: ['stage.height', -10],
				right: ['stage.width', -10]
			});
			
			// addComponent(lname, {
			// 	id: 'yearLabel',
			// 	g: components.get().yearLabel.getGroup(),
			// 	xcenter: ['chart.xcenter'],
			// 	ycenter: ['chart.ycenter']
			// });

			addComponent(lname, {
				id: 'axisCaller',
				g: components.get().yAxis.getGroup(),
				top: ['yLabel.bottom'],
				left: ['chart.left'],
				bottom: ['chart.bottom', -60],
				right: ['chart.right', -20],
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
				left: ['yAxisText.right', 5],
				render: components.get().yAxis.measureAxis
			});

			addComponent(lname, {
				id: 'yAxisGrid',
				g: components.get().yAxis.getAxisGrid(),
				top: ['yLabel.bottom'],
				left: ['yAxis.left'],
				render: components.get().yAxis.measureAxisGrid
			});

			addComponent(lname, {
				id: 'searchBox',
				g: components.get().searchBox.getGroup(),
				top: ['yLabel.bottom', 10],
				left: ['yAxis.right', 10]
			});

			addComponent(lname, {
				id: 'x-axisCaller',
				g: components.get().xAxis.getGroup(),
				top: ['yAxis.top'],
				left: ['chart.left'],
				bottom: ['chart.bottom', -60],
				right: ['chart.right', -20],
				render: components.get().xAxis.render
			});

			addComponent(lname, {
				id: 'xAxis',
				g: components.get().xAxis.getAxis(),
				top: ['yAxis.bottom'],
				left: ['yAxis.right'],
				right: ['x-axisCaller.right'],
				render: components.get().xAxis.measureAxis
			});

			addComponent(lname, {
				id: 'xAxisText',
				g: components.get().xAxis.getAxisText(),
				top: ['xAxis.top'],
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
				bottom: ['xAxisText.top'],
				right: ['xAxisText.right', -5]
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