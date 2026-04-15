from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("submissions", "0002_author_rename_submitted_at_article_created_at_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="author",
            name="headshot_url",
            field=models.ImageField(
                blank=True,
                max_length=500,
                null=True,
                upload_to="headshots/",
            ),
        ),
        migrations.AlterField(
            model_name="media",
            name="image_url",
            field=models.ImageField(
                max_length=500,
                upload_to="article_media/",
            ),
        ),
    ]
