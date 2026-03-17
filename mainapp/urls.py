
from django.contrib import admin
from django.urls import path
from mainapp import views

urlpatterns = [
path('admin/', admin.site.urls),
path('', views.home, name="home"),
path('search/', views.search, name="search"),
path('add/', views.addMedia, name="add_media"),
    path('update-media/<str:pk>', views.updateMedia, name='update-media'),
    path('delete-media/<str:pk>', views.delete_media, name='delete-media')
]
