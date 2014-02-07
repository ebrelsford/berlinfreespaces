requirejs.config({
    name: 'bower_components/almond/almond',
    paths: {
        "handlebars": "bower_components/handlebars/handlebars",
        "jquery": "bower_components/jQuery/dist/jquery",
        "leaflet": "bower_components/leaflet/leaflet",
        "underscore": "bower_components/underscore/underscore",
    },
    include: ['main'],
    insertRequire: ['main'],
    optimize: "none",
    shim: {
        "handlebars": {
            "exports": "Handlebars"
        },
        "underscore": {
            "exports": "_"
        }
    }
});
