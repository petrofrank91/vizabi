module.exports = function (paths) {
    return {
        replace: {
            templateincludes: {
                options: {
                    variables: {
                        '<!-- @@hat-include:"css.html" -->': '<%= grunt.file.read("' + paths.hat + '/css.html") %>',
                    }
                }
            }
        },
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    // for not having to duplicate existing requirejs-configuration here
                    mainConfigFile: '<%= yeoman.app.common %>/scripts/main-processed.js',
                    // determines base path for "include" and "name"
                    baseUrl: '<%= yeoman.app.base %>/common/scripts',
                    // the main module to include into the outfile
                    include: 'main-processed',
                    // path to require.js or almond.js - without ".js"
                    name: '../../../<%= yeoman.app.base %>/bower_components/almond/almond',
                    // wrapper content that allows vizabi.js to be included using both a script-tag or as an amd module
                    wrap: {
                        "startFile": "<%= yeoman.app.base %>/vizabi.js/wrap.start",
                        "endFile": "<%= yeoman.app.base %>/vizabi.js/wrap.end"
                    },
                    // the resulting file
                    out: '<%= yeoman.dist.base %>/scripts/vizabi-amd.js',
                    // none since this is done be a different grunt task
                    optimize: 'none',
                    // generate source maps that help local debugging
                    generateSourceMaps: true,
                    // required to support SourceMaps
                    // http://requirejs.org/docs/errors.html#sourcemapcomments
                    preserveLicenseComments: false,
                    useStrict: true,
                    // makes inline require() statements work in the built file
                    findNestedDependencies: true,
                    // performs some post build analysis (configuration taken from grunt-contrib-requirejs readme)
                    done: function (done, output) {
                        var duplicates = require('rjs-build-analysis').duplicates(output);

                        if (duplicates.length > 0) {
                            grunt.log.subhead('Duplicates found in requirejs build:');
                            grunt.log.warn(duplicates);
                            done(new Error('r.js built duplicate modules, please check the excludes option.'));
                        }

                        done();
                    }
                }
            }
        }
    }
};