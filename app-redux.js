import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  clearError, 
  clearMessage 
} from './store/slices/authSlice';
import { 
  fetchTodos, 
  addTodo, 
  updateTodo, 
  deleteTodo 
} from './store/slices/todoSlice';
import { 
  setImagePreview, 
  clearImagePreview, 
  toggleAuthMode, 
  setAuthMode 
} from './store/slices/uiSlice';
import './styles.css';

function AppRedux() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error, message } = useAppSelector(state => state.auth);
  const { todos, uploading } = useAppSelector(state => state.todos);
  const { imagePreview, isLogin } = useAppSelector(state => state.ui);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchTodos());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (error) {
      setTimeout(() => dispatch(clearError()), 5000);
    }
    if (message) {
      setTimeout(() => dispatch(clearMessage()), 5000);
    }
  }, [error, message, dispatch]);

  const handleAuthSubmit = async () => {
    if (isLogin) {
      await dispatch(loginUser({ username: usernameInput, password: passwordInput }));
    } else {
      await dispatch(registerUser({ username: usernameInput, password: passwordInput }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, GIF, etc.)');
        return;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size must be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        dispatch(setImagePreview(e.target.result));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTodo = async () => {
    if (!title || !user) {
      alert("Title and login required");
      return;
    }

    await dispatch(addTodo({ title, description, author: user, imageFile }));
    
    // Clear form
    setTitle('');
    setDescription('');
    setImageFile(null);
    dispatch(clearImagePreview());
  };

  const handleToggleComplete = async (todo) => {
    await dispatch(updateTodo({
      id: todo._id,
      title: todo.title,
      description: todo.description,
      completed: !todo.completed,
      author: user,
    }));
  };

  const handleDeleteTodo = async (id) => {
    await dispatch(deleteTodo({ id, author: user }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">
              {isLogin ? 'Welcome Back!' : 'Join Us Today!'}
            </h1>
            <p className="auth-subtitle">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>
          
          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); handleAuthSubmit(); }}>
            <div className="input-group">
              <input 
                className="auth-input"
                placeholder="Username" 
                value={usernameInput} 
                onChange={(e) => setUsernameInput(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <input 
                className="auth-input"
                type="password" 
                placeholder="Password" 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)}
                required
              />
            </div>
            
            <button 
              className="auth-button"
              onClick={handleAuthSubmit} 
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <span className="loading-spinner">⏳</span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>
          
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          
          <div className="auth-switch">
            <button 
              className="switch-button"
              onClick={() => dispatch(toggleAuthMode())}
            >
              {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">✨ Todo Master</h1>
          <div className="user-info">
            <span className="welcome-text">Welcome, <strong>{user}</strong></span>
            <button className="logout-button" onClick={handleLogout}>
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="todo-form-container">
          <h2 className="section-title">Add New Todo</h2>
          <div className="todo-form">
            <div className="form-row">
              <input 
                className="todo-input"
                placeholder="What needs to be done?" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>
            
            <div className="form-row">
              <textarea 
                className="todo-textarea"
                placeholder="Add a description (optional)" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows="3"
              />
            </div>
            
            <div className="form-row">
              <div className="file-upload-container">
                <label className="file-upload-label">
                  <span className="upload-icon">📷</span>
                  <span>Add Image</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange} 
                    className="file-input"
                  />
                </label>
              </div>
            </div>
            
            {imagePreview && (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Preview" className="image-preview" />
                <button 
                  className="remove-image-button"
                  onClick={() => { setImageFile(null); dispatch(clearImagePreview()); }}
                >
                  ❌ Remove
                </button>
              </div>
            )}
            
            <button 
              className="add-todo-button"
              onClick={handleAddTodo} 
              disabled={uploading || !title.trim()}
            >
              {uploading ? (
                <span className="loading-spinner">⏳</span>
              ) : (
                <span>➕ Add Todo</span>
              )}
            </button>
          </div>
        </div>

        <div className="todos-section">
          <h2 className="section-title">
            Your Todos ({todos.filter(t => t.author === user).length} yours, {todos.length} total)
          </h2>
          
          {todos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No todos yet!</h3>
              <p>Create your first todo to get started</p>
            </div>
          ) : (
            <div className="todos-grid">
              {todos.map(todo => (
                <div 
                  key={todo._id} 
                  className={`todo-card ${todo.completed ? 'completed' : ''} ${todo.author === user ? 'own-todo' : 'other-todo'}`}
                >
                  <div className="todo-header">
                    <h3 className="todo-title">
                      {todo.title}
                      {todo.completed && <span className="completion-icon">✅</span>}
                    </h3>
                    {todo.author === user && <span className="ownership-badge">Yours</span>}
                  </div>
                  
                  {todo.description && (
                    <p className="todo-description">{todo.description}</p>
                  )}
                  
                  {todo.imageUrl && (
                    <div className="todo-image-container">
                      <img 
                        src={todo.imageUrl} 
                        alt="todo-img" 
                        className="todo-image"
                      />
                    </div>
                  )}
                  
                  <div className="todo-footer">
                    <span className="todo-author">By: {todo.author}</span>
                    
                    {todo.author === user ? (
                      <div className="todo-actions">
                        <button 
                          className={`action-button ${todo.completed ? 'undo-button' : 'complete-button'}`}
                          onClick={() => handleToggleComplete(todo)}
                        >
                          {todo.completed ? '↩️ Undo' : '✅ Complete'}
                        </button>
                        <button 
                          className="action-button delete-button"
                          onClick={() => handleDeleteTodo(todo._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    ) : (
                      <span className="read-only-badge">Read-only</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AppRedux; 