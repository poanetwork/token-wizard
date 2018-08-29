"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const sassGlob = require("gulp-sass-glob");
const autoprefixer = require("gulp-autoprefixer");
const uglifycss = require("gulp-uglifycss");

gulp.task("sass", function () {
  return gulp.src(["src/assets/stylesheets/*.scss"])
    .pipe(sassGlob())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({
      remove: false
    }))
    .pipe(uglifycss({
      "uglyComments": true
    }))
    .pipe(gulp.dest("src/assets/stylesheets/"));
});

gulp.task("watch", function () {
  gulp.watch("src/assets/stylesheets/**/*.scss", ["sass"]);
});
