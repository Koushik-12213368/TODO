# ✨ Todo Master (MERN + Redux)

A beautiful, full-featured Todo app built with the MERN stack, Redux Toolkit, and image upload support. Manage todos, attach images, and collaborate with multiple users—all in a modern, responsive UI.

---

## 🚀 Features

- **User Authentication** (register/login/logout)
- **Redux State Management** (Redux Toolkit)
- **Create, Read, Update, Delete Todos**
- **Image Uploads** (attach images to todos)
- **Multi-User Support** (see all users' todos, edit only your own)
- **Responsive, Modern UI** (custom CSS, animations)
- **Ownership & Permissions** (edit/delete only your todos)
- **Optimistic UI & Loading States**
- **Comprehensive Error Handling**

---

## 🏗️ Tech Stack

- **Frontend:** React 18, Redux Toolkit, Axios
- **Backend:** Node.js, Express, Multer
- **Database:** MongoDB (local or Atlas)
- **Styling:** Custom CSS (see `client/src/styles.css`)

---

## ⚡ Quick Start

### 1. **Clone & Install**
```bash
git clone https://github.com/Koushik-12213368/TODO
cd TODO
npm install
cd client
npm install
cd ..
```

### 2. **Start MongoDB**
- **Local:** Ensure MongoDB is running on `mongodb://localhost:27017/todo-app`
- **Atlas:** Set `MONGODB_URI` in a `.env` file

### 3. **Run the App**
```bash
npm run dev
```
- Client: [http://localhost:3000](http://localhost:3000)
- Server: [http://localhost:5001](http://localhost:5001)

**Or, run separately:**
```bash
npm run server   # in one terminal
npm run client   # in another terminal
```

### 4. **In-Memory Mode (No MongoDB Needed)**
```bash
npm run dev:memory
```

---

## 📝 Usage

1. **Register** a new account or login
2. **Create todos** with title, description, and optional image
3. **View all todos** (yours and others')
4. **Edit/delete** only your own todos
5. **Mark todos** as complete/incomplete
6. **Logout** to end your session

---

## 🔄 Workflow

- **User Auth:** Register/Login → Redux → API → MongoDB
- **Add Todo:** Form → Image Upload (if any) → API → MongoDB → Redux → UI
- **View Todos:** Redux fetches all todos → UI shows ownership, images, and actions
- **Edit/Delete:** Only for your own todos (server-verified)
- **Image Handling:** Multer saves images to `/uploads`, served statically

---

## 📁 Project Structure

```
TODO/
├── server.js            # Express backend
├── server-memory.js     # In-memory backend (no DB)
├── package.json         # Server dependencies
├── client/
│   ├── package.json     # Client dependencies
│   ├── src/
│   │   ├── app.js       # Main entry (Redux wrapper)
│   │   ├── app-redux.js # Main Redux-powered component
│   │   ├── styles.css   # Modern CSS styles
│   │   └── store/       # Redux store & slices
│   └── public/
│       └── index.html
└── uploads/             # Uploaded images
```

---

## 🛠️ Troubleshooting

- **Port in use:**
  - Run `taskkill /F /IM node.exe` (Windows) or kill the process using port 5001/3000
- **MongoDB not running:**
  - Use `npm run dev:memory` for in-memory mode
- **Image upload fails:**
  - Ensure `uploads/` directory exists and is writable
- **Redux DevTools:**
  - Install the Redux DevTools browser extension for debugging

---

## 🎨 Screenshots

> ![Login/Register](docs/screenshot-auth.png)
> ![Main App](docs/screenshot-main.png)
> ![Image Upload](docs/screenshot-image.png)

---

## 📚 Credits & License

- Built with ❤️ by Koushik
- MIT License

---

## ✨ Enjoy your modern, collaborative Todo app! ✨
