import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  MenuItem,
  Alert
} from '@mui/material';
import api from '../../services/api';

const GENRES = [
  { value: 'FICCAO', label: 'Ficção' },
  { value: 'NAO_FICCAO', label: 'Não Ficção' },
  { value: 'ROMANCE', label: 'Romance' },
  { value: 'MISTERIO', label: 'Mistério' },
  { value: 'DISTOPIA', label: 'Distopia' },
  { value: 'SATIRA', label: 'Sátira' },
  { value: 'REALISMO_MAGICO', label: 'Realismo Mágico' },
  { value: 'FANTASIA', label: 'Fantasia' }
];

function BookCreate() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    publication_year: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/books/', {
        ...formData,
        publication_year: parseInt(formData.publication_year)
      });
      navigate('/books');
    } catch (error) {
      setError('Erro ao criar livro. Por favor, verifique os dados.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Novo Livro
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Título"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Autor"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          select
          label="Gênero"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        >
          {GENRES.map((genre) => (
            <MenuItem key={genre.value} value={genre.value}>
              {genre.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Ano de Publicação"
          name="publication_year"
          type="number"
          value={formData.publication_year}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Descrição"
          name="description"
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange}
          required
          sx={{ mb: 3 }}
        />

        <Box display="flex" gap={2}>
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
          >
            Criar
          </Button>
          <Button 
            variant="outlined" 
            fullWidth
            onClick={() => navigate('/books')}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default BookCreate;
