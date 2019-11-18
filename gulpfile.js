var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var jade = require('gulp-jade');
var uglify = require('gulp-uglify');
// var copy = require('gulp-copy');
var clean = require('gulp-clean');
// var rename = require('gulp-rename');
// var eventStream = require('event-stream');
var argv = require('yargs').argv;

/**
 * ------------------------------------------------------------------------
 * Usage:
 *
 * ```shell
 * ./nodule_modules/.bin/gulp release --env asf
 * ./nodule_modules/.bin/gulp release --env echartsjs
 * ./nodule_modules/.bin/gulp release --env dev # the same as "debug"
 * # Check `./config` to see the available env
 * ```
 * ------------------------------------------------------------------------
 */

function initEnv() {
    var envType = argv.env;
    var isDev = argv.dev != null || argv.debug != null || envType === 'debug';

    if (isDev) {
        console.warn('=============================');
        console.warn('!!! THIS IS IN DEV MODE !!!');
        console.warn('=============================');
        envType = 'dev';
    }

    if (!envType) {
        throw new Error('--env MUST be specified');
    }

    return require('./config/env.' + envType);
}

var config = initEnv();

var date = +new Date();

/**
 * Launch the Server
 */
gulp.task('browser-sync', ['sass'], function() {
    gulp.run('jade');
    browserSync({
        server: {
            baseDir: '.'
        }
    });
});

/**
 * Build files for release
 */
gulp.task('build', function() {
    gulp.run('jade');
    gulp.run('sass');
});

/**
 * Compile files from _scss into css
 */
gulp.task('sass', function () {
    return gulp.src('public/stylesheets/scss/main.scss')
        .pipe(sass({
            includePaths: ['scss'],
            onError: function(e) {
                browserSync.notify();
                process.stdout.write(e + '\n');
            },
            outputStyle: 'compressed'
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('jade-zh', ['clean'], function () {
    return gulp.src(['views/view.jade', 'views/editor.jade', 'views/index.jade'])
        .pipe(jade({
            data: {
                buildVersion: date,
                lang: 'zh',
                host: config.host,
                blogPath: config.blogPath,
                mainSitePath: config.mainSitePath
            }
        }))
        .pipe(gulp.dest('public/zh'));
});

gulp.task('jade-en', ['clean'], function () {
    return gulp.src(['views/view.jade', 'views/editor.jade', 'views/index.jade'])
        .pipe(jade({
            data: {
                buildVersion: date,
                lang: 'en',
                host: config.host,
                blogPath: config.blogPath,
                mainSitePath: config.mainSitePath
            }
        }))
        .pipe(gulp.dest('public/en'));
});

gulp.task('jade-redirect', ['clean'], function () {
    return gulp.src(['views/old-redirect/index.jade', 'views/old-redirect/editor.jade', 'views/old-redirect/view.jade'])
        .pipe(jade({
            data: {
                buildVersion: date,
                host: config.host
            }
        }))
        .pipe(gulp.dest('public'));
});

gulp.task('jade-misc', ['clean'], function () {
    // 404 for https://ecomfe.github.io/echarts-examples
    return gulp.src('views/404.jade')
        .pipe(jade({
            data: {
                buildVersion: date,
                host: config.host
            }
        }))
        .pipe(gulp.dest('.'));
});

/**
 * Generate site using Jade
 */
gulp.task('jade', ['jade-zh', 'jade-en', 'jade-redirect', 'jade-misc']);

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function() {
    gulp.watch('public/stylesheets/scss/*.scss', ['sass']);
});

gulp.task('clean', function () {
    return gulp.src(['public/**/*.html', '!public/screenshot.html', 'release'])
        .pipe(clean());
});

/**
 * Build files into release directory
 */
gulp.task('release-copy', ['jade', 'sass'], function() {
    // copy source files
    return gulp.src(['public/**/*', '!public/stylesheets/scss/**/*'], {
            base: 'public'
        })
        .pipe(gulp.dest(config.releaseDestDir));
});

gulp.task('release', ['release-copy'], function() {
    return gulp.src(['public/javascripts/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest(config.releaseDestDir + '/javascripts'));
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
