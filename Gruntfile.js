var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};

/*global module:false*/
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    coffee: {
      dist: {
        expand: true,
        cwd: 'coffee/',
        src: ['*.coffee'],
        dest: '.tmp/js/',
        ext: '.js'
      },
      test: {
        expand: true,
        cwd: 'test/coffee/',
        src: ['*.coffee'],
        dest: 'test/spec/',
        ext: '.js'
      }
    },
    less: {
      development: {
        options: {
          paths: ['css/'],
          compress: true
        },
        files: {
          'css/style.css': 'less/style.less'
        }
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['.tmp/js/*.js'],
        dest: 'js/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'js/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        asi: true,
        curly: true,
        eqeqeq: true,
        expr: true,
        immed: true,
        indent: 2,
        quotmark: 'double',
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: false,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          'require': true
        }
      },
      gruntfile: {
        options: {
          quotmark: 'single'
        },
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['js/*.js']
      }
    },
    mocha: {
      all: {
        src: 'test/index.html'
      },
      options: {
        mocha: {
          ignoreLeaks: false
        },
        run: true
      }
    },
    connect: {
      livereload: {
        options: {
          port: 9001,
          middleware: function(connect, options) {
            return [lrSnippet, folderMount(connect, '.')];
          }
        }
      }
    },
    regarde: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['livereload', 'jshint:lib_test', 'mocha']
      },
      css: {
        files: 'css/**/*.css',
        tasks: ['livereload']
      },
      html: {
        files: '*.html',
        tasks: ['livereload']
      },
      coffee: {
        files: ['coffee/**/*.coffee', 'test/coffee/**/*.coffee'],
        tasks: ['coffee', 'livereload', 'test']
      },
      less: {
        files: 'less/**/*.less',
        tasks: ['less']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('test', ['mocha']); 
  // Default task.
  grunt.registerTask('default', ['coffee', 'jshint', 'less', 'concat', 'uglify', 'livereload-start', 'connect', 'regarde']);

};
