import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  date_joined: string;
}

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user?.is_staff) {
    navigate('/books');
    return null;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/');
        const userData = Array.isArray(response.data) ? response.data : response.data.results;
        setUsers(userData || []);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        setUsers([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: number) => {
    try {
      await api.delete(`/users/${userId}/`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError('Erro ao deletar usuário');
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center" gap={2}>
          <Button 
            variant="outlined"
            onClick={() => navigate('/books')}
          >
            Voltar
          </Button>
          <Typography variant="h4">
            Usuários
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          onClick={() => navigate('/users/create')}
        >
          Novo Usuário
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Data de Cadastro</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(users) && users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.is_staff ? 'Sim' : 'Não'}</TableCell>
                <TableCell>
                  {(() => {
                    try {
                      return new Date(user.date_joined).toLocaleDateString('pt-BR');
                    } catch {
                      return '-';
                    }
                  })()}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => navigate(`/users/${user.id}/edit`)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Deletar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default UserList;
