import React, { useState, useEffect } from 'react';
import { authService } from '../../services/auth.service';
import { User, UserRole } from '../../types/user.types';
import Loading from '../../components/Loading';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    sortBy: 'name',
    order: 'ASC' as 'ASC' | 'DESC',
  });
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [filters, showInactive]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      let data: User[];
      if (showInactive) {
        data = await authService.getInactiveUsers();
      } else {
        data = await authService.getAllUsers(filters);
      }
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await authService.deleteUser(id);
        loadUsers();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao excluir usuário');
      }
    }
  };

  const getStatus = (user: User) => {
    if (!user.lastLoginAt) return 'Nunca logou';
    const lastLogin = new Date(user.lastLoginAt);
    const daysSinceLogin = Math.floor((Date.now() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceLogin > 30 ? 'Inativo' : 'Ativo';
  };

  if (loading) return <Loading />;

  return (
    <div className="user-list-container">
      <h2>Gerenciamento de Usuários</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div className="filters">
        <div className="filter-group">
          <label>Filtrar por função:</label>
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          >
            <option value="">Todos</option>
            <option value="admin">Administrador</option>
            <option value="user">Usuário</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Ordenar por:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          >
            <option value="name">Nome</option>
            <option value="createdAt">Data de cadastro</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Ordem:</label>
          <select
            value={filters.order}
            onChange={(e) => setFilters({ ...filters, order: e.target.value as 'ASC' | 'DESC' })}
          >
            <option value="ASC">Crescente</option>
            <option value="DESC">Decrescente</option>
          </select>
        </div>
        
        <button onClick={() => setShowInactive(!showInactive)}>
          {showInactive ? 'Mostrar Todos' : 'Mostrar Inativos'}
        </button>
      </div>
      
      <table className="user-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Função</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role === 'admin' ? 'Administrador' : 'Usuário'}</td>
              <td>{getStatus(user)}</td>
              <td>
                <button onClick={() => handleDelete(user.id)} className="delete-btn">
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {users.length === 0 && (
        <p className="no-data">Nenhum usuário encontrado.</p>
      )}
    </div>
  );
};

export default UserList;