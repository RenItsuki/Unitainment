from django.urls import path

from . import views


urlpatterns = [
    path("", views.home, name="home"),
    path("discussions/", views.discussions, name="discussions"),
    path("search/", views.search, name="search"),
    path("list/", views.list_home, name="list-home"),
    path("list/add/", views.save_to_list, name="save-to-list"),
    path("list/remove/<int:entry_id>/", views.remove_from_list, name="remove-from-list"),
    path("list/<str:status>/", views.list_status, name="list-status"),
    path("login/", views.login_view, name="login"),
    path("register/", views.register_view, name="register"),
    path("logout/", views.logout_view, name="logout"),
    path("add/", views.addMedia, name="add_media"),
]
