define([
	'jquery',
	'underscore',
	'smart-picker'
	], function($, _, smartPicker) {

	var geoPicker = function() {

		var pickerElement;
		var bubbleEvents;

		var init = function(bEvents) {
			
			bubbleEvents = bEvents;
			var data = Object.keys(bubbleEvents.getSelectedBubbles());

			pickerElement = new smartPicker("geoMult", "geo-mult", {
                width: 500,
                confirmButton: true,
                draggable: true,
                initialValue: data,
                onInteraction: function(data) {
                    var selected = data.selected;
                    var countries = [];
                    for(var i=0, size=selected.length; i<size; i++){
                        var country = selected[i];
                        countries.push(country.value);
                    }
                   	//force selection of searched countries
                    bubbleEvents.bubbleForceSelection(countries);
                }
            });
		};

		var show = function() {
			pickerElement.show();
		};

		var hide = function() {
			pickerElement.hide();
		};

		return {
			init: init,
			show: show
		};
	};

	return geoPicker;
});