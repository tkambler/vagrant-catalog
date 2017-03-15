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
                    'node_modules/restangular/dist/restangular.min.js'
                ],
                'dest': 'www/js/concat.js'
            }
        },
        'concat-verify': {
            'dist': {}
        },
        'browserify': {
            'options': {
                'src': [],
                'dest': null,
                'paths': [],
                'external': [],
                'exclude': [],
                'require': [],
                'babelify': {
                    'enable': false
                },
                'noParse': [],
                'extensions': ['.js', '.json']
            },
            'app': {
                'options': {
                    'src': ['src/index.js'],
                    'dest': 'www/js/app.bundle.js',
                    'paths': ['src'],
                    'exclude': [],
                    'babelify': {
                        'enable': true,
                        'options': {
                            'extensions': ['.js'],
                            'presets': ['es2015'],
                            'plugins': [
                            ]
                        }
                    }
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
                    'scss/**/*'
                ],
                'tasks': [
                    'compass'
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

    grunt.registerTask('build', ['clean', 'copy', 'compass', 'concat']);
    grunt.registerTask('default', ['build']);
    grunt.registerTask('serve', ['build', 'concurrent']);
    grunt.loadTasks('tasks');

};
