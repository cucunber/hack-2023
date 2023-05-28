import json

from django.db.models import Q, F
from django.db.models.functions import TruncDate
from django.utils.datetime_safe import datetime
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from django.db.models import Max, Min

from orders.api.serializers import OrderSerializer
from orders.models import OrderHistory, Order
from .serializers import HallTypeSerializer, PropertySerializer, HallSerializer, HallFavoriteSerializer, \
    EventTypeSerializer, HallBookedDateSerializer, UnitSerializer, ModeratedSerializer
from halls.models import HallType, Property, Hall, HallProperty, HallFavorite, EventType, Unit, HallModeratingStatus
from halls.api.permisions import IsOwnerOrAdminOrReadOnly, IsOwnerOrRestrict
from utils import recomender


class PriceUnitViewSet(ModelViewSet):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer


class HallModeratingStatusViewSet(ModelViewSet):
    queryset = HallModeratingStatus.objects.all()
    serializer_class = ModeratedSerializer


class HallTypeViewSet(ModelViewSet):
    serializer_class = HallTypeSerializer
    queryset = HallType.objects.all()


class PropertyViewSet(ModelViewSet):
    serializer_class = PropertySerializer
    queryset = Property.objects.all()


class HallViewSet(ModelViewSet):
    queryset = Hall.objects.all()
    serializer_class = HallSerializer
    permission_classes = [IsOwnerOrAdminOrReadOnly]

    def get_queryset(self):
        queryset = Hall.objects.all()
        hall_name = self.request.query_params.get('hall_name')
        price_from = self.request.query_params.get('price_from')
        price_till = self.request.query_params.get('price_till')
        area_from = self.request.query_params.get('area_from')
        area_till = self.request.query_params.get('area_till')
        capacity_from = self.request.query_params.get('capacity_from')
        capacity_till = self.request.query_params.get('capacity_till')
        event_type = self.request.query_params.get('event_type')
        hall_type = self.request.query_params.get('hall_type')
        filter_from = self.request.query_params.get('order_from')
        filter_till = self.request.query_params.get('order_till')
        moderated = self.request.query_params.get('moderated')

        if hall_name:
            queryset = queryset.filter(hall_type__halls__name__icontains=hall_name)
        if price_till:
            queryset = queryset.filter(price__lt=int(price_till))
        if price_from:
            queryset = queryset.filter(price_min__gt=price_from)
        if area_from:
            queryset = queryset.filter(area_min__gt=int(area_from))
        if area_till:
            queryset = queryset.filter(area__lt=area_till)
        if capacity_from:
            queryset = queryset.filter(capacity_min__gt=capacity_from)
        if capacity_till:
            queryset = queryset.filter(capacity__lt=capacity_till)
        if hall_type:
            queryset = queryset.filter_all_many_to_many('hall_type__id', *hall_type.split(','))
        if event_type:
            queryset = queryset.filter_all_many_to_many('event_type__id', *event_type.split(','))
        if filter_from and filter_till:
            filter_from = datetime.strptime(filter_from, '%Y-%m-%d')
            filter_till = datetime.strptime(filter_till, '%Y-%m-%d')
            halls_with_order = OrderHistory.objects.filter(status__order_status_name='approved',
                                                           end_date__isnull=True).filter(
                (Q(order__order_till__lt=filter_till) & Q(order__order_till__gt=filter_from)) |
                (Q(order__order_from__lt=filter_till) & Q(order__order_till__gt=filter_till))
            ).values_list('order__hall_id', flat=True)
            queryset = queryset.exclude(id__in=halls_with_order)
        if moderated:
            queryset = queryset.filter(moderated=moderated)
        return queryset
    
    
    # def get_serializer_context(self):
    #     return super().get_serializer_context()

    @extend_schema(parameters=[
        OpenApiParameter(name='hall_name', type=OpenApiTypes.STR, required=False,),
        OpenApiParameter(name='price_till', type=OpenApiTypes.DECIMAL, required=False),
        OpenApiParameter(name='price_from', type=OpenApiTypes.DECIMAL, required=False),
        OpenApiParameter(name='area_from', type=OpenApiTypes.DECIMAL, required=False),
        OpenApiParameter(name='area_till', type=OpenApiTypes.DECIMAL, required=False),
        OpenApiParameter(name='capacity_from', type=OpenApiTypes.INT, required=False),
        OpenApiParameter(name='capacity_till', type=OpenApiTypes.INT, required=False),
        OpenApiParameter(name='hall_type', type=OpenApiTypes.STR, required=False,
                         description='comma separated string with hall type ID'),
        OpenApiParameter(name='event_type', type=OpenApiTypes.STR, required=False,
                         description='comma separated string with event type ID'),
        OpenApiParameter(name='order_from', type=OpenApiTypes.DATE, required=False),
        OpenApiParameter(name='order_till', type=OpenApiTypes.DATE, required=False),
        OpenApiParameter(name='moderated', type=OpenApiTypes.BOOL, required=False),
    ])
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return response

    def retrieve(self, request, *args, **kwargs):
        current_datetime = datetime.now()
        user = request.user
        hall = self.get_object()
        hall.increase_view_count()
        # ToDo need to store data about all halls in cache
        data = recomender.load_data()
        recommendations = recomender.recommender(hall.id, data)
        serializer = HallSerializer(hall, many=False, context={'request': self.request})
        serializer_data = serializer.data
        serializer_data.update({'recommendations': recommendations})
        can_make_comment = False
        if user.is_authenticated:
            user_orders = user.orders.filter(hall=hall)
            if user_orders.count() > 0:
                is_order_finished = user.orders.prefetch_related('histories').filter(
                    hall=hall,
                    histories__status__order_status_name='finished',
                    histories__end_date__isnull=True
                ).count()
                if is_order_finished > 0:
                    can_make_comment = True
        serializer_data.update({'canComment': can_make_comment})
        # get active orders
        active_orders = hall.orders.filter(
            histories__status__order_status_name='approved',
            histories__end_date__isnull=True,
            order_from__gt=current_datetime
        ).annotate(
            order_from_date=TruncDate('order_from'),
            order_till_date=TruncDate('order_till')).values(
            'order_from_date', 'order_till_date').annotate(
            order_from=F('order_from_date'),
            order_till=F('order_till_date'))
        active_orders_serializer = HallBookedDateSerializer(instance=active_orders, many=True)
        serializer_data.update({'active_orders': active_orders_serializer.data})
        return Response(serializer_data, status=status.HTTP_200_OK)

    @extend_schema(responses=HallSerializer, request=HallSerializer)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': self.request})
        serializer.is_valid(raise_exception=True)
        # instance = self.perform_create(serializer)
        instance_id = serializer.save()
        return Response(data=instance_id, status=status.HTTP_201_CREATED,)

    def update(self, request, *args, **kwargs):
        data = request.data.copy()
        properties = data.get('properties', None)
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        if properties:
            properties = json.loads(properties)
            properties = {hall_property['property_name']: hall_property['property_value'] for hall_property in
                          properties}
            HallProperty.update_properties(hall_id=instance.id, **properties)
        self.perform_update(serializer)
        return Response(status=status.HTTP_200_OK)

    @action(methods=['delete'], detail=True, url_path='property')
    def delete_property(self, requests, pk=None):
        hall = self.get_object()
        properties = requests.data.get('properties', None)
        if properties:
            HallProperty.delete_properties(hall_id=hall.id, **properties)
            return Response(status=status.HTTP_200_OK)

    @extend_schema(responses=OrderSerializer(many=True))
    @action(methods=['get'], detail=True, url_path='order-date')
    def ordered(self, request, pk=None):
        obj = self.get_object()
        approved_orders = obj.orders.prefetch_related('histories').filter(
            histories__status__order_status_name='approved')
        serializer = OrderSerializer(instance=approved_orders, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False, url_path='filter')
    def filter(self, request):
        resp = {}
        area_agr = Hall.objects.aggregate(min_area=Min('area_min'), max_area=Max('area'))
        capacity_agr = Hall.objects.aggregate(min_capacity=Min('capacity_min'), max_capacity=Max('capacity'))
        price_agr = Hall.objects.aggregate(min_price=Min('price_min'), max_price=Max('price'))
        resp.update(area_agr)
        resp.update(capacity_agr)
        resp.update(price_agr)
        return Response(data=resp, status=status.HTTP_200_OK)

    @action(methods=['get'], detail=True, url_path='analytic', permission_classes=[IsOwnerOrRestrict])
    def analytic(self, request, pk=None):
        hall = self.get_object()
        data = {}
        # воронка продаж
        crater = [
            Hall.objects.filter(id=hall.id).get().view_count,
            Order.objects.filter(hall=hall).count(),
            sum([order.histories.filter(end_date__isnull=True).first().status.order_status_name == 'approved' for order in Order.objects.filter(hall=hall)])]
        data['crater'] = crater
        # средняя цена в сегмента
        hall_types = sorted([h.id for h in hall.hall_type.all()])
        halls_prices = [hall.price for hall in Hall.objects.all() if
                        sorted([h.id for h in hall.hall_type.all()]) == hall_types]
        try:
            avg_price = round(sum(halls_prices) / len(halls_prices), 0)
        except:
            avg_price = 'Средняя цена недоступна'
        data['avg_price_in_segment'] = avg_price
        return Response(data=data, status=status.HTTP_200_OK)



class HallFavoriteViewSet(ModelViewSet):
    queryset = HallFavorite.objects.all()
    serializer_class = HallFavoriteSerializer


class EventTypeViewSet(ModelViewSet):
    queryset = EventType.objects.all()
    serializer_class = EventTypeSerializer
