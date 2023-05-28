from django.db.models.signals import post_save
from django.dispatch import receiver

from orders.models import Order, OrderStatus, OrderHistory


@receiver(post_save, sender=Order)
def order_save(sender, instance, created, **kwargs):
    if created:
        OrderHistory.objects.create(
            order=instance,
            status=OrderStatus.objects.get(order_status_name='draft')
        )
