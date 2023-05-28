from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from urllib.parse import parse_qs



@database_sync_to_async
def get_user(token):
    try:
        User = get_user_model()
        # user = JWTAuthentication().authenticate(request=None, token=token)
        access_token_obj = AccessToken(token)
        user_id = access_token_obj['user_id']
        user = User.objects.get(id=user_id)
        return user
    except Exception:
        return AnonymousUser()


class TokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        headers = dict(scope["headers"])
        if b"authorization" in headers:
            # Extract the token from the Authorization header
            token = headers[b"authorization"].decode().split()[1]
            scope["headers"] = [(b"authorization", b"Bearer " + token.encode())]
        print(token)
        user = await get_user(token)
        print(user)
        scope["user"] = user
        return await self.inner(scope, receive, send)
