
from django.db import models

class User(models.Model):
    username = models.CharField(max_length=100)
    email = models.EmailField()
    password = models.CharField(max_length=200)
    updates = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

class Media(models.Model):
    MEDIA_TYPES=[('movie','Movie'),('anime','Anime'),('game','Game'),('webseries','Webseries')]
    title=models.CharField(max_length=200)
    media_type=models.CharField(max_length=20,choices=MEDIA_TYPES)
    rating=models.FloatField()
    seasons=models.IntegerField(null=True,blank=True)
    episode_count=models.IntegerField(null=True,blank=True)
    minutes_per_episode=models.IntegerField(null=True,blank=True)
    status=models.CharField(max_length=20)
    updates = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    

class PersonalList(models.Model):
    STATUS=[('planned','Plan'),('watching','Watching'),('completed','Completed'),('dropped','Dropped')]
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    media=models.ForeignKey(Media,on_delete=models.CASCADE)
    status=models.CharField(max_length=20,choices=STATUS)
    updates = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

class Discussion(models.Model):
    topic=models.CharField(max_length=200)
    description=models.TextField()
    upvotes=models.IntegerField(default=0)
    downvotes=models.IntegerField(default=0)
    updates = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
