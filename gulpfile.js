var gulp = require('gulp')
require('traceur/bin/traceur-runtime')
var $ = require('gulp-load-plugins')({
    lazy: true
});
var config = require('./config')
var child = require('child_process')

gulp.task('default', ['serve-dev'])

gulp.task('test', ['build'], function () {
    return gulp.src('build/**/*Spec.js', {
            read: false
        })
        .pipe($.mocha({
            reporter: 'nyan'
        }))
})

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

gulp.task('build', ['clean'], function () {
    gulp.src('src/views/**')
        .pipe(gulp.dest('build/views/'));

    return gulp.src('src/**/*.js')
//        .pipe($.sourcemaps.init())
        .pipe($.traceur({
            sourceMaps: 'inline',
            annotations: true,
            types: true,
            typeAssertions: true,
            typeAssertionModule: '../assert'
        }))
//        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('build'))
})

gulp.task('test', ['build'], function () {
    return gulp.src('build/**/*Spec.js', {
            read: false
        })
        .pipe($.mocha({
            reporter: 'nyan'
        }))
})

gulp.task('db-migrate', function () {
    process.argv[2] = 'up'
    process.env['DATABASE_URL'] = config.connectionString
    return require('node-pg-migrate/bin/pg-migrate')
})

function serve(isDev) {
    require('./build')

    var debug = true //args.debug || args.debugBrk

    if (debug) {
        child.exec('node-inspector --web-port 9090', function (error, stdout, stderr) {
            if (error) {
                console.log(error.stack);
                console.log('Error code: ' + error.code);
                console.log('Signal received: ' + error.signal);
            }
            console.log(stdout)
            console.log(stderr)
        })
    }
}