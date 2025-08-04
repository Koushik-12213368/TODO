const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Authentication endpoints
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Create new user
    const user = {
      id: nextUserId++,
      username,
      password,
      createdAt: new Date()
    };
    users.push(user);
    
    res.status(201).json({ message: 'User created successfully', username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }
    
    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // Check password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    res.json({ message: 'Login successful', username: user.username, userId: user.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// In-memory storage
let todos = [];
let users = [];
let nextId = 1;
let nextUserId = 1;

// Helper function to find todo by ID
const findTodoById = (id) => todos.find(todo => todo.id === id);

app.get('/api/todos', async (req, res) => {
  try {
    // Get all todos, sorted by creation date (newest first)
    const sortedTodos = todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sortedTodos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const { title, description, author } = req.body;
    if (!title || !author) {
      return res.status(400).json({ message: 'Title and author required' });
    }
    
    // Verify user exists
    const user = users.find(u => u.username === author);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    
    const todo = {
      id: nextId++,
      title,
      description,
      author,
      authorId: user.id,
      completed: false,
      createdAt: new Date(),
      _id: nextId - 1 // For compatibility with MongoDB _id
    };
    
    todos.push(todo);
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, author } = req.body;
    
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));
    if (todoIndex === -1) return res.status(404).json({ message: 'Todo not found' });
    
    const todo = todos[todoIndex];
    if (todo.author !== author) return res.status(403).json({ message: 'Not authorized' });
    
    const updatedTodo = {
      ...todo,
      title: title || todo.title,
      description: description !== undefined ? description : todo.description,
      completed: completed !== undefined ? completed : todo.completed
    };
    
    todos[todoIndex] = updatedTodo;
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { author } = req.body;
    
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));
    if (todoIndex === -1) return res.status(404).json({ message: 'Todo not found' });
    
    const todo = todos[todoIndex];
    if (todo.author !== author) return res.status(403).json({ message: 'Not authorized' });
    
    todos.splice(todoIndex, 1);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Using in-memory storage (no MongoDB required)`);
  console.log(`🌐 API available at http://localhost:${PORT}`);
}); 