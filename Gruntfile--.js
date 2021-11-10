'use strict';

module.exports = function(grunt) {
    const sass = require('node-sass');

    const sassIncludePaths = [].concat(
        require('bourbon-neat').includePaths,
        require('include-media').includePath
    );

    var config = grunt.file.readJSON('config.json');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        banner: '/** \n' +
            ' * Automatically Generated - DO NOT EDIT \n' +
            ' * <%= pkg.name %> / v<%= pkg.version %> / <%= grunt.template.today("yyyy-mm-dd") %> \n' +
            ' */ \n\n',

        sourcePath: 'src',
        distPath: 'dist',
        templateDir: 'templates',
        assetDir: 'assets',
        styleDir: 'styles',
        scriptDir: 'scripts',
        imageDir: 'images',
        fontDir: 'fonts',

        watch: {
            html: {
                files: '<%= sourcePath %>/<%= templateDir %>/**/*.hbs',
                tasks: ['assemble']
            },
            sass: {
                files: '<%= sourcePath %>/<%= assetDir %>/<%= styleDir %>/**/*.scss',
                tasks: ['sass', 'postcss', 'usebanner', 'critical', 'replace']
            },
            js: {
                files: '<%= sourcePath %>/<%= assetDir %>/<%= scriptDir %>/*.js',
                tasks: ['copy:scripts', 'uglify:js', 'uglify:concat', 'uglify:concatmin']
            },
            jsPlugins: {
                files: ['<%= sourcePath %>/<%= assetDir %>/<%= scriptDir %>/vendor/**/**/*.js', '!<%= sourcePath %>/<%= assetDir %>/<%= scriptDir %>/vendor/min/*.js'],
                tasks: ['copy:scripts', 'uglify:jsPlugins']
            },
            images: {
                files: '<%= sourcePath %>/<%= assetDir %>/<%= imageDir %>/**/*.{png,jpg,jpeg,gif,webp,svg}',
                tasks: ['copy:images']
            },
            fonts: {
                files: '<%= sourcePath %>/<%= assetDir %>/<%= fontDir %>/**/*.{eot,svg,ttf,woff,woff2}',
                tasks: ['copy:fonts']
            }
        },

        browserSync: {
            default_options: {
                bsFiles: {
                    src: [
                        "<%= distPath %>/<%= assetDir %>/<%= styleDir %>/*.css",
                        "<%= distPath %>/<%= assetDir %>/<%= scriptDir %>/*.js",
                        "<%= distPath %>/<%= assetDir %>/<%= scriptDir %>/**/*.js",
                        "<%= distPath %>/*.html"
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: "./dist/"
                    }
                }
            }
        },

        postcss: {
            options: {
                map: {
                    inline: false, // save all sourcemaps as separate files...
                    annotation: '<%= distPath %>/<%= assetDir %>/<%= styleDir %>/maps/' // ...to the specified directory
                },
                processors: [
                    require('pixrem')(), // add fallbacks for rem units
                    require('autoprefixer')({
                        browsers: ['last 5 version']
                    }),
                    require('cssnano')(), // minify the result
                ]
            },
            dist: {
                src: '<%= distPath %>/<%= assetDir %>/<%= styleDir %>/*.css'
            }
        },

        critical: {
            dist: {
                options: {
                    base: 'dist/',  
                    css: [
                        '<%= distPath %>/<%= assetDir %>/<%= styleDir %>/main.css'
                    ],
                },
                src: '<%= distPath %>/index.html',
                dest: '<%= distPath %>/<%= assetDir %>/<%= styleDir %>/critical/main.css',
            }
        },
        
        replace: {
          dist: {
            options: {
              patterns: [
                {
                  match: /assets/g,
                  replacement: function () {
                    return '../..'; 
                  }
                }
              ]
            },
            files: [
              {expand: true, flatten: true, src: ['<%= distPath %>/<%= assetDir %>/<%= styleDir %>/critical/main.css'], dest: '<%= distPath %>/<%= assetDir %>/<%= styleDir %>/critical'}
            ]
          }
        },

        sass: {
            options: {
                includePaths: sassIncludePaths,
                implementation: sass,
                sourceMap: false
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= sourcePath %>/<%= assetDir %>/<%= styleDir %>/',
                    src: ['*.scss'],
                    dest: '<%= distPath %>/<%= assetDir %>/<%= styleDir %>/',
                    ext: '.css'
                }]
            }
        },

        uglify: {
            js: {
                options: {
                    banner: '<%= banner %>',
                    beautify: false,
                    compress: {
                       // drop_console: true
                    },
                },
                files: [{
                    expand: true,
                    cwd: '<%= distPath %>/<%= assetDir %>/<%= scriptDir %>',
                    src: '*.js',
                    dest: '<%= distPath %>/<%= assetDir %>/<%= scriptDir %>/min'
                }]
            },

            concat: {
                options : {
                    beautify: true ,
                    mangle: false ,
                    compress: {
                       // drop_console: false
                    }
                },
                files: {
                    '<%= distPath %>/<%= assetDir %>/<%= scriptDir %>/home.js': ['<%= sourcePath %>/<%= assetDir %>/<%= scriptDir %>/common.js', '<%= sourcePath %>/<%= assetDir %>/<%= scriptDir %>/home.js'],
                    '<%= distPath %>/<%= assetDir %>/<%= scriptDir %>/page.js': ['<%= sourcePath %>/<%= assetDir %>/<%= scriptDir %>/common.js', '<%= sourcePath %>/<%= assetDir %>/<%= scriptDir %>/page.js']
                }
            }, 
            
            concatmin: {
                options: {
                    beautify: false,
                    compress: {
                      //  drop_console: true
                    }
                },
                files: {
                    '<%= distPath %>/<%= assetDir %>/<%= scriptDir %>/min/home.js': ['<%= sourcePath %>/<%= assetDir %>/<%= scriptDir %>/common.js', '<%= sourcePath %>/<%= assetDir %>/<%= scriptDir %>/home.js'],
                    '<%= distPath %>/<%= assetDir %>/<%= scriptDir %>/min/page.js': ['<%= sourcePath %>/<%= assetDir %>/<%= scriptDir %>/common.js', '<%= sourcePath %>/<%= assetDir %>/<%= scriptDir %>/page.js']
                }
            },

            jsPlugins: {
                options: {
                    beautify: false,
                    compress: {
                      //  drop_console: true
                    }
                },
                files: {
                    '<%= distPath %>/<%= assetDir %>/<%= scriptDir %>/min/home_plugins.js': config.home,
                    '<%= distPath %>/<%= assetDir %>/<%= scriptDir %>/min/page_plugins.js': config.page
                }
            },

        },

        imagemin: {
            target: {
                options: {
                    optimizationLevel: 7,
                    progressive: true,
                },
                files: [{
                    expand: true,
                    cwd: '<%= sourcePath %>/<%= assetDir %>/<%= imageDir %>/',
                    src: ['**/*.{png,jpg,jpeg,gif}'],
                    dest: '<%= distPath %>/<%= assetDir %>/<%= imageDir %>/',
                }]
            }
        },

        usebanner: {
            dist: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>',
                    linebreak: true
                },
                files: {
                    src: ['<%= distPath %>/<%= assetDir %>/<%= styleDir %>/*.css']
                }
            }
        },


        assemble: {
            options: {
                assets: '<%= distPath %>/<%= assetDir %>',
                layoutdir: '<%= sourcePath %>/<%= templateDir %>/layouts',
                partials: ['<%= sourcePath %>/<%= templateDir %>/components/**/*.hbs'],
                flatten: true,
                helpers: ['./helpers/**/*.js']
            },
            site: {
                options: {
                    layout: 'default.hbs',
                    rtl: false
                },
                src: ['<%= sourcePath %>/<%= templateDir %>/*.hbs'],
                dest: '<%= distPath %>'
            },
            site_ar: {
                options: {
                    layout: 'default-ar.hbs',
                    rtl: true
                },
                src: ['<%= sourcePath %>/<%= templateDir %>/rtl/*.hbs'],
                dest: '<%= distPath %>'
            }
        },

        copy: {
            fonts: {
                files: [{
                    expand: true,
                    cwd: '<%= sourcePath %>/<%= assetDir %>/<%= fontDir %>/',
                    src: ['**'],
                    dest: '<%= distPath %>/<%= assetDir %>/<%= fontDir %>/'
                }]
            },
            images: {
                files: [{
                    expand: true,
                    cwd: '<%= sourcePath %>/<%= assetDir %>/<%= imageDir %>/',
                    src: ['**'],
                    dest: '<%= distPath %>/<%= assetDir %>/<%= imageDir %>/'
                }]
            },
            scripts: {
                files: [{
                    expand: true,
                    cwd: '<%= sourcePath %>/<%= assetDir %>/<%= scriptDir %>/',
                    src: ['**'],
                    dest: '<%= distPath %>/<%= assetDir %>/<%= scriptDir %>/'
                }]
            },
            video: {
                files: [{
                    expand: true,
                    cwd: '<%= sourcePath %>/<%= assetDir %>/video/',
                    src: ['**'],
                    dest: '<%= distPath %>/<%= assetDir %>/video/'
                }]
            }
        },

        clean: {
            dist: ['<%= distPath %>/**/*', '!<%= distPath %>/.gitignore', '!<%= distPath %>/video']
        }

    });


    grunt.loadNpmTasks('grunt-assemble');
    grunt.loadNpmTasks('grunt-critical');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.registerTask('serve', ['browserSync', 'watch']);
    grunt.registerTask('default', [
        'clean',
        'copy',
        'uglify',
        'sass',
        'postcss',
        'assemble',
        'usebanner',
        'imagemin',
        'critical',
        'replace' 
    ]);
};