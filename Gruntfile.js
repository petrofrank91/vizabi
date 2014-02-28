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

    // which component to work with (component variable is called project for better consistency with go grunt config)
    var project;
    var tool_project = grunt.option('tool');
    var vizabi_components_project = grunt.option('vizabi-component');
    var widget_projects = grunt.option('widget');
    var hatnum = grunt.option('hatnum') || 0;
    var sourcePath, distPath;

    if (tool_project) {
        project = 'tools/' + tool_project;
    }
    else if (vizabi_components_project) {
        project = 'vizabi-components/' + vizabi_components_project;
    }
    else if (widget_projects) {
        project = 'widgets/' + widget_projects;
    } else {
        // if no build target is specified, just build vizabi-amd and css for all components
        project = 'vizabi.js';
    }

    // set hat path depending on component
    if (project != 'vizabi.js') {
        sourcePath = 'test/' + project + "/human-acceptance/" + hatnum;
        distPath = project + "/human-acceptance/" + hatnum;
    } else {
        sourcePath = 'app/vizabi.js/build';
        distPath = 'build';
    }

    // configurable paths
	var paths = {
        hat: sourcePath,
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
			base: 'dist/' + distPath,
            project: 'dist/' + distPath + '/' + project,
            common: 'dist/' + distPath + '/common'
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
                    '<%= yeoman.app.base %>/index-template.html',
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
                    'replace:wrapperjs'
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
            postbuild: {
                files: [
                    {
                        dot: true,
                        src: [
                            '<%= yeoman.dist.base %>/index-template.html'
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
                sassDir: '<%= yeoman.app.project %>/styles',
                cssDir: '<%= yeoman.tmp.project %>/styles',
                generatedImagesDir: '<%= yeoman.app.project %>/images/generated',
                imagesDir: '<%= yeoman.app.project %>/images',
                javascriptsDir: '<%= yeoman.app.project %>/scripts',
                fontsDir: '<%= yeoman.app.project %>/styles/fonts',
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
					{src: '<%= yeoman.dist.base %>/scripts/vizabi-amd.js', dest: '<%= yeoman.dist.base %>/scripts/vizabi-amd.js'},
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
						'<!-- @@hat-include:"body.html" -->': '<%= grunt.file.read("' + paths.hat + '/body.html") %>'
					},
					prefix: ''
				},
				files: [
					{expand: true, flatten: true, src: ['<%= yeoman.app.base %>/index.html'], dest: '<%= yeoman.app.base %>/'}
				]
			},
			wrapperjs: {
				options: {
					variables: {
						'{{vizabi-script-tag-attributes}}': 'data-main="common/scripts/main-processed" src="bower_components/requirejs/require.js"',
					},
					prefix: ''
				},
				files: [
                    {expand: true, flatten: true, src: ['<%= yeoman.app.base %>/vizabi.js/vizabi.js'], dest: '<%= yeoman.tmp.base %>/scripts/'}
				]
			},
			wrapperjsdist: {
				options: {
					variables: {
						'{{vizabi-script-tag-attributes}}': 'src="../../../../build/scripts/vizabi-amd.js"',
					},
					prefix: ''
				},
				files: [
                    {expand: true, flatten: true, src: ['<%= yeoman.app.base %>/vizabi.js/vizabi.js'], dest: '<%= yeoman.dist.base %>/scripts/'}
				]
			},
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
                assetsDirs: ['<%= yeoman.dist.base %>'],
            },
            html: ['<%= yeoman.dist.base %>/index.html'],
            css: ['<%= yeoman.dist.base %>/styles/{,*/}*.css']
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
                dest: '<%= yeoman.app.base %>/index.html'
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
                            'images/{,*/}*.{gif,jpg,jpeg,png,svg,webp}',
                            'styles/vizabi.css',
                            'styles/fonts/{,*/}*.*',
                            'bower_components/jquery-ui/themes/base/',
                            'bower_components/sass-bootstrap/fonts/*.*'
                        ]
                    },
                    // HAT data
                    {
                        expand: true,
                        dot: true,
						cwd: '<%= yeoman.hat %>',
						dest: '<%= yeoman.dist.base %>',
                        src: [
                            'data/{,*/}*',
                        ]
                    },
                ]
            },
            styles: {
                files: [
                    // Styles
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app.base %>/styles',
                        dest: '<%= yeoman.tmp.base %>/styles/',
                        src: '{,*/}*.css'
                    },
                    // Project stylesheets
                    {
                        expand: true,
                        dot: true,
						cwd: '<%= yeoman.app.project %>',
						dest: '<%= yeoman.dist.project %>',
                        src: [
                            //'styles/{,*/}{,*/}*.css',
                            'styles/*.ico'
                        ]
                    },
                    // jQuery UI theme - for relative urls to work (https://github.com/GoalSmashers/clean-css/issues/129#issuecomment-32153443)
                    {
                        expand: true,
                        dot: true,
						cwd: '<%= yeoman.app.base %>/bower_components/jquery-ui/themes/base',
						dest: '<%= yeoman.dist.base %>/styles',
                        src: [
                            'images/{,*/}*.{gif,jpg,jpeg,png,svg,webp}',
                        ]
                    },
                ]
            },
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
				//'uglify', // comment out to simplify debugging
            ]
        },
        bower: {
            all: {
                rjsConfig: '<%= yeoman.app.project %>/scripts/main.js'
            }
        }
    };

    // import app-specific config
    var appConfig = require('./app/' + project + '/grunt-config');

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
			'replace:wrapperjs',
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

    grunt.registerTask('build-hat', [
        'clean:dist',
        'copy:index',
        'replace:mainjs',
        'replace:templateincludes',
        'useminPrepare',
        //'concurrent:dist', // runs various tasks concurrently, see configuration above. currently disabled since the stage server chokes here. instead running the tasks synchronously:
        'imagemin',
        'svgmin',
        'htmlmin',
        //'uglify', // comment out to simplify debugging
        'autoprefixer',
        //'modernizr', // disabled due to https://github.com/Modernizr/grunt-modernizr/issues/45
        'copy:dist',
        //'rev',
        'usemin',
        'clean:postbuild'
    ]);

    grunt.registerTask('build-vizabi.js', [
        'clean:dist',
        'copy:index',
        'replace:mainjs',
        'replace:templateincludes',
        'replace:wrapperjsdist',
        'useminPrepare',
        'requirejs',
        //'concurrent:dist', // runs various tasks concurrently, see configuration above. currently disabled since the stage server chokes here. instead running the tasks synchronously:
        'compass:dist',
        'copy:styles',
        'imagemin',
        'svgmin',
        'htmlmin',
        //'uglify', // comment out to simplify debugging
        'autoprefixer',
        //'modernizr', // disabled due to https://github.com/Modernizr/grunt-modernizr/issues/45
        'copy:dist',
        'concat:generated',
        'cssmin:generated',
        //'rev',
        'usemin',
        'clean:postbuild'
    ]);

    if (project == 'vizabi.js') {
        grunt.registerTask('build', function () {
            grunt.log.write('Building vizabi.js');
            grunt.task.run(['build-vizabi.js']);
        });
    } else {
        grunt.registerTask('build', function () {
            grunt.log.write('Building HAT ' + hatnum + ' for component ' + project + '. (Assuming vizabi.js has been built already)');
            grunt.task.run(['build-hat']);
        });
    }

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
