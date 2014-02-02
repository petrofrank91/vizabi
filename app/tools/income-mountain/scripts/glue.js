// Income Mountain Glue
// ====================

// Implementation of the Income Mountain that glues all the visualization
// components together.
gapminder.im = function (divId, options) {
    var div;
    var svg;

    var ready = false;

    var layManager;
    var dataHandlers = {};

    // Income Mountain default perma-state
    var state = {
        year: 1820,
        stack: false,
        fullscreen: false,
        geo: [],
    };

    var incomeMountainOptions = {
        cachedData: [],
        drawData: [],
        maxHeight: 0,
        mountainPixelsHeight: 0,
        startYear: 1820,
        finalYear: 2010,
        start_year: 1820,
        final_year: 2010
    };

    var components = {};

    // Move this to i18n layer when layer is ready
    function i18n(str1, str2) {
        return str2;
    }

    var defaultMeasures = {
        width: 900,
        height: 500
    };

    var currentMeasures = {
        width: '100%',
        height: '100%'
    };

    var errMsg = {
        noDivSpecified: 'You must supply a <div>!',
        noStateSpecified: 'No state was specified'
    }

    if (!divId) {
        console.error(errMsg.noDivSpecified);
        return false;
    }

    div = d3.select(divId);
    svg = div.append('svg');
    var select_dropdown = gapminder.viz.tools.n_dropdown({div: div, svg: svg});

    function loadState(st) {
        if (!st) {
            console.error(errMsg.noStateSpecified);
            return false;
        }
        console.log(st);
        i18n = st.i18n || i18n;

        state.year = +st.year || state.year;
        state.geo = st.geo || state.geo;
        console.log(state.stack);
        if (!state.stack) {
            state.stack = (st.stack === true || st.stack === 'true');
        }
        ;
        console.log(state.stack);
        state.fullscreen =
            (st.fullscreen === true || st.fullscreen === 'true');

        if (typeof state.geo === "string") {
            state.geo = state.geo.split(",");
        }
    }

    function modifyUrl() {
        var serializedState = [];

        for (var s in state) {
            if (state.hasOwnProperty(s)) {
                serializedState.push(
                    encodeURIComponent(s) + "=" + encodeURIComponent(state[s])
                );
            }
        }

        var url = location.origin + location.pathname + "?" + serializedState.join("&");

        history.pushState({ }, 'Income Mountain', url);
    }

    function loadMeasures(opt) {
        currentMeasures.width = opt.width || currentMeasures.width;
        currentMeasures.height = opt.height || currentMeasures.height;

        svg.attr("height", currentMeasures.height)
            .attr("width", currentMeasures.width);
    }

    function initLayoutManager() {
        layManager = layoutManager(div, svg, defaultMeasures,
            currentMeasures);

        layManager.addLayout('default');
    }

    function initComponentHeader() {
        components.header = gapminder.viz.tools.txt(svg,
            i18n("incMountain", "People by income"),
            32, 'header'
        );

        layManager.addComponent('default', {
            g: components.header.g,
            id: 'header',
            top: 1,
            left: 1
        });
    }

    function initComponentDropdown() {
        components.dropdown = gapminder.viz.tools.dropdown(svg,
            i18n("incMountain", "SELECT LOCATION")
        );

        layManager.addComponent('default', {
            g: components.dropdown.g,
            id: 'dropdown',
            top: ['header.top'],
            left: ['header.right', 10]
        });
    }

    function initComponentLabels() {
        components.labels = gapminder.viz.income_mountain.labels(svg, state);

        layManager.addComponent('default', {
            g: components.labels.g,
            id: 'labels',
            top: ['header.bottom', 10],
            left: ['header.left']
        })
    }

    function initComponentTimeSlider() {
        components.timeSlider = gapminder.tools.time_slider({
            div: div,
            svg: svg,
            state: state,
            viz_window: currentMeasures,
            localConfigs: incomeMountainOptions
        });

        layManager.addComponent('default', {
            g: components.timeSlider.g,
            id: 'timeSlider',
            top: ['header.top'],
            right: ['stage.width', -10]
        })
    }

    function initComponentAboutData() {
        components.aboutData = gapminder.tools.aboutData(
            {div: div, svg: svg},
            i18n('incMountain',
                'Data by: Van Zanden et al., UNU-WIDER, ' +
                    'UN Pop. & Gapminder...'),
            'zandenData.html'
        );

        layManager.addComponent('default', {
            g: components.aboutData.g,
            id: 'aboutData',
            left: ['header.left'],
            bottom: ['stage.height']
        });
    }

    function initComponentAxis() {
        components.axis = axisGenerator(svg, i18n);

        layManager.addComponent('default', {
            g: components.axis.g,
            id: 'axis',
            left: ['header.left'],
            right: ['timeSlider.right'],
            bottom: ['aboutData.top', -5],
            render: components.axis.render
        });
    }

    function initComponentMountains() {
        components.mountains = gapminder.viz.incomeMountain(svg, function () {
            incomeMountainOptions.mountainPixelsHeight = components.mountains.getHeight()
            draw();
        });

        components.mountains.render(900, 500);

        layManager.addComponent('default', {
            g: components.mountains.g,
            id: 'mountains',
            top: ['timeSlider.bottom'],
            left: ['axis.left'],
            right: ['axis.right'],
            bottom: ['axis.top'],
            render: components.mountains.render
        });
    }

    // Data initialization
    function initDataHandlers() {
        dataHandlers.loader = gapminder.data_manager.income_mountain.loader(
            state, components.mountains.x);

        dataHandlers.operations =
            gapminder.data_manager.income_mountain.operations(
                state,
                incomeMountainOptions
            );
    }

    function initData() {
        state.geo = state.geo.filter(function (e, pos, self) {
            return self.indexOf(e) === pos;
        });

        var num_geos = state.geo.length;

        incomeMountainOptions.cachedData = dataHandlers.loader.load(
            state.geo,
            function () {
                if (!--num_geos) {
                    ready = true;
                    draw();
                    components.labels.draw();
                }
            }
        );
    }

    function loadGeo(geo) {
        var num_geos = countMissingGeoData();

        incomeMountainOptions.cachedData = dataHandlers.loader.load(
            state.geo,
            function () {
                if (!--num_geos) {
                    ready = true;
                    draw();
                    components.labels.draw();
                }
            }
        );

        if (!countMissingGeoData()) {
            ready = true;
            draw();
            components.labels.draw();
        }
    }

    function countMissingGeoData() {
        var count = 0;

        state.geo.forEach(function (d) {
            if (!incomeMountainOptions.cachedData[d]) count++;
        })

        return count;
    }

    function draw() {
        if (!ready) {
            return;
        }
        dataHandlers.operations.get_year();
        dataHandlers.operations.calculate_max_height();
        dataHandlers.operations.order();

        components.mountains.clear();   // remove any old paths

        for (var i = 0; i < incomeMountainOptions.drawData.length; i++) {
            dataHandlers.operations.fix_mountain_height(
                incomeMountainOptions.drawData[i].data,
                incomeMountainOptions.mountainPixelsHeight
            );

            components.mountains.renderMountain({
                name: incomeMountainOptions.drawData[i].name,
                data: [incomeMountainOptions.drawData[i].data],
                color: incomeMountainOptions.drawData[i].color
            });
        }
    }

    // Time slider binding
    function bindTimeSlider() {
        var play = function () {
            draw();
        };
        var whileSliding = function () {
            draw();
        };
        var stoppedSliding = function () {
            modifyUrl();
        };
        var stop = function () {
            draw();
            modifyUrl();
        };

        components.timeSlider.on_play(play);
        components.timeSlider.on_slide(whileSliding, stoppedSliding);
        components.timeSlider.on_stop(stop);
    }

    // Binds labels action
    function onClickLabels() {
        var onClick = function (geo) {
            state.geo.splice(state.geo.indexOf(geo), 1);
            select_dropdown.update(state.geo);
            loadGeo();
            components.labels.draw();
            draw();
            modifyUrl();
        };

        components.labels.on_click(onClick);
    }

    function bindDropdown() {
        var action = function () {
            //components.aboutData.show();
            $(select_dropdown.div.node()).show();
            svg.style('opacity', 0.5)
            select_dropdown.open();
        }

        components.dropdown.svg_on_click(action);
    }

    function hoverMountainOrLabel() {
        function mouseover(shape) {
            var id = shape.id;

            // Maybe classed active/inactive for the future? Keep 0.8 opacity?
            components.mountains.g.selectAll(".mountains_still")
                .style('opacity', 0.3);

            components.mountains.g.select('#' + id)
                .style('opacity', 1);

            components.labels.g.selectAll(".label")
                .style('opacity', 0.3);

            components.labels.g
                .select("#" + id)
                .style('opacity', 1);
        }

        function mouseout() {
            components.mountains.g.selectAll('.mountains_still')
                .style('opacity', 0.8)

            components.labels.g.selectAll('.label')
                .style('opacity', 0.8)
        }

        components.mountains.onMouseOver(mouseover);
        components.mountains.onMouseOut(mouseout);
        components.labels.onMouseOver(mouseover);
        components.labels.onMouseOut(mouseout);
    }

    loadState(options);
    loadMeasures(options);
    loadState(gapminder.helper.getStateFromURL());

    initLayoutManager();
    initComponentHeader();
    initComponentDropdown();
    initComponentLabels();
    initComponentTimeSlider();
    initComponentAboutData();
    initComponentAxis();
    initComponentMountains();

    initDataHandlers();
    initData();

    bindTimeSlider();
    bindDropdown();
    onClickLabels();
    hoverMountainOrLabel();

    draw();

    // Select 'hack'
    select_dropdown.update(state.geo);

    select_dropdown.on_click(function (menu) {
        ready = false;
        $(select_dropdown.div.node()).hide();
        svg.style('opacity', 1)

        state.geo = [];

        var values = select_dropdown.values();
        console.log(values);

        values.forEach(function (d) {
            if (d.id) {
                state.geo.push(d.id);
            } else {
                console.log(d);
                state.geo.push(d);
            }
        });

        loadGeo();
        modifyUrl();
    });

    select_dropdown.on_cancel(function () {
        $(select_dropdown.div.node()).hide();
        svg.style('opacity', 1)
    });

    if (navigator.userAgent.match(/iPhone/)) {
        div.style('position', 'relative');

        select_dropdown.menu.on('change', function () {
            ready = false;
            svg.style('opacity', 1)

            state.geo = [];

            var values = select_dropdown.values();

            values.forEach(function (d) {
                if (d.id) {
                    state.geo.push(d.id);
                } else {
                    console.log(d);
                    state.geo.push(d);
                }
            });

            loadGeo();
            modifyUrl();
            window.dispatchEvent(new Event('resize'));
        });
    }

    if (state.fullscreen) {
        layManager.fullscreenScale();
    } else {
        if (currentMeasures.width === '100%' ||
            currentMeasures.height === '100%') {
            layManager.divScale();
            layManager.update();
        }
    }

    layManager.update();
    modifyUrl();

    window.addEventListener('resize', function () {
        console.log(layManager.getComponent('dropdown'));
    })

    return {
        layoutManager: layManager
    }
};

// ToDo's
// ------
// * sort out naming throughout
// * Move URL to miscFunctions