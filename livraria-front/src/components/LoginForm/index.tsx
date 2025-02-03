import { useState } from 'react';
import { Box, TextField, Button, Alert } from '@mui/material';

interface LoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>;
}

function LoginForm({ onSubmit }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(username, password);
    } catch (err) {
      setError('Usuário ou senha inválidos');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 300,
        width: '100%',
      }}
    >
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
      />
      <Button type="submit" variant="contained" fullWidth>
        Entrar
      </Button>
    </Box>
  );
}

export default LoginForm;