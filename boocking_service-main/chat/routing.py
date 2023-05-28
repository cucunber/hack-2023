from django.urls import re_path

from .consumers import ChatConsumer, ConversationConsumer

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<room_name>\w+)/$", ChatConsumer.as_asgi()),
    re_path(r"ws/conversation/(?P<user_id>\w+)/$", ConversationConsumer.as_asgi()),
]
