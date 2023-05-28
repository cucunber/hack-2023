from django.contrib.auth import get_user_model
from rest_framework import serializers

from halls.models import Hall
from orders.models import OrderHistory, Order, OrderStatus


User = get_user_model()


class OrderSerializer(serializers.ModelSerializer):
    hall = serializers.PrimaryKeyRelatedField(queryset=Hall.objects.all())
    ordered_by = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    current_status = serializers.CharField(required=False)

    class Meta:
        model = Order
        fields = ['id', 'hall', 'order_from', 'order_till', 'price', 'ordered_by', 'current_status']


class OrderStatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderStatus
        fields = ['id', 'order_status_name']


class OrderHistorySerializer(serializers.ModelSerializer):
    order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all())
    status = serializers.PrimaryKeyRelatedField(queryset=OrderStatus.objects.all())

    class Meta:
        model = OrderHistory
        fields = ['id', 'order', 'status', 'start_date', 'end_date']
