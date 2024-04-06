import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext'; 
import NavigationBar from './NavigationBar'; 
import Home from './components/Home';
import Login from './components/Login';
import PostDetail from './components/PostDetail';
import EditPost from './components/EditPost';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
