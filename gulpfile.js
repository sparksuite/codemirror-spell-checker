var gulp = require('gulp'),
	minifycss = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	header = require('gulp-header'),
	pkg = require('./package.json');

var banner = ['/**',
	' * <%= pkg.name %> v<%= pkg.version %>',
	' * Copyright <%= pkg.company %>',
	' * @link <%= pkg.homepage %>',
	' * @license <%= pkg.license %>',
	' */',
	''].join('\n');

gulp.task('scripts', function() {
	var js_files = [
		'./src/js/typo.js',
		'./src/js/spell-checker.js'];

	return gulp.src(js_files)
		.pipe(header(banner, {pkg: pkg}))
		.pipe(concat('spell-checker.min.js'))
		.pipe(gulp.dest('dist'))
		.pipe(uglify())
		.pipe(header(banner, {pkg: pkg}))
		.pipe(gulp.dest('dist'));
});

gulp.task('styles', function() {
	return gulp.src('./src/css/*.css')
		.pipe(concat('spell-checker.min.css'))
		.pipe(gulp.dest('dist'))
		.pipe(minifycss())
		.pipe(header(banner, {pkg: pkg}))
		.pipe(gulp.dest('dist'));
});

gulp.task('dictionaries', function() {
	return gulp.src('./src/data/*.{dic,aff}')
		.pipe(gulp.dest('dist/'));
});

gulp.task('default', ['scripts', 'styles', 'dictionaries']);