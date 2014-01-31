gapminder.components.settingsButton = function (changeCallback, model) {

    var modelChangeCallback = changeCallback;
    var isInteractive = model.get("isInteractive");

    var initialize = function (renderDiv) {
        $("<input>", {
            id: "settingsButton",
            type: "button",
            style: "display:inline-block;width:20px"
        }).appendTo("#" + renderDiv);

        $("<div>", {
            id: "dialog-form"
        }).appendTo("#" + renderDiv);

        $("#dialog-form").dialog({
            title: "Vizabi Settings",
            autoOpen: false,
            height: 300,
            width: 350,
            position: {at: "right center"}
        });

        var LabelForFontRange = $("<label>", {
            for: "fontRangeValue"
        }).appendTo("#dialog-form");
        $(LabelForFontRange).text("Bubble Label Font Size Range:");

        $("<input>", {
            id: "fontRangeValue",
            type: "text"
        }).appendTo("#dialog-form");

        var fontSlider = $("<div>", {
            id: "font-slider",
            style: "margin-bottom: 12px; margin-top: 20px"
        }).appendTo("#dialog-form");

        var fontValues = {};
        fontValues.min = model.get("minFontSize") || 7;
        fontValues.max = model.get("maxFontSize") || 25;

        $(fontSlider).slider({
            range: true,
            min: 1,
            max: 50,
            values: [ fontValues.min, fontValues.max],
            slide: function (event, ui) {
                $("#fontRangeValue").val(ui.values[0] + "px" + "-" + ui.values[ 1 ] + "px");
                modelChangeCallback({minFontSize: ui.values[0], maxFontSize: ui.values[1]});
            }
        });

        if (isInteractive) {
            $(fontSlider).slider("option", "disabled", true);
        }

        $("#fontRangeValue").val($("#font-slider").slider("values", 0) + " px" +
            " - " + $("#font-slider").slider("values", 1) + " px");

        var labelForSizeRange = $("<label>", {
            for: "rangeValue"
        }).appendTo("#dialog-form");

        $(labelForSizeRange).text("Bubble Size Range:");

        $("<input>", {
            id: "sizeRangeValue",
            type: "text"
        }).appendTo("#dialog-form");

        var sizeSlider = $("<div>", {
            id: "size-slider",
            style: "margin-bottom: 12px; margin-top: 20px"
        }).appendTo("#dialog-form");


        var sizeValues = {};
        sizeValues.min = model.get("minBubbleSize") || 1;
        sizeValues.max = model.get("maxBubbleSize") || 30;

        $(sizeSlider).slider({
            range: true,
            min: 0,
            max: 100,
            values: [sizeValues.min, sizeValues.max],
            slide: function (event, ui) {
                $("#sizeRangeValue").val(ui.values[ 0 ] + " px - " + ui.values[ 1 ] + " - px");
                modelChangeCallback({minBubbleSize: ui.values[0], maxBubbleSize: ui.values[1]});
            }
        });

        $("#sizeRangeValue").val($("#size-slider").slider("values", 0) + "px" +
            " -" + $("#size-slider").slider("values", 1) + "px");

        var editModeSetting = $("<div>", {
            id: "editModeSetting"
        }).appendTo("#dialog-form");


        $("<input>", {
            id: "editMode",
            type: "radio",
            name: "edit",
            value: "editOn"
        }).appendTo(editModeSetting);

        var editLabel = $("<label>", {
            for: "editMode"
        }).appendTo(editModeSetting);

        editLabel.html("Edit Mode");

        $("<input>", {
            id: "nonEditMode",
            type: "radio",
            name: "edit",
            value: "editOff",
            //checked: "checked"
        }).appendTo(editModeSetting);

        var nonEditLabel = $("<label>", {
            for: "nonEditMode"
        }).appendTo(editModeSetting);

        nonEditLabel.html("Locked Mode");


        var isEditMode = model.get("editMode");
        if (isEditMode) {
            $("#editMode").attr("checked", "checked");
        }
        else {
            $("#nonEditMode").attr("checked", "checked");
        }
        $(editModeSetting).buttonset();


        $("#editModeSetting input[name='edit']").click(function () {
            if ($('input:radio[name=edit]:checked').val() === "editOn") {
                modelChangeCallback({editMode: true});
            }
            else {
                modelChangeCallback({editMode: false});
            }
        });

        if (isInteractive) {
            $("#editModeSetting > input:radio").button({disabled: true});
        }

        $("#settingsButton")
            .button()
            .click(function () {
                $("#dialog-form").dialog("open");
            });
    };

    return {
        initialize: initialize
    };
};
