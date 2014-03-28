requirejs.config({
    name: 'bower_components/almond/almond',
    paths: {
        "bootstrap": "bower_components/bootstrap/dist/js/bootstrap",
        "handlebars": "bower_components/handlebars/handlebars",
        "jquery": "bower_components/jQuery/dist/jquery",
        "jquery.form": "bower_components/jquery-form/jquery.form",
        "leaflet": "bower_components/leaflet/leaflet",
        "underscore": "bower_components/underscore/underscore",
    },
    include: ['main'],
    insertRequire: ['main'],
    optimize: "uglify2",
    shim: {
        "handlebars": {
            "exports": "Handlebars"
        },
        "underscore": {
            "exports": "_"
        }
    }
});
