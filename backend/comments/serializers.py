from rest_framework import serializers
from .models import Comment
from accounts.serializers import UserSerializer


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model  = Comment
        fields = ['id', 'ticket', 'author', 'body', 'is_internal', 'created_at', 'updated_at']
        read_only_fields = ['id', 'ticket', 'author', 'created_at', 'updated_at']


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Comment
        fields = ['body', 'is_internal']
