## Operational Handbook for the Asset Map + Database

The objective of this project is to join many datasets from federal, state, and local sources to synthesize a comprehensive picture of the assets that make up the infrastructure of a particular community.

### Source-file preparation
We assembled many such datasets, in some cases filtering them down to just those in Allegheny County, or even filtering into several different files, one for each of the types of assets in the original file.

The source files can be found in [this private repository](https://github.com/WPRDC/liquid-assets). Source files are typically either CSV files, Excel files (which are then converted to CSV files using Visidata), or ESRI shapefiles (which are converted to SQLite using [shapefile-to-sqlite](https://pypi.org/project/shapefile-to-sqlite/), and from there to CSV, again by Visidata).

### Conversion to a standard schema
[This ETL script](https://github.com/WPRDC/rocket-etl/blob/master/engine/payload/asset_map/_facet_hound.py) can be run (after setting the parameter `one_file` to `True`) to process all the source files represented in the `job_dicts` list, using the corresponding schemas, to produce an `all_assets.csv` file, which contains all the asset information in a standard schema, suitable for uploading to the asset database. This command will process all the source files:

```> python launchpad.py engine/payload/asset_map/_facet_hound.py mute``` 

The job codes defined in the `job_dicts` list can be supplied as command-line arguments to generate a file containing just those assets. For instance, the `job_code` value for the public-art dataset is `public_art`, so running

```> python launchpad.py engine/payload/asset_map/_facet_hound.py mute public_art```
will only process the public_art job. If `one_file == False`, the generated file will be called `public-art-pgh.csv` and will only contain the fields defined by the corresponding schema (wherease when `one_file == True`, all fields in the asset schema are included in the file). All converted files will be saved to the directory given in the variable `ASSET_MAP_PROCESSED_DIR`, as specified by the `destination_file` parameter in the jobs (though this could be changed).

The contents of these files are considered to be raw assets.

### Uploading raw assets to the asset database and then downloading them

The asset database (defined in [this Django models.py file](https://github.com/WPRDC/asset-hound/blob/master/assets/models.py)) has a RawAsset model which is compatible with the schema produced by the `_facet_hound.py` ETL job. To upload a file of raw assets, converted by `_facet_hound.py`, move the file to the assets server (`> sftp all_assets.csv <username>@assets.wprdc.org:<path-to-asset_hound>/raw_assets_to_add.csv`), shell into the Django server, change directories to the Django directory, activate the Django virtual environment (`source env/bin/activate`), and run the RawAsset-loading management command (`> python manage.py load_raw_assets raw_assets_to_add.csv`).

The contents of the raw-asset table can then be exported from the database by running
```> python manage.py dump_raw_assets```

### Creating and editing assets
The resulting `raw_asset_dump.csv` file is then exported to another computer, where a subset of raw assets may be selected (for instance, all raw assets of a given asset-type (like `restaurants`)). This filtered file is run through a Python script that facilitates finding and merging raw assets. When the script finds sufficiently similar raw assets, it proposes them as duplicates to merge and the lets the user select among conflicting values on a field-by-field basis. The output of this process is what we call a merge-instructions file.

(The format of the merge-instructions file)

(How the Asset updater works)
(Asset-based vs. Raw-Asset-based updates)


### The workflow for adding a new file containing assets to the assets database

### Exporting data
Accessing the URL [https://assets.wprdc.org/edit/dump_assets/](https://assets.wprdc.org/edit/dump_assets/) triggers a dump of the assets which will show up `(# of records)/(4000/minute)` later at
[https://assets.wprdc.org/asset_dump.csv](https://assets.wprdc.org/asset_dump.csv).

There is also a cronjob which periodically dumps the full set of assets to this file. This file is used as the source for the ETL job controlled by [this script](https://github.com/WPRDC/rocket-etl/blob/master/engine/payload/wprdc/assets_to_ckan.py), which runs nightly on the tools server.
