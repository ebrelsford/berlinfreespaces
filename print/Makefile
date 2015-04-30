
download:
	# Get from Cartodb
	wget -O toprint.geojson "https://newagebeverages.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT the_geom, row_number() over (order by name_of_space) AS printid FROM potentialities_map_v3 WHERE (needs_moderation IS NULL OR needs_moderation != true) AND name_of_space != ''"
	wget -O toprint.csv "https://newagebeverages.cartodb.com/api/v2/sql?format=CSV&q=SELECT *, row_number() over (order by name_of_space) AS printid FROM potentialities_map_v3 WHERE (needs_moderation IS NULL OR needs_moderation != true) AND name_of_space != ''"
	wget -O toprint.json "https://newagebeverages.cartodb.com/api/v2/sql?q=SELECT row_number() over (order by name_of_space), name_of_space, address AS printid FROM potentialities_map_v3 WHERE (needs_moderation IS NULL OR needs_moderation != true) AND name_of_space != ''"

export_image:
	# Get from Mapbox Studio
	wget -O toprint.png "http://localhost:3000/static/14/13.174,52.3802,13.7233,52.5822@2.078125x.png?id=tmstyle:///home/eric/Documents/MapBox/berlin-free-spaces.tm2"
