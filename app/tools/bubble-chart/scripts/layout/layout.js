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
				top: ['yLabel.bottom'],
				left: ['yLabel.left'],

			});

			addComponent(lname, {
				id: 'yAxisText',
				g: components.get().yAxisText.getGroup(),
				top: ['chart.top'],
				left: ['chart.left']
			});

			addComponent(lname, {
				id: 'yAxisGrid',
				g: components.get().yAxisGrid.getGroup(),
				top: ['chart.top'],
				left: ['chart.left']
			});

			addComponent(lname, {
				id: 'searchBox',
				g: components.get().searchBox.getGroup(),
				top: ['chart.top', 10],
				left: ['yAxisText.left', 10]
			});

			// LATER
			// addComponent(lname, {
			// 	id: 'yearLabel',
			// 	g: components.get().yearLabel.getGroup(),
			// 	top: 1,
			// 	left: 1
			// });

			addComponent(lname, {
				id: 'xAxisText',
				g: components.get().xAxisText.getGroup(),
				top: ['yAxisText.bottom'],
				left: ['yAxisText.right']
			});

			addComponent(lname, {
				id: 'xAxisGrid',
				g: components.get().xAxisGrid.getGroup(),
				top: ['yAxisGrid.bottom'],
				left: ['yAxisGrid.right']
			});

			addComponent(lname, {
				id: 'xLabel',
				g: components.get().xLabel.getGroup(),
				bottom: ['xAxisGrid.top'],
				right: ['xAxisGrid.right', -50]
			});

			addComponent(lname, {
				id: 'bubblesContainer',
				g: components.get().bubblesContainer.getGroup(),
				top: ['chart.top'],
				left: ['yAxisGrid.left'],
				bottom: ['xAxisText.top'],
				right: ['xAxisGrid.right'],
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