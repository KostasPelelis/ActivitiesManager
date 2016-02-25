var 
    gulp    = require('gulp'),
    watch   = require('gulp-watch'),
    sass    = require('gulp-sass'),
    nano    = require('gulp-cssnano'),
    rename  = require('gulp-rename'),
    uglify  = require('gulp-uglify'),
    brwfy   = require('gulp-browserify'),
    Ractive = require('ractive'),
    tap     = require('gulp-tap')
;

gulp.task('styles', function() {
    gulp.src('./frontend/sass/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./static/css'));
});

gulp.task('minify', function () {
    gulp.src('./static/css/base.css')
        .pipe(nano())
        .pipe(rename('base.min.css'))
        .pipe(gulp.dest('./static/css/'))
});

gulp.task('jsfun', function() {
    gulp.src(['./frontend/js/app.js'])
        .pipe(brwfy())
        .pipe(gulp.dest('./static/js/'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./static/js/'));
});

gulp.task('templates', function() {
    gulp.src('./frontend/templates/**/*.html')
        .pipe(tap(function(file, t) {
            var precompiled = Ractive.parse(file.contents.toString());
            precompiled = JSON.stringify(precompiled);
            file.contents = new Buffer('module.exports = ' + precompiled);
        }))
        .pipe(rename(function(path) {
            path.extname = '.js';
        }))
        .pipe(gulp.dest('./frontend/templates/'))
});

gulp.task('watch',function() {
    gulp.watch('./frontend/sass/*.sass', ['styles']);
    gulp.watch('./static/css/*.css', ['minify']);
    gulp.watch('./frontend/templates/**/*.html', ['templates', 'jsfun']);
    gulp.watch('./frontend/js/app.js', ['jsfun']);
});

