from huey.contrib.djhuey import periodic_task, task
from assets.models import Asset
from assets.util_carto import sync_asset_to_carto

@task()
def sync_assets_to_carto_eventually(asset_ids):
    for asset_id in asset_ids:
        asset = Asset.objects.get(pk = asset_id)
        sync_asset_to_carto(asset)
