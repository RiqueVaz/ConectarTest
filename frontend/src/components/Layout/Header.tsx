import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <h1>Sistema de Usuários</h1>
        {user && (
          <nav>
            <span>Olá, {user.name}</span>
            <Link to="/profile">Perfil</Link>
            {isAdmin && <Link to="/users">Usuários</Link>}
            <button onClick={handleLogout}>Sair</button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;