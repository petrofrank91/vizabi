gapminder.viz.income_mountain.labels = function labels(svg, state) {
    "use strict";

    var group;
    var width = 300, height = 200;
    
    var state; // should be passed (inherited from income mountain);
    var on_click_callback;
    var onMouseOver_callback;
    var onMouseOut_callback;

    group = svg.append("g");

    function draw_labels() {
        var y_padding = 30;

        group.selectAll("g").remove();
        
        var geo = state.geo;

        for (var i = 0; i < geo.length; i++) {
            var name = gapminder.entities.get_name(geo[i]);
            var color = gapminder.entities.get_color(geo[i]);

            var label_group = group.append('g')
                .attr("id", name)
                .attr("class", "label");

            var text = label_group.append("text")
                .attr("class", "label_still")
                .attr("id", name)
                .attr("y", 20 + y_padding * i)
                .attr("fill", color)
                .text(name);
            
            var text_width = text.node().getBBox().width;
            
            var box = label_group.append("g").attr("class", "label-box");

            box.append("rect")
                .attr("x", text_width + 8).attr("y", 6 + y_padding * i)
                .attr("rx", "2px").attr("ry", "2px")
                .attr("width", "14px").attr("height", "14px")
                .attr("fill", color);
            
            box.append("text")
                .attr("x", text_width + 14.9).attr("y", 17.5 + y_padding * i)
                .text("x");

            label_group.on('mouseover', function() {
                onMouseOver(this);
            })
            .on('mouseout', function() {
                onMouseOut(this);
            });

            (function(geo) { bind_on_click(box, geo); })(geo[i]);
        }
    }
    
    function bind_on_click(element, param) {
        element.on("click", function() {
            on_click(param);
        });
    }

    function bind_onMouseOver(element, param) {
        element.on("mouseover", function() {
            onMouseOver(param);
        })
    }
    
    function on_click(param) {
        if (typeof on_click_callback === "function") on_click_callback(param);
    }
    
    function set_on_click(callback) {
        if (typeof callback === "function") on_click_callback = callback;
    }

    function onMouseOver(param) {
        if (typeof onMouseOver_callback === "function") onMouseOver_callback(param);
    }
    
    function set_onMouseOver(callback) {
        if (typeof callback === "function") onMouseOver_callback = callback;
    }

    function onMouseOut(param) {
        if (typeof onMouseOut_callback === "function") onMouseOut_callback(param);
    }
    
    function set_onMouseOut(callback) {
        if (typeof callback === "function") onMouseOut_callback = callback;
    }
    
    return {
        g: group,
        draw: draw_labels,
        on_click: set_on_click,
        onMouseOver: set_onMouseOver,
        onMouseOut: set_onMouseOut
    };
};
