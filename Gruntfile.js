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
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Project configuration.
  grunt.initConfig({
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
    copy:{
      sass:{
        files:[
          {src:'stylesheets/jquery.datetimepicker.scss',dest:'dist/jquery.datetimepicker.scss'},
          {src:'stylesheets/_options.scss',dest:'dist/_options.scss'}
        ]
      }
    },
    sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'dist/jquery.datetimepicker.css': 'dist/jquery.datetimepicker.scss'
            }
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
      },
      css:{
        src: ['stylesheets/jquery.datetimepicker.scss'],
        dest: 'stylesheets/jquery.moment.datetimepicker.min.css'        
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['rig', 'copy', 'sass']);
  grunt.registerTask('release', ['default', 'uglify', 'copy', 'compress']);
};