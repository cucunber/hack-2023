from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from users.models import User, Interest
from halls.api.serializers import HallFavoriteSerializer


class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = ['id', 'interest_name']


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'is_staff',
            'email',
            'first_name',
            'last_name',
            'user_agreement',
            'offer_agreement',
            'show_phone_number',
            'phone_number',
            'job_title',
            'organization',
        ]


class UserForChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id']


class UserRetrieveSerializer(serializers.ModelSerializer):
    favorites = HallFavoriteSerializer(many=True, required=False)
    email = serializers.EmailField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'inn',
            'user_agreement',
            'offer_agreement',
            'show_phone_number',
            'phone_number',
            'favorites',
            'interest',
            'job_title',
            'organization',
            'is_staff',
        ]


class UserRegisterSerializer(serializers.ModelSerializer):
    interest = serializers.PrimaryKeyRelatedField(queryset=Interest.objects.all(), many=True, required=False)
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'inn',
            'email',
            'password',
            'first_name',
            'last_name',
            'user_agreement',
            'offer_agreement',
            'show_phone_number',
            'phone_number',
            'is_staff',
            'interest',
            'job_title',
            'organization',
        ]

    def create(self, validated_data):
        interest = validated_data.pop('interest')
        user = User.objects.create_user(
            **validated_data
        )
        if interest:
            user.interest.set(interest)
        return user
