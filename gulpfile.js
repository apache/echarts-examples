var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var jade        = require('gulp-jade');
var clean       = require('gulp-clean');
var uglify      = require('gulp-uglify');
var copy        = require('gulp-copy');
var rename      = require('gulp-rename');
var gcallback   = require('gulp-callback');
var gulpif      = require('gulp-if');

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
gulp.task('build', function(){
    gulp.run('jade');
    gulp.run('sass');
});

/**
 * Clean built files
 */
gulp.task('clean', function() {
    return gulp.src([androidRoot, iosRoot], {read: false})
        .pipe(clean({force: true}));
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

/**
 * Generate site using Jade
 */
gulp.task('jade', function() {
    return gulp.src(['views/view.jade', 'views/editor.jade', 'views/index.jade'])
        .pipe(jade())
        .pipe(gulp.dest('public/'))
        .pipe(browserSync.reload({stream:true}));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function() {
    gulp.watch('public/stylesheets/scss/*.scss', ['sass']);
});

/**
 * Use fecs to test code style
 */
// gulp.task('fecs', function() {
//     return gulp.src(['public/javascript/*'])
//         .pipe(fecs.check())
//         .pipe(fecs.reporter('baidu', {
//             color: true,
//             rule: true,
//             sort: true
//         }))
//         .pipe(fecs.format())
//         .pipe(gulp.dest('fecs'));;
// });

/**
 * Build files into release directory
 */
gulp.task('release-copy', ['release-jade'], function() {
    // copy source files
    return gulp.src(['public/data/**', 'public/fonts/**', 'public/images/**',
        'public/stylesheets/*.css',
        'public/vendors/**', 'public/javascripts/chart-list.js',
        'public/javascripts/editor.js','public/javascripts/view.js', 'public/javascripts/hm.js', 'public/*.html'])
        .pipe(copy('release'));
});

gulp.task('release-jade', function() {
    var env = {
        buildVersion: +new Date()
    };
    gulp.src('views/explore.jade')
        .pipe(jade({
            data: env
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('public'));
    return gulp.src('views/editor.jade')
        .pipe(jade({
            data: env
        }))
        .pipe(gulp.dest('public'));
});

gulp.task('release', ['release-copy'], function() {
    return gulp.src(['release/public/javascripts/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('release/public/javascripts'));
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
