"use strict";

var gulp = require("gulp");
var autoprefixer = require("autoprefixer");
var del = require("del");
var concat = require("gulp-concat");
var imagemin = require("gulp-imagemin");
var include = require("posthtml-include");
var fileinclude = require('gulp-file-include');
var minify = require("gulp-csso");
var mqpacker = require("css-mqpacker");
var sass = require("gulp-sass");
var server = require("browser-sync").create();
var sortCSSmq = require('sort-css-media-queries');
var sourcemaps = require('gulp-sourcemaps');
var svgmin = require("gulp-svgmin");
var svgstore = require("gulp-svgstore");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var posthtml = require("gulp-posthtml");
var rename = require("gulp-rename");
var run =require("run-sequence");
var uglify = require("gulp-uglify");
var webp = require("gulp-webp");


gulp.task("clean", function() {
  return del("build");
});

gulp.task('svg-clean', function () {
  return gulp.src('source/img/*' +
    '.svg')
    .pipe(svgmin({
      plugins: [{
        removeViewBox: false
      }, {
        cleanupNumericValues: {
          floatPrecision: 2
        }
      },
        {
          convertColors: {
            names2hex: false,
            rgb2hex: false
          }
        }, {
          removeDimensions: false
        }]
    }))
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    .pipe(gulp.dest('source/img'));
});

gulp.task("scripts", function() {
  return gulp.src(["!source/js/picturefill.min.js", "source/js/*.js", "source/blocks/**/*.js"])
    .pipe(concat("scripts.min.js"))
    //.pipe(uglify())
    .pipe(gulp.dest("build/js"));
});

gulp.task("svg-sprite", function() {
  return gulp.src("source/img/svg-icons/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("svg-sprite.svg"))
    .pipe(gulp.dest("source/img"));
});

gulp.task("html", function() {
  return gulp.src("source/*.html")
    /*
    .pipe(posthtml([
      include()
    ]))
    */
    .pipe(plumber())
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest("build"));
});

gulp.task("images", function() {
  return gulp.src("source/img/**/*.{png,jpg,gif}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest("source/img"));
});

gulp.task("webp", function() {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source/img"));
});

gulp.task("style", function() {
  gulp.src("source/sass/style.scss")
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 1 version",
        "last 2 Chrome versions",
        "last 2 Firefox versions",
        "last 2 Opera versions",
        "last 2 Edge versions",
        "IE 11"
      ]}),
      mqpacker({
        sort: sortCSSmq
      })
    ]))
    .pipe(minify())
    .pipe(sourcemaps.write())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("build", function(done) {
  run(
    "clean",
    "svg-sprite",
    "copy",
    "style",
    "scripts",
    "html",
    done
  );
});

gulp.task("copy", function() {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch(["source/sass/**/*.{scss,sass}", "source/blocks/**/*.{scss,sass}"], ["style"]);
  gulp.watch("source/**/*.html", ["html"]).on("change", server.reload);
  gulp.watch(["source/js/*.js", "source/blocks/**/*.js"], ["scripts"]).on("change", server.reload);
});
