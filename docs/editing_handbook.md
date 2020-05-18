## Operational Handbook for Data Quality Improvement

All edits should be made through our editing framework to ensure that edits can be stored and replayed when fresh data from the raw sources comes in.

The [data dictionary](https://github.com/WPRDC/asset-hound/blob/master/assets-data-dictionary.csv) for the flat CSV versions of the assets is a good starting point for understanding the data model we're using. (This should eventually be augmented by full documentation of the Django data model, which is important to understand.)

## Kinds of edits
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

### De-listing records
In cases where the record represents something that is not an asset within the scope of the asset map (currently whatever we are defining "assets" to be, that are 1) in Allegheny County and 2) extant (as this is not designed to represent historical assets (yet)), it should be removed from the map.

We'll call this "delisting" (or maybe "unmapping"). The expected workflow should be 1) click on a "delist" button for an asset, 2) you get prompted for a reason for delisting (where dropdown options should include "Outside Allegheny County", "Not a real place", and "Does not meet the definition of an asset"), and 3) likely the record will persist, but it will be flagged to not be displayed to end-users.

# Questions

## Q: Why did you say it's important to understand the Django data model?
A: Well, currently the location information of an asset is broken off into a separate `Location` class. This may not seem important when one record represents one asset, and it's the only thing at that address, but when there are multiple different assets at the same address, if you change the Location for one asset, it will also change the location data for any other asset that is also at that address. It's basically a thing to keep an eye on until we get it smoothed out, at which point this documentation should be updated.

## Q: How will we link together multiple assets that are associated but are at different locations?
A: The `Organization` model should provide a way to do this. All of the assets can be assigned the same `Organization` instance, and we can eventually provide any necessary functionality for accessing those. (Maybe it should be possible for users to click on the name of the organization and get a map and list of all assets in that organization.)

