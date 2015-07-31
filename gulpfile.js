var gulp = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var extname = require('gulp-extname');
var electron = require('gulp-electron');

var fs = require('fs');
var spawn = require('child_process').spawn;

var runSequence = require('run-sequence');
var Seq = function() {
  var args = Array.prototype.slice.call(arguments);
  return function(cb) {
    runSequence.apply(this, args.concat([cb]));
  };
};

var Spawner = function(command, args, options) {
  var options = options || {};
  options['stdio'] = options['stdio'] || 'inherit';
  return function(cb) {
    var proc = spawn(command, args, options);
    proc.on('close', cb);
  };
};

gulp.task('js', function () {
  return gulp.src([
      'src/**/*.js',
      'src/**/*.jsx',
      '!src/env-debug.js',
      '!src/node_modules/**/*'])
    .pipe(babel())
    // .pipe(uglify({
    //   mangle: false,
    //   preserveComments: "some"
    // }))
    .pipe(extname('js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('json', function(cb) {
  var pkg = require('./src/package.json');
  pkg['devDependencies'] = {};
  fs.writeFile('./dist/package.json', JSON.stringify(pkg), cb);
});

gulp.task('html', function() {
  gulp.src('src/index.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('package', ['js', 'json'], function() {
  var pkg = require('./dist/package.json');
  gulp.src("")
    .pipe(electron({
      src: "./dist",
      packageJson: pkg,
      release: "./release",
      cache: "./cache",
      version: "v0.26.1",
      packaging: true,
      platforms: ["win32-ia32", "linux-x64", "darwin-x64"],
      platformResources: {
        darwin: {
            CFBundleDisplayName: pkg.name,
            CFBundleIdentifier: pkg.name,
            CFBundleName: pkg.name,
            CFBundleVersion: pkg.version,
            // icon: "gulp-electron.icns",
        },
        win: {
            "version-string": pkg.version,
            "file-version": pkg.version,
            "product-version": pkg.version,
            // "icon": "gulp-electron.ico",
        },
      }
    }))
    .pipe(gulp.dest(""));
});

gulp.task('run', Spawner('./node_modules/.bin/electron', ['src/']));
gulp.task('run-dist', Spawner('./node_modules/.bin/electron', ['dist/']));

gulp.task('install', Spawner('npm', ['install'], { cwd: './src/' }));
gulp.task('install-dist', Spawner('npm', ['install'], { cwd: './dist/' }));

gulp.task('dist', ['js', 'json']);
gulp.task('default', Seq('dist', 'install-dist', 'package'));
