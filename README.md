Gapminder Vizabi
==============

## Get started
In order to get the repo up and running, run the following commands:

    npm install -g bower grunt-cli
    npm install
    bower install

## Development Process
### Grunt build process
When you work with each type of `app` (`tool`, `vizabi-component` and `widget`), you can provide each of the
mentioned types with their references to fire up Grunt server which has its built-in LiveReload task, watching changes
and applying them instantly for styles and to reload the pages for changes in Javascript code.

    grunt serve --tool=toolref
    grunt serve --widget=widgetId
    grunt serve --vizabi-component=componentId

### Vizabi apps reference IDs

Here is a table regarding the reference IDs and the associated tool types in Vizabi project:


    |-------------------------------------------|
    | ID                   | Type               |
    |----------------------|--------------------|
    | income-mountain      | tool               |
    | bubble-chart         | tool               |
    | bubble-map           | tool               |
    | line-chart           | tool               |
    | layout-manager       | vizabi-components  |
    | data-cube            | vizabi-components  |
    | time-slider          | widget             |
    | chart-grid           | widget             |
    | dropdown             | widget             |
    | header               | widget             |
    | settings-button      | widget             |
    | time-slider-jQueryUI | widget             |
    ---------------------------------------------


## Build gapminder.js

todo

## Testing

todo

## Code Conventions
* When creating files, the convention is to use dashes instead of underscore or camel case notation.
```
Wrong: a_script_file.js, aScriptFile.js ---> Correct: a-script-file.js
```



