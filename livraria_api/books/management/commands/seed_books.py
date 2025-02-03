from django.core.management.base import BaseCommand
from books.models import Book

class Command(BaseCommand):
    help = 'Seed the database with books'

    def handle(self, *args, **kwargs):
        books_data = [
            {
                "title": "Dom Casmurro",
                "author": "Machado de Assis",
                "genre": "FICÇÃO",
                "publication_year": 1899,
                "description": "Um dos romances mais famosos da literatura brasileira, que narra a história de Bentinho e seu ciúme por Capitu."
            },
            {
                "title": "O Senhor dos Anéis",
                "author": "J.R.R. Tolkien",
                "genre": "FICÇÃO",
                "publication_year": 1954,

                "description": "Uma saga épica de fantasia que narra a jornada de Frodo para destruir o Um Anel."
            },
            {
                "title": "Harry Potter e a Pedra Filosofal",
                "author": "J.K. Rowling",
                "genre": "FICÇÃO",
                "publication_year": 1997,

                "description": "Harry Potter descobre que é um bruxo e começa sua jornada na Escola de Magia e Bruxaria de Hogwarts."
            },
            {
                "title": "Harry Potter e a Câmara Secreta",
                "author": "J.K. Rowling",
                "genre": "FICÇÃO",
                "publication_year": 1998,

                "description": "Em seu segundo ano em Hogwarts, Harry enfrenta o mistério da Câmara Secreta e o herdeiro de Slytherin."
            },
            {
                "title": "Harry Potter e o Prisioneiro de Azkaban",
                "author": "J.K. Rowling",
                "genre": "FICÇÃO",
                "publication_year": 1999,
                "description": "Harry descobre a verdade sobre seu padrinho, Sirius Black, e o traidor que levou à morte de seus pais."

            },
            {
                "title": "1984",
                "author": "George Orwell",
                "genre": "DISTOPIA",
                "publication_year": 1949,
                "description": "Uma visão sombria de um futuro totalitário sob vigilância constante do Grande Irmão."

            },
            {
                "title": "O Pequeno Príncipe",
                "author": "Antoine de Saint-Exupéry",
                "genre": "FICÇÃO",
                "publication_year": 1943,

                "description": "Uma história encantadora sobre amizade, amor e o significado da vida, contada através das aventuras de um pequeno príncipe."
            },
            {
                "title": "A Revolução dos Bichos",
                "author": "George Orwell",
                "genre": "SÁTIRA",
                "publication_year": 1945,

                "description": "Uma fábula política sobre o poder e a corrupção, simbolizando a Revolução Russa e seus desdobramentos."
            },
            {
                "title": "Cem Anos de Solidão",
                "author": "Gabriel García Márquez",
                "genre": "REALISMO MÁGICO",
                "publication_year": 1967,
                "description": "A saga da família Buendía na cidade fictícia de Macondo, repleta de elementos de realismo mágico."
            },

            {
                "title": "O Nome do Vento",
                "author": "Patrick Rothfuss",
                "genre": "FANTASIA",
                "publication_year": 2007,
                "description": "A história de Kvothe, um jovem prodígio da magia, narrada por ele mesmo em uma pousada afastada."

            }
        ]

        for book_data in books_data:
            Book.objects.get_or_create(
                title=book_data['title'],
                defaults=book_data
            )
            self.stdout.write(f"Created book: {book_data['title']}")

        self.stdout.write(self.style.SUCCESS('Successfully seeded books'))