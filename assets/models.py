from django.contrib.gis.db import models
from django.contrib.gis.geos import Point
from phonenumber_field.modelfields import PhoneNumberField

from assets.utils import geocode_address

address_field_mappings = (
    ()
)


class AssetType(models.Model):
    """ Asset types """
    name = models.CharField(max_length=255)


class Location(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    available_transportation = models.TextField()
    parent_location = models.ForeignKey(
        'Location',
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )
    geom = models.PointField(null=True)

    def save(self, *args, **kwargs):
        """ When the model is saved, attempt to geocode it based on address """
        lat, lng = geocode_address(self.address)
        self.geom = Point(lng, lat)
        super(Location, self).save(*args, **kwargs)

class Organization(models.Model):
    name = models.CharField(max_length=255)
    location = models.ForeignKey('Location', on_delete=models.CASCADE)
    email = models.EmailField()
    phone = PhoneNumberField(blank=True)


class AccessibilityFeature(models.Model):
    name = models.CharField(max_length=255)


class ProvidedService(models.Model):
    name = models.CharField(max_length=255)


class TargetPopulation(models.Model):
    name = models.CharField(max_length=255)


class DataSource(models.Model):
    name = models.CharField(max_length=255)
    url = models.URLField()


class Asset(models.Model):
    FIXED_LOCALE = 'FIX'
    MOBILE_LOCALE = 'MOB'
    VIRTUAL_LOCALE = 'VIR'
    LOCALIZABILITY_CHOICES = (
        (FIXED_LOCALE, 'Fixed'),
        (MOBILE_LOCALE, 'Mobile'),
        (VIRTUAL_LOCALE, 'Virtual/Cyber'),
    )
    name = models.CharField(max_length=255)
    asset_type = models.ManyToManyField('AssetType')
    organization = models.ForeignKey('Organization', on_delete=models.PROTECT)
    localizability = models.CharField(max_length=3, choices=LOCALIZABILITY_CHOICES)
    location = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True)
    url = models.URLField()
    email = models.EmailField()
    phone = PhoneNumberField()
    hours_of_operation = models.TextField()
    holiday_hours_of_operation = models.TextField()
    child_friendly = models.BooleanField()
    capacity = models.IntegerField()
    accessibility = models.ManyToManyField('AccessibilityFeature')
    internet_access = models.BooleanField()
    wifi_network = models.CharField(max_length=100)
    computers_available = models.BooleanField()
    services = models.ManyToManyField('ProvidedService')
    open_to_public = models.BooleanField()
    hard_to_count_population = models.ManyToManyField('TargetPopulation')
    sensitive = models.BooleanField()
    date_entered = models.DateTimeField()
    last_updated = models.DateTimeField()
    data_source = models.ForeignKey('DataSource', on_delete=models.PROTECT)
