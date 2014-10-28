module.exports = function(grunt) {

	grunt.initConfig({
		browserify: {
			js: {
				files: {
					'dist/vendor.js': 'client/app/vendor.js',
					'dist/app.js': 'client/app/index.js'
				}
			}
		},
		uglify: {
			build: {
				options: {
					mangle: true,
					compress: true
				},
				files: {
					'dist/vendor.js': 'dist/vendor.js',
					'dist/app.js': 'dist/app.js',
				}
			}
		},
		less: {
			compile: {
				options: {
					compress: true
				},
				files: {
					'dist/css/app.css': 'client/css/app.less',
					'dist/css/responsive.css': 'client/css/responsive.less'
				}
			}
		},
		jade: {
			compile: {
				options: {
					doctype: 'html'
				},
				files: [{
					expand: true,
					cwd: 'client',
					src: ['**/*.jade', '!views/static/**/*.jade'],
					dest: 'dist',
					ext: '.html'
				}]
			}
		},
		copy: {
			build: {
				files: [
					{
						cwd: 'client',
						src: ['**', '!app/**', '!**/*.less', '!**/*.jade', '!**/*.js'],
						dest: 'dist',
						expand: true
					}
				]
			}
		},
		connect: {
			server: {
				options: {
					port: 4000,
					base: 'dist',
					hostname: '*'
				}
			}
		},
		watch: {
			options: {
				livereload: true
			},
			css: {
				files: 'client/css/**/*.less',
				tasks: ['less']
			},
			jade: {
				files: 'client/views/**/*.jade',
				tasks: ['jade']
			},
			scripts: {
				files: 'client/app/**/*.js',
				tasks: ['browserify']
			},
			copy: {
				files: ['client/**', '!client/**/*.less', '!client/**/*.jade', '!client/**/*.js'],
				tasks: ['copy']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask(
		'javascript',
		'Compile scripts.',
		['browserify', 'uglify']
	);

	grunt.registerTask(
		'views',
		'Compile views.',
		['jade', 'less', 'copy']
	);

	grunt.registerTask(
		'files',
		'Copy files.',
		['copy']
	);

	grunt.registerTask(
		'build',
		'Compiles everything.',
		['javascript', 'views']
	);

	grunt.registerTask(
		'default', 
		'Build, start server and watch.', 
		['build', 'watch']
	);

}