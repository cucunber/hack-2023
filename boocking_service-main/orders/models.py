import datetime

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.contrib.auth import get_user_model
from django.db import models

from halls.models import Hall


User = get_user_model()


class Order(models.Model):
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE, related_name='orders')
    order_from = models.DateTimeField()
    order_till = models.DateTimeField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    ordered_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='orders')

    @property
    def current_status(self):
        return self.histories.filter(end_date__isnull=True).first().status

    def save(self, *args, **kwargs):
        is_update = True if self.pk else False
        super(Order, self).save(*args, **kwargs)
        if is_update:
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                'order_channel',
                {
                    'type': 'order_change_status.message',
                    'message': {
                        'order_id': str(self.pk),
                        'status': self.histories.get(end_date__isnull=True).status.order_status_name,
                        'order_from': self.order_from.strftime('%Y-%m-%d %H:%M:%S'),
                        'order_till': self.order_till.strftime('%Y-%m-%d %H:%M:%S'),
                        'order_price': str(self.price),
                    }
                }
            )

            async_to_sync(channel_layer.group_send)(
                f'hall_{self.hall.pk}',
                {
                    'type': 'hall_order_status_change.message',
                    'message': {
                        'order_id': str(self.pk),
                        'status': self.histories.get(end_date__isnull=True).status.order_status_name,
                        'order_from': self.order_from.strftime('%Y-%m-%d %H:%M:%S'),
                        'order_till': self.order_till.strftime('%Y-%m-%d %H:%M:%S'),
                        'order_price': str(self.price),
                    }
                }
            )


class OrderStatus(models.Model):
    order_status_name = models.CharField(max_length=120)

    def __repr__(self):
        return self.order_status_name

    def __str__(self):
        return self.order_status_name


class OrderHistory(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='histories')
    status = models.ForeignKey(OrderStatus, on_delete=models.SET_NULL, null=True)
    start_date = models.DateTimeField(null=True)
    end_date = models.DateTimeField(null=True)

    def save(self, *args, **kwargs):
        now = datetime.datetime.now(tz=datetime.timezone.utc)
        if not self.pk:
            previous_order = OrderHistory.objects.filter(order__id=self.order.id, end_date__isnull=True)
            if previous_order:
                previous_order.update(end_date=now)
        self.start_date = now
        super(OrderHistory, self).save(*args, **kwargs)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'order_channel',
            {
                'type': 'order_change_status.message',
                'message': {
                    'order_id': str(self.order.pk),
                    'status': self.status.order_status_name,
                    'order_from': self.order.order_from.strftime('%Y-%m-%d %H:%M:%S'),
                    'order_till': self.order.order_till.strftime('%Y-%m-%d %H:%M:%S'),
                    'order_price': str(self.order.price),
                }
            }
        )

        async_to_sync(channel_layer.group_send)(
            f'hall_{self.order.hall.pk}',
            {
                'type': 'hall_order_status_change.message',
                'message': {
                    'order_id': str(self.order.pk),
                    'status': self.status.order_status_name,
                    'order_from': self.order.order_from.strftime('%Y-%m-%d %H:%M:%S'),
                    'order_till': self.order.order_till.strftime('%Y-%m-%d %H:%M:%S'),
                    'order_price': str(self.order.price),
                }
            }
        )
