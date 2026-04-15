from django.conf import settings
from django.db import models


class Media(models.Model):
    MEDIA_TYPES = [
        ("anime", "Anime"),
        ("game", "Game"),
        ("book", "Book"),
        ("webseries", "Web Series"),
        ("movie", "Movie"),
    ]

    title = models.CharField(max_length=200)
    media_type = models.CharField(max_length=20, choices=MEDIA_TYPES, default="anime")
    genre = models.CharField(max_length=80, blank=True, default="")
    tagline = models.CharField(max_length=220, blank=True, default="")
    description = models.TextField(blank=True, default="")
    rating = models.FloatField(default=0)
    seasons = models.IntegerField(null=True, blank=True)
    episode_count = models.IntegerField(null=True, blank=True)
    minutes_per_episode = models.IntegerField(null=True, blank=True)
    release_year = models.IntegerField(null=True, blank=True)
    season_label = models.CharField(max_length=80, blank=True, default="")
    image_url = models.URLField(blank=True, default="")
    status = models.CharField(max_length=40, blank=True, default="Hot right now")
    is_hot = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    updates = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-featured", "-is_hot", "-updates", "-created"]

    def __str__(self):
        return self.title

    @property
    def poster_url(self):
        return self.image_url or f"https://picsum.photos/seed/unitainment-{self.pk}/900/600"


class PersonalList(models.Model):
    STATUS = [
        ("planning", "Plan To"),
        ("current", "Current"),
        ("completed", "Completed"),
        ("dropped", "Dropped"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="media_lists",
    )
    media = models.ForeignKey(
        Media,
        on_delete=models.CASCADE,
        related_name="list_entries",
    )
    status = models.CharField(max_length=20, choices=STATUS, default="planning")
    notes = models.CharField(max_length=255, blank=True, default="")
    updates = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-updates", "-created"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "media"],
                name="unique_media_per_user",
            )
        ]

    def __str__(self):
        return f"{self.user} -> {self.media} ({self.status})"


class SearchHistory(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="search_history",
        null=True,
        blank=True,
    )
    query = models.CharField(max_length=120, blank=True, default="")
    media_type = models.CharField(max_length=20, blank=True, default="")
    genre = models.CharField(max_length=80, blank=True, default="")
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created"]

    def __str__(self):
        parts = [self.query, self.media_type, self.genre]
        return " / ".join(part for part in parts if part) or "Recent search"


class Discussion(models.Model):
    TOPIC_TYPES = [("general", "General")] + Media.MEDIA_TYPES

    topic = models.CharField(max_length=200)
    description = models.TextField()
    community = models.CharField(max_length=80, default="r/unitainment")
    author_name = models.CharField(max_length=60, default="mod")
    topic_type = models.CharField(max_length=20, choices=TOPIC_TYPES, default="general")
    image_url = models.URLField(blank=True, default="")
    comment_count = models.IntegerField(default=0)
    featured = models.BooleanField(default=False)
    upvotes = models.IntegerField(default=0)
    downvotes = models.IntegerField(default=0)
    updates = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-featured", "-created"]

    def __str__(self):
        return self.topic

    @property
    def score(self):
        return self.upvotes - self.downvotes

    @property
    def banner_url(self):
        return self.image_url or f"https://picsum.photos/seed/discussion-{self.pk}/900/600"


class DiscussionComment(models.Model):
    discussion = models.ForeignKey(
        Discussion,
        on_delete=models.CASCADE,
        related_name="comments",
    )
    author_name = models.CharField(max_length=60)
    body = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created"]

    def __str__(self):
        return f"{self.author_name} on {self.discussion}"
