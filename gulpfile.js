//common modules
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const gulpIf = require("gulp-if");
//clear
const del = require("del");

//templates
const pug = require('gulp-pug');

//scripts
const webpack = require("webpack");
const gulpWebpack = require("webpack-stream");
const webpackConfig = require("./webpack.config");

//image
const imagemin = require('gulp-imagemin');
const isProduction = process.env.NODE_ENV === "production";

//server
const browserSync = require("browser-sync").create();

//styles
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const minifyCss = require('gulp-clean-css');

const PATHS = {
    app:"./app",
    dist:"./dist"
}

gulp.task('clear', () => {
    return del(PATHS.dist);
});

gulp.task('templates', () => {
    return gulp
        .src(`${PATHS.app}/pages/**/*.pug`,//с какими файлами работать
        {since: gulp.lastRun("templates")} )//ошибки
        .pipe(plumber())
        .pipe(pug({ pretty:true }))//преобразовали файлы
        .pipe(gulp.dest(PATHS.dist));//разместили на диске
});

//конкатенация js скриптов в общий бандл
gulp.task('scripts', () => {
    return gulp
        .src(`${PATHS.app}/common/scripts/**/*.js`,//с какими файлами работать, где брать исходники
        {since: gulp.lastRun("scripts")} )//ошибки
        .pipe(plumber())
        .pipe(gulpWebpack(webpackConfig, webpack))
        .pipe(gulp.dest(`${PATHS.dist}/assets/scripts`));//зап веппак и вернет скрипты, положить их в папку
});

gulp.task("styles", () => {
    return gulp
    .src(`${PATHS.app}/common/styles/**/*.scss`, {
    since: gulp.lastRun("styles")
    })
    .pipe(plumber())
    .pipe(gulpIf(!isProduction, sourcemaps.init()))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulpIf(isProduction, minifyCss()))
    .pipe(gulpIf(!isProduction, sourcemaps.write()))
    .pipe(gulp.dest(`${PATHS.dist}/assets/styles`));
});

gulp.task("images", () => {
    return gulp
    .src(`${PATHS.app}/common/images/**/*.+(png|jpg|jpeg|gif|svg|ico)`, {
    since: gulp.lastRun("images")
    })
    .pipe(plumber())
    .pipe(gulpIf(isProduction, imagemin()))
    .pipe(gulp.dest(`${PATHS.dist}/assets/images`));
});

gulp.task("server", () => {
    browserSync.init({
    server: PATHS.dist
    });
    browserSync.watch(PATHS.dist + "/**/*.*").on("change", browserSync.reload);
});

gulp.task("watch", () => {
    gulp.watch(`${PATHS.app}/**/*.pug`, gulp.series("templates"));
    gulp.watch(`${PATHS.app}/**/*.scss`, gulp.series("styles"));
    gulp.watch(`${PATHS.app}/**/*.js`, gulp.series("scripts"));
    gulp.watch(
    `${PATHS.app}/common/images/**/*.+(png|jpg|jpeg|gif|svg|ico)`,
    gulp.series("images")
    );
 });

 gulp.task('copy', async() => {
    var fonts = gulp.src('app/common/fonts/**/*')
    .pipe(gulp.dest('dist/assets/fonts/'))
});

 gulp.task(
     "default",
     gulp.series(
         gulp.parallel("templates", "styles", "scripts", "images", "copy"),
         gulp.parallel("watch", "server")
     )
 )

 gulp.task(
     "production",
     gulp.series(
         "clear",
         gulp.parallel("templates", "styles", "scripts", "images")
     )
 )