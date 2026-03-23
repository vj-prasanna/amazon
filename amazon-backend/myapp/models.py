from django.db import models

# Create your models here.

class Products(models.Model):
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=7, decimal_places=2)
    image = models.ImageField(upload_to='products/' ,blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class UserProfile(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE, related_name='profile')
    image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    address = models.TextField(max_length=255, blank=True)
    mobile = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return self.user.username