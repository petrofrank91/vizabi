gapminder.viz.tools.txt = function (svg, text, fontsize, cssClass) {
    'use strict';

    var group = svg.append('g');
    var txt = group.append('text').text(text);

    if (cssClass && typeof cssClass === 'string') {
        txt.attr('class', cssClass);
    }

    if (fontsize && !isNaN(+fontsize)) {
        txt.attr('y', +fontsize).style('font-size', +fontsize);
    }

    function setText(newText) {
        if (typeof newText === 'string' || typeof newText === number) {
            group.text(newText);
        }
    };

    function setFontsize(newSize) {
        if (newSize && !isNaN(+newSize)) {
            txt.attr('y', +newSize).style('font-size', +newSize);
        }
    }

    function setClass(newClass) {
        if (newClass && typeof newClass === 'string') {
            txt.attr('class', newClass);
        }
    }

    return {
        g: group,
        setText: setText,
        setFontsize: setFontsize,
        setClass: setClass
    };
}
