from django.contrib import admin

from orders.models import OrderHistory, Order, OrderStatus


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = ['hall', 'order_from', 'order_till', 'price', 'ordered_by']


@admin.register(OrderHistory)
class OrderHistoryAdmin(admin.ModelAdmin):

    list_display = ['order', 'status', 'start_date', 'end_date']


@admin.register(OrderStatus)
class OrderStatusAdmin(admin.ModelAdmin):

    list_display = ['order_status_name']

