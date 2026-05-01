from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from .models import Author, Article, ArticleAuthor, Media
from .serializers import (
    AuthorSerializer,
    ArticleSerializer,
    ArticleAuthorSerializer,
    MediaSerializer,
)


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer


class ArticleAuthorViewSet(viewsets.ModelViewSet):
    queryset = ArticleAuthor.objects.all()
    serializer_class = ArticleAuthorSerializer


class MediaViewSet(viewsets.ModelViewSet):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer


# Authorized author list — mirrors src/lib/authorizedAuthors.ts
# TEMPORARY CHANGE AUTH
VALID_AUTHORS = {
    "samiksha gaherwar",
    "eshaan govil",
    "vivian huang",
    "emily yang",
    "nachammai annamalai",
    "anna xie",
    "chinmaya saran",
    "jonathan liu",
    "nuhayd omar",
    "raj patel",
    "charles muehlberger",
    "vishrut thoutam",
    "seojin moon",
    "emilio medina castellanos",
    "grace im",
    "matthew lee",
    "aikhan jumashukurov",
    "reem belafkih",
    "isaac kang",
    "kevin park",
    "ari gomez",
    "deeksha chaudhari",
    "monika mommsen",
    "jeevan sailesh",
    "mathias nguyen-van-duong",
    "miguel pinero-jacome",
    "stephy zhang",
    "lynn morris",
    "tyler pellek",
    "jackie chan",
}


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    """Custom registration endpoint — no external libraries needed."""
    email = request.data.get("email", "").strip()
    password1 = request.data.get("password1", "")
    password2 = request.data.get("password2", "")
    first_name = request.data.get("first_name", "").strip()
    last_name = request.data.get("last_name", "").strip()

    if not email or not password1:
        return Response(
            {"error": "Email and password are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if password1 != password2:
        return Response(
            {"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {"error": "A user with this email already exists."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Check if this person is in the authorized author list
    full_name = f"{first_name} {last_name}".strip().lower()
    is_staff = full_name in VALID_AUTHORS

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password1,
        first_name=first_name,
        last_name=last_name,
        is_staff=is_staff,
    )
    token, _ = Token.objects.get_or_create(user=user)
    return Response(
        {"key": token.key, "is_staff": is_staff}, status=status.HTTP_201_CREATED
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    """Custom login endpoint."""
    email = request.data.get("email", "").strip()
    password = request.data.get("password", "")

    # Authenticate using username=email since we store email as username
    user = authenticate(username=email, password=password)
    if not user:
        return Response(
            {"error": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST
        )

    token, _ = Token.objects.get_or_create(user=user)
    return Response(
        {"key": token.key, "is_staff": user.is_staff}, status=status.HTTP_200_OK
    )
