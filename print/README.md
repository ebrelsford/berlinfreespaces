# Making the print map

In April 2015 we made a print map with the data. Here's how we got there.

## Tools

* CartoDB
* QGIS
* Mapbox Studio

## Process

1. Grab data from CartoDB as a GeoJSON file.
2. Load the data in QGIS, save the data as a shapefile.
3. Space the points out a bit by:
    * Finding voronoi shapes for the points
    * Selecting those under a particular size (guessed)
    * Find the selected voronoi shapes' centroids, save to a new file
    * Select points *not* in the small voronoi shapes, save those to a new file
    * Merge the two files (use MMQGIS)
4. Try it out in Mapbox Studio:
    * Start a new source, add the combined shapefile layer
    * Save, upload
    * Add layer to map style
5. Move points that are still too close to each other manually in QGIS
6. Open source in Mapbox Studio and upload it
7. Repeat 5 and 6 until you're happy with it
