from django.db import migrations, models


class Migration(migrations.Migration):
    """
    Reverts ImageField back to URLField.
    Image uploads now go directly from the browser to Supabase via the
    Next.js /api/upload route. Django only stores the resulting public URL.
    """

    dependencies = [
        ("submissions", "0003_imagefield_supabase_storage"),
    ]

    operations = [
        migrations.AlterField(
            model_name="author",
            name="headshot_url",
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="media",
            name="image_url",
            field=models.URLField(max_length=2000),
        ),
    ]
