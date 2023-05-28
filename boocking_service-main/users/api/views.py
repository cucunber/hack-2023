from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework import mixins, status, permissions
from rest_framework.decorators import action

from chat.api.serializers import ConversationSerializer
from halls.api.serializers import HallSerializer
from halls.models import Hall
from orders.api.serializers import OrderSerializer
from users.models import User
from .serializers import UserSerializer, UserRegisterSerializer, UserRetrieveSerializer
from orders.models import Order


class UserViewSet(GenericViewSet,
                  mixins.RetrieveModelMixin,
                  mixins.ListModelMixin,
                  mixins.CreateModelMixin,
                  mixins.UpdateModelMixin):
    queryset = User.objects.all()

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context

    def get_serializer_class(self):
        if self.action == 'list':
            return UserSerializer
        if self.action == 'create':
            return UserRegisterSerializer
        if self.action == 'retrieve':
            return UserRetrieveSerializer
        if self.action in ['update', 'partial_update']:
            return UserRegisterSerializer

    def perform_create(self, serializer):
        return serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        obj = self.perform_create(serializer)
        obj_serializer = UserSerializer(obj)
        headers = self.get_success_headers(obj_serializer.data)
        return Response(obj_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @extend_schema(responses=HallSerializer(many=True))
    @action(methods=['get'], detail=True, url_path='hall/for-rent')
    def for_rent(self, request, pk=None):
        """площадки которые сдает пользователь"""
        user = self.get_object()
        halls = user.halls.all().distinct()
        halls_serializer = HallSerializer(instance=halls, many=True, context=self.get_serializer_context())
        headers = self.get_success_headers(halls_serializer.data)
        return Response(halls_serializer.data, status=status.HTTP_200_OK, headers=headers)

    @extend_schema(responses=HallSerializer(many=True))
    @action(methods=['get'], detail=True, url_path='hall/rented')
    def rented(self, request, pk=None):
        """площадки которые арендует пользователь"""
        user = self.get_object()
        halls = Hall.objects.prefetch_related('orders').filter(orders__ordered_by=user).distinct()
        halls_serializer = HallSerializer(instance=halls, many=True, context=self.get_serializer_context())
        headers = self.get_success_headers(halls_serializer.data)
        return Response(halls_serializer.data, status=status.HTTP_200_OK, headers=headers)

    @extend_schema(responses=OrderSerializer(many=True))
    @action(methods=['get'], detail=True, url_path='order/rented')
    def order_for_rent(self, request, pk=None):
        """заказы пользователя на аренду"""
        user = self.get_object()
        orders = user.orders.all().distinct()
        orders_serializer = OrderSerializer(instance=orders, many=True, context=self.get_serializer_context())
        headers = self.get_success_headers(orders_serializer.data)
        return Response(orders_serializer.data, status=status.HTTP_200_OK, headers=headers)

    @extend_schema(responses=OrderSerializer(many=True))
    @action(methods=['get'], detail=True, url_path='order/for-rent')
    def order_rented(self, request, pk=None):
        """заказы пользователя на сдачу"""
        user = self.get_object()
        orders = Order.objects.select_related('hall').filter(hall__owner=user).distinct()
        orders_serializer = OrderSerializer(instance=orders, many=True, context=self.get_serializer_context())
        headers = self.get_success_headers(orders_serializer.data)
        return Response(orders_serializer.data, status=status.HTTP_200_OK, headers=headers)

    @extend_schema(responses=ConversationSerializer(many=True))
    @action(methods=['get'], detail=True, url_path='conversations')
    def conversations(self, request, pk=None):
        user = self.get_object()
        conversation_started_by = user.convo_starter.all()
        conversation_receiver = user.convo_participant.all()
        user_conversations = conversation_receiver.union(conversation_started_by)
        conversation_serializer = ConversationSerializer(instance=user_conversations, many=True)
        return Response(data=conversation_serializer.data, status=status.HTTP_200_OK)
