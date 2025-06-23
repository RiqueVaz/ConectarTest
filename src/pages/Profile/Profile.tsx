import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';
import Loading from '../../components/Loading';

const Profile: React.FC = () => {
  const { user, login } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, password: '' });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const updateData: any = { name: formData.name };
      if (formData.password) {
        updateData.password = formData.password;
      }

      const updatedUser = await authService.updateProfile(updateData);
      login(updatedUser, localStorage.getItem('token') || '');
      setSuccess('Perfil atualizado com sucesso!');
      setEditMode(false);
      setFormData({ ...formData, password: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Loading />;

  return (
    <div className="profile-container">
      <h2>Meu Perfil</h2>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      {!editMode ? (
        <div className="profile-info">
          {user.avatar && (
            <div className="avatar-container">
              <img src={user.avatar} alt={user.name} className="user-avatar" />
            </div>
          )}
          <p><strong>Nome:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Função:</strong> {user.role === 'admin' ? 'Administrador' : 'Usuário'}</p>
          <p><strong>Login via:</strong> {user.provider === 'local' ? 'Email/Senha' : user.provider}</p>
          <p><strong>Cadastrado em:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          <button onClick={() => setEditMode(true)}>Editar Perfil</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          {user.provider === 'local' && (
            <div className="form-group">
              <label>Nova Senha (opcional):</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                minLength={6}
              />
            </div>
          )}
          
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" onClick={() => setEditMode(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;