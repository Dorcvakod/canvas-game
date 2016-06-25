var gulp = require("gulp"),
	browserify = require('gulp-browserify');

var watcher = gulp.watch('./js/src/*.js', ['build']);
watcher.on('change', function(event) {
	console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

gulp.task('build', function(){
	return gulp.src('js/src/main.js')
		.pipe(browserify())
		.pipe(gulp.dest('js/dist'))
});

gulp.task("default", ['build']);
