import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from '../../components/LoginForm';
import { Box, Typography } from '@mui/material';


function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (username: string, password: string) => {
    try {
      await login(username, password);
      navigate('/books');
    } catch (error) {
      throw error;
    }
  };


  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Typography variant="h4" sx={{ mb: 4 }}>
        Login
      </Typography>
      <LoginForm onSubmit={handleLogin} />
    </Box>
  );
}

export default LoginPage;