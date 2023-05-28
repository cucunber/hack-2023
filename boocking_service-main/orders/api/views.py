from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action

from .serializers import OrderSerializer, OrderStatusSerializer, OrderHistorySerializer
from orders.models import Order, OrderStatus, OrderHistory


class OrderView(ModelViewSet):

    serializer_class = OrderSerializer
    queryset = Order.objects.all()

    @action(methods=['GET'], url_path='status', detail=True)
    def order_status(self, request, pk=None):
        order = self.get_object()
        history = order.histories.filter(end_date__isnull=True).first()
        serializer = OrderHistorySerializer(history, many=False)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class OrderStatusView(ModelViewSet):

    serializer_class = OrderStatusSerializer
    queryset = OrderStatus.objects.all()


class OrderHistoryView(ModelViewSet):

    serializer_class = OrderHistorySerializer
    queryset = OrderHistory.objects.all()

