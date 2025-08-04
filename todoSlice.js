import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/todos');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch todos');
    }
  }
);

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async ({ title, description, author, imageFile }, { rejectWithValue }) => {
    try {
      let imageUrl = '';
      
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadResponse = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        imageUrl = uploadResponse.data.imageUrl;
      }

      const response = await axios.post('/api/todos', {
        title,
        description,
        author,
        imageUrl,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add todo');
    }
  }
);

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async ({ id, title, description, completed, author }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/todos/${id}`, {
        title,
        description,
        completed,
        author,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update todo');
    }
  }
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async ({ id, author }, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/todos/${id}`, { data: { author } });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete todo');
    }
  }
);

const initialState = {
  todos: [],
  loading: false,
  error: null,
  uploading: false,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUploading: (state, action) => {
      state.uploading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch todos
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
        state.error = null;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add todo
      .addCase(addTodo.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.uploading = false;
        state.todos.unshift(action.payload);
        state.error = null;
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })
      // Update todo
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex(todo => todo._id === action.payload._id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete todo
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter(todo => todo._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, setUploading } = todoSlice.actions;
export default todoSlice.reducer; 