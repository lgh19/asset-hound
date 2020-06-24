## Operational Handbook for Data Quality Improvement

### Overview
The asset map at [assets.wprdc.org](https://assets.wprdc.org) is an attempt to present a comprehensive view of neighborhood resources in Allegheny County. It is synthesized from many different open datasets and data we have received or harvested from other sources. These different data sources have wildly different data qualities. We are working to eliminate errors and improve the data quality to make the map more useful to people.

The [data dictionary](https://github.com/WPRDC/asset-hound/blob/master/assets-data-dictionary.csv) for the flat CSV versions of the assets is a good starting point for understanding the data model we're using. (This should eventually be augmented by full documentation of the Django data model, which is important to understand.)

## Ways to improve the data quality of assets
  - Check whether assets you're familiar with appear on the map. If not, track them down in the database and manually correct their `latitude` and `longitude` fields. (Then run [this push-changes-to-Carto script](https://github.com/WPRDC/asset-hound/blob/master/extra/upload_to_carto.py) and verify that the assets are where they should be.)
    * Whenever you fix the geocoordinates of a location, check the address. In some cases, bad geocoordinates come from bad address data. If you can manually fix the address so that a geocoder can correctly generate latitude and longitude values for the location, it's better to fix the address. We'll need to set up a way that you can trigger a re-geocoding to refresh the latitude and longitude fields. Until that's available, just make manual changes to make the data usable. We can always go back and fix the addresses later.
  - Associate a parcel ID with every physical asset. (A long-range goal is to ensure that each asset's location have a value in its `parcel_id` field, which should be the Allegheny County parcel identifier.) This will allow us to have a script automatically check that the geocoordinates of assets are within the boundaries of their parcels. (We should also run similar validation of geocoordinates against city/township boundaries, state boundaries, county boundaries, and maybe ZIP code boundaries.)
  - Look for assets outside of Allegheny County and either de-list them (see below) or toggle their `do_not_display` value to True.
  - Add tags to improve granularity of data (e.g., correctly classifying restaurants as coffee shops and categorizing places of worship by denomination). 
    * Anything with an `asset_type` value of `community_nonprofit_orgs` should be assigned a new asset type. In some cases, this can be based on the NTEE code associated with the asset, but about 40% of those assets have no NTEE code, so we'll need to classify them manually.

## Edits
All data edits should be made through our editing framework to ensure that edits can be stored and replayed when fresh data from the raw sources comes in. 

The following describes the different kinds of edits:

### Single-record edits
These are edits that only affect a single record. This can be any change to the field values of an asset (and any number of changes can fit into one edit).

#### Examples:
1) Correct the geocoordinates of an asset:

   Change the `latitude` field value from `0` to `40.586729` and change the `longitude` field value from `0` to `-80.229576`.

2) Change the type of an asset.

   A Starbucks with an `asset_type` value of `restaurants` should be changed to `coffee_shops`.

3) Add tags to better categorize/describe the asset and help people find it.

   Add new values to the `tags` field.

   An asset in `faith-based_facilities` should have a tag representing its religion (e.g., `Catholic` or `Buddhist`). You can add as many tags as you need to describe an asset. All `faith-based_facilities` should be categorized as either `places of worship` or `other religious facilities` (or maybe `faith-based facilities without services`).

4) Address standardization

   Change the address from `1 S. Dog STREET` to `1 South Dog St`.

### Multi-record merges
This is a case where two or more records that represent the same asset are are combined into a single record.
[We haven't worked out exactly how this will work yet on the backend. It might be the deletion (or hiding of all original records and the creation of a new one.]

An issue encountered when merging records is deciding which field values to use when multiple records differ.

#### Example:
One data source lists the asset as "STARBUCKS COFFEE", and the other lists it as "Starbucks Coffee&nbsp; #754". Preferring the specificity of the second one, we would change the value of the `asset_name` field to "Starbucks Coffee #754" (where it has been normalized by removing the extra space between "Coffee" and "#754").

The expected workflow in this case is that you find two or more records representing the same asset (the same entity at the same location). There will be some interface that will allow you to select the assets and click on a "Merge" button. The interface will then present you with a merge editor that will let you pick among the different values for each field.

So if one has an asset type of "restaurants" and the other has an asset type of "bars", you could pick one or the other or both (since there are cases where the best option would be to allow a list of both values) or enter free text (as in the case of "Starbucks Coffee #754" without the space).

In cases of geocoordinates, the list must be reduced to a single latitude-longitude pair.

### Making entirely new asset records
An asset that should be in the database but is not may be entered by creating a new record and filling in field values to describe it. The `data_source_name` and `data_source_url` should be filled in to describe where the data came from as best as possible. Liberal use of the `notes` field is also encouraged to document the data source.

### De-listing records
In cases where the record represents something that is not an asset within the scope of the asset map (currently whatever we are defining "assets" to be, that are 1) in Allegheny County and 2) extant (as this is not designed to represent historical assets (yet)), it should be removed from the map.

We'll call this "delisting" (or maybe "unmapping"). The expected workflow should be 1) click on a "delist" button for an asset, 2) you get prompted for a reason for delisting (where dropdown options should include "Outside Allegheny County", "Not a real place", and "Does not meet the definition of an asset"), and 3) likely the record will persist, but it will be flagged to not be displayed to end-users.

## Questions

### Q: Why did you say it's important to understand the Django data model?
A: Well, currently the location information of an asset is broken off into a separate `Location` class. This may not seem important when one record represents one asset, and it's the only thing at that address, but when there are multiple different assets at the same address, if you change the Location for one asset, it will also change the location data for any other asset that is also at that address. It's basically a thing to keep an eye on until we get it smoothed out, at which point this documentation should be updated.

### Q: How will we link together multiple assets that are associated but are at different locations?
A: The `Organization` model should provide a way to do this. All of the assets can be assigned the same `Organization` instance, and we can eventually provide any necessary functionality for accessing those. (Maybe it should be possible for users to click on the name of the organization and get a map and list of all assets in that organization.)

## Advanced operations
The challenge of maintaining the assets database is that data comes in from completely different types of sources: 1) ETL (Extract-Transform-Load) processes wrangle data from various datasets (including federal, state, and local datasets) into a common schema which then can be loaded into the assets database. (These processes currently run manually, but we expect them to eventually be at least somewhat automatic.) 2) Inputs from data editors, through the provided interface on assets.wprdc.org.

However, regardless of how these changes are made, any additions or deletions of assets (including merges) or changes to geocoordinates/geometry/name/asset type/category have to then be replicated to another database: The Carto database, which lives here:
https://wprdc-maps.carto.com/u/wprdc/tables/assets/public?redirected=true

If you click on a point on the map representing an asset, the database on assets.wprdc.org is queried to get and display the details of the corresponding asset. But the map itself is generated from the Carto database for performance reasons. This means  that periodically, it must be modified to reflect the assets.wprdc.org database. The manual process for this is as follows:

1) Shell into assets.wprdc.org.
2) `> source ~/backend/env/bin/activate`
3) `cd backend`
4) `python manage.py dump_assets`
5) Take `~/backend/data/assets_dump.csv` and overwrite the Carto database with it.
