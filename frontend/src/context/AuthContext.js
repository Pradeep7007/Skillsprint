import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// Set baseURL of API
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    // If token exists, configure default Axios headers
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Retrieve current user details if needed or use stored user data
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));
      
      setToken(receivedToken);
      setUser(receivedUser);
      
      return { success: true, user: receivedUser };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.response?.data?.error || 'Invalid email or password',
      };
    }
  };

  // Register handler
  const register = async (name, email, password, role, adminSecretKey) => {
    try {
      const response = await axios.post('/auth/register', {
        name,
        email,
        password,
        role,
        adminSecretKey,
      });
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);

      return { success: true, user: receivedUser };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.response?.data?.error || 'Registration failed',
      };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      // Notify backend if necessary
      if (token) {
        await axios.post('/auth/logout');
      }
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Check if user has specific role
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
