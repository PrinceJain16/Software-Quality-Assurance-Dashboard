import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  // 1️⃣ While checking token → don't redirect
  if (loading) {
    return <div>Loading...</div>;
  }

  // 2️⃣ If still no user but token exists → wait
  const token = localStorage.getItem("token");
  if (!user && token) {
    return <div>Loading...</div>;
  }

  // 3️⃣ If no token → redirect
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 4️⃣ Everything good → allow access
  return children;
}
