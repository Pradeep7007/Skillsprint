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
    // Axios 401 interceptor to handle stale/deleted user tokens
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
          setToken(null);
          setUser(null);
        }
        return Promise.reject(error);
      }
    );

    // If token exists, set header and validate user token with backend
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios
        .get('/auth/me')
        .then((res) => {
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
          setToken(null);
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
    }

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
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
