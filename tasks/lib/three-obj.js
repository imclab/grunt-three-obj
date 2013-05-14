// Minify with three-obj.
// Source: https://github.com/makesites/three-obj

var threeOBJ = require('three-obj'),
	fs = require('fs'),
	path = require("path");

exports.init = function(grunt) {
	var exports = {},
		async = grunt.util.async;

	exports.parse = function(files, dir, options, callback) {
		options = options || {};

		grunt.verbose.write('Converting with three-obj...');

		var topLevel = null;
		// destination file
		var dest = "";

		// Grab and parse all source files
		async.forEach(files, function(file, cb) {
		//files.forEach(function(file){
			dir = findRelativePath(file, dir);
			// find destination (error control?)
			dest = path.normalize( __dirname +"/../../../../"+ dir.replace(/\.[^/.]+$/, ".js") );
			// normalize file path
			file = path.normalize( __dirname +"/../../../../"+ file );
			// check the destination:
			if( grunt.file.exists(dest) ){
				// ask for overwrite confirmation?
			} else {
				// create the destination file if not available (including nested folders)
				grunt.file.write(dest, " ");
			}
			// execute the conversion
			if( options.minify ){
				topLevel = threeOBJ.minify(file, dest, function( data ){
					//console.log( data );
					return cb();
				});
			} else {
				topLevel = threeOBJ.convert(file, dest, function( data ){
					//console.log( data );
					return cb();
				});
			}
		//});
		}, function(error) {
			//console.log("DONE!!!");
			//done(!error);
			callback( dest );
			return true;
		});

		//return true;
	};

	return exports;
};

// Helpers
// - finde the relative path from location a in location b
function findRelativePath(a, b){
	var a = a.split("/"),
		b = b.split("/");
	// this will be the final path
	var path = [];

	for( var i in a ){
		// follow the b dir until the same level
		path.push( ( typeof b[i] == "undefined" || b[i] == "" )? a[i] : b[i] );
	}

	// finally join the array as a string
	return path.join("/");
}

