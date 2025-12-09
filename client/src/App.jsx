import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TrekListPage from './pages/TrekListPage';
import AddTrekPage from './pages/AddTrekPage';
import EditTrekPage from './pages/EditTrekPage';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="page">
        <p style={{ textAlign: 'center', margin: '1rem 0' }}>Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/treks"
          element={
            <PrivateRoute>
              <TrekListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/treks/new"
          element={
            <PrivateRoute>
              <AddTrekPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/treks/:id/edit"
          element={
            <PrivateRoute>
              <EditTrekPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/treks" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
