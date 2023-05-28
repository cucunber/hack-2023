from rest_framework.viewsets import ModelViewSet

from comments.api.serializers import CommentSerializer
from comments.models import Comment


class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
