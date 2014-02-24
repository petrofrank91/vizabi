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
					id: 'yAxis',
					g: components.get().yAxis.getGroup(),
					top: ['chart.top'],
					left: ['chart.left']
				});

				addComponent(lname, {
					id: 'searchBox',
					g: components.get().searchBox.getGroup(),
					top: ['chart.top', 10],
					left: ['yAxis.right', 10]
				});

				// LATER
				// addComponent(lname, {
				// 	id: 'yearLabel',
				// 	g: components.get().yearLabel.getGroup(),
				// 	top: 1,
				// 	left: 1
				// });

				addComponent(lname, {
					id: 'xAxis',
					g: components.get().xAxis.getGroup(),
					top: ['yAxis.bottom'],
					left: ['yAxis.right']
				});


				addComponent(lname, {
					id: 'xLabel',
					g: components.get().xLabel.getGroup(),
					bottom: ['xAxis.top'],
					right: ['xAxis.right', -5]
				});

				addComponent(lname, {
					id: 'bubblesContainer',
					g: components.get().bubblesContainer.getGroup(),
					top: ['chart.top'],
					left: ['xAxis.left'],
				 	bottom: ['xAxis.top'],
					right: ['xAxis.right'],
					render: components.get().bubblesContainer.render
				});

				addComponent(lname, {
					id: 'labelLayer',
					g: components.get().labelLayer.getGroup(),
					top: 1,
					left: 1
				});
			};

			var addComponent = function(name, o) {
				layoutManager.addComponent(name,o);
			};


			return {
				init: init,
				startLayout: startLayout,
				addComponent: addComponent
			};
		};
		return layout;

	});