Vizabi Bubble Chart - Version 0
========================
### List of Test Pages for Vizabi:

[URL for List of Test Pages](/index.html)

[Automated Jasmine Test Suites](/tests/jasmineTestRunner.html)

### Example of usage

```html
<html>
<head>
    <link rel="stylesheet" href="../assets/css/styles.css">
    <link rel="stylesheet" href="../libs/jquery-ui.custom/css/ui-lightness/jquery-ui-1.10.3.custom.css">

    <script type="text/javascript" src="../libs/jquery-ui.custom/js/jquery-1.9.1.js" charset="utf-8"></script>
    <script type="text/javascript" src="../libs/jquery-ui.custom/js/jquery-ui-1.10.3.custom.js" charset="utf-8"></script>
    <script type="text/javascript" src="../libs/d3/d3.v3.js" charset="utf-8"></script>

    <script type="text/javascript" src="../vizabi.min.js"></script>

    var chartState = {
            dataPath: "data/",
            year: 1960,
            xIndicator : "inc",
            yIndicator : "lex",
            sizeIndicator : "pop",
            entity : "unstates",
            fileFormat: "multipleCSV", // fileFormat as "singleCSV" is also supported
            xAxisScale: "log", // the default is linear
            xAxisTickValues: [500,1000,2000,5000,10000,20000, 50000]
        };

        var renderDiv = "chart-1";
        var renderMode = "interactive"; // you can also use "print" for A4 print scales and features

        var app = new gapminder.bubbleChart(renderDiv, renderMode, chartState);
</head>
</html>

```


### Vizabi URL State

Vizabi does not come up with its built-in URL state modification and you can implement your own URL state model. However for that to happen, you need to bind to Vizabi as followings:

```javascript
app.registerStateBindCallback(function(model) {
            var currentState = window.history.state;

            //You can either push or replace the state of Vizabi's model object
            if (!currentState) {
                history.pushState(model, "", "#?" + JSON.stringify(model));
            }
            else {
                history.replaceState(model, "", "#?" + JSON.stringify(model));
            }
});
```

========================
© Gapminder Foundation 2013
