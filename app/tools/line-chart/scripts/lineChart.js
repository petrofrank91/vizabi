gapminder.lineChart = function(renderDiv,state) {

    var isInteractive;
    var chartLabelDiv;
    var lineChart;
    var model;
    var appSVG;
    var timeSlider;
    var modelBindCallback;


    var setInitialState = function (state) {
        model = new gapminder.lineChartModel();

        model.setInit(state, function() {
            isInteractive = model.get("isInteractive");
            setUpSubviews();
            setUpModelAndUpdate();
            if (modelBindCallback) {modelBindCallback(model.getAttributes());}
        });
    };


    var setState = function(state) {
        model.set(state, function() {
            isInteractive = model.get("isInteractive");
            setUpModelAndUpdate();
            if (modelBindCallback) {modelBindCallback(model.getAttributes());}
        });
    };

    var setUpModelAndUpdate = function() {
        var year =   model.get("year");
        var trails = model.get("trails");

        $("#" + chartLabelDiv).html(Math.round(year));

        if (isInteractive) {
            timeSlider.update(model);
        }

        lineChart.update(model);
    };


    var setUpSubviews =  function() {
        $(document).ready(function() {
            initializeGuiElements(renderDiv);
            initializeTimeSlider(isInteractive,renderDiv);
            initializeLineChart(appSVG,renderDiv);
            setTrailsCheckBoxBinding();
        });
    };


    var initializeGuiElements = function(renderDiv) {
        gapminder.guiUtils.initializeLayers(renderDiv, scatterChartModelUpdate, model);
        if (isInteractive)
        {
            gapminder.guiUtils.createTrails(renderDiv);
        }

        chartLabelDiv = gapminder.guiUtils.get("labelForYear");

        var appDIV = "#" + renderDiv;
        appSVG = d3.select(appDIV).append("svg")
            .style({display: "block"});
    };

    var initializeLineChart = function (svg, renderDiv) {
        lineChart = new gapminder.vizLine();
        lineChart.initialize(svg, renderDiv, model);
    };


    var initializeTimeSlider = function (isInteractive, renderDiv) {
        if (isInteractive)
        {
            gapminder.guiUtils.createTimeSlider(renderDiv);

            timeSlider = new gapminder.timeSlider(timeSliderModelUpdate);
            timeSlider.initialize(model);
            timeSlider.setupListeners();
        }
    };


    var scatterChartModelUpdate = function (state) {
        model.set(state, function() {
            lineChart.update(model);
            if (modelBindCallback) {modelBindCallback(model.getAttributes());}
        });

    };

    var timeSliderModelUpdate = function (state) {
        model.set(state, function() {

            $("#" + chartLabelDiv).html(Math.round(model.get("year")));
            timeSlider.update(model);
            lineChart.update(model);
            if (modelBindCallback) {modelBindCallback(model.getAttributes());}
        });
    };


    var setTrailsCheckBoxBinding = function() {
        $(document).on('change', ".ui-trails", function() {
            if($(this).is(':checked')) {
                model.set({trails : "standard"}, setUpModelAndUpdate);
                if (modelBindCallback) {modelBindCallback(model.getAttributes());}
            }
            else {
                model.set({trails : "none"}, setUpModelAndUpdate);
                if (modelBindCallback) {modelBindCallback(model.getAttributes());}
            }
        });
    };

    var registerModelBindCallback = function(callback) {
        modelBindCallback = callback;
    };



   setInitialState(state);

    return {
        setVizabiState: setInitialState,
        setState: setState,
        setInitialState: setInitialState,
        registerStateBindCallback: registerModelBindCallback
    };
};
