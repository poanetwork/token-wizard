"use strict";

const gulp = require("gulp");
const include = require("gulp-include");
const addsrc = require("gulp-add-src");
const order = require("gulp-order");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");

gulp.task("javascript", function() {
  return gulp.src("assets/javascripts/application/*.js")
    .pipe(addsrc("assets/javascripts/vendor/index.js"))
    .pipe(order([
      "assets/javascripts/vendor/index.js",
      "assets/javascripts/application/read-sol-file.js",
      "assets/javascripts/application/index.js"
    ], {base: "."}))
    .pipe(include())
    .pipe(concat("application.js"))
    //.pipe(uglify())
    .pipe(gulp.dest("public"));
});

gulp.task("watch", function() {
  gulp.watch("assets/javascripts/application/*.js", ["javascript"]);
});
