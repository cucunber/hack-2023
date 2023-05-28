from chat.models import Conversation
from rest_framework import status
from rest_framework.response import Response

from halls.models import Hall
from users.models import User
from chat.api.serializers import ConversationSerializer, ConversationCreateSerializer
from rest_framework.viewsets import ModelViewSet


class ConversationViewSet(ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

    def get_serializer_class(self):
        if self.action == 'create'"":
            return ConversationCreateSerializer
        return ConversationSerializer

    def create(self, request, *args, **kwargs):
        # when user start chat we create conversation with receiver transmitter and hall_id
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user_from = serializer.validated_data.get('user_from')
        hall = serializer.validated_data.get('hall')
        user_to = request.user

        conversation = Conversation.objects.filter(hall_id=hall, user_from=user_from, user_to=user_to)

        if conversation.count() > 0:
            return Response(ConversationSerializer(conversation.first()).data, status=status.HTTP_200_OK)
        conversation = Conversation.objects.create(hall=hall, user_from=user_from, user_to=user_to)
        return Response(ConversationSerializer(conversation).data, status=status.HTTP_200_OK)
