define(
    [
        'handlebars',
        'filters',
        'jquery',
        'leaflet',
        'underscore',

        'bootstrap',
        'jquery.form'
    ],
    function (Handlebars, mapFilters, $, L, _) {

        (function (window, $, undefined) {
            "use strict";

            $.freespacemap = function(options, element) {
                this.element = $(element);
                if (!this._create(options)) {
                    this.failed = true;
                }
            };

            $.freespacemap.defaults = {
                center: [52.500556, 13.398889],

                filters: null,

                leafletApiKey: '781b27aa166a49e1a398cd9b38a81cdf',
                leafletStyleId: '9986',

                zoom: 10,
            };

            $.freespacemap.prototype = {

                map: null,

                style: {
                    fillColor: '#F04848',
                    fillOpacity: 1,
                    radius: 4,
                    stroke: false,

                    //stroke: true,
                    //strokeColor: '#000000',
                },

                allFilters: mapFilters,
                sortedFeaturs: null,

                currentFilters: [],

                _create: function(options) {
                    // Add custom options to defaults
                    var opts = $.extend(true, {}, $.freespacemap.defaults, options);
                    this.options = opts;
                    var $window = $(window);
                    var instance = this;

                    instance._initializeMap();
                    instance._initializeFilters();

                    return true;
                },

                renderSquatList: function(search) {
                    var source = $('#list-template').html(),
                        template = Handlebars.compile(source),
                        instance = this,
                        features = instance.sortedFeatures;
                    if (search && search !== '') {
                        features = _.filter(features, function (f) {
                            return f.properties.name_of_space.indexOf(search) >= 0;
                        });
                    }
                    $('#list').html(template({
                        places: features,
                    }));

                    $('.list-place a').click(function(e) {
                        e.preventDefault();
                        var clicked_id = $(this).data('cartodbid');
                        var clicked_layer = _.find(instance.map._layers, function(layer) {
                            if (!layer.feature) return false;
                            return layer.feature.properties.cartodb_id === clicked_id;
                        });

                        clicked_layer.fire('click');
                        return false;
                    });
                },

                renderAddSquatFilters: function () {
                    // build the form
                    var source = $('#add-filters-template').html(),
                        template = Handlebars.compile(source),
                        instance = this;
                    $('.form-filters').html(template({
                        filters: instance.allFilters
                    }));
                },

                _initializeMap: function() {
                    var instance = this;

                    instance.map = L.map('map', {
                        center: instance.options.center,
                        zoom: instance.options.zoom,   
                    });

                    // add tile layer
                    L.tileLayer('http://{s}.tile.cloudmade.com/' 
                            + instance.options.leafletApiKey +'/' + instance.options.leafletStyleId
                            + '/256/{z}/{x}/{y}.png', {
                        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://cloudmade.com">CloudMade</a>',
                        maxZoom: 18,
                    }).addTo(instance.map);

                    $.getJSON('http://newagebeverages.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM potentialities_map_v3 WHERE needs_moderation IS NULL or needs_moderation = false', function(data) {
                        L.geoJson(data, {

                            onEachFeature: function(featureData, layer) {
                                layer.on('click', function(e) {
                                    var properties = _.filter(instance.currentFilters, function(filter) {
                                        return featureData.properties[filter] !== 'No';
                                    });

                                    // precompile
                                    var source = $('#popup-template').html();
                                    var template = Handlebars.compile(source);
                                    var content = template({
                                        place: featureData,
                                        selectedProperties: properties,
                                    });
                                    layer.bindPopup(content, {
                                        minWidth: 300,   
                                        maxHeight: 450,
                                    }).openPopup();
                                });
                            },

                            pointToLayer: function(feature, latlng) {
                                return L.circleMarker(latlng, instance.style);
                            },

                        }).addTo(instance.map);

                        instance.sortedFeatures = _.sortBy(data.features, function(f) {
                            return f.properties.name_of_space;
                        });
                        instance.renderSquatList();
                    });

                },

                _initializeFilters: function() {
                    var instance = this;

                    var addFilter = function(filter, position) {

                        // TODO precompile
                        var source = $('#filter-item-child-template').html();
                        var template = Handlebars.compile(source);
                        var inside = template({ filter: filter });

                        var $category_li = $('<li></li>');
                        $category_li
                            .html(inside);
                        $(position).append($category_li);

                        if (filter.items) {
                            // top-level category
                            $category_li.addClass('category');
                            // create subcategories ul
                            var $ul = $('<ul></ul>').addClass('subcategories');

                            // append everything to new ul
                            $.each(filter.items, function(i, item) {
                                addFilter(item, $ul);
                            });

                            // append ul to position
                            $($category_li).append($ul);
                        }
                        else {
                            // subcategory
                            $category_li.addClass('subcategory');
                        }
                    };

                    $.each(instance.allFilters, function(i, filter) {
                        addFilter(filter, instance.options.filters);
                    });
                },

                updateFilters: function(filters) {
                    var instance = this;
                    instance.currentFilters = [];

                    var grow = $('#grow').is(':checked');

                    $.each(filters, function(i, filter) {
                        instance.currentFilters.push(filter.name);
                    });

                    // update display
                    $.each(instance.map._layers, function(i, layer) {
                        if (!layer.feature) return;

                        var layerFilters = _.filter(instance.currentFilters, function(filter) {
                            var filterValue = layer.feature.properties[filter];
                            return filterValue && filterValue !== '' && filterValue !== 'No';
                        });
                        if (layerFilters.length > 0) {
                            // show
                            layer.setStyle(instance.style);
                            if (grow) {
                                layer.setStyle({ radius: layerFilters.length * 2 });
                            }
                        }
                        else {
                            // hide
                            layer.setStyle({ radius: 0, stroke: false, });
                        }
                    });
                },

            };

            $.fn.freespacemap = function(options) {
                var thisCall = typeof options;

                switch (thisCall) {

                    // method 
                    case 'string':
                        var args = Array.prototype.slice.call(arguments, 1);

                        //this.each(function() {

                            var instance = $.data(this[0], 'freespacemap');

                            if (!instance) {
                                // not setup yet
                                return $.error('Method ' + options + 
                                    ' cannot be called until freespacemap is setup');
                            }

                            if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
                                return $.error('No such method ' + options + ' for freespacemap');
                            }

                            // no errors!
                            return instance[options].apply(instance, args);
                        //});

                        break;

                    // creation 
                    case 'object':

                        this.each(function () {
                            var instance = $.data(this, 'freespacemap');

                            if (instance) {
                                // update options of current instance
                                instance.update(options);
                            } else {
                                // initialize new instance
                                instance = new $.freespacemap(options, this);

                                // don't attach if instantiation failed
                                if (!instance.failed) {
                                    $.data(this, 'freespacemap', instance);
                                }
                            }
                        });

                        break;
                }

                return this;
            };

        })(window, jQuery);


        function onFilterChange() {
            $('#map').freespacemap('updateFilters', $('.filters :input').serializeArray());
        }

        function doWithoutFilterEvents(fn) {
            // temporarily stop handling onChange
            $('.filters input').off('change', onFilterChange);
            
            fn();

            // start handling onChange again
            $('.filters input').on('change', onFilterChange);
        }

        Handlebars.registerHelper('video_link', function(videoValue) {
            if (!videoValue || videoValue === 'No' || videoValue === 'no') return '';
            if (videoValue.indexOf('youtube') === -1) {
                return new Handlebars.SafeString('<a href="' + videoValue + '" target="_blank">video</a>');
            }
            return new Handlebars.SafeString('<iframe width="300" height="169" src="' + videoValue + '" frameborder="0" allowfullscreen></iframe>');
        });

        $(document).ready(function() {
            var freespacemap = $('#map').freespacemap({
                filters: $('.filters'),
            });


            // hide subcategories
            $('.subcategories').slideUp();

            $('.filters input').change(onFilterChange);

            $('#grow').change(onFilterChange);


            /*
             * Search
             */
            $('#search :input').keyup(function () {
                $('#map').freespacemap('renderSquatList', $(this).val());
            });


            /*
             * Select/de-select top-level category.
             */
            $('.category > :checkbox').change(function() {
                var $subcategories_ul = $(this).parent().find('ul');
                var $subcategories_checkboxes = $subcategories_ul.find(':checkbox');

                if (this.checked) {
                    doWithoutFilterEvents(function() {
                        $subcategories_checkboxes.not(':checked').trigger('click');

                        // call onChange handler manually
                        onFilterChange();
                    });
                }
                else {
                    doWithoutFilterEvents(function() {
                        $subcategories_checkboxes.filter(':checked').trigger('click');

                        // call onChange handler manually
                        onFilterChange();
                    });
                }
            });


            /*
             * Expand/collapse top-level category.
             */
             $('.category > label, .category > .icon').click(function() {
                var $subcategories_ul = $(this).parent().find('ul');
                var $category_li = $subcategories_ul.parent();

                if (($subcategories_ul).is(':visible')) {
                    $subcategories_ul.slideUp();
                    $category_li.removeClass('expanded');
                }
                else {
                    $subcategories_ul.slideDown();
                    $category_li.addClass('expanded');
                }
            });


            /*
             * All filters on.
             */
            $('#filters-all-on').click(function(e) {
                e.preventDefault();

                doWithoutFilterEvents(function() {
                    $('.filters .subcategories :checkbox:not(:checked)').trigger('click');
                    $('.filters .category > :checkbox:not(:checked)').trigger('click');

                    // call onChange handler manually
                    onFilterChange();
                });

                return false;
            });


            /*
             * All filters on.
             */
            $('#filters-all-off').click(function(e) {
                e.preventDefault();

                doWithoutFilterEvents(function() {
                    $('.filters .subcategories :checkbox:checked').trigger('click');
                    $('.filters .category > :checkbox:checked').trigger('click');

                    // call onChange handler manually
                    onFilterChange();
                });

                return false;
            });


            /*
             * Add form
             */
            $('a[href="#squat-add"]').on('show.bs.tab', function () {
                $('#map').freespacemap('renderAddSquatFilters');
            });

            $('#squat-add form').submit(function () {
                $(this).find(':input[type=submit]').prop('disabled', true);
                $(this).ajaxSubmit({
                    success: function () {
                        $('.squat-add-success').show();
                        $('.squat-add-form-wrapper').hide();
                    }
                });
                return false;
            });

        });

    }
);
