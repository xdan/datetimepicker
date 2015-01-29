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
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Project configuration.
  grunt.initConfig({
    rig: {
      standalone: {
        src: ['javascripts/jquery.datetimepicker.js'],
        dest: 'dist/javascripts/jquery.datetimepicker.js'
      },
      moment: {
        src: ['javascripts/jquery.moment.datetimepicker.js'],
        dest: 'dist/javascripts/jquery.moment.datetimepicker.js'
      },
      mousewheel: {
        src: ['javascripts/import.mousewheel.js'],
        dest: 'bin/jquery.mousewheel.js'
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: "./bin/",
          name: "jquery.mousewheel", 
          out: "./bin/jquery.mousewheel.js",
          paths: {
              "jquery.mousewheel": "./jquery.mousewheel",
              'jquery':'empty:'
          },
          optimize:'none'
        }      
      }
    },
    copy:{
      sass:{
        files:[
          {src:'stylesheets/jquery.datetimepicker.scss',dest:'dist/stylesheets/jquery.datetimepicker.scss'},
          {src:'stylesheets/_options.scss',dest:'dist/stylesheets/_options.scss'}
        ]
      }
    },
    sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'dist/stylesheets/jquery.datetimepicker.css': 'dist/stylesheets/jquery.datetimepicker.scss'
            }
        }
    },
    uglify: {
      standalone: {
        src: ['dist/javascripts/jquery.datetimepicker.js'],
        dest: 'dist/javascripts/jquery.datetimepicker.min.js'
      },
      moment: {
        src: ['dist/javascripts/jquery.moment.datetimepicker.js'],
        dest: 'dist/javascripts/jquery.moment.datetimepicker.min.js'
      }
    },
    cssmin: {
      target: {
        files: {
          'dist/stylesheets/jquery.datetimepicker.min.css': ['dist/stylesheets/jquery.datetimepicker.css', 'bar.css']
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['rig:moment','rig:mousewheel', 'requirejs','rig:standalone', 'copy', 'sass']);
  grunt.registerTask('release', ['default', 'uglify','cssmin']);
};