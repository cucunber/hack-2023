from halls.models import Hall
from users.api.serializers import UserForChatSerializer
from chat.models import Conversation, Message
from rest_framework import serializers

from users.models import User
from users.api.serializers import UserRetrieveSerializer


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        exclude = ('conversation',)


class ConversationListSerializer(serializers.ModelSerializer):
    initiator = UserForChatSerializer()
    receiver = UserForChatSerializer()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['initiator', 'receiver', 'last_message']

    def get_last_message(self, instance):
        message = instance.message_set.first()
        return MessageSerializer(instance=message)


class ConversationCreateSerializer(serializers.ModelSerializer):
    user_from = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=True, many=False)
    hall = serializers.PrimaryKeyRelatedField(queryset=Hall.objects.all(), required=True, many=False)

    class Meta:
        model = Conversation
        fields = ['id', 'user_from', 'hall']


class ConversationSerializer(serializers.ModelSerializer):
    # user_from = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=True, many=False)
    # user_to = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=True, many=False)
    # hall = serializers.PrimaryKeyRelatedField(many=False, required=True, queryset=Hall.objects.all())
    # message_set = MessageSerializer(many=True)
    messages = MessageSerializer(many=True, read_only=True,)
    hall_owner = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'user_from', 'user_to', 'hall', 'messages', 'hall_owner']

    def get_hall_owner(self, obj):
        return UserRetrieveSerializer(instance=obj.hall.owner).data
