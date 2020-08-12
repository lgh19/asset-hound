from django.contrib.gis.db import models
from django.contrib.gis.geos import Point
from phonenumber_field.modelfields import PhoneNumberField
from simple_history.models import HistoricalRecords

from assets.utils import geocode_address

FIXED_LOCALE = 'FIX'
MOBILE_LOCALE = 'MOB'
VIRTUAL_LOCALE = 'VIR'

LOCALIZABILITY_CHOICES = (
    (FIXED_LOCALE, 'Fixed'),
    (MOBILE_LOCALE, 'Mobile'),
    (VIRTUAL_LOCALE, 'Cyber'),
)


class AssetType(models.Model):
    """ Asset types """
    name = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    category = models.ForeignKey('Category', on_delete=models.PROTECT, related_name='asset_types', null=True)

    def __str__(self):
        return self.title or '<MISSING NAME>'


class Category(models.Model):
    """ Categories """
    name = models.CharField(max_length=255)
    title = models.CharField(max_length=255)

    class Meta:
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.title or '<MISSING TITLE>'


class Tag(models.Model):
    """ Tags """
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name or '<MISSING NAME>'


class Location(models.Model):
    name = models.CharField(max_length=255, editable=False)
    street_address = models.CharField(max_length=100, null=True, blank=True)
    unit = models.CharField(max_length=20, null=True, blank=True)
    unit_type = models.CharField(max_length=20, null=True, blank=True)
    municipality = models.CharField(max_length=50, null=True, blank=True)
    city = models.CharField(max_length=50, null=True, blank=True)
    state = models.CharField(max_length=50, null=True, blank=True)
    zip_code = models.CharField(max_length=10, null=True, blank=True)
    parcel_id = models.CharField(max_length=50, null=True, blank=True)
    residence = models.BooleanField(null=True, blank=True)

    available_transportation = models.TextField(null=True, blank=True)
    parent_location = models.ForeignKey(
        'Location',
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    geom = models.PointField(null=True, blank=True)
    geocoding_properties = models.TextField(null=True, blank=True)
    iffy_geocoding = models.BooleanField(null=True, blank=True) # If False, this means that
    # someone has decided that the location's geocoordinates are unambiguously correct.
    # Making this True flags this Location's geocoordinates for review. Examples of
    # iffy geocoding: A Location that has a street address for which other Locations
    # have Suites or other units, but this one doesn't. A Location where multiple
    # different assets have about the same geocoordinates, so it's likely that
    # some are wrong (or at least need to be checked).

    # Notes about this or other things (like missing Suite numbers) may be added to
    # the geocoding_properties field.

    history = HistoricalRecords()

    @property
    def full_address(self):
        if self.street_address:
            return f'{self.street_address or ""}, {self.unit or ""} {self.unit_type or ""}, {self.city or ""}, {self.state or ""} {self.zip_code or ""}'
        return ""

    def save(self, *args, **kwargs):
        """ When the model is saved, attempt to geocode it based on address """
        if not self.pk or self.name == 'None, None None None':
            if self.street_address is not None:
                self.name = f'{self.street_address}, {self.unit or ""} {self.unit_type or ""}, {self.city}, {self.state} {self.zip_code}'
                # Note that using parcel_id is not good for two reasons: 1) It's not very
                # human-readable. 2) It's sometimes LESS precise than street address since
                # many house numbers may be included in one giant parcel.
            elif self.latitude is not None:
                self.name = f'({self.latitude}, {self.longitude})'
            else:
                self.name = f'<Unnamed location>'

        # if not (self.longitude or self.latitude):
        #    self.latitude, self.longitude = geocode_address(self.name) # This can give very
        # bad geocoordinates to an asset (like the centroid of Pittsburgh). Currently ~0.5%
        # of assets are ungeocoded, so this is not necessary.
        if not self.geom:
            print(self.latitude, self.longitude)
            self.geom = Point(
                (float(self.longitude), float(self.latitude))
            ) if self.latitude and self.longitude else None
        super(Location, self).save(*args, **kwargs)

    def __str__(self):
        return self.name or '<MISSING NAME>'


class Organization(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)
    location = models.ForeignKey('Location', on_delete=models.CASCADE, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = PhoneNumberField(null=True, blank=True)

    history = HistoricalRecords()

    def __str__(self):
        return self.name or '<MISSING NAME>'


class ProvidedService(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name or '<MISSING NAME>'


class TargetPopulation(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name or '<MISSING NAME>'


class DataSource(models.Model):
    name = models.CharField(max_length=255)
    url = models.URLField(max_length=500, null=True, blank=True)

    def __str__(self):
        return self.name or '<MISSING NAME>'


class BaseAsset(models.Model):
    name = models.CharField(max_length=255)
    localizability = models.CharField(max_length=3, choices=LOCALIZABILITY_CHOICES, null=True, blank=True)

    url = models.URLField(max_length=500, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = PhoneNumberField(null=True, blank=True)

    hours_of_operation = models.TextField(null=True, blank=True)
    holiday_hours_of_operation = models.TextField(null=True, blank=True)
    periodicity = models.CharField(max_length=100, null=True, blank=True)
    capacity = models.IntegerField(null=True, blank=True)
    wifi_network = models.CharField(max_length=100, null=True, blank=True)

    child_friendly = models.BooleanField(null=True, blank=True)
    internet_access = models.BooleanField(null=True, blank=True)
    computers_available = models.BooleanField(null=True, blank=True)
    accessibility = models.BooleanField(null=True, blank=True)
    open_to_public = models.BooleanField(null=True, blank=True)
    sensitive = models.BooleanField(null=True, blank=True)
    do_not_display = models.BooleanField(null=True, blank=True)

    asset_types = models.ManyToManyField('AssetType')
    # category = models.ManyToManyField('Category')
    services = models.ManyToManyField('ProvidedService', blank=True)
    hard_to_count_population = models.ManyToManyField('TargetPopulation', blank=True)
    data_source = models.ForeignKey('DataSource', on_delete=models.PROTECT, null=True, blank=True)

    tags = models.ManyToManyField('Tag', blank=True)
    etl_notes = models.TextField(null=True, blank=True)  # notes from Rocket
    primary_key_from_rocket = models.TextField(null=True, blank=True)
    synthesized_key = models.TextField(null=True, blank=True)
    date_entered = models.DateTimeField(editable=False, auto_now_add=True)  # As implemented, these are
    last_updated = models.DateTimeField(editable=False, auto_now=True)  # just for tracking history of

    # these records. These may be retirable if the django-simple-history approach is sufficiently
    # convenient.

    def __str__(self):
        return self.name or '<MISSING NAME>'


class RawAsset(BaseAsset):
    # Location and Organization information is all represented in a flat manner here
    # with a series of fields more closely representing the CSV file.

    # This is to avoid the loss of information that happens if we upload the CSV
    # straight to the Asset model, since the Location and Organization may be
    # shared between multiple Asset instances, so we have to choose between
    # automerging or just overwriting data. In the case of latitude, longitude,
    # and geom, these fields cannot be lists so there is certain to be lost data
    # if we upload straight to the Asset model. The RawAsset model exists
    # to keep in a database some form of the original records, which can be
    # linked to from the Asset instances (with a ManyToMany field), though
    # maybe it would make more sense to have ForeignKeys from RawAsset
    # instances to the one merged Asset that it feeds (as we shouldn't have
    # one record feeding multiple Assets).

    # Finally, other fields that are table-ized in the Asset model (like tags)
    # could be kept flat here to make it easier to serialize and deserialize them
    # but that pushes the cumbersomeness of the conversions from the
    # loading/dumping of RawAssets to the comparison of RawAssets to the Assets
    # (when looking for mismatches when updating the RawAssets (which is ONLY
    # done when new data is brought in from raw source files)).

    # Option 1: Table-ize Raw Asset:
    # Use existing loader (modified to flatten Locations and Organizations),
    # but then serialize using Django Rest Framework (CSV Edition)
    # Allow the serialized-to-CSV table to be reimported (some kind of deserialization
    # happens here - but it's going to be more complex because it's then merging RawAssets
    # to create Assets and doing the Location/Organization manipulations).
    # [I think this option sounds OK.]

    # Location/Organization manipulations might be a separate round of extract-edit-upload-modify.

    # BEGIN flattened Location
    # location_name = models.CharField(max_length=255, editable=False) # Is this needed at this stage? This is not in the original assets CSV file.
    street_address = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=50, null=True, blank=True)
    state = models.CharField(max_length=50, null=True, blank=True)
    zip_code = models.CharField(max_length=10, null=True, blank=True)
    parcel_id = models.CharField(max_length=50, null=True, blank=True)
    residence = models.BooleanField(null=True, blank=True)

    available_transportation = models.TextField(null=True, blank=True)
    parent_location = models.CharField(max_length=50, null=True, blank=True)
    # The thing about the parent location is that it's just a name in the
    # source data at this point, and we've got to figure out how we're going
    # to connect it to Location instances. At present, there are only 153 distinct
    # parent_location values, so doing it semimanually seems viable.
    # It's pretty much the same deal with the organization having a
    # Location instance. It might eventually make sense to make this
    # association, but there's no data or wiring or front end features
    # to support it at this point.
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    geom = models.PointField(null=True)
    geocoding_properties = models.TextField(null=True, blank=True)
    # END flattened Location
    # BEGIN flattened Organization
    organization_name = models.CharField(max_length=255, null=True, blank=True)
    organization_email = models.EmailField(null=True, blank=True)
    organization_phone = PhoneNumberField(null=True, blank=True)

    # END flattened Organization
    raw_asset_notes = models.TextField(max_length=1000, null=True, blank=True)  # This is named
    # to distinguish it from the Asset-level notes field, which should not be produced by merging # these RawAsset-level notes.

    asset = models.ForeignKey('Asset', on_delete=models.SET_NULL, null=True, blank=True)

    history = HistoricalRecords()  # This adds a HistoricalRawAsset table to the database, which
    # will record a new row every time a tracked change (model creation, change, or deletion)
    # occurs. This field needs to be added explicitly to every table to be tracked (it is
    # not inherited from a parent model). However, fields inherited from a parent model
    # will be tracked.


# class Asset(BaseAsset): # This is supposed to replace the original Asset class.
#    # [ ] After a staging server has been set up, with a duplicate database,
#    # Check (first when making migrations) that this will not screw everything up.
#
#    location = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True, blank=True)
#    organization = models.ForeignKey('Organization', on_delete=models.PROTECT, null=True, blank=True)
#
#    notes = models.TextField(max_length=1000, null=True, blank=True)
#
#    history = HistoricalRecords()
#
#    @property
#    def category(self):
#        return self.asset_types.all()[0].category


class Asset(models.Model):
    name = models.CharField(max_length=255)
    localizability = models.CharField(max_length=3, choices=LOCALIZABILITY_CHOICES, null=True, blank=True)

    url = models.URLField(max_length=500, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = PhoneNumberField(null=True, blank=True)

    hours_of_operation = models.TextField(null=True, blank=True)
    holiday_hours_of_operation = models.TextField(null=True, blank=True)
    periodicity = models.CharField(max_length=100, null=True, blank=True)
    capacity = models.IntegerField(null=True, blank=True)
    wifi_network = models.CharField(max_length=100, null=True, blank=True)

    child_friendly = models.BooleanField(null=True, blank=True)
    internet_access = models.BooleanField(null=True, blank=True)
    computers_available = models.BooleanField(null=True, blank=True)
    accessibility = models.BooleanField(null=True, blank=True)
    open_to_public = models.BooleanField(null=True, blank=True)
    sensitive = models.BooleanField(null=True, blank=True)
    do_not_display = models.BooleanField(null=True, blank=True)

    asset_types = models.ManyToManyField('AssetType')
    location = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True, blank=True)
    organization = models.ForeignKey('Organization', on_delete=models.PROTECT, null=True, blank=True)
    services = models.ManyToManyField('ProvidedService', blank=True)
    hard_to_count_population = models.ManyToManyField('TargetPopulation', blank=True)
    data_source = models.ForeignKey('DataSource', on_delete=models.PROTECT, null=True, blank=True)

    tags = models.ManyToManyField('Tag', blank=True)
    etl_notes = models.TextField(null=True, blank=True)  # notes from Rocket
    notes = models.TextField(max_length=1000, null=True, blank=True)
    primary_key_from_rocket = models.TextField(null=True, blank=True)
    synthesized_key = models.TextField(null=True, blank=True)
    date_entered = models.DateTimeField(editable=False, auto_now_add=True)
    last_updated = models.DateTimeField(editable=False, auto_now=True)

    history = HistoricalRecords()

    @property
    def category(self):
        return self.asset_types.all()[0].category

    def __str__(self):
        return self.name or '<MISSING NAME>'
