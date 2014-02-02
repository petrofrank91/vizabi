<!DOCTYPE html>
    <html>

        <head>
            <title>Income Mountain Viz</title>
        </head>

        <body>
            <div id="income_mountain"></div>
            <div id="income_mountain2"></div>
        </body>
        <script type="text/javascript" src="../start.js" charset="utf-8"></script>
        <script type="text/javascript">
        var gettext = (typeof json_locale_data !== "undefined") ? new Gettext({ domain: 'incMountain', locale_data: json_locale_data }) : undefined;

        var o = gapminder.income_mountain({
            div: "#income_mountain",
            geo: ["EUR", "AME", "AFR"],
            year: 1900,
//            state: {
//                geo: ["EUR","AME","AFR","EUR"],
//                year:
//            }
        height: "100%",
        width: "100%",
        i18n: gettext
        });

        //        var i = gapminder.income_mountain({
//            div: "#income_mountain2",
//            geo: ["EUR","AME"],
//            height: 250,
//            width: 450,
//            stack: true,
//            fullscreen: true
//        });
        </script>

    </html>