from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db import models
from django.contrib.auth import get_user_model

from halls.models import Hall

User = get_user_model()


class Conversation(models.Model):
    user_from = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="convo_starter"
    )
    user_to = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="convo_participant"
    )
    start_time = models.DateTimeField(auto_now_add=True)
    hall = models.ForeignKey(Hall, on_delete=models.SET_NULL, null=True)

    def __repr__(self):
        return f'conversation between {self.user_from} and {self.user_to} about {self.hall.name}'

    def __str__(self):
        return f'conversation between {self.user_from} and {self.user_to} about {self.hall.name}'

    def save(self, *args, **kwargs):
        is_update = True if self.pk else False
        super(Conversation, self).save(*args, **kwargs)
        if not is_update:
            # new_conversation_notification(self)
            channel_layer = get_channel_layer()
            # serializer = ConversationSerializer(instance=self)
            async_to_sync(channel_layer.group_send)(
                f'user_{self.hall.owner.pk}',
                {
                    'type': 'new_conversation.message',
                    'id': self.pk,
                }
            )
            # new_conversation_notification()


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.SET_NULL,
                               null=True, related_name='message_sender')
    text = models.CharField(max_length=200, blank=True)
    attachment = models.FileField(blank=True)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f'message from {self.sender}'

    def __repr__(self):
        return f'message from {self.sender}'

    class Meta:
        ordering = ('-timestamp',)
