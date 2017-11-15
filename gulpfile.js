"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const sassGlob = require("gulp-sass-glob");
const autoprefixer = require("gulp-autoprefixer");
const uglifycss = require("gulp-uglifycss");
const include = require("gulp-include");
const addsrc = require("gulp-add-src");
const order = require("gulp-order");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const gutil = require("gulp-util");

gulp.task("javascript", function() {
  return gulp.src("assets/javascripts/application/*.js")
    .pipe(addsrc("assets/javascripts/vendor/index.js"))
    .pipe(order([
      "assets/javascripts/vendor/index.js",
      "assets/javascripts/application/*.js"
    ], {base: "."}))
    .pipe(include())
    .pipe(concat("application.js"))
    //.pipe(uglify())
    .pipe(gulp.dest("public"));
});

gulp.task("sass", function() {
  return gulp.src(["src/assets/stylesheets/*.scss"])
    .pipe(sassGlob())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(uglifycss())
    .pipe(gulp.dest("src/assets/stylesheets/"));
});

gulp.task("watch", function() {
  gulp.watch("src/assets/stylesheets/**/*.scss", ["sass"]);
});
