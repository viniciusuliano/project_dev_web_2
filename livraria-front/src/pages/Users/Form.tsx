import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import api from '../../services/api';

interface UserFormData {
  username: string;
  email: string;
  password: string;
  is_staff: boolean;
}

function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    password: '',
    is_staff: false
  });

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await api.get(`/users/${id}/`);
          const { password, ...userData } = response.data;
          setFormData({ ...userData, password: '' });
        } catch (err) {
          setError('Erro ao carregar usuário');
        }
      };
      fetchUser();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/users/${id}/`, formData);
      } else {
        await api.post('/users/', formData);
      }
      navigate('/users');
    } catch (err) {
      setError('Erro ao salvar usuário');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        {id ? 'Editar Usuário' : 'Novo Usuário'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Senha"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required={!id}
          sx={{ mb: 2 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              name="is_staff"
              checked={formData.is_staff}
              onChange={handleChange}
            />
          }
          label="É administrador?"
          sx={{ mb: 3 }}
        />

        <Box display="flex" gap={2}>
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
          >
            {id ? 'Atualizar' : 'Criar'}
          </Button>
          <Button 
            variant="outlined" 
            fullWidth
            onClick={() => navigate('/users')}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default UserForm;
