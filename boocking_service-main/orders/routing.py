from django.urls import path, re_path
from . import consumers

websocket_urlpatterns = [
    path(r'ws/order/', consumers.AllOrderConsumer.as_asgi()),
    re_path(r'ws/hall/(?P<hall_id>\w+)/$', consumers.HallConsumer.as_asgi())
]
