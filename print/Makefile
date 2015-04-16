
download:
	# Get from Cartodb
	wget -O toprint.geojson "https://newagebeverages.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT the_geom, row_number() over (order by name_of_space) AS printid FROM potentialities_map_v3 WHERE (needs_moderation IS NULL OR needs_moderation != true) AND name_of_space != ''"
	wget -O toprint.csv "https://newagebeverages.cartodb.com/api/v2/sql?format=CSV&q=SELECT *, row_number() over (order by name_of_space) AS printid FROM potentialities_map_v3 WHERE (needs_moderation IS NULL OR needs_moderation != true) AND name_of_space != ''"

export_image:
	# TODO Get from Mapbox Studio
	wget TODO
