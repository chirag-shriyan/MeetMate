from django.db import models

# Create your models here.
class RoomRecord(models.Model):
    username = models.CharField(max_length=100)
    room = models.TextField()
    uid = models.IntegerField()
    joined_at = models.DateTimeField(auto_now_add=True)