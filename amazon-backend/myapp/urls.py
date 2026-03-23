from django.urls import path
from . import views

urlpatterns = [
    path('auth/register/', views.register),
    path('auth/login/', views.login),
    path('auth/logout/', views.logout),
    path('profile/', views.profile),
    path('checkout/', views.checkout),
    path('products/', views.get_products),
    path('products/create/', views.create_product),
    path('products/<int:id>/', views.product_detail),
]
