// chosen plugin select
gapminder.viz.tools.n_dropdown = function dropdown(elements) {
	// About data on this?
	var div = elements.div;

	var dropdown_div = div.append("div")
		.attr("id", "test")
		.style('background-color', '#FDFDFD')
		.style('margin', '0 auto')
		.style('position', 'relative')
		.style('height', '300px')
		.style('width', '350px');

	var in_div;

	var menu;

	addDivHeader('Select place');
	createMultipleMenu('Select Location');
	addButtons();
	
	// population for income_mountain
	var income_mountain_available = [["ASI","Asia"],["AME","America"],["AFR","Africa"],["EUR","Europe"],["WORLD","World"],["AFG","Afghanistan"],["ALB","Albania"],["DZA","Algeria"],["AGO","Angola"],["ARG","Argentina"],["ARM","Armenia"],["AUS","Australia"],["AUT","Austria"],["AZE","Azerbaijan"],["BHS","Bahamas"],["BGD","Bangladesh"],["BRB","Barbados"],["BLR","Belarus"],["BEL","Belgium"],["BEN","Benin"],["BOL","Bolivia"],["BWA","Botswana"],["BRA","Brazil"],["BGR","Bulgaria"],["BFA","Burkina Faso"],["BDI","Burundi"],["KHM","Cambodia"],["CMR","Cameroon"],["CAN","Canada"],["CAF","Central African Republic"],["TCD","Chad"],["CHL","Chile"],["CHN","China"],["COL","Colombia"],["COM","Comoros"],["COD","Congo [DRC]"],["COG","Congo [Republic]"],["CRI","Costa Rica"],["HRV","Croatia"],["CUB","Cuba"],["CZE","Czech Republic"],["DNK","Denmark"],["DJI","Djibouti"],["DOM","Dominican Republic"],["ECU","Ecuador"],["EGY","Egypt"],["SLV","El Salvador"],["EST","Estonia"],["ETH","Ethiopia"],["FJI","Fiji"],["FIN","Finland"],["FRA","France"],["GAB","Gabon"],["GMB","Gambia"],["GEO","Georgia"],["DEU","Germany"],["GHA","Ghana"],["GRC","Greece"],["GTM","Guatemala"],["GIN","Guinea"],["GNB","Guinea-Bissau"],["GUY","Guyana"],["HTI","Haiti"],["HND","Honduras"],["HKG","Hong Kong"],["HUN","Hungary"],["IND","India"],["IDN","Indonesia"],["IRN","Iran"],["IRQ","Iraq"],["IRL","Ireland"],["ISR","Israel"],["ITA","Italy"],["CIV","Ivory Coast"],["JAM","Jamaica"],["JPN","Japan"],["JOR","Jordan"],["KAZ","Kazakhstan"],["KEN","Kenya"],["KGZ","Kyrgyzstan"],["LAO","Laos"],["LVA","Latvia"],["LBN","Lebanon"],["LSO","Lesotho"],["LTU","Lithuania"],["LUX","Luxembourg"],["MKD","Macedonia [FYROM]"],["MDG","Madagascar"],["MWI","Malawi"],["MYS","Malaysia"],["MLI","Mali"],["MRT","Mauritania"],["MUS","Mauritius"],["MEX","Mexico"],["MDA","Moldova"],["MNG","Mongolia"],["MAR","Morocco"],["MOZ","Mozambique"],["MMR","Myanmar [Burma]"],["NAM","Namibia"],["NPL","Nepal"],["NLD","Netherlands"],["NZL","New Zealand"],["NIC","Nicaragua"],["NER","Niger"],["NGA","Nigeria"],["NOR","Norway"],["PAK","Pakistan"],["PAN","Panama"],["PNG","Papua New Guinea"],["PRY","Paraguay"],["PER","Peru"],["PHL","Philippines"],["POL","Poland"],["PRT","Portugal"],["PRI","Puerto Rico"],["ROU","Romania"],["RUS","Russia"],["RWA","Rwanda"],["SEN","Senegal"],["SRB","Serbia"],["SYC","Seychelles"],["SLE","Sierra Leone"],["SGP","Singapore"],["SVK","Slovakia"],["SVN","Slovenia"],["SOM","Somalia"],["ZAF","South Africa"],["KOR","South Korea"],["ESP","Spain"],["LKA","Sri Lanka"],["SDN","Sudan"],["SUR","Suriname"],["SWE","Sweden"],["CHE","Switzerland"],["SYR","Syria"],["TWN","Taiwan"],["TJK","Tajikistan"],["TZA","Tanzania"],["THA","Thailand"],["TGO","Togo"],["TTO","Trinidad and Tobago"],["TUN","Tunisia"],["TUR","Turkey"],["TKM","Turkmenistan"],["UGA","Uganda"],["UKR","Ukraine"],["GBR","United Kingdom"],["USA","United States"],["URY","Uruguay"],["UZB","Uzbekistan"],["VEN","Venezuela"],["VNM","Vietnam"],["YEM","Yemen"],["ZMB","Zambia"],["ZWE","Zimbabwe"]];
    income_mountain_available.forEach(function(d) {
        addMenuOption(d[1], d[0]);
    });

	// Start select2 (chosen?) plugin
	$(".chosen-select").select2({
		placeholder: "Select place"
	});

	function addDivHeader(text) {
		dropdown_div.append("div")
			.attr('class', 'geo_location_header')
			.append('p')
			.text(text);
	}

	function createMultipleMenu(placeholderText) {
		in_div = dropdown_div.append('div')	
		menu = in_div.append('select')
			.attr('multiple', 'multiple')
			.attr('class', 'chosen-select')
			.attr('tabindex', 3)
			.style('margin', '0 auto')
			.style('width', '100%');

		if (placeholderText) menu.attr('data-placeholder', placeholderText);
	}

	function addMenuOption(text, value) {
		menu.append('option').attr('value', value).text(text);
	}

	function addButtons() {
		var buttons = in_div.append('div').style('float', 'right');
		
		buttons.append('button')
			.text("Deselect all")
			.on('click', function() { 
				$(".chosen-select").select2('val', '');
			});
		
		buttons.append('button')
			.text("OK")
			.on('click', function() {
				on_click();
			});
	}

	function on_click(param) {
		if (typeof on_click_function === 'function') on_click_function(param);
	}

	function set_on_click(func) {
		if (typeof func === 'function') on_click_function = func;
	}

	function values() {
		return $('.chosen-select').select2('val');
	}

	return {
		on_click: set_on_click,
		values: values
	}
}
