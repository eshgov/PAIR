from django.db import models


class Author(models.Model):
    AFFILIATION_CHOICES = [
        ("undergrad", "Undergrad"),
        ("grad", "Grad"),
        ("faculty", "Faculty"),
        ("other", "Other"),
    ]

    full_name = models.CharField(max_length=255, default="")
    email = models.EmailField(unique=True)
    affiliation = models.CharField(
        max_length=20, choices=AFFILIATION_CHOICES, default="other"
    )
    class_year = models.IntegerField(null=True, blank=True)
    major_department = models.CharField(max_length=255, blank=True, default="")
    bio = models.TextField(blank=True, default="")
    headshot_url = models.URLField(null=True, blank=True)
    linkedin_url = models.URLField(null=True, blank=True)
    twitter_url = models.URLField(null=True, blank=True)
    website_url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} ({self.email})"


class Article(models.Model):
    SECTION_CHOICES = [
        ("technical", "Technical"),
        ("opinion", "Opinion"),
        ("creative", "Creative"),
        ("interview", "Interview"),
        ("humor", "Humor"),
        ("spotlight", "Spotlight"),
    ]

    PUBLICATION_CHOICES = [
        ("asap", "ASAP"),
        ("next_issue", "Next Issue"),
        ("flexible", "Flexible"),
    ]

    title = models.CharField(max_length=500, default="")
    subtitle = models.CharField(max_length=500, blank=True, default="")
    section = models.CharField(
        max_length=20, choices=SECTION_CHOICES, default="technical"
    )
    tags = models.CharField(
        max_length=500, blank=True, default="", help_text="Comma-separated tags"
    )
    abstract = models.TextField(blank=True, default="")
    estimated_read_time = models.IntegerField(null=True, blank=True)
    publication_preference = models.CharField(
        max_length=20, choices=PUBLICATION_CHOICES, default="flexible"
    )
    body = models.TextField(default="")
    acknowledgements = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class ArticleAuthor(models.Model):
    article = models.ForeignKey(
        Article, on_delete=models.CASCADE, related_name="article_authors"
    )
    author = models.ForeignKey(
        Author,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="article_authors",
    )
    is_primary = models.BooleanField(default=False)
    external_name = models.CharField(max_length=255, blank=True, default="")
    external_email = models.EmailField(blank=True, default="")
    external_class_year = models.IntegerField(null=True, blank=True)

    def __str__(self):
        if self.author:
            return f"{self.author.full_name} — {self.article.title}"
        return f"{self.external_name} (external) — {self.article.title}"


class Media(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name="media")
    image_url = models.URLField(max_length=2000)
    caption = models.CharField(max_length=500, blank=True, default="")
    alt_text = models.CharField(max_length=500, blank=True, default="")
    credit = models.CharField(max_length=255, blank=True, default="")
    is_cover = models.BooleanField(default=False)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"Media for {self.article.title} ({'cover' if self.is_cover else f'image {self.order}'})"
