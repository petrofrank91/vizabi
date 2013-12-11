gapminder.viz.tools.dropdown = function dropdown(svg, text) {
    "use strict";

    var group;
    
    var padding = 20;
    var open = false;

    var select_element;
    var select_click;

    var errMsg = {
        missingSVG: 'Please specify a SVG',
        missingText: 'Please add an i18n text to the dropdown'
    }

    if (!svg) {
        console.error("dropdown:", errMsg.missingSVG);
        return false;
    }

    group = svg.append("g");

    if (!text) {
        console.error('dropdown:', errMsg.missingText);
        return false;
    }
    
    function draw_select() {
        group.append("rect").attr("class", "select")
            .attr("x", "1px").attr("y", "8px")
            .attr("rx", "5px").attr("ry", "5px")
            .attr("height", "32px").attr("width", "200px");
        
        group.append("text").attr("class", "select")
            .attr("x", "10px").attr("y", "30px")
            .text(text)
        
        group.append("polygon").attr("class", "select")
            .attr("points", gapminder.graphics.select.triangle);
    }

    function svg_on_click() {   // maybe pass size and change on end of populate?
        group.on("click", function(event) {
            if (typeof select_click === 'function') select_click();
        });
    }

    function set_svg_on_click(func) {
        if (typeof func === 'function') select_click = func;
    }
    
    function get_select_svg_box() {
        return svg.node().getBBox();
    }
    
    draw_select();
    svg_on_click();

    // Income Mountain:
    var income_mountain_available = [["ASI","Asia"],["AME","America"],["AFR","Africa"],["EUR","Europe"],["WORLD","World"],["AFG","Afghanistan"],["ALB","Albania"],["DZA","Algeria"],["AGO","Angola"],["ARG","Argentina"],["ARM","Armenia"],["AUS","Australia"],["AUT","Austria"],["AZE","Azerbaijan"],["BHS","Bahamas"],["BGD","Bangladesh"],["BRB","Barbados"],["BLR","Belarus"],["BEL","Belgium"],["BEN","Benin"],["BOL","Bolivia"],["BWA","Botswana"],["BRA","Brazil"],["BGR","Bulgaria"],["BFA","Burkina Faso"],["BDI","Burundi"],["KHM","Cambodia"],["CMR","Cameroon"],["CAN","Canada"],["CAF","Central African Republic"],["TCD","Chad"],["CHL","Chile"],["CHN","China"],["COL","Colombia"],["COM","Comoros"],["COD","Congo [DRC]"],["COG","Congo [Republic]"],["CRI","Costa Rica"],["HRV","Croatia"],["CUB","Cuba"],["CZE","Czech Republic"],["DNK","Denmark"],["DJI","Djibouti"],["DOM","Dominican Republic"],["ECU","Ecuador"],["EGY","Egypt"],["SLV","El Salvador"],["EST","Estonia"],["ETH","Ethiopia"],["FJI","Fiji"],["FIN","Finland"],["FRA","France"],["GAB","Gabon"],["GMB","Gambia"],["GEO","Georgia"],["DEU","Germany"],["GHA","Ghana"],["GRC","Greece"],["GTM","Guatemala"],["GIN","Guinea"],["GNB","Guinea-Bissau"],["GUY","Guyana"],["HTI","Haiti"],["HND","Honduras"],["HKG","Hong Kong"],["HUN","Hungary"],["IND","India"],["IDN","Indonesia"],["IRN","Iran"],["IRQ","Iraq"],["IRL","Ireland"],["ISR","Israel"],["ITA","Italy"],["CIV","Ivory Coast"],["JAM","Jamaica"],["JPN","Japan"],["JOR","Jordan"],["KAZ","Kazakhstan"],["KEN","Kenya"],["KGZ","Kyrgyzstan"],["LAO","Laos"],["LVA","Latvia"],["LBN","Lebanon"],["LSO","Lesotho"],["LTU","Lithuania"],["LUX","Luxembourg"],["MKD","Macedonia [FYROM]"],["MDG","Madagascar"],["MWI","Malawi"],["MYS","Malaysia"],["MLI","Mali"],["MRT","Mauritania"],["MUS","Mauritius"],["MEX","Mexico"],["MDA","Moldova"],["MNG","Mongolia"],["MAR","Morocco"],["MOZ","Mozambique"],["MMR","Myanmar [Burma]"],["NAM","Namibia"],["NPL","Nepal"],["NLD","Netherlands"],["NZL","New Zealand"],["NIC","Nicaragua"],["NER","Niger"],["NGA","Nigeria"],["NOR","Norway"],["PAK","Pakistan"],["PAN","Panama"],["PNG","Papua New Guinea"],["PRY","Paraguay"],["PER","Peru"],["PHL","Philippines"],["POL","Poland"],["PRT","Portugal"],["PRI","Puerto Rico"],["ROU","Romania"],["RUS","Russia"],["RWA","Rwanda"],["SEN","Senegal"],["SRB","Serbia"],["SYC","Seychelles"],["SLE","Sierra Leone"],["SGP","Singapore"],["SVK","Slovakia"],["SVN","Slovenia"],["SOM","Somalia"],["ZAF","South Africa"],["KOR","South Korea"],["ESP","Spain"],["LKA","Sri Lanka"],["SDN","Sudan"],["SUR","Suriname"],["SWE","Sweden"],["CHE","Switzerland"],["SYR","Syria"],["TWN","Taiwan"],["TJK","Tajikistan"],["TZA","Tanzania"],["THA","Thailand"],["TGO","Togo"],["TTO","Trinidad and Tobago"],["TUN","Tunisia"],["TUR","Turkey"],["TKM","Turkmenistan"],["UGA","Uganda"],["UKR","Ukraine"],["GBR","United Kingdom"],["USA","United States"],["URY","Uruguay"],["UZB","Uzbekistan"],["VEN","Venezuela"],["VNM","Vietnam"],["YEM","Yemen"],["ZMB","Zambia"],["ZWE","Zimbabwe"]];
    income_mountain_available.forEach(function(d) {
        // populate(d[0], d[1]);
    });
    
    return {
        g: group,
        svg_on_click: set_svg_on_click
    };
}
