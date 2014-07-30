var gulp = require('gulp'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    cmq = require('gulp-combine-media-queries');

gulp.task('minifycss', function() {
    return gulp.src('./loggify.css')
        .pipe(minifyCSS({keepSpecialComments: 0}))
        .pipe(rename('loggify.min.css'))
        .pipe(gulp.dest('./'))
});

gulp.task('scripts', function() {
    return gulp.src('./loggify.js')
        .pipe(uglify())
        .pipe(rename('loggify.min.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
    gulp.watch('./loggify.css', ['minifycss']);
    gulp.watch('./loggify.js', ['scripts']);
//    gulp.watch(paths.less, ['cmq']);
});

gulp.task('default', ['watch']);