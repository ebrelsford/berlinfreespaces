module.exports = function(grunt) {
    grunt.initConfig({
        cssmin: {
            minify: {
                src: 'css/style.css',
                dest: 'css/style.min.css'
            }
        },
        less: {
            development: {
                options: {
                    paths: ["css"],
                    yuicompress: true
                },
                files: {
                    "css/style.css": "css/style.less"
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "js",
                    mainConfigFile: "js/app.js",
                    out: "js/dist/app.built.js"
                }
            }
        },
        watch: {
            less: {
                files: ["css/*.less", "css/*/*.less"],
                tasks: ["less", "cssmin"]
            },
            requirejs: {
                files: "js/*.js",
                tasks: 'requirejs'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
};
