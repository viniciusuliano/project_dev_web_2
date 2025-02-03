from django.contrib import admin
from .models import Book

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'genre', 'publication_year', 'views_count')
    list_filter = ('genre', 'publication_year')
    search_fields = ('title', 'author')