from django.contrib import admin

from .models import Discussion, Media, PersonalList, SearchHistory


@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
    list_display = ("title", "media_type", "genre", "rating", "featured", "is_hot")
    list_filter = ("media_type", "genre", "featured", "is_hot")
    search_fields = ("title", "genre", "tagline")


@admin.register(PersonalList)
class PersonalListAdmin(admin.ModelAdmin):
    list_display = ("user", "media", "status", "updates")
    list_filter = ("status",)
    search_fields = ("user__username", "media__title")


@admin.register(Discussion)
class DiscussionAdmin(admin.ModelAdmin):
    list_display = ("topic", "community", "topic_type", "featured", "upvotes", "comment_count")
    list_filter = ("topic_type", "featured")
    search_fields = ("topic", "community", "author_name")


@admin.register(SearchHistory)
class SearchHistoryAdmin(admin.ModelAdmin):
    list_display = ("query", "media_type", "genre", "user", "created")
    search_fields = ("query", "genre", "user__username")
