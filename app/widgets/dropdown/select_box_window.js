// chosen plugin select
gapminder.viz.tools.n_dropdown = function dropdown(elements) {
	// About data on this?
	var div = elements.div;
	var divId = div.attr("id");

	var dropdown_div;
	var in_div;
	var val_array = [];
	var menu;

	var iphone = navigator.userAgent.match(/(iPod|iPhone)/);
	
	if (!iphone) {
		createDiv();
		addDivHeader('Select place');
		createMultipleMenu('Select Location');
		startSelect2();
		addButtons();
		centerDiv();
	} else {
		createMultipleMenu('Select Location');
		styleDesktopSelect();
	}
	
	// population for income_mountain
	var income_mountain_available_regions = [["ASI","Asia"],["AME","America"],["AFR","Africa"],["EUR","Europe"]];
	var income_mountain_available_states = [["AFG","Afghanistan"],["ALB","Albania"],["DZA","Algeria"],["AGO","Angola"],["ARG","Argentina"],["ARM","Armenia"],["AUS","Australia"],["AUT","Austria"],["AZE","Azerbaijan"],["BHS","Bahamas"],["BGD","Bangladesh"],["BRB","Barbados"],["BLR","Belarus"],["BEL","Belgium"],["BEN","Benin"],["BOL","Bolivia"],["BWA","Botswana"],["BRA","Brazil"],["BGR","Bulgaria"],["BFA","Burkina Faso"],["BDI","Burundi"],["KHM","Cambodia"],["CMR","Cameroon"],["CAN","Canada"],["CAF","Central African Republic"],["TCD","Chad"],["CHL","Chile"],["CHN","China"],["COL","Colombia"],["COM","Comoros"],["COD","Congo [DRC]"],["COG","Congo [Republic]"],["CRI","Costa Rica"],["HRV","Croatia"],["CUB","Cuba"],["CZE","Czech Republic"],["DNK","Denmark"],["DJI","Djibouti"],["DOM","Dominican Republic"],["ECU","Ecuador"],["EGY","Egypt"],["SLV","El Salvador"],["EST","Estonia"],["ETH","Ethiopia"],["FJI","Fiji"],["FIN","Finland"],["FRA","France"],["GAB","Gabon"],["GMB","Gambia"],["GEO","Georgia"],["DEU","Germany"],["GHA","Ghana"],["GRC","Greece"],["GTM","Guatemala"],["GIN","Guinea"],["GNB","Guinea-Bissau"],["GUY","Guyana"],["HTI","Haiti"],["HND","Honduras"],["HKG","Hong Kong"],["HUN","Hungary"],["IND","India"],["IDN","Indonesia"],["IRN","Iran"],["IRQ","Iraq"],["IRL","Ireland"],["ISR","Israel"],["ITA","Italy"],["CIV","Ivory Coast"],["JAM","Jamaica"],["JPN","Japan"],["JOR","Jordan"],["KAZ","Kazakhstan"],["KEN","Kenya"],["KGZ","Kyrgyzstan"],["LAO","Laos"],["LVA","Latvia"],["LBN","Lebanon"],["LSO","Lesotho"],["LTU","Lithuania"],["LUX","Luxembourg"],["MKD","Macedonia [FYROM]"],["MDG","Madagascar"],["MWI","Malawi"],["MYS","Malaysia"],["MLI","Mali"],["MRT","Mauritania"],["MUS","Mauritius"],["MEX","Mexico"],["MDA","Moldova"],["MNG","Mongolia"],["MAR","Morocco"],["MOZ","Mozambique"],["MMR","Myanmar [Burma]"],["NAM","Namibia"],["NPL","Nepal"],["NLD","Netherlands"],["NZL","New Zealand"],["NIC","Nicaragua"],["NER","Niger"],["NGA","Nigeria"],["NOR","Norway"],["PAK","Pakistan"],["PAN","Panama"],["PNG","Papua New Guinea"],["PRY","Paraguay"],["PER","Peru"],["PHL","Philippines"],["POL","Poland"],["PRT","Portugal"],["PRI","Puerto Rico"],["ROU","Romania"],["RUS","Russia"],["RWA","Rwanda"],["SEN","Senegal"],["SRB","Serbia"],["SYC","Seychelles"],["SLE","Sierra Leone"],["SGP","Singapore"],["SVK","Slovakia"],["SVN","Slovenia"],["SOM","Somalia"],["ZAF","South Africa"],["KOR","South Korea"],["ESP","Spain"],["LKA","Sri Lanka"],["SDN","Sudan"],["SUR","Suriname"],["SWE","Sweden"],["CHE","Switzerland"],["SYR","Syria"],["TWN","Taiwan"],["TJK","Tajikistan"],["TZA","Tanzania"],["THA","Thailand"],["TGO","Togo"],["TTO","Trinidad and Tobago"],["TUN","Tunisia"],["TUR","Turkey"],["TKM","Turkmenistan"],["UGA","Uganda"],["UKR","Ukraine"],["GBR","United Kingdom"],["USA","United States"],["URY","Uruguay"],["UZB","Uzbekistan"],["VEN","Venezuela"],["VNM","Vietnam"],["YEM","Yemen"],["ZMB","Zambia"],["ZWE","Zimbabwe"]];
	
	addMenuOption("World", "WORLD");

	var group = addMenuGroup('Regions');
    income_mountain_available_regions.forEach(function(d) {
        addMenuOption(d[1], d[0], group);
    });

    var group = addMenuGroup('UN States');
    income_mountain_available_states.forEach(function(d) {
        addMenuOption(d[1], d[0], group);
    });

	function createDiv() {
		dropdown_div = div.append("div")
			.attr("id", divId.replace('#', '') + "test")
			.style('margin', '0 auto')
			.style('position', 'absolute')
			.style('top', '50%')
			.style('left', '50%')
			.style('width', '35%')
			.style('display', 'none');
	}

	function addDivHeader(text) {
		dropdown_div.append("div")
			.attr('class', 'geo_location_header')
			.append('p')
			.text(text);
	}

	function createMultipleMenu(placeholderText) {
		if (dropdown_div) {
			in_div = dropdown_div.append('div')	
		} else {
			in_div = div;
		}

		menu = in_div.append('select')
			.attr('id', divId.replace('#', '') + "-menu")
			.attr('multiple', 'multiple')
			.attr('tabindex', 3)
			.style('margin', '0 auto')
			.style('width', '100%');

		if (placeholderText) menu.attr('data-placeholder', placeholderText);
	}

	function styleDesktopSelect() {
		menu.style('position', 'absolute')
			.style('top', '5px')
			.style('left', '200px')
			.style('width', '250px')
			.style('opacity', 0)
	}

	function startSelect2() {
		// Start select2 plugin
		$(menu.node()).select2();
	}

	function addMenuGroup(label) {
		return menu.append('optgroup').attr('label', label);
	}

	function addMenuOption(text, value, group) {
		if (!group) menu.append('option').attr('value', value).text(text);
		else group.append('option').attr('value', value).text(text);
	}

	function addButtons() {
		var buttons = in_div.append('div').style('float', 'right');
		
		buttons.append('button')
			.text("Cancel")
			.on('click', function() {
				on_cancel($(menu.node()));
			});

		buttons.append('button')
			.text("Deselect all")
			.on('click', function() { 
				$(menu.node()).select2('val', '');
			});
		
		buttons.append('button')
			.text("OK")
			.on('click', function() {
				console.log(divId);
				on_click($(menu.node()));
			});
	}

	function on_click(param) {
		if (typeof on_click_function === 'function') on_click_function(param);
		console.log(on_click_function)
	}

	function set_on_click(func) {
		if (typeof func === 'function') on_click_function = func;
		console.log(func);
	}

	function on_cancel(param) {
		if (typeof on_cancel_function === 'function') on_cancel_function(param);
	}

	function set_on_cancel(func) {
		if (typeof func === 'function') on_cancel_function = func;
	}

	function values() {
		if (!iphone) {
			return $(menu.node()).select2('data');
		} else {
			return $(menu.node()).val();
		}
	}

	function autoOpen() {
		return $(menu.node()).select2('open');
	}

	// refactor
	function update(geos) {
		if (!iphone) {
			$(menu.node()).select2('val', geos);
		} else {
			$(menu.node()).val(geos);
		}
	}

	// refactor
	function centerDiv() {
		$(dropdown_div.node()).css("top", Math.max(0, (($(div.node()).height() / 2 - $(dropdown_div.node()).height() / 2))));
		$(dropdown_div.node()).css("left", Math.max(0, (($(div.node()).width() / 2 - $(dropdown_div.node()).width() / 2))));
		console.log($(dropdown_div.node()).height(), $(div.node()).height(), (($(div.node()).height() - $(dropdown_div.node()).height() / 2)));
		console.log($(dropdown_div.node()).width(), $(div.node()).width(), (($(div.node()).width() - $(dropdown_div.node()).width() / 2)));
	}

	return {
		div: dropdown_div,
		menu: menu,
		on_click: set_on_click,
		on_cancel: set_on_cancel,
		values: values,
		open: autoOpen,
		update: update
	}
}
