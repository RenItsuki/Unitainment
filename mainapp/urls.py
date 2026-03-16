
from django.contrib import admin
from django.urls import path
from mainapp import views

urlpatterns = [
path('admin/', admin.site.urls),
path('', views.home, name="home"),
path('search/', views.search, name="search"),
path('add/', views.add_media, name="add_media"),
path('delete/<int:id>/', views.delete_media, name="delete_media"),
]
