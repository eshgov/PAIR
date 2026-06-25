import sys
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'journal.settings')
django.setup()

from django.contrib.auth.models import User
from submissions.models import Author

print("USERS:")
for u in User.objects.all():
    print(f"ID: {u.id}, Email: '{u.email}', Username: '{u.username}'")

print("\nAUTHORS:")
for a in Author.objects.all():
    print(f"ID: {a.id}, Email: '{a.email}', Name: '{a.full_name}'")
