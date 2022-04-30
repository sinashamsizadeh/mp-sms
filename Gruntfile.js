module.exports = function (grunt) {
	// Project configuration.
	grunt.initConfig(
		{
			compress: {
				main: {
					options: {
						archive: '../mp-sms.zip',
					},
					files: [
					{
						src: [
							'admin/**',
							'classes/**',
							'languages/**',
							'vendor/**',
							'index.php',
							'mp-sms.php',
						],
						filter: function (filepath) {
							return (
								grunt.file.isFile( filepath ) &&
								filepath.indexOf( 'node_modules' ) < 0 &&
								filepath.indexOf( 'package-lock.json' ) < 0 &&
								filepath.indexOf( 'package.json' ) < 0
							);
						},
						dest: '/mp-sms',
					},
					],
				},
			},
		}
	);

	// Load the plugins.
	grunt.loadNpmTasks( 'grunt-contrib-compress' );

	// Task definitions
	grunt.registerTask('default', ['compress']);

	// Package task(s).
	grunt.registerTask( 'package', ['compress'] );
};
