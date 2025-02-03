import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Alert,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Stack
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  publication_year: number;
  description: string;
  views_count?: number;
  created_at?: string;
}

interface Filters {
  author: string;
  genre: string;
  year: string;
  ordering: string;
}

const GENRES = [
  { value: '', label: 'Todos' },
  { value: 'FICTION', label: 'Ficção' },
  { value: 'NON_FICTION', label: 'Não Ficção' },
  { value: 'ROMANCE', label: 'Romance' },
  { value: 'MYSTERY', label: 'Mistério' },
];

const ORDERING_OPTIONS = [
  { value: '-publication_year', label: 'Mais recentes' },
  { value: 'publication_year', label: 'Mais antigos' },
  { value: '-views_count', label: 'Mais populares' },
  { value: 'title', label: 'Título (A-Z)' },
  { value: '-title', label: 'Título (Z-A)' },
];

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<Filters>({
    author: '',
    genre: '',
    year: '',
    ordering: '-publication_year'
  });
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (filters.author) params.append('author', filters.author);
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.year) params.append('publication_year', filters.year);
      if (filters.ordering) params.append('ordering', filters.ordering);

      const response = await api.get(`/books/?${params.toString()}`);
      const booksArray = Array.isArray(response.data.results) 
        ? response.data.results 
        : Array.isArray(response.data) 
          ? response.data 
          : [];
      
      setBooks(booksArray);
    } catch (err) {
      setError('Erro ao carregar os livros');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [filters]);

  const handleInputChange = (field: keyof Filters) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSelectChange = (field: keyof Filters) => (
    event: SelectChangeEvent
  ) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBook(null);
  };

  const handleDeleteClick = (id: number) => {
    setBookToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (bookToDelete) {
      try {
        await api.delete(`/books/${bookToDelete}/`);
        setBooks(prevBooks => prevBooks.filter(book => book.id !== bookToDelete));
        setDeleteDialogOpen(false);
      } catch (error) {
        console.error('Erro ao deletar livro:', error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setBookToDelete(null);
  };

  const handleEditClick = (book: Book) => {
    setEditingBook(book);
    setEditDialogOpen(true);
  };

  const handleEditConfirm = async () => {
    if (editingBook) {
      try {
        await api.put(`/books/${editingBook.id}/`, editingBook);
        setBooks(prevBooks => 
          prevBooks.map(book => 
            book.id === editingBook.id ? editingBook : book
          )
        );
        setEditDialogOpen(false);
        setEditingBook(null);
      } catch (error) {
        console.error('Erro ao editar livro:', error);
      }
    }
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditingBook(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">
          Livros
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            onClick={() => navigate('/books/create')}
            sx={{ mr: 2 }}
          >
            Novo Livro
          </Button>
          {user?.is_staff && (
            <>
              <Button 
                variant="contained"
                color="secondary"
                onClick={() => navigate('/users')}
                sx={{ mr: 2 }}
              >
                Usuários
              </Button>
              <Button 
                variant="contained"
                color="secondary"
                onClick={() => navigate('/users/create')}
                sx={{ mr: 2 }}
              >
                Criar Usuário
              </Button>
            </>
          )}
          <Button 
            variant="outlined" 
            color="error"
            onClick={logout}
          >
            Sair
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Autor"
              value={filters.author}
              onChange={handleInputChange('author')}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Gênero</InputLabel>
              <Select
                value={filters.genre}
                label="Gênero"
                onChange={handleSelectChange('genre')}
              >
                {GENRES.map(genre => (
                  <MenuItem key={genre.value} value={genre.value}>
                    {genre.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Ano"
              type="number"
              value={filters.year}
              onChange={handleInputChange('year')}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={filters.ordering}
                label="Ordenar por"
                onChange={handleSelectChange('ordering')}
              >
                {ORDERING_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Autor</TableCell>
              <TableCell>Gênero</TableCell>
              <TableCell>Ano</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(books) && books.length > 0 ? (
              books.map((book: Book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell>{book.publication_year}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleEditClick(book)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(book.id)}
                      >
                        Deletar
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Nenhum livro encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {selectedBook && (
          <>
            <DialogTitle>
              {selectedBook.title}
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Typography>
                  <strong>Autor:</strong> {selectedBook.author}
                </Typography>
                <Typography>
                  <strong>Gênero:</strong> {selectedBook.genre}
                </Typography>
                <Typography>
                  <strong>Ano de Publicação:</strong> {selectedBook.publication_year}
                </Typography>
                <Typography>
                  <strong>Descrição:</strong>
                </Typography>
                <Typography>
                  {selectedBook.description}
                </Typography>
                {selectedBook.views_count !== undefined && (
                  <Typography>
                    <strong>Visualizações:</strong> {selectedBook.views_count}
                  </Typography>
                )}
                {selectedBook.created_at && (
                  <Typography>
                    <strong>Adicionado em:</strong>{' '}
                    {new Date(selectedBook.created_at).toLocaleDateString('pt-BR')}
                  </Typography>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Fechar
              </Button>
              {user?.is_staff && (
                <Button 
                  onClick={() => {
                    handleCloseDialog();
                    navigate(`/books/${selectedBook.id}/edit`);
                  }}
                  color="primary"
                  variant="contained"
                >
                  Editar
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmar Deleção
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Tem certeza que deseja deletar este livro? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Deletar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={handleEditCancel}
        aria-labelledby="edit-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="edit-dialog-title">
          Editar Livro
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2, pb: 2 }}>
            <TextField
              label="Título"
              fullWidth
              value={editingBook?.title || ''}
              onChange={(e) => setEditingBook(prev => 
                prev ? { ...prev, title: e.target.value } : null
              )}
            />
            <TextField
              label="Autor"
              fullWidth
              value={editingBook?.author || ''}
              onChange={(e) => setEditingBook(prev => 
                prev ? { ...prev, author: e.target.value } : null
              )}
            />
            <TextField
              label="Ano de Publicação"
              type="number"
              fullWidth
              value={editingBook?.publication_year || ''}
              onChange={(e) => setEditingBook(prev => 
                prev ? { ...prev, publication_year: Number(e.target.value) } : null
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleEditCancel}>
            Cancelar
          </Button>
          <Button onClick={handleEditConfirm} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default BookList;
