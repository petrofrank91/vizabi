gapminder.components.timeSlider = function (callback) {

    var sliderAttributes = {
        year: undefined,
        slider: "",
        timeSliderDiv: "",
        sliderScale: undefined
    };

    var timeSliderState;

    var playButton;
    var timer;
    var playing;
    var sliderStateChangeCallback = callback;


    var initialize = function (state, timeSliderDiv) {
        timeSliderState = state;
        sliderAttributes.timeSliderDiv = $(".G_widget_slider", "#" + timeSliderDiv);
        sliderAttributes.sliderScale = $(".G_widget_slider_scale ", "#" + timeSliderDiv);

        playButton = $(".play-button", "#" + timeSliderDiv);

        var scaleWidth = sliderAttributes.sliderScale.width();

        var scale = d3.scale.linear()
            .domain([timeSliderState.getDataHelper().getMinYear(), timeSliderState.getDataHelper().getMaxYear()])
            .range([0, scaleWidth]);

        var labels = d3.select(sliderAttributes.sliderScale[0])
            .selectAll("div")
            .data(scale.ticks(8));

        labels.enter().append("div")
            .style("font-family", "sans-serif")
            .style("font-size", "12px");

        labels
            .style("left", function (d, i) {
                return scale(d) - 12 + "px";
            })
            .style("position", "absolute")
            .text(String);

        labels.exit().remove();


        sliderAttributes.slider = $(sliderAttributes.timeSliderDiv).slider({
            min: timeSliderState.getDataHelper().getMinYear(),
            max: timeSliderState.getDataHelper().getMaxYear(),
            step: 0.1
        });
    };

    var playHandler = function () {
        if (playing) {
            clearInterval(timer);
            playing = false;
            sliderStateChangeCallback({enableHistory: true});
            playButton.attr("src", "/tools/bubble-chart/images/play.png");
        }
        else {
            playButton.attr("src", "/tools/bubble-chart/images/pause.png");
            timer = setInterval(function () {
                playingOnInterval();
            }, 40);
            playing = true;
        }
    };

    var playingOnInterval = function () {
        var year = parseFloat(timeSliderState.get("year"));
        var newYear = (year + parseFloat(timeSliderState.get("speed"))).toFixed(2);

        var hasNotReachEndOfSlider = newYear <= timeSliderState.getDataHelper().getMaxYear();
        if (hasNotReachEndOfSlider) {
            sliderStateChangeCallback({year: newYear, enableHistory: false, action: "year"});
        }
        else {
            stopHandler();
            sliderStateChangeCallback({year: Math.floor(newYear), enableHistory: false, action: "year"});
        }

        sliderAttributes.slider = $(sliderAttributes.timeSliderDiv)
            .slider({value: year});
    };

    var stopHandler = function () {
        clearInterval(timer);
        playing = false;
        timer = undefined;
        playButton.attr("src", "../../assets/img/bubble/play.png");
    };


    var setUpListenersForPlayAndSlideChangesEvents = function () {
        setPlayButtonClickEvent();
        setSliderEvents();

    };

    var setPlayButtonClickEvent = function () {
        playButton.click(function () {
            playHandler();
        });
    };

    var setSliderEvents = function () {
        sliderAttributes.slider = $(sliderAttributes.timeSliderDiv).slider({
            slide: function (e, ui) {
                // Just set the new state
                sliderStateChangeCallback({year: ui.value, enableHistory: false, action: "year"});
            },
            change: function (e, ui) {
                sliderChangeEventListener(e, ui);
            }
        });
    };

    var sliderChangeEventListener = function (e, ui) {
        if ("originalEvent" in e) {
            var year = ui.value;
            var prevYear = Math.floor(year);
            var nextYear = Math.ceil(year);
            var yearFraction = year - Math.floor(year);

            if (yearFraction < 0.5) {
                sliderStateChangeCallback({year: prevYear, enableHistory: true, action: "year"});
            }
            else {
                sliderStateChangeCallback({year: nextYear, enableHistory: true, action: "year"});
            }
        }
    };

    var update = function (state) {
        timeSliderState = state;

        $(sliderAttributes.timeSliderDiv).slider({
            value: state.get("year")
        });
    };

    return {
        initialize: initialize,
        setupListeners: setUpListenersForPlayAndSlideChangesEvents,
        update: update
    };

};

