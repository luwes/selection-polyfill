
var gulp = require('gulp');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var wrap = require('gulp-wrap');
var rename = require('gulp-rename');

var paths = {
	scripts: 'src/*.coffee'
};

var wrapTemplate =
	'(function(window, document) {' +
		'<%= contents %>' +
	'})(window, document);';

gulp.task('scripts', function() {
	gulp.src(paths.scripts)
		.pipe(coffee({ bare: true }))
		.pipe(concat('selection-polyfill.js'))
		.pipe(wrap(wrapTemplate))
		.pipe(gulp.dest(''))
		.pipe(rename('selection-polyfill.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(''));
});

gulp.task('watch', function() {
	gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('default', ['scripts']);
