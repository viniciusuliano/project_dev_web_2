from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as django_filters
from .models import Book
from .serializers import BookSerializer
from .permissions import IsAdminOrReadOnly

class BookFilter(django_filters.FilterSet):
    genre = django_filters.CharFilter(field_name='genre', lookup_expr='iexact')
    author = django_filters.CharFilter(field_name='author', lookup_expr='icontains')
    publication_year = django_filters.NumberFilter(field_name='publication_year', lookup_expr='exact')
    
    class Meta:
        model = Book
        fields = ['genre', 'author', 'publication_year']

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = BookFilter
    search_fields = ['title', 'author']
    ordering_fields = ['title', 'author', 'publication_year', 'views_count']

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_me(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)
