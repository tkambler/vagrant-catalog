'use strict';

module.exports = (grunt) => {

    grunt.registerMultiTask('browserify', function() {

        var done = this.async();

        var watchify = require('watchify');

        var browserify = require('browserify')(this.options().src, {
            'cache': {},
            'packageCache': {},
            'fullPaths': true,
            'paths': this.options().paths,
            'extensions': this.options().extensions,
            'noParse': this.options().noParse,
            'plugin': grunt.option('watch') ? [watchify] : []
        });

        if (this.options('watch')) {
            browserify = watchify(browserify);
        }

        this.options().exclude.forEach((module) => {
            grunt.verbose.writeln('Excluding: %s', module);
            browserify.exclude(module);
        });

        this.options().require.forEach((module) => {
            grunt.verbose.writeln('Requiring: %s', module);
            browserify.require(module);
        });

        if ( this.options().babelify.enable ) {
            grunt.verbose.writeln('Enabling babelify with options:', this.options().babelify.options);
            browserify.transform(require('babelify').configure(this.options().babelify.options));
        }

        var save = (err, data) => {
            if ( err ) {
                if ( grunt.option('watch') ) {
                    grunt.fail.warn(err.stack ? err.stack : err);
                } else {
                    grunt.fail.fatal(err.stack ? err.stack : err);
                }
            }
            grunt.file.write(this.options().dest, data);
            if ( !grunt.option('watch') ) {
                done();
            }
        };

        browserify.bundle(save);

        if ( grunt.option('watch') ) {

            browserify.on('update', function() {
                grunt.log.writelns('Browserify detected update...');
                browserify.bundle(save);
            });

            browserify.on('log', function(msg) {
                grunt.log.oklns(msg);
            });

        }

    });

};
