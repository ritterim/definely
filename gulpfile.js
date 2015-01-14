var gulp = require('gulp')
require('traceur/bin/traceur-runtime')
var $ = require('gulp-load-plugins')({
    lazy: true
});


gulp.task('default', ['serve-dev'])


gulp.task('serve-dev', ['build'], function () {
    serve(true)
})

gulp.task('serve-build', ['build'], function () {
    serve(false)
})

gulp.task('clean', function () {
    return gulp.src('build', {
            read: false
        })
        .pipe($.clean())
})

gulp.task('build', function () {
    gulp.src('src/views/**')
        .pipe(gulp.dest('build/views/'));

    return gulp.src('src/**/*.js')
        .pipe($.sourcemaps.init())
        .pipe($.traceur())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('build'))
})

function serve(isDev) {
    require('./build')

    var debug = true //args.debug || args.debugBrk

    if (debug) {
        var exec = require('child_process').exec
        exec('node-inspector')
    }
}