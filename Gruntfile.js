/*global module:false*/
module.exports = function(grunt) {

  var version = '1.7.7';
  // before release:
  // update bower.json, package.json
  // after release:
  // add tag to repo: git tag -a 1.6.0 -m 'i18next v1.6.0'
  // push tag: git push origin 1.6.0
  // npm publish

  grunt.loadNpmTasks('grunt-rigger');
  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadTasks('buildtasks');

  // Project configuration.
  grunt.initConfig({
    clean: ['bin'],
    rig: {
      standalone: {
        src: ['javascripts/jquery.datetimepicker.js'],
        dest: 'dist/jquery.datetimepicker.js'
      },
      moment: {
        src: ['javascripts/jquery.moment.datetimepicker.js'],
        dest: 'dist/jquery.moment.datetimepicker.js'
      }
    },
    uglify: {
      standalone: {
        src: ['dist/jquery.datetimepicker.js'],
        dest: 'dist/jquery.datetimepicker.min.js'
      },
      moment: {
        src: ['dist/jquery.moment.datetimepicker.js'],
        dest: 'dist/jquery.moment.datetimepicker.min.js'
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['clean', 'rig']);
  grunt.registerTask('release', ['default', 'uglify', 'copy', 'compress']);
};