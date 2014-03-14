define([
        'jquery',
        'bubble-chart-model',
        'viz-bubble',
        'time-slider-jQueryUI',
        'settings-button',
        'chart-grid',
        'i18n'
    ],
    function ($, bubbleChartModel, vizBubble, timeSlider, settingsButton, chartGrid) {
        // supposed to be available at window.vizabi.bubbleChart
        var bubbleChart = function (renderDiv, state) {
            var isInteractive;
            var _vizBubble;
            var model;
            var appSVG;
            var _timeSlider;
            var _vizChart;
            var chartScales;
            var availableFrame;
            var modelBindCallback;
            var placeholderDivIds = {
                slider: undefined,
                trails: undefined,
                playImage: undefined
            };
            var enableManualZoom;
            var _i18n;

            var setInitialState = function (state) {
                model = new bubbleChartModel();

                model.setInit(state, function () {
                    isInteractive = model.get("isInteractive");
                    setUpSubviews();
                    setUpModelAndUpdate();
                    if (model.get("manualZoom")) {setZoom();}
                    if (modelBindCallback) {
                        modelBindCallback(model.getAttributes());
                    }
                });

                seti18n();
            };

            var setState = function (state) {
                model.set(state, function () {
                    isInteractive = model.get("isInteractive");
                    setUpModelAndUpdate();
                    if (modelBindCallback) {
                        modelBindCallback(model.getAttributes());
                    }
                });
            };

            var seti18n = function() {
                var language = model.get("language");
                var fn = model.get("i18nfn");

                _i18n = fn ? fn : i18n.instance();

                if (language) {
                    setLanguage(language)
                }
            };

            var setLanguage = function(lang, callback) {
                var filename = 0;
                _i18n.setLanguage(lang, filename, callback);
            };

            var setUpModelAndUpdate = function () {
                var year = model.get("year");
                var trails = model.get("trails");

                if (isInteractive) {
                    _timeSlider.update(model);
                }

                chartScales = _vizChart.updateLayout(model);
                availableFrame = _vizChart.getAvailableHeightAndWidth();
                _vizBubble.update(model,chartScales, availableFrame);
            };


            var setUpSubviews = function () {
                initializeLayers(scatterChartModelUpdate);
                initializeScatterChart(appSVG, renderDiv);
                initializeTimeSlider(isInteractive);
            };


            var initializeScatterChart = function (svg, renderDiv) {
                var _vizBubblePrint;

                _vizBubble = new vizBubble(scatterChartModelUpdate);

                _vizChart = new chartGrid();
                _vizChart.initializeLayers(renderDiv);

                if (!isInteractive) {
                    _vizBubblePrint = new gapminder.viz.vizBubblePrint(chartRenderDiv, vizState, vizStateChangeCallback);
                    _vizBubblePrint.registerClickEventListerners();
                    _vizBubblePrint.registerAlignButtonsEventListeners();
                }

                _vizBubble.initialize(svg, renderDiv, model);
            };

            var initializeTimeSlider = function (isInteractive) {
                if (isInteractive) {
                    createTimeSlider();
                    _timeSlider = new timeSlider(timeSliderModelUpdate);
                    _timeSlider.initialize(model, getDivId("slider"));
                    _timeSlider.setupListeners();
                }
            };


            var scatterChartModelUpdate = function (state) {
                model.set(state, function () {
                    _vizBubble.update(model,chartScales, availableFrame);
                    if (modelBindCallback) {
                        modelBindCallback(model.getAttributes());
                    }
                });

            };

            var timeSliderModelUpdate = function (state) {
                model.set(state, function () {
                    _timeSlider.update(model);
                    _vizChart.updateLayout(model);
                    _vizBubble.update(model,chartScales, availableFrame);
                    if (modelBindCallback) {
                        modelBindCallback(model.getAttributes());
                    }
                });
            };


            var initComponents = function() {
                components.init(svg, model, scatterChartModelUpdate);
            };

            var initLayouts = function() {
                var _bubbleChartLayout = new bubbleChartLayout();
                _bubbleChartLayout.init(components);
            };

            var initLayoutManager = function () {
                lm.init(svg, defaultMeasures, currentMeasures);
                lm.divScale();
            };


            /* GUI Layer Creator */
            var initializeLayers = function (changeCallback) {
                var appRenderDiv = document.getElementById(renderDiv);

                setDivId("labelForYear", "label-year-" + renderDiv);

    //            var _settingsButton = new settingsButton(changeCallback, model);
    //            _settingsButton.initialize(renderDiv);

                //            var alignButtons = document.createElement("div");
                //            alignButtons.id = "alignButtons";
                //            alignButtons.style.display = "inline-block";
                //            alignButtons.style.width = "100px";
                //            alignButtons.style.height = "20px";
                //            appRenderDiv.appendChild(alignButtons);
                //
                //
                //            var leftAlign = document.createElement("input");
                //            leftAlign.id = "leftAlign";
                //            leftAlign.setAttribute("name", "setting");
                //            leftAlign.setAttribute("value", "leftAlign");
                //            leftAlign.setAttribute("type", "radio");
                //            alignButtons.appendChild(leftAlign);
                //
                //            var leftLabel = document.createElement("label");
                //            leftLabel.setAttribute("for", "leftAlign");
                //            leftLabel.style.fontSize = "6px;";
                //            leftLabel.innerHtml = "LEFT";
                //            alignButtons.appendChild(leftLabel);
                //
                //
                //            var midAlign = document.createElement("input");
                //            midAlign.id = "leftAlign";
                //            midAlign.setAttribute("name", "setting");
                //            midAlign.setAttribute("value", "midAlign");
                //            midAlign.setAttribute("type", "radio");
                //            alignButtons.appendChild(midAlign);
                //
                //            var midLabel = document.createElement("label");
                //            midLabel.setAttribute("for", "midAlign");
                //            midLabel.style.fontSize = "6px;";
                //            midLabel.innerHtml = "CENTER";
                //            alignButtons.appendChild(midLabel);
                //
                //            var rightAlign = document.createElement("input");
                //            rightAlign.id = "rightAlign";
                //            rightAlign.setAttribute("name", "setting");
                //            rightAlign.setAttribute("values", "rightAlign");
                //            rightAlign.setAttribute("type", "radio");
                //            alignButtons.appendChild(rightAlign);
                //
                //            var rightLabel = document.createElement("label");
                //            rightLabel.setAttribute("for", "midAlign");
                //            rightLabel.style.fontSize = "6px;";
                //            rightLabel.innerHtml = "RIGHT";
                //            alignButtons.appendChild(rightLabel);
                //
                //            $("#alignButtons").buttonset();
                //            $("#alignButtons").hide();
            };

            var createTimeSlider = function () {
                var appRenderDiv = document.getElementById(renderDiv);

                setDivId("slider", "slider-" + renderDiv);
                var sliderDiv = document.createElement("div");
                sliderDiv.id = getDivId("slider");
                appRenderDiv.appendChild(sliderDiv);

                var sliderPlayDiv = document.createElement("div");
                sliderPlayDiv.className = "G_widget_slider_play";
                sliderPlayDiv.style.width = "40px";
                sliderPlayDiv.style.float = "left";
                sliderDiv.appendChild(sliderPlayDiv);

                var imageParent = document.getElementById(getDivId("slider")).getElementsByClassName("G_widget_slider_play")[0];
                setDivId("playImage", "image-" + renderDiv);
                var playImage = document.createElement("img");
                playImage.className = "play-button";
                playImage.src = "tools/bubble-chart/images/play.png"; // TODO: Do not include src here, the className is enough. Move src to css as url()
                imageParent.appendChild(playImage);

                var sliderWidgetDiv = document.createElement("div");
                sliderWidgetDiv.className = "G_widget_slider";
                sliderWidgetDiv.style.marginLeft = "50px";
                sliderDiv.appendChild(sliderWidgetDiv);

                var sliderWidgetScale = document.createElement("div");
                sliderWidgetScale.className = "G_widget_slider_scale";
                sliderWidgetScale.style.marginLeft = "50px";
                sliderWidgetScale.style.marginTop = "10px";
                sliderWidgetScale.style.position = "relative";
                sliderDiv.appendChild(sliderWidgetScale);
            };

            var getDivId = function (divName) {
                return placeholderDivIds[divName];
            };

            var setDivId = function (divName, divId) {
                placeholderDivIds[divName] = divId;
            };

            var setZoom = function () {
                var g = d3.select("#" + renderDiv).select("g");
                var xScale = _vizChart.getXScale();
                var yScale = _vizChart.getYScale();

                var zoom = d3.behavior.zoom()
                    .on("zoom", function() {
                        zoomed(xScale,yScale, zoom.scale())
                    });

                g.call(zoom);
            };

            var zoomed = function (xScale, yScale, zoomScale) {
                _vizChart.updateLayout(model, zoomScale);
                var availableFrame = _vizChart.getAvailableHeightAndWidth();
                var xScale = _vizChart.getXScale();
                var yScale = _vizChart.getYScale();

                _vizBubble.update(model,[xScale, yScale], availableFrame);
            };

            setInitialState(state);

            return {
                setVizabiState: setInitialState,
                setState: setState,
                setInitialState: setInitialState,
                registerStateBindCallback: registerModelBindCallback
            };
        };

        return bubbleChart;
    }
);
