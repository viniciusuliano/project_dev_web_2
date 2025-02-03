import './App.css'
import LoginPage from './pages/Login';
import BookList from './pages/Books';
import BookCreate from './pages/Books/Create';
import UserList from './pages/Users';
import UserForm from './pages/Users/Form';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rotas protegidas para usuários logados */}
          <Route element={<PrivateRoute />}>
            <Route path="/books" element={<BookList />} />
            <Route path="/books/create" element={<BookCreate />} />
          </Route>

          {/* Rotas protegidas para administradores */}
          <Route element={<AdminRoute />}>
            <Route path="/users" element={<UserList />} />
            <Route path="/users/create" element={<UserForm />} />
            <Route path="/users/:id/edit" element={<UserForm />} />
          </Route>

          <Route path="/" element={<Navigate to="/books" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App