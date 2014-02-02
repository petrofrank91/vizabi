// About data
gapminder.tools.aboutData = function (elements, text, url) {
    if (!elements) {
        console.error('About data needs elements');
        return;
    }

    var div = elements.div;
    var group = elements.svg.append('g');
    var divId = div.attr("id");

    var aboutDiv = div.append('div');
    var placeholderDiv;

    var textToDisplay = text;
    var urlToLoad = url;

    function drawText() {
        group.attr('class', 'aboutData')
            .append('text')
            .text(textToDisplay)
            .style('font-size', 12)
            .attr('y', 12);
    }

    function createPlaceholderDiv() {
        placeholderDiv = div.append('div')
            .style('position', 'absolute')
            .style('height', '100%')
            .style('width', "100%")
            .style('padding', '2px')
            .style('vertical-align', 'middle')
            .style('margin', '0 auto');
    }

    function insertDiv(d) {
        placeholderDiv[0][0].appendChild(d[0][0]);
    }

    // function show() {
    //     placeholderDiv.style('visibility', 'visible');
    // }

    // function hide() {
    //     placeholderDiv.style('visibility', 'hidden');
    // }

    drawText();
    //createPlaceholderDiv();

    return {
        g: group,
        insert: insertDiv,
        // show: show,
        // hide: hide
    }
}
