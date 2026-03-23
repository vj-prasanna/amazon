from django.contrib import admin
from rest_framework.authtoken.models import Token
from .models import Products


admin.site.register(Token)
admin.site.register(Products)
