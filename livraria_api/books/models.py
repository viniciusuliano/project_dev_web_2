from django.db import models
from django.contrib.auth.models import User

class Book(models.Model):
    GENRE_CHOICES = [
        ('FICCAO', 'Ficção'),
        ('NAO_FICCAO', 'Não Ficção'),
        ('ROMANCE', 'Romance'),
        ('MISTERIO', 'Mistério'),
        ('DISTOPIA', 'Distopia'),
        ('SATIRA', 'Sátira'),
        ('REALISMO_MAGICO', 'Realismo Mágico'),
        ('FANTASIA', 'Fantasia'),
    ]

    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    genre = models.CharField(max_length=50, choices=GENRE_CHOICES)
    publication_year = models.IntegerField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title