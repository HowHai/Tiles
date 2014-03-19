'use strict';

module.exports = function(grunt) {
	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			serverViews: {
				files: ['app/views/**'],
				options: {
					livereload: false,
				}
			},
			serverJS: {
				files: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
				tasks: ['jshint'],
				options: {
					livereload: false,
				}
			},
			clientViews: {
				files: ['public/modules/**/views/*.html'],
				options: {
					livereload: false,
				}
			},
			clientJS: {
				files: ['public/js/**/*.js', 'public/modules/**/*.js'],
				tasks: ['jshint'],
				options: {
					livereload: false,
				}
			},
			// Sass Setup -- May be duplication of below
			sass: {
			    files: ['public/sass/**/*.{scss,sass}','sass/_partials/**/*.{scss,sass}'],
			    tasks: ['sass:dist']
			},
			clientCSS: {
				files: ['public/**/css/*.css'],
				options: {
					livereload: false,
				}
			},
			// Sass Setup
			source: {
			  files: ['public/sass/**/*.scss'],
			  tasks: ['sass'],
			  options: {
			    livereload: true, // needed to run LiveReload
			  }
			},
		},
		jshint: {
			all: {
				src: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js', 'public/js/**/*.js', 'public/modules/**/*.js'],
				options: {
					jshintrc: true
				}
			}
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					nodeArgs: ['--debug']
				}
			}
		},
		concurrent: {
			tasks: ['nodemon', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		},
		env: {
			test: {
				NODE_ENV: 'test'
			}
		},
		mochaTest: {
			src: ['app/tests/**/*.js'],
			options: {
				reporter: 'spec',
				require: 'server.js'
			}
		},
		// Compile Task Scss to Css
		sass: {
        dist: {
            files: {
                'public/css/master.css': 'public/sass/master.scss'
            }
        }
    },
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		}
	});

	//Load NPM tasks
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
		// Grunt Sass Task
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-env');

	//Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	//Default task(s).
	grunt.registerTask('default', ['jshint', 'concurrent']);
		// Run grunt sass as concurrent task
	grunt.registerTask('default', ['sass', 'concurrent']);

	//Test task.
	grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);
};
