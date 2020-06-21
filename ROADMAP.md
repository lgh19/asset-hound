# Roadmap for the WPRDC Asset Map 

1. Collect the first round of data.
2. Transform the asset data into a standard schema.
3. Create and deploy an interactive map of the asset data.
4. Add new assets and devise an update procedure.
5. Improve data quality.
    * Associate a parcel ID with every physical asset. Then, automatically check that the geocoordinates of assets are within the boundaries of their parcels.
    * Add tags to improve granularity of data (e.g., correctly classifying restaurants as coffee shops and categorizing places of worship by denomination).
    * Improve geocoding by dealing with so-called "last line" postal localities (postal cities), such as when an address is listed with "Pittsburgh" as the city even though it is in a municipality outside of Pittsburgh.
       - There is [a relevant GitHub issue](https://github.com/whosonfirst-data/whosonfirst-data/issues/202) for the Who's On First Data repository, and [one particularly useful comment](https://github.com/whosonfirst-data/whosonfirst-data/issues/202#issuecomment-614335635), which describes how the [Pelias lastline project](https://github.com/pelias/lastline) provides a recipe for analyzing OpenStreetMap/OpenAddresses addresses to scrape these postal cities from them and then use that information to (presumably) improve Pelias's geocoding.
   * Represent the boundaries of places like parks by a "geom" value field which is a Polygon. (This means uploading those Polygons to the appropriate Location instances and getting the front-end map to use these (which at a minimum means figure out how to get Carto to store this data (possibly in a separate Carto dataset and map layer)).)
