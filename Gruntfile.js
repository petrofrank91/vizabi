// Generated on 2013-12-10 using generator-webapp 0.4.4
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // which project to work with
    var project;
    var tool_project = grunt.option('tool');
    var vizabi_components_project = grunt.option('vizabi-component');
    var widget_projects = grunt.option('widget');
    var hatnum = grunt.option('hatnum');

    if (tool_project) {
        project = 'tools/' + tool_project;
    }
    else if (vizabi_components_project) {
        project = 'vizabi-components/' + vizabi_components_project;
    }
    else if (widget_projects) {
        project = 'widgets/' + widget_projects;
    }

    // configurable paths
	var paths = {
        hat: 'test/' + project + "/human-acceptance/" + hatnum,
		app: {
			base: 'app',
            project: 'app/' + project,
            common: 'app/common'
        },
        tmp: {
			base: '.tmp',
            project: '.tmp/' + project,
            common: '.tmp/common'
        },
        dist: {
			base: 'dist',
            project: 'dist/' + project,
            common: 'dist/common'
        }
    };

    var gruntConfig = {
        yeoman: paths,
        watch: {
            compass: {
                files: ['<%= yeoman.app.common %>/styles/{,*/}*.{scss,sass}','<%= yeoman.app.project %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer']
            },
            styles: {
                files: ['<%= yeoman.app.common %>/styles/{,*/}*.css', '<%= yeoman.app.project %>/styles/{,*/}*.css'],
                tasks: ['copy:styles', 'autoprefixer']
            },
            processmain: {
                files: [
					'{<%= yeoman.tmp.common %>,<%= yeoman.app.common %>}/scripts/main.js'
				],
                tasks: [
                    'replace:mainjs'
                ]
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.hat %>/*.html',
                    '<%= yeoman.app.base %>/*.html',
					'{<%= yeoman.tmp.project %>,<%= yeoman.app.project %>}/styles/{,*/}{,*/}{,*/}*.css',
					'{<%= yeoman.tmp.project %>,<%= yeoman.app.project %>}/scripts/{,*/}{,*/}{,*/}*.js',
					'{<%= yeoman.tmp.common %>,<%= yeoman.app.common %>}/styles/{,*/}{,*/}{,*/}*.css',
					'{<%= yeoman.tmp.common %>,<%= yeoman.app.common %>}/scripts/,*/{,*/}{,*/}*.js',
					'{<%= yeoman.tmp.common %>,<%= yeoman.app.common %>}/scripts/init.js',
					'{<%= yeoman.tmp.common %>,<%= yeoman.app.common %>}/scripts/main-processed.js',
					'<%= yeoman.app.project %>/images/{,*/}{,*/}{,*/}*.{gif,jpg,jpeg,png,svg,webp}',
					'<%= yeoman.app.common %>/images/{,*/}{,*/}{,*/}*.{gif,jpg,jpeg,png,svg,webp}'
                ],
                tasks: [
                    'copy:index',
                    'replace:templateincludes',
                    'replace:requirejs'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    /*open: {
                        target: 'http://<%= connect.options.hostname %>:100'//<%= connect.test.options.port %>'
                    },*/
                    base: [
                        '<%= yeoman.tmp.base %>',
                        '<%= yeoman.app.base %>',
                        '<%= yeoman.hat %>'
                    ]
                }
            },
            test: {
                options: {
                    base: [
                        '<%= yeoman.tmp.base %>',
                        'test',
                        '<%= yeoman.app.base %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= yeoman.dist.base %>',
                    livereload: false
                }
            }
        },
        /*
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        */
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '<%= yeoman.tmp.base %>',
                            '<%= yeoman.dist.base %>/*',
                            '!<%= yeoman.dist.base %>/.git*'
                        ]
                    }
                ]
            },
            server: '<%= yeoman.tmp.base %>'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
				'<%= yeoman.app.common %>/scripts/{,*/}*.js',
				'!<%= yeoman.app.common %>/scripts/vendor/*',
				'<%= yeoman.app.project %>/scripts/{,*/}*.js',
				'!<%= yeoman.app.project %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
                }
            }
        },
        compass: {
            options: {
                sassDir: '<%= yeoman.app.base %>/styles',
                cssDir: '<%= yeoman.tmp.base %>/styles',
                generatedImagesDir: '<%= yeoman.tmp.base %>/images/generated',
                imagesDir: '<%= yeoman.app.base %>/images',
                javascriptsDir: '<%= yeoman.app.base %>/scripts',
                fontsDir: '<%= yeoman.app.base %>/styles/fonts',
                importPath: '<%= yeoman.app.base %>/bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false,
                assetCacheBuster: false
            },
            dist: {
                options: {
                    generatedImagesDir: '<%= yeoman.dist.base %>/images/generated'
                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.tmp.base %>/styles/',
                        src: '{,*/}*.css',
                        dest: '<%= yeoman.tmp.base %>/styles/'
                    }
                ]
            }
        },
         concat: {
            html: {
                src: [
                    //project-specific config through json
                ],
                dest: '<%= yeoman.dist.base %>/index.html'
            }
        },
		uglify: {
			dist: {
				files: [
					{src: '<%= yeoman.dist.common %>/scripts/amd-app.js', dest: '<%= yeoman.dist.base %>/scripts/amd-app.js'},
				]
			}
		},
        replace: {
			mainjs: {
				options: {
					variables: {
						'{{project}}': project,
						'{{hatnum}}': hatnum,
					},
					prefix: ''
				},
				files: [
					{expand: false, flatten: true, src: ['<%= yeoman.app.common %>/scripts/main.js'], dest: '<%= yeoman.app.common %>/scripts/main-processed.js'}
				]
			},
			templateincludes: {
				options: {
					variables: {
						'{{project}}': project,
						'{{hatnum}}': hatnum,
						'<!-- @@hat-include:"css.html" -->': '<%= grunt.file.read("' + paths.hat + '/css.html") %>',
						'<!-- @@hat-include:"body.html" -->': '<%= grunt.file.read("' + paths.hat + '/body.html") %>',
					},
					prefix: ''
				},
				files: [
					{expand: true, flatten: true, src: ['<%= yeoman.app.base %>/index.html'], dest: '<%= yeoman.app.base %>/'}
				]
			},
			requirejs: {
				options: {
					variables: {
						'<!-- @@requirejs-script-tag -->': '<script data-main="common/scripts/main-processed" src="bower_components/requirejs/require.js"></script>',
					},
					prefix: ''
				},
				files: [
                    {expand: true, flatten: true, src: ['<%= yeoman.app.base %>/index.html'], dest: '<%= yeoman.app.base %>/'}
				]
			},
			requirejsdist: {
				options: {
					variables: {
						'<!-- @@requirejs-script-tag -->': '<script src="common/scripts/amd-app.js"></script>',
					},
					prefix: ''
				},
				files: [
                    {expand: true, flatten: true, src: ['<%= yeoman.dist.base %>/index.html'], dest: '<%= yeoman.dist.base %>/'}
				]
			},
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
					// the resulting file
					out: '<%= yeoman.dist.base %>/common/scripts/amd-app.js',
					// none since this is done be a different grunt task
                    optimize: 'none',
					// generate source maps that help local debugging
					generateSourceMaps: true,
                    // required to support SourceMaps
                    // http://requirejs.org/docs/errors.html#sourcemapcomments
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true,
					// makes inline require() statements work in the built file
                    findNestedDependencies: true,
					// performs some post build analysis (configuration taken from grunt-contrib-requirejs readme)
					done: function(done, output) {
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
        },
        'bower-install': {
            app: {
                html: '<%= yeoman.app.base %>/index.html',
                ignorePath: '<%= yeoman.app.base %>/'
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist.base %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist.base %>/styles/{,*/}*.css',
                        '<%= yeoman.dist.base %>/images/{,*/}*.{gif,jpeg,jpg,png,webp}',
                        '<%= yeoman.dist.base %>/styles/fonts/{,*/}*.*'
                    ]
                }
            }
        },
        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist.base %>'
            },
            html: '<%= yeoman.app.base %>/index.html'
        },
        usemin: {
            options: {
                assetsDirs: ['<%= yeoman.dist.base %>']
            },
            html: ['<%= yeoman.dist.base %>/{,*/}*.html'],
            css: ['<%= yeoman.dist.base %>/{,*/}{,*/}styles/{,*/}{,*/}*.css']
        },
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app.project %>/images',
                        src: '{,*/}*.{gif,jpeg,jpg,png}',
                        dest: '<%= yeoman.dist.project %>/images'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app.common %>/images',
                        src: '{,*/}*.{gif,jpeg,jpg,png}',
                        dest: '<%= yeoman.dist.common %>/images'
                    }
                ]
            }
        },
        svgmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app.base %>/images',
                        src: '{,*/}*.svg',
                        dest: '<%= yeoman.dist.base %>/images'
                    }
                ]
            }
        },
        cssmin: {
            // This task is pre-configured if you do not wish to use Usemin
            // blocks for your CSS. By default, the Usemin block from your
            // `index.html` will take care of minification, e.g.
            //
            //     <!-- build:css({.tmp,app}) styles/main.css -->
            //
            // dist: {
            //     files: {
            //         '<%= yeoman.dist %>/common/styles/main.css': [
            //             '.tmp/styles/{,*/}*.css',
            //             '<%= yeoman.project %>/styles/{,*/}*.css',
            //             '<%= yeoman.common %>/styles/{,*/}*.css'
            //         ]
            //     },
            // }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                     // https://github.com/yeoman/grunt-usemin/issues/44
                     //collapseWhitespace: true,
                     collapseBooleanAttributes: true,
                     removeAttributeQuotes: true,
                     removeRedundantAttributes: true,
                     useShortDoctype: true,
                     removeEmptyAttributes: true,
                     removeOptionalTags: true*/
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app.base %>',
                        src: '*.html',
                        dest: '<%= yeoman.dist.base %>'
                    }
                ]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            index: {
                src: '<%= yeoman.app.base %>/index-template.html',
                dest: '<%= yeoman.app.base %>/index.html',
            },
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
						cwd: '<%= yeoman.app.common %>',
						dest: '<%= yeoman.dist.common %>',
                        src: [
                            '*.{ico,png,txt}',
                            '.htaccess',
                            'images/{,*/}*.{webp,gif}',
                            'styles/fonts/{,*/}*.*',
                            'bower_components/sass-bootstrap/fonts/*.*'
                        ]
                    },
                    {
                        expand: true,
                        dot: true,
						cwd: '<%= yeoman.app.project %>',
						dest: '<%= yeoman.dist.project %>',
                        src: [
                            'styles/{,*/}{,*/}*.css',
                            'styles/*.ico'
                        ]
                    }
                ]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app.base %>/styles',
                dest: '<%= yeoman.tmp.base %>/styles/',
                src: '{,*/}*.css'
            }
        },
        modernizr: {
            devFile: '<%= yeoman.app.base %>/bower_components/modernizr/modernizr.js',
            outputFile: '<%= yeoman.dist.base %>/bower_components/modernizr/modernizr.js',
            files: [
                '<%= yeoman.dist.base %>/scripts/{,*/}*.js',
                '<%= yeoman.dist.base %>/styles/{,*/}*.css',
                '!<%= yeoman.dist.base %>/scripts/vendor/*'
            ],
            uglify: true
        },
        concurrent: {
            server: [
                'compass:server',
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'compass:dist',
                'copy:styles',
                'imagemin',
                'svgmin',
                'htmlmin',
				'uglify',
            ]
        },
        bower: {
            all: {
                rjsConfig: '<%= yeoman.app.project %>/scripts/main.js'
            }
        }
    };

    // import app-specific config
    var appConfig = grunt.file.readJSON('app/' + project + '/grunt-config.json');

	// merge the gruntConfig with the app-specific config
	var _ = require('lodash');
	gruntConfig = _.merge(gruntConfig, appConfig);

	// uncomment to output merged config for debugging
    //console.log(gruntConfig, gruntConfig.concat.dist);

    // init grunt configuration
    grunt.initConfig(gruntConfig);

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', /*'open',*/ 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'copy:index',
			'replace:mainjs',
			'replace:templateincludes',
			'replace:requirejs',
            'concurrent:server', // runs various tasks concurrently, see configuration above
            'autoprefixer',
            'connect:livereload',
            //'open',
            'watch'
        ]);
    });

    grunt.registerTask('server', function () {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'compass',
        'connect:test',
        'mocha'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'copy:index',
		'replace:mainjs',
		'replace:templateincludes',
		'replace:requirejsdist',
        'useminPrepare',
        'requirejs',
        'concurrent:dist', // runs various tasks concurrently, see configuration above
        'autoprefixer',
        //'modernizr', // disabled due to https://github.com/Modernizr/grunt-modernizr/issues/45
        'copy:dist',
        'rev',
        'usemin'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
