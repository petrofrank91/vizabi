function relatedPage(containerDiv, divToInsert, relatedArray) {
    var errMsg = {
        noContainer: 'Please specify a container',
        noDivToInsert: 'No div to be inserted'
    }

    var isDisplayed = true;

    if (!containerDiv) {
        console.error(containerDiv);
        return false;
    }

    if (!divToInsert) {
        console.error(noDivToInsert);
        return false;
    }

    if (!relatedArray) {

    }

    var divContent = d3.select('#' + divToInsert);

    var mainPage = d3.select('#' + containerDiv)
        .append('div')
        .style('float', 'left')
        .style('width', '80%')
        .style('background', '#FDFDFD');

    mainPage.node().appendChild(divContent.node());

    var relatedPage = d3.select('#' + containerDiv)
        .append('div')
        .style('float', 'right')
        .style('width', '14%')
        .style('border', '1px #b9b9b9 solid')
        .style('background', '#F6FCFC');

    if (!relatedArray || !relatedArray.length) {
        relatedPage.append("p").text("There are no related arrays");
    }

    var hideButton = relatedPage.append("div")
        .style('width', '85%')
        .style('display', 'block')
        .style("margin-left", 'auto')
        .style("margin-right", 'auto')
        .append("p")
        .style("font-family", "Arial Rounded MT Bold")
        .text("HIDE >");

    hideButton.on('click', function () {
        hide();
    })

    relatedArray.forEach(function (d) {
        var relatedItem = relatedPage.append("div")
            .style("border", "1px #b9b9b9 solid")
            .style('width', '80%')
            .style("background", '#fff')
            .style('display', 'block')
            .style("margin-left", 'auto')
            .style("margin-right", 'auto');

        relatedItem
            .style("font-family", "Arial Rounded MT Bold")
            .text(d.title);

        relatedItem.append("a")
            .attr("href", '/go/' + d.node_id)
            .append("img")
            .attr("src", d.thumb_url)
            .style("margin-left", 'auto')
            .style("margin-right", 'auto')
            .style('display', 'block')
            .style("max-width", "100%")
            .style("max-height", "100%");

        relatedPage.append("p");
    });

    d3.select('#banner').append('img')
        .attr('id', 'related-img')
        .attr('src', 'http://vizabi-dev.gapminder.org.s3.amazonaws.com/related_unused.png')
        .style("float", 'right')
        .style("max-height", '100%')
        .style('margin-right', '10px')
        .on('click', show);

    function hide() {
        isDisplayed = false;
        $(relatedPage.node()).fadeOut('fast', function () {
            mainPage.style('width', '100%');
            window.dispatchEvent(new Event('resize'));
        });
        //relatedPage.style("display", "none");
    }

    function show() {
        isDisplayed = true;
        $(relatedPage.node()).fadeIn('fast', function () {
            mainPage.style('width', '85%');
            window.dispatchEvent(new Event('resize'));
        })
    }

    window.addEventListener('resize', function () {
        relatedPage.style('min-height', mainPage.property('offsetHeight') + 'px');
        window.dispatchEvent(new Event('layout-resize'));
    });

    window.addEventListener('orientationchange', function () {
        if (isDisplayed) {
            show();
        } else {
            hide();
        }
        window.dispatchEvent(new Event('resize'));
    });

    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new Event('layout-resize'));
}
