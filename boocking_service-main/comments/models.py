from django.db import models

from halls.models import Hall
from users.models import User


class Comment(models.Model):

    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='comments', null=True, blank=False)
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField(null=True)
    rating = models.IntegerField(default=0)

    def __str__(self):
        return f'comment from {self.user} on {self.hall.name}'

    def __repr__(self):
        return f'comment from {self.user} on {self.hall}'
