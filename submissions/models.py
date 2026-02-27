from django.contrib.auth.models import User
from django.db import models


class Article(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("submitted", "Submitted"),
        ("under_review", "Under Review"),
        ("revision", "Revision Requested"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
    ]

    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=300)
    abstract = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class ArticleFile(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    file = models.FileField(upload_to="manuscripts/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
