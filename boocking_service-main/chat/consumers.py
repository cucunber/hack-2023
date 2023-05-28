import base64
import json
import secrets

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from django.core.files.base import ContentFile
from django.contrib.auth import get_user_model

from chat.models import Message, Conversation
from chat.api.serializers import MessageSerializer


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data=None, bytes_data=None):
        """ Это метод чтоб выбирать тип сообщения, но он у нас один (chat_message) """
        # parse the json data into dictionary object
        text_data_json = json.loads(text_data)

        # Send message to room group
        chat_type = {"type": "chat_message"}
        return_dict = {**chat_type, **text_data_json}

        message, attachment, sender_id = (
            text_data_json["message"],
            text_data_json.get("attachment"),
            text_data_json["sender_id"]
        )

        User = get_user_model()
        conversation = Conversation.objects.get(id=int(self.room_name))
        # sender = self.scope['user']
        sender = User.objects.get(id=sender_id)

        # Attachment
        if attachment:
            file_str, file_ext = attachment["data"], attachment["format"]

            file_data = ContentFile(
                base64.b64decode(file_str), name=f"{secrets.token_hex(8)}.{file_ext}"
            )
            # сохраняем в бд
            _message = Message.objects.create(
                sender=sender,
                attachment=file_data,
                text=message,
                conversation=conversation,
            )
        else:
            # сохраняем в бд
            print('save to db')
            _message = Message.objects.create(
                sender=sender,
                text=message,
                conversation=conversation,
            )

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            return_dict,
        )

    # Receive message from room group
    def chat_message(self, event):

        text_data_json = event.copy()
        text_data_json.pop("type")
        message, attachment, sender_id = (
            text_data_json["message"],
            text_data_json.get("attachment"),
            text_data_json["sender_id"]
        )

        conversation = Conversation.objects.get(id=int(self.room_name))
        # # sender = self.scope['user']
        User = get_user_model()
        sender = User.objects.get(id=sender_id)
        #
        # # Attachment
        # if attachment:
        #     file_str, file_ext = attachment["data"], attachment["format"]
        #
        #     file_data = ContentFile(
        #         base64.b64decode(file_str), name=f"{secrets.token_hex(8)}.{file_ext}"
        #     )
        #     # сохраняем в бд
        #     _message = Message.objects.create(
        #         sender=sender,
        #         attachment=file_data,
        #         text=message,
        #         conversation=conversation,
        #     )
        # else:
        #     # сохраняем в бд
        #     print('save to db')
        #     _message = Message.objects.create(
        #         sender=sender,
        #         text=message,
        #         conversation=conversation,
        #     )
        _message = Message.objects.filter(conversation=conversation, sender_id=sender).latest('timestamp')
        serializer = MessageSerializer(instance=_message)
        # Send message to WebSocket
        self.send(
            text_data=json.dumps(
                serializer.data
            )
        )


class ConversationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.user_group_name = 'user_%s' % self.user_id

        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.user_group_name, self.channel_name)

    async def new_conversation_message(self, event):
        # Send message to websocket group
        await self.send(text_data=json.dumps(event))
