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

        clean: {
            build: {
                src: ['build']
            }
        },

        copy: {
            build: {
                files: [
                    {
                        src: '**/*.built.js',
                        dest: 'build/',
                        expand: true
                    },
                    {
                        src: '**/*.min.css',
                        dest: 'build/',
                        expand: true
                    },
                    {
                        src: 'img/*',
                        dest: 'build/',
                        expand: true
                    },
                    {
                        src: 'index.html',
                        dest: 'build/'
                    }
                ]
            }
        },

        shell: {
            publish: {
                command: 'scp -r build/* wf:~/webapps/berlin'
            }
        },

        watch: {
            less: {
                files: ["css/*.less", "css/*/*.less"],
                tasks: ["less", "cssmin"]
            },
            requirejs: {
                // TODO don't uglify during dev, only when building
                files: "js/*.js",
                tasks: 'requirejs'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('build', ['clean:build', 'copy:build']);
    grunt.registerTask('publish', 'shell:publish')
};
