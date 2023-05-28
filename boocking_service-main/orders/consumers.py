import json
from channels.generic.websocket import AsyncWebsocketConsumer


class AllOrderConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.group_name = ''

    async def connect(self):
        # we are using one fixed group
        self.group_name = 'order_channel'

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard('order_channel', self.channel_name)

    async def order_change_status_message(self, event):
        # Send message to websocket group
        await self.send(text_data=json.dumps(event['message']))


class HallConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.hall_id = self.scope["url_route"]["kwargs"]["hall_id"]
        self.hall_group_name = 'hall_%s' % self.hall_id

        await self.channel_layer.group_add(
            self.hall_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.hall_group_name, self.channel_name)

    async def hall_order_status_change_message(self, event):
        # Send message to websocket group
        await self.send(text_data=json.dumps(event['message']))
