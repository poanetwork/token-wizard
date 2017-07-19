'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const uglifycss = require('gulp-uglifycss');
const include = require('gulp-include');
const addsrc = require('gulp-add-src');
const order = require('gulp-order');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

gulp.task('sass', function() {
  return gulp.src(['assets/stylesheets/*.scss'])
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(uglifycss())
    .pipe(gulp.dest('assets/stylesheets/'));
});

gulp.task('javascript', function() {
  return gulp.src('assets/javascripts/application/*.js')
    .pipe(addsrc('assets/javascripts/vendor/index.js'))
    .pipe(order([
      "assets/javascripts/vendor/index.js",
      "assets/javascripts/application/*.js"
    ], {base: '.'}))
    .pipe(include())
    .pipe(concat('application.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('assets/javascripts'));
});

gulp.task('watch', function() {
  gulp.watch('assets/stylesheets/**/*.scss', ['sass']);
  gulp.watch('assets/javascripts/application/*.js', ['javascript']);
});
