from django.db import models

# Create your models here.

class Content(models.Model):
    id = models.IntegerField(primary_key=True)
    pos_from_centre_X = models.IntegerField(default=0)
    pos_from_centre_Y = models.IntegerField(default=0)
    width = models.IntegerField(default=100)
    height = models.IntegerField(default=100)

    class Meta:
        abstract = True

class Text(Content):
    txt = models.CharField(max_length = 1000000)

class Image(Content):
    img_dir = models.CharField(max_length=200)

class Video(Content):
    vid_dir = models.CharField(max_length=200)

class Link(Content):
    link = models.CharField(max_length=200)