import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Chat from './components/Chat/Chat';
import Login from './components/Login';
import Register from './components/Register';
import Home from './routes/Home';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <nav>
          <ul>
            <li><Link to='/' >Home</Link></li>
            <li><Link to='chat'>Messages</Link></li>
            <li><Link to='register' >Register</Link></li>
            <li><Link to='login' >Login</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path='/' >
            <Route index element={<Home />} />
            <Route path='chat' element={<Chat />} />
            <Route path='register' element={<Register />} />
            <Route path='login' element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
