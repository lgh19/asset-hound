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

    def __str__(self):
        return self.name


class Location(models.Model):
    name = models.CharField(max_length=255, editable=False)
    street_address = models.CharField(max_length=100)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)

    available_transportation = models.TextField(null=True, blank=True)
    parent_location = models.ForeignKey(
        'Location',
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )
    latitude = models.FloatField()
    longitude = models.FloatField()
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
    name = models.CharField(max_length=255)
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
    localizability = models.CharField(max_length=3, choices=LOCALIZABILITY_CHOICES)

    url = models.URLField(null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = PhoneNumberField(null=True, blank=True)

    hours_of_operation = models.TextField(null=True, blank=True)
    holiday_hours_of_operation = models.TextField(null=True, blank=True)
    capacity = models.IntegerField(null=True, blank=True)
    wifi_network = models.CharField(max_length=100, null=True, blank=True)

    child_friendly = models.BooleanField(null=True, blank=True)
    internet_access = models.BooleanField(null=True, blank=True)
    computers_available = models.BooleanField(null=True, blank=True)
    open_to_public = models.BooleanField()
    sensitive = models.BooleanField()

    asset_types = models.ManyToManyField('AssetType')
    location = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True)
    organization = models.ForeignKey('Organization', on_delete=models.PROTECT)
    services = models.ManyToManyField('ProvidedService')
    accessibility_features = models.ManyToManyField('AccessibilityFeature', )
    hard_to_count_population = models.ManyToManyField('TargetPopulation')
    data_source = models.ForeignKey('DataSource', on_delete=models.PROTECT, null=True, blank=True)

    date_entered = models.DateTimeField(editable=False, auto_now_add=True)
    last_updated = models.DateTimeField(editable=False, auto_now=True)

    def __str__(self):
        return self.name
