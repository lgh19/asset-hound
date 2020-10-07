## Operational Handbook for the Asset Map + Database

The objective of this project is to join many datasets from federal, state, and local sources to synthesize a comprehensive picture of the assets that make up the infrastructure of a particular community.

### Source-file preparation
We assembled many such datasets, in some cases filtering them down to just those in Allegheny County, or even filtering into several different files, one for each of the types of assets in the original file.

The source files can be found in [this private repository](https://github.com/WPRDC/liquid-assets). Source files are typically either CSV files, Excel files (which are then converted to CSV files using Visidata), or ESRI shapefiles (which are converted to SQLite using [shapefile-to-sqlite](https://pypi.org/project/shapefile-to-sqlite/), and from there to CSV, again by Visidata).

### Editing assets


### Exporting data
Accessing the URL [https://assets.wprdc.org/edit/dump_assets/](https://assets.wprdc.org/edit/dump_assets/) triggers a dump of the assets which will show up `(# of records)/(4000/minute)` later at
[https://assets.wprdc.org/asset_dump.csv](https://assets.wprdc.org/asset_dump.csv).

There is also a cronjob which periodically dumps the full set of assets to this file. This file is used as the source for the ETL job controlled by [this script](https://github.com/WPRDC/rocket-etl/blob/master/engine/payload/wprdc/assets_to_ckan.py), which runs nightly on the tools server.
