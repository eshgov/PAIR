from rest_framework import serializers
from .models import Author, Article, ArticleAuthor, Media


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = "__all__"


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = "__all__"


class ArticleAuthorSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = ArticleAuthor
        fields = "__all__"

    def get_author_name(self, obj):
        if obj.author:
            return obj.author.full_name
        return obj.external_name


class ArticleSerializer(serializers.ModelSerializer):
    article_authors = ArticleAuthorSerializer(many=True, read_only=True)
    media = MediaSerializer(many=True, read_only=True)

    class Meta:
        model = Article
        fields = "__all__"
