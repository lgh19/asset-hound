from django.contrib.gis.db import models
from django.contrib.gis.geos import Point
from phonenumber_field.modelfields import PhoneNumberField

from assets.utils import geocode_address


class AssetType(models.Model):
    """ Asset types """
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Tag(models.Model):
    """ Tags """
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Location(models.Model):
    name = models.CharField(max_length=255, editable=False)
    street_address = models.CharField(max_length=100, null=True, blank=True)
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
    geom = models.PointField(null=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        """ When the model is saved, attempt to geocode it based on address """
        if not self.pk:
            self.name = f'{self.street_address} {self.city}, {self.state} {self.zip_code}'
        if not (self.longitude or self.latitude):
            self.latitude, self.longitude = geocode_address(self.name)
        if not self.geom:
            print(self.latitude, self.longitude)
            self.geom = Point((float(self.longitude), float(self.latitude)))
        super(Location, self).save(*args, **kwargs)


class Organization(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)
    location = models.ForeignKey('Location', on_delete=models.CASCADE, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = PhoneNumberField(null=True, blank=True)

    def __str__(self):
        return self.name


class AccessibilityFeature(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class ProvidedService(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class TargetPopulation(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class DataSource(models.Model):
    name = models.CharField(max_length=255)
    url = models.URLField(null=True, blank=True)

    def __str__(self):
        return self.name


class Asset(models.Model):
    FIXED_LOCALE = 'FIX'
    MOBILE_LOCALE = 'MOB'
    VIRTUAL_LOCALE = 'VIR'
    LOCALIZABILITY_CHOICES = (
        (FIXED_LOCALE, 'Fixed'),
        (MOBILE_LOCALE, 'Mobile'),
        (VIRTUAL_LOCALE, 'Cyber'),
    )
    name = models.CharField(max_length=255)
    localizability = models.CharField(max_length=3, choices=LOCALIZABILITY_CHOICES, null=True, blank=True)

    url = models.URLField(null=True, blank=True)
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
    open_to_public = models.BooleanField(null=True, blank=True)
    sensitive = models.BooleanField(null=True, blank=True)
    do_not_display = models.BooleanField(null=True, blank=True)

    asset_types = models.ManyToManyField('AssetType')
    location = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True, blank=True)
    organization = models.ForeignKey('Organization', on_delete=models.PROTECT, null=True, blank=True)
    services = models.ManyToManyField('ProvidedService', blank=True)
    accessibility_features = models.ManyToManyField('AccessibilityFeature', blank=True)
    hard_to_count_population = models.ManyToManyField('TargetPopulation', blank=True)
    data_source = models.ForeignKey('DataSource', on_delete=models.PROTECT, null=True, blank=True)

    tags = models.ManyToManyField('Tag', blank=True)
    etl_notes = models.TextField(null=True, blank=True) # notes from Rocket
    notes = models.TextField(null=True, blank=True)
    primary_key_from_rocket = models.TextField(null=True, blank=True)
    date_entered = models.DateTimeField(editable=False, auto_now_add=True)
    last_updated = models.DateTimeField(editable=False, auto_now=True)

    def __str__(self):
        return self.name
