'use strict';

module.exports = (grunt) => {

    require('time-grunt')(grunt);

    require('load-grunt-tasks')(grunt, {
        'pattern': [
            'grunt-*'
        ]
    });

    grunt.initConfig({
        'pkg': require('./package.json'),
        'concat': {
            'options': {
                'separator': ';\n',
                'process': (src, filepath) => {
                    grunt.verbose.writeln('Concating: %s', filepath);
                    return '/** FILE: ' + filepath + ' **/\n' + src;
                }
            },
            'dist': {
                'src': [
                    'node_modules/lodash/lodash.min.js',
                    'node_modules/jquery/dist/jquery.js',
                    'node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',
                    'node_modules/angular/angular.js',
                    'node_modules/restangular/dist/restangular.min.js',
                    'node_modules/angular-sanitize/angular-sanitize.js',
                    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
                    'node_modules/angular-ui-router/release/angular-ui-router.js',
                    'node_modules/angular-validation-match/dist/angular-validation-match.js',
                    'node_modules/bluebird/js/browser/bluebird.js',
                    'node_modules/noty/js/noty/packaged/jquery.noty.packaged.js',
                    'node_modules/noty/js/noty/themes/bootstrap.js',
                    'node_modules/noty/js/noty/layouts/topCenter.js',
                ],
                'dest': 'www/js/concat.js',
                'nonull': true
            }
        },
        'concat-verify': {
            'dist': {}
        },
        'browserify': {
            'app': {
                'options': {
                    'watch': grunt.option('watch'),
                    'keepAlive': grunt.option('watch'),
                    'transform': [
                        'brfs',
                        'browserify-shim',
                        'bulkify',
                        'babelify'
                    ],
                    'browserifyOptions': {
                        'paths': ['src']
                    }
                },
                'files': {
                    'www/js/app.bundle.js': 'src/index.js'
                }
            }
        },
        'compass': {
            'all': {
                'options': {
                    'httpPath': '/',
                    'cssDir': 'www/css',
                    'sassDir': 'scss',
                    'imagesDir': 'www/img',
                    'relativeAssets': true,
                    'outputStyle': 'compressed',
                    'specify': [
                        'scss/style.scss'
                    ],
                    'importPath': [
                        'node_modules'
                    ]
                }
            }
        },
        'watch': {
            'scss': {
                'files': [
                    'scss/**/*',
                    'Gruntfile.js'
                ],
                'tasks': [
                    'compass'
                ],
                'options': {
                    'interrupt': true
                }
            },
            'bundle': {
                'files': [
                    'src/**/*',
                    'Gruntfile.js'
                ],
                'tasks': [
                    'browserify'
                ],
                'options': {
                    'interrupt': true
                }
            },
            'concat': {
                'files': [
                    '<%= concat.dist.src %>',
                    'Gruntfile.js'
                ],
                'tasks': [
                    'concat'
                ],
                'options': {
                    'interrupt': true
                }
            }
        },
        'clean': {
            'fonts': ['www/fonts']
        },
        'copy': {
            'fonts': {
                'files': [
                    {
                        'expand': true,
                        'cwd': 'assets',
                        'src': '**/*',
                        'dest': 'www'
                    },
                    {
                        'expand': true,
                        'cwd': 'node_modules/opensans-npm-webfont/fonts',
                        'src': '**/*',
                        'dest': 'www/fonts'
                    },
                    {
                        'expand': true,
                        'cwd': 'node_modules/bootstrap-sass/assets/fonts/bootstrap',
                        'src': '**/*',
                        'dest': 'www/fonts'
                    }
                ]
            }
        },
        'cssmin': {
            'vendor': {
                'files': {
                    'www/css/vendor.css': [
                    ]
                }
            }
        },
        'connect': {
            'server': {
                'options': {
                    'port': 9090,
                    'base': 'www',
                    'keepalive': true
                }
            }
        },
        'concurrent': {
            'build': {
                'tasks': [
                    'watch', 'browserify', 'connect'
                ],
                'options': {
                    'logConcurrentOutput': true
                }
            }
        }
    });

    grunt.registerTask('build', ['clean', 'copy', 'compass', 'cssmin', 'concat']);
    grunt.registerTask('build-serve', ['build', 'concurrent']);
    grunt.registerTask('default', ['build']);

};
