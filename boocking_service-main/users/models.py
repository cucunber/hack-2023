from django.db import models
from django.contrib.auth.models import AbstractUser


class Interest(models.Model):
    interest_name = models.CharField(max_length=180)

    def __str__(self):
        return self.interest_name

    def __repr__(self):
        return self.interest_name


class User(AbstractUser):

    email = models.EmailField(blank=False)
    first_name = models.CharField(max_length=120, blank=False, null=False)
    last_name = models.CharField(max_length=120, blank=False, null=False)
    user_agreement = models.BooleanField(default=True, blank=False)
    offer_agreement = models.BooleanField(default=True, blank=False)
    show_phone_number = models.BooleanField(default=True, blank=False)
    phone_number = models.CharField(max_length=12, null=True, blank=True,)
    interest = models.ManyToManyField(Interest, blank=True, related_name='users')
    inn = models.IntegerField(null=True, blank=True)
    job_title = models.CharField(max_length=120, null=True, blank=True)
    organization = models.CharField(max_length=120, null=True, blank=True)

