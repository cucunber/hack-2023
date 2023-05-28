import os
from channels.routing import get_default_application

import django

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'booking_service.settings')
django.setup()

import orders.routing
import chat.routing
from chat.middleware import TokenAuthMiddleware

# auth middleware
# application = ProtocolTypeRouter(
#     {
#         'http': get_asgi_application(),
#         'websocket': AllowedHostsOriginValidator(
#             TokenAuthMiddleware(URLRouter(
#                 orders.routing.websocket_urlpatterns
#                 + chat.routing.websocket_urlpatterns
#             ))
#         ),
#     }
# )
application = ProtocolTypeRouter(
    {
        'http': get_asgi_application(),
        'websocket': AllowedHostsOriginValidator(
            URLRouter(
                orders.routing.websocket_urlpatterns
                + chat.routing.websocket_urlpatterns
            )
        ),
    }
)
