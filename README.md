(Legacy code)

Not being developed or maintained anymore. Check out the new repo: [https://github.com/Gapminder/vizabi](Gapminder Vizabi)

==============

## Overview

This repo consists of

* the different components that together build up the Vizabi library
* build scripts and wrapper code that creates the files that are supposed to be distributed to end-users
* human acceptance tests (called "HATs" in short) that acts both as test cases to evaluate, and as examples of how to use the Vizabi library

## Prerequisites

This project uses npm, grunt and bower. For npm, you will need Node.js installed. Then, run the following commands:

    npm install -g bower grunt-cli
    npm install
    bower install
    ./post-bower-install.sh

## Development Process

When developing for Vizabi, you run a Human Acceptane Test (HAT) page and inside that you work with enhanced/testing the code. Grunt `watch` task will look for changes you make and then will reload the page or apply styles instantly.

For each component, its related HATs reside in `test/*component-type*/*name*/human-acceptance/*hatnum*` folder. You need to pass `hatnum` option to Grunt. Depending on which type of component you are developing with Vizabi, run:

    grunt serve --component-type=name --hatnum=hat-folder-number

Replace `component-type` with either `tool`, `vizabi-component` or `widget` depending on what you are developing.
Replace `hat-folder-number` with the human acceptance test that you are using to try out the library. (Hint: hatnum `0` should give you the most basic version of the component).

When you run the command, a built in local web server will start serving the contents of the specific component
browser will open and goes to the `human-acceptance` test index page.

Example:

    grunt serve --tool=bubble-chart --hatnum=0

This example should open the HAT defined in the folder test/tool/bubble-chart/human-acceptance/*hatnum*

### Vizabi components and their names

Here is a table regarding the names and the associated component types in Vizabi project:

    |-------------------------------------------|
    | name                 | component-type     |
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

## Build vizabi.js

    grunt build

## Testing

    ./generate-all-hats.sh

##Deploying to S3

**Set environment variables**

Go to the webapp-framework folder and set the following variables:
```
export BASE_CMS_API=http://release_0_3-cms.gapminder.org/api/
export VIZABI_DATA_URL=http://vizabi-dev.gapminder.org.s3.amazonaws.com/data/
export VIZABI_WAFFLE_URL=http://oven.gapminder.org:9990/waffle/lang/
```

**Generate config file**

Run erb to generate the config file:
```
erb config.js.erb > app/vizabi-config.js 
```

**Build the project or copy ```config.js``` into the ```dist``` folder**

Build the project and the newly created config.js file will be placed correctly:
```
grunt build
```

Alternatively, if you just want to change the config file, copy it to the dist folder:
```
cp app/vizabi-config.js dist/build/scripts/vizabi-config.js 
```

**Upload the contents of the dist-folder to S3**

Upload the ```dist``` folder to S3:
```
s3cmd put --recursive dist/ s3://vizabi-dev.gapminder.org/vizabi/
```

## Code Conventions
* When creating files, the convention is to use dashes instead of underscore or camel case notation.
```
Wrong: a_script_file.js, aScriptFile.js ---> Correct: a-script-file.js
```



